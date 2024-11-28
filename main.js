const {LinkedList} = require('./ieeeList');

const f = LinkedList.fromDouble(0.1);
const s = LinkedList.fromDouble(0.2);

// console.log(f.toBinaryString());
// console.log(s.toBinaryString());

const result = LinkedList.add(f, s);
console.log(result.toBinaryString());
console.log(result.toDouble());