import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    // Create JWT token using the userId parameter directly
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure cookies in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: "/", // Make cookie available across all routes
    });
};
