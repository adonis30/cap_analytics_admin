import * as XLSX from "xlsx";
import ChartData from "../models/ChartData.js";
import ChartMetadata from "../models/ChartMetadata.js";

export const uploadChartData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = req.file.buffer;
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      raw: false,
      header: 0,
    });

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ error: "Empty or invalid sheet" });
    }

    const normalizedData = jsonData
      .map((row) => {
        const cleanRow = {};
        for (const key in row) {
          if (!key.trim()) continue;
          const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, "_");
          cleanRow[normalizedKey] = row[key];
        }
        return cleanRow;
      })
      .filter((row) => Object.keys(row).length >= 2);

    if (normalizedData.length === 0) {
      return res.status(400).json({ error: "No usable data after cleanup" });
    }

    const metadata = await ChartMetadata.create({
      title: sheetName || req.file.originalname,
      sourceFileName: req.file.originalname,
      uploadedAt: new Date(),
      sheetName,
    });

    await ChartData.insertMany(
      normalizedData.map((entry) => ({
        ...entry,
        metadataId: metadata._id,
      }))
    );

    res.status(201).json({
      message: "Chart data uploaded successfully",
      metadataId: metadata._id,
      recordCount: normalizedData.length,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process uploaded chart data" });
  }
};

export const getChartDataByMetadataId = async (req, res) => {
  try {
    const { metadataId } = req.params;
    const metadata = await ChartMetadata.findById(metadataId);
    const chartData = await ChartData.find({ metadataId });

    if (!metadata) return res.status(404).json({ error: "Metadata not found" });

    res.status(200).json({ metadata, data: chartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllChartMetadata = async (req, res) => {
  try {
    const metadata = await ChartMetadata.find().sort({ uploadedAt: -1 });
    res.status(200).json(metadata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteChartData = async (req, res) => {
  try {
    const { metadataId } = req.params;
    await ChartData.deleteMany({ metadataId });
    await ChartMetadata.findByIdAndDelete(metadataId);
    res.status(200).json({ message: "Chart data deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete chart data" });
  }
};

export const updateChartMetadata = async (req, res) => {
  try {
    const { metadataId } = req.params;
    const { title, sourceFileName } = req.body;

    const updatedMetadata = await ChartMetadata.findByIdAndUpdate(
      metadataId,
      { title, sourceFileName },
      { new: true, runValidators: true }
    );

    if (!updatedMetadata) {
      return res.status(404).json({ error: "Metadata not found" });
    }

    res.status(200).json(updatedMetadata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update chart metadata" });
  }
};

export const getChartDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const chartData = await ChartData.findById(id);
    if (!chartData) {
      return res.status(404).json({ error: "Chart data not found" });
    }
    res.status(200).json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve chart data" });
  }
};

export const getAllChartData = async (req, res) => {
  try {
    const chartData = await ChartData.find().populate("metadataId");
    res.status(200).json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve all chart data" });
  }
};
