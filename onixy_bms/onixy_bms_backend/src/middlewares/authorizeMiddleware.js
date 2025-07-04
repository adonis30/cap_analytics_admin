// authorize.js
export const authorize = (roles = []) => {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    // Check if user's role is permitted
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: You do not have the required role" });
    }

    next();
  };
};
