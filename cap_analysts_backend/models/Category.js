import mongoose from "mongoose";
const { Schema, model, models } = mongoose;


// Category Schema
const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true }, // Unique and required field for category name
});

// If the model already exists, use it; otherwise, create a new model
const Category = models.Category || model("Category", CategorySchema);

export default Category;
