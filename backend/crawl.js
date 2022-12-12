const cheerio = require("cheerio");
const request = require("request-promise");

function reverseMoneyFormattedText(formattedText) {
  const regex = /[. ₫]/g;

  return Number(formattedText.replace(regex, ""));
}

request(
  "https://tiki.vn/de-tan-nhiet-cooler-master-c3-hang-chinh-hang-p359286.html?spid=108517768",
  (err, res, html) => {
    if (err || res.statusCode !== 200) {
      return console.log(err);
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
      var obj = {};
      obj[$($(el).find("td")[0]).text()] = $($(el).find("td")[1]).text();
      specifications.push(obj);
    });

    // handle price
    let price, discount;
    if (listPrice === 0) {
      price = currentPrice;
      discount = 0;
    } else {
      price = currentPrice;
      discount = listPrice - currentPrice;
    }

    console.log({
      name,
      price,
      discount,
      brand,
      imageUrl,
      description,
      specifications: JSON.stringify(specifications),
    });
  }
);
