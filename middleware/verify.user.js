const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  if (req.cookies["connect.sid"] === undefined) {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Authentication token is not present!" });
    }
    token = token.split(" ")[1];

    jwt.verify(token, process.env.SECRETJWT, (err, payload) => {
      if (err) {
        return res.status(401).json({ error: err.message });
      } else {
        req.user = payload;
        next();
      }
    });
  } else {
    if (req.session.user === undefined) {
      return res.status(401).json({ error: "Something wrong!" });
    } else {
      req.user = req.session.user;
      next();
    }
  }
};

const verifyAdmin = (req, res, next) => {
    console.log("Entering verifyAdmin middleware");
    let token = req.headers.authorization;
    console.log("Authorization header:", token);
    
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ error: "Authentication token is not present!" });
    }
    
    token = token.split(" ")[1];
    console.log("Extracted token:", token);
    
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, payload) => {
      if (err) {
        console.log("JWT verification error:", err);
        return res.status(401).json({ error: err.message });
      }
      
      console.log("Decoded payload:", payload);
      
      if (!payload || !payload.role) {
        console.log("Invalid payload or missing role");
        return res.status(403).json({ error: "Invalid token payload or missing role" });
      }
      
      if (payload.role !== "admin") {
        console.log("User is not admin. Role:", payload.role);
        return res.status(403).json({ error: "Access only for admin!" });
      }
      
      console.log("Admin verified successfully");
      req.user = payload;
      next();
    });
  };
module.exports = { verifyUser, verifyAdmin };
