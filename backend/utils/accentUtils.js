function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function containsAccents(str) {
  return Array.from(str.normalize("NFD")).length !== str.length;
}

module.exports = {
  removeAccents,
  containsAccents,
};
