export function showError(antMessage, message) {
  if (Array.isArray(message)) {
    for (let m of message) {
      antMessage.error(m);
    }
  } else {
    antMessage.error(message);
  }
}

export function checkUploadCondition(file, antMessage) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    antMessage.error("You can only upload JPG/PNG file!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    antMessage.error("Image must smaller than 2MB!");
    return false;
  }
}

export const moneyFormatter = new Intl.NumberFormat("vi-vn", {
  style: "currency",
  currency: "vnd",
});

export function reverseMoneyFormattedText(formattedText) {
  const regex = /[. ₫]/g;

  return Number(formattedText.replace(regex, ""));
}

export function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}