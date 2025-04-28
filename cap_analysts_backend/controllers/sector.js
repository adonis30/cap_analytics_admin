import Sector from "../models/Sector.js";


export const getAllSectors = async (req, res) => {
  try {
    const sectors = await Sector.find();
    res.status(200).json(sectors);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSectorById = async (req, res) => {
  try {
    const { id } = req.params;
    const sector = await Sector.findById(id);
    if (!sector) {
      return res.status(404).json({ message: "No sector found" });
    }
    res.status(200).json(sector);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createSector = async (req, res) => {
  const { value, label, ...rest } = req.body;
  try {
    const newSector = new Sector({ value, label, ...rest });
    const savedSector = await newSector.save();
    res.status(200).json({message: "Sector created successfully", savedSector});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSector = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedSector = await Sector.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updatedSector) {
      return res.status(404).json({ message: "No sector found" });
    }
    res.status(200).json(updatedSector);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSector = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSector = await Sector.findByIdAndDelete(id);
    if (!deletedSector) {
      return res.status(404).json({ message: "No sector found" });
    }
    res.status(200).json({ message: "Sector deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


