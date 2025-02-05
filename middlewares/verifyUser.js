import jwt from "jsonwebtoken";

const VerifyUser = (req, res, next) => {
  console.log("req.query", req.query);
  const token = req.query.token; // Get token from query string

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (id, googleId, role, etc.) to req.user
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default VerifyUser;
