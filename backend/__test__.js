const crypto = require("crypto");
const moment = require("moment");

// console.log(crypto.randomBytes(16).toString("hex"));
// console.log(typeof moment().format("M"));
// console.log(moment("2022-12-06T21:13:35+07:00").isSame("2022-12-07", "date"));
// console.log(moment("2022-12-07T21:13:35+07:00").isSame(moment(), "date"));
// console.log(moment("").startOf('day').fromNow());   
// console.log(moment().format("M"));
// console.log(new Date().getMonth());
// console.log(Array.from([0, 1, 2], (x) => 2000 - x));
let a = [{ name: "hell", age: 12}, {name: "asdf", age: 13}]
a.map(b => { b.stupid = true; return b});
console.log(a);