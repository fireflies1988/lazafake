const jwt = require("jsonwebtoken");

// generate jwt
function generateTokens(id, role) {
  const payload = {
    id,
    role,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
}

module.exports = {
  generateTokens,
};
