import User from "../models/User.js";
import mongoose from "mongoose";

export const getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  export const getAllUsers = async (req, res) => {

    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

 export const createUser = async (req, res) => {

    try {
      const newUser = new User(req.body);
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  export const updateUser = async (req, res) => {
    const { id } = req.params;

    try {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      } 
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  // Create a new board member
export const  createBoardMember = async (req, res) => {
    try {
      const newBoardMember = new BoardMember(req.body);
      const savedBoardMember = await newBoardMember.save();
      res.status(201).json(savedBoardMember);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Get all board members
  export const getAllBoardMembers = async (req, res) => {
    try {
      const boardMembers = await BoardMember.find();
      res.status(200).json(boardMembers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // Get a single board member by ID
 export const getBoardMemberById = async (req, res) => {
    try {
      const { id } = req.params;
      const boardMember = await BoardMember.findById(id);
      if (!boardMember) {
        return res.status(404).json({ error: "BoardMember not found" });
      }
      res.status(200).json(boardMember);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Update a board member by ID
 export const updateBoardMember = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedBoardMember = await BoardMember.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updatedBoardMember) {
        return res.status(404).json({ error: "BoardMember not found" });
      }
      res.status(200).json(updatedBoardMember);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Delete a board member by ID
  export const deleteBoardMember = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBoardMember = await BoardMember.findByIdAndDelete(id);
      if (!deletedBoardMember) {
        return res.status(404).json({ error: "BoardMember not found" });
      }
      res.status(200).json({ message: "BoardMember deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

