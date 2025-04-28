import mongoose from "mongoose";

const { Schema, model, models } = mongoose;


// Sector Schema
const SectorSchema = new Schema({
    name: { type: String, required: true, unique: true }, // Unique and required field for sector name
});

const Sector = models.Sector || model("Sector", SectorSchema);

export default Sector;
