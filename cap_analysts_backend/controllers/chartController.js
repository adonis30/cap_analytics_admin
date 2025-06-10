import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import ChartMetadata from "../models/ChartMetadata.js";
import ChartData from "../models/ChartData.js";

const excelDateToISO = (excelSerial) => {
  const date = new Date((excelSerial - 25569) * 86400 * 1000);
  return date.toISOString();
};

export const uploadChartData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { category, name, chartType, chartSubtype } = req.body;
    const validCategories = ["Macroeconomic Overview", "Business Climate", "Investment Trends"];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid or missing chart category" });
    }
    if (!name) {
      return res.status(400).json({ error: "Chart name is required" });
    }

    const buffer = req.file.buffer;
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const defaultSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[defaultSheetName];

    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    const [rawHeaders, ...rows] = rawData;

    const headers = rawHeaders.map((h, i) =>
      h ? h.toString().trim().toLowerCase().replace(/[^\w]+/g, "_") : `column_${i}`
    );

    const normalizedData = rows.map((row) => {
      const obj = {};
      headers.forEach((key, i) => {
        let value = row[i];
        if ((key === "month_year" || key === "month") && typeof value === "number") {
          const isoString = new Date((value - 25569) * 86400 * 1000).toISOString();
          const formatted = format(new Date(isoString), "MMM-yyyy");
          obj["month_year"] = isoString;
          obj["display_month"] = formatted;
        } else if (value !== "") {
          obj[key] = value;
        }
      });
      return obj;
    }).filter((row) => Object.keys(row).length >= 2);

    if (normalizedData.length === 0) {
      return res.status(400).json({ error: "No usable data after cleanup" });
    }

    // 🔍 Check if metadata already exists
    let metadata = await ChartMetadata.findOne({ category, name });

    if (metadata) {
      // 🧹 Optional: Remove previous data
      await ChartData.deleteMany({ metadataId: metadata._id });

      // ✏️ Optionally update metadata fields
      metadata.uploadedAt = new Date();
      metadata.sheetName = defaultSheetName;
      metadata.sourceFileName = req.file.originalname;
      metadata.chartType = chartType || metadata.chartType;
      metadata.chartSubtype = chartSubtype || metadata.chartSubtype;
      await metadata.save();
    } else {
      // 🆕 Create new metadata if not found
      metadata = await ChartMetadata.create({
        title: defaultSheetName || req.file.originalname,
        sheetName: defaultSheetName,
        sourceFileName: req.file.originalname,
        uploadedAt: new Date(),
        category,
        name,
        chartType: chartType || "line",
        chartSubtype: chartSubtype || "default",
      });
    }

    // 💾 Insert new data rows
    await ChartData.insertMany(normalizedData.map((entry) => ({
      ...entry,
      metadataId: metadata._id,
    })));

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

export const getChartsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { chartType, startYear, endYear } = req.query;

    const match = { category };

    if (chartType) {
      match.chartType = chartType;
    }

    // Optional: Add year range filtering if you store a date/year field
    // You must extract and store a proper `year` field in the database for this
    // e.g., match.year = { $gte: Number(startYear), $lte: Number(endYear) }

    const metadataList = await ChartMetadata.find(match);
    const metadataIds = metadataList.map((m) => m._id);

    const charts = await ChartData.aggregate([
      { $match: { metadataId: { $in: metadataIds } } },
      {
        $group: {
          _id: '$metadataId',
          data: { $push: '$$ROOT' },
        },
      },
    ]);

    const result = charts.map((group) => {
      const metadata = metadataList.find((m) => m._id.toString() === group._id.toString());
      return {
        _id: group._id,
        chartType: metadata.chartType,
        category: metadata.category,
        name: metadata.name,
        title: metadata.title,
        uploadedAt: metadata.uploadedAt,
        data: group.data,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('getChartsByCategory error:', err);
    res.status(500).json({ error: 'Server error while fetching charts by category' });
  }
};

// controllers/chartController.js
export const getDistinctNamesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) return res.status(400).json({ error: "Category is required" });

    const names = await ChartMetadata.distinct("name", { category });
    res.status(200).json({ category, names });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve names" });
  }
};

