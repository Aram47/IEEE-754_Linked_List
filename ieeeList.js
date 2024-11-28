class Utils {
    static encodeIEEE754_64(number) {
        if (number === 0) {
            return {
              sign: 0,
              exponent: "00000000000",
              fraction: "0".repeat(52),
              ieee754: "0".repeat(64),
            };
        }
        if (isNaN(number)) {
            return {
              sign: 0,
              exponent: "11111111111",
              fraction: "1".repeat(52),
              ieee754: "011111111111" + "1".repeat(52),
            };
        }
        if (!isFinite(number)) {
            return {
              sign: number < 0 ? 1 : 0,
              exponent: "11111111111",
              fraction: "0".repeat(52),
              ieee754: (number < 0 ? "1" : "0") + "11111111111" + "0".repeat(52),
            };
        }
    
        let sign = number < 0 ? 1 : 0;
        number = Math.abs(number);
    
        let exponent = 0;
        let fraction = number;
    
        while (fraction >= 2) {
            fraction /= 2;
            ++exponent;
        }
    
        while (fraction < 1 && exponent > -1022) {
            fraction *= 2;
            --exponent;
        }
    
        if (exponent <= -1023) {
            exponent = -1023;
        } else {
            --fraction;
        }
    
        let biasedExponent = exponent + 1023;
    
        let fractionBits = "";
        let fracPart = fraction;
        for (let i = 0; i < 52; ++i) {
            fracPart *= 2;
            if (fracPart >= 1) {
                fractionBits += "1";
                --fracPart;
            } else {
                fractionBits += "0";
            }
        }
    
        let exponentBits = biasedExponent.toString(2).padStart(11, "0");
        let ieee754 = sign.toString() + exponentBits + fractionBits;
    
        return {
            sign,
            exponent: exponentBits,
            fraction: fractionBits,
            ieee754: ieee754,
        };
    }

    static decodeIEEE754_64(binary) {
        let sign = parseInt(binary[0], 10);
        let exponentBits = binary.slice(1, 12);
        let fractionBits = binary.slice(12);
    
        let biasedExponent = parseInt(exponentBits, 2);
        let exponent = biasedExponent - 1023;
    
        if (biasedExponent === 0) {
            if (fractionBits === "0".repeat(52)) {
              return { value: 0 };
            }
            exponent = -1022;
        } else if (biasedExponent === 2047) {
            if (fractionBits === "0".repeat(52)) {
              return { value: sign === 1 ? -Infinity : Infinity };
            }
            return { value: NaN };
        }
    
        let significand = 1;
        for (let i = 0; i < 52; ++i) {
            significand += parseInt(fractionBits[i], 10) * Math.pow(2, -(i + 1));
        }
    
        if (biasedExponent === 0) {
            --significand;
        }
    
        let value = significand * Math.pow(2, exponent);
        if (sign === 1) {
            value = -value;
        }
    
        return { value };
    }
};

class Node {
    constructor(bit) {
      this.bit = bit;
      this.next = null;
    }
}
  
class LinkedList {
    constructor() {
      this.head = null;
    }
    push(bit) {
        if (!this.head) {
            this.head = new Node(+bit);
        } else {
            let temp = this.head;
            while (temp.next) { temp = temp.next; }
            temp.next = new Node(+bit);
        }
    }
    static fromDouble(number) {
        const result = Utils.encodeIEEE754_64(number).ieee754;
        const newList = new LinkedList();
        for (let i = 0; i < result.length; ++i) {
            newList.push(result[i]);
        }
        return newList;
    }
    toDouble() {
      let result = "";
      let temp = this.head;
      while (temp) {
        result += temp.bit;
        temp = temp.next;
      }  
      return Utils.decodeIEEE754_64(result).value;
    }
    static add(listA, listB) {
      let first = "", second = "";
      let firstIt = listA.head, secondIt = listB.head;
      console.log(firstIt);
      console.log(secondIt);
      while (firstIt) {
        first += firstIt.bit;
        second += secondIt.bit;
        firstIt = firstIt.next;
        secondIt = secondIt.next;
      }

      first = Utils.decodeIEEE754_64(first).value;
      second = Utils.decodeIEEE754_64(second).value;
      const result = Utils.encodeIEEE754_64(first + second).ieee754;
      let newList = new LinkedList();
      for (let i = 0; i < result.length; ++i) {
        newList.push(result[i]);
      }
      return newList;
    }
    toBinaryString() {
      let result = "";
      let temp = this.head;
      while (temp) {
        result += temp.bit;
        temp = temp.next;
      }
      return result;
    }
}

module.exports = { LinkedList };