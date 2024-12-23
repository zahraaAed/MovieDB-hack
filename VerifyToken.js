const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Token from "Authorization: Bearer <token>"

  if (!token) {
    return res.status(401).json({ status: 401, message: "Authentication required" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: 403, message: "Invalid or expired token" });
    }

    req.user = decoded; // Attach the decoded user info to the request
    next(); // Proceed to the next middleware or route
  });
};

module.exports = verifyToken;
