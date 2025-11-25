const jwt = require("jsonwebtoken");

function createActivationToken(user) {
  return jwt.sign(
    { userId: user.userId },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = createActivationToken;