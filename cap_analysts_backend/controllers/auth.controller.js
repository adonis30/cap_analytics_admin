import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid"; // Import UUID library for generating random clerkId
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
   
    try {  
        const { email, password, firstName, lastName } = req.body; 
        
        // Validate that firstName and lastName are provided
        if (!firstName || !lastName) {
            const error = new Error("First name and last name are required");
            error.statusCode = 400;
            throw error;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 403;
            throw error;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a random clerkId
        const clerkId = uuidv4(); // Generates a random UUID

        // Create a new user
        const newUser = await User.create([{
            email,
            username: email, // Assuming username is the same as email
            password: hashedPassword,
            firstName,
            lastName,
            clerkId // Include the randomly generated clerkId
        }], { session });

        // Generate JWT token
        const token = jwt.sign({ userId: newUser[0]._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: { token, user: newUser[0] }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};


export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
         

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        generateTokenAndSetCookie(res, user._id);
        
        res.status(200).json(
            {
                success: true,
                message: "User logged in successfully",
                user: {
				...user._doc,
				password: undefined,
			  },
            }
        );

    } catch (error) {
        next(error);
    }
};


export const signout = async (req, res, next) => {
    try {
        // Clear the token from cookies (if using cookies)
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });

        res.status(200).json({
            success: true,
            message: "User signed out successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const checkAuth = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
        next(error);
	}
};
