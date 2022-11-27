export function showError(antMessage, message) {
  if (Array.isArray(message)) {
    for (let m of message) {
      antMessage.error(m);
    }
  } else {
    antMessage.error(message);
  }
}
