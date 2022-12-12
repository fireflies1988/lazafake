const Address = require("../models/addressModel");

function checkVoucherConditions(res, voucherObj, userId, totalPayment) {
  if (!voucherObj) {
    res.status(404);
    throw new Error("Voucher not found.");
  }

  if (voucherObj.expirationDate < new Date().toISOString()) {
    res.status(422);
    throw new Error("This voucher is expired");
  }

  // check minSpend
  if (totalPayment < voucherObj.minSpend) {
    res.status(422);
    throw new Error("MinSpend: " + voucherObj.minSpend);
  }

  // check if this voucher is used by this user
  if (voucherObj.usersUsed.indexOf(userId) > -1) {
    res.status(409);
    throw new Error(
      "You have used this voucher before. You can't use it again."
    );
  }

  // check limit
  if (voucherObj.usersUsed.length >= voucherObj.limit) {
    res.status(422);
    throw new Error(
      "This voucher has already been used the maximum number of times."
    );
  }
}

async function checkAddressConditions(res, addressId, userId) {
  const address = await Address.findById(addressId);
  if (!address) {
    res.status(400);
    throw new Error("Address not found.");
  }

  if (address.user.toString() !== userId) {
    res.status(400);
    throw new Error("This is not your address.");
  }
}

function checkCartItem(res, cartItemObj, userId) {
  if (cartItemObj.user.toString() !== userId) {
    res.status(400);
    throw new Error(`This item ${cartItemObj.id} is not in your cart`);
  }

  if (cartItemObj.quantity > cartItemObj.product.quantity) {
    res.status(409);
    throw new Error(
      `There are not enough '${cartItemObj.product.name}' in stock (remaining ${cartItemObj.product.quantity}). Please adjust the quantity of this item.`
    );
  }
}

function calculateDiscount(voucherObj, totalPayment) {
  if (voucherObj.isPercentageDiscount) {
    const tempDiscountAmount = Math.floor(
      (totalPayment * voucher.discountAmount) / 100
    );

    if (tempDiscountAmount > voucherObj.maxDiscountAmount) {
      return voucherObj.maxDiscountAmount;
    } else {
      return tempDiscountAmount;
    }
  } else {
    // cash
    return voucherObj.discountAmount;
  }
}

const USD_TO_VND = 24600;

function convertVndToUsd(vnd) {
  return (vnd / USD_TO_VND).toFixed(2);
}

module.exports = {
  checkVoucherConditions,
  checkAddressConditions,
  checkCartItem,
  calculateDiscount,
  convertVndToUsd,
};
