const jwt = require("jsonwebtoken");
require("dotenv").config();

// This middleware will continue on if the token is inside the local storage
module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header("token");

  // Check if not token
  if (!token) return res.status(403).json({ msg: "authorization denied" });

  // Verify token
  try {
    const verify = jwt.verify(token, process.env.JWTSECRET);
    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}
