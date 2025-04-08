import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";

const router = express.Router();

// GET all categories
router.get("/", getCategories);

// GET a single category by ID
router.get("/:id", getCategoryById);

// POST a new category
router.post("/", createCategory);

// PUT (update) a category by ID
router.put("/:id", updateCategory);

// DELETE a category by ID
router.delete("/:id", deleteCategory);

export default router;
