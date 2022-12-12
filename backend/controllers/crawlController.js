const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const cheerio = require("cheerio");
const request = require("request-promise");

function reverseMoneyFormattedText(formattedText) {
  const regex = /[. ₫]/g;

  return Number(formattedText.replace(regex, ""));
}

const crawlTikiProductAsync = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { productLink } = req.body;

  if (!productLink.includes("tiki.vn")) {
    res.status(400);
    throw new Error("Not a tiki link.");
  }

  request(productLink, (err, response, html) => {
    if (err || response.statusCode !== 200) {
      throw err;
    }

    const $ = cheerio.load(html);

    const name = $("div.header h1.title").text();
    const currentPrice = reverseMoneyFormattedText(
      $(".product-price__current-price").text()
    );
    const listPrice =
      $(".product-price__list-price").length > 0
        ? reverseMoneyFormattedText($(".product-price__list-price").text())
        : 0;
    const brand = $("[data-view-id='pdp_details_view_brand']").text();
    const imageUrl = $(`[alt='${name}']`).attr("src");
    const description = $("div[class^='ToggleContent__View']").text();
    const specifications = [];

    $("div[class='content has-table'] > table > tbody > tr").each((i, el) => {
      specifications.push({
        key: $($(el).find("td")[0]).text(),
        value: $($(el).find("td")[1]).text(),
      });
    });

    // handle price
    let price, discount;
    if (listPrice === 0) {
      price = currentPrice;
      discount = 0;
    } else {
      price = listPrice;
      discount = listPrice - currentPrice;
    }

    res.json({
      name,
      price,
      discount,
      brand,
      imageUrl,
      description,
      specifications: JSON.stringify(specifications),
    });
  });
});

module.exports = {
  crawlTikiProductAsync,
};
