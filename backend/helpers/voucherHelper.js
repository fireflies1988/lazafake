function checkConditions(res, voucher, userId, payment) {
  if (!voucher) {
    res.status(404);
    throw new Error("Voucher not found.");
  }

  if (voucher.expirationDate < new Date().toISOString()) {
    res.status(422);
    throw new Error("This voucher is expired");
  }

  // check minSpend
  if (payment < voucher.minSpend) {
    res.status(422);
    throw new Error("MinSpend: " + voucher.minSpend);
  }

  // check if this voucher is used by this user
  if (voucher.usersUsed.indexOf(userId) > -1) {
    res.status(409);
    throw new Error(
      "You have used this voucher before. You can't use it again."
    );
  }

  // check limit
  if (voucher.limited === true) {
    if (voucher.usersUsed.length >= voucher.limit) {
      res.status(422);
      throw new Error(
        "This voucher has already been used the maximum number of times."
      );
    }
  }
}

module.exports = {
  checkConditions,
};
