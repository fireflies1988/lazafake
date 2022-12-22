const crypto = require("crypto");
const moment = require("moment");

console.log(
  moment("2022-12-14T08:34:17.970Z").isSame("2022-12-16T16:00:20.398Z", "month")
);
