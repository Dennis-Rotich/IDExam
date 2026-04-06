import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Updated to match your "instructor" enum
const isTeacher = (req, res, next) => {
  // Allow admins to bypass instructor checks if needed, or strictly limit to instructors.
  // I am strictly limiting it to 'instructor' here, but you can change this to:
  // if (req.user.role !== "instructor" && req.user.role !== "admin") 
  if (req.user.role !== "instructor") {
    return res
      .status(403)
      .json({ success: false, message: "Instructor privileges required." });
  }
  next();
};

// Added based on your UserRole type
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin privileges required." });
  }
  next();
};

export { verifyToken, isTeacher, isAdmin };