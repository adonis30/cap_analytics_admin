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
      console.log(req.body);
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
