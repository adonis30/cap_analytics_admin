import InvestmentAsk from "../models/InvestmentAsk.js";


export const getAllInvestmentAsks = async (req, res) => {
  try {
    const investmentAsks = await InvestmentAsk.find();
    res.status(200).json(investmentAsks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvestmentAskById = async (req, res) => {
  try {
    const { id } = req.params;
    const investmentAsk = await InvestmentAsk.findById(id);
    if (!investmentAsk) return res.status(404).json({ message: "Investment ask not found" });
    res.status(200).json(investmentAsk);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInvestmentAsk = async (req, res) => {
  const { min, max, description } = req.body;

  try {
    if (min == null || max == null) {
      return res.status(400).json({ message: "Min and Max values are required." });
    }

    const newInvestmentAsk = new InvestmentAsk({ min, max, description });
    await newInvestmentAsk.save();
    res.status(201).json(newInvestmentAsk);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInvestmentAsk = async (req, res) => {
  const { id } = req.params;
  const { min, max, description } = req.body;

  try {
    const updatedInvestmentAsk = await InvestmentAsk.findByIdAndUpdate(
      id,
      { min, max, description },
      { new: true, runValidators: true }
    );

    if (!updatedInvestmentAsk) {
      return res.status(404).json({ message: "Investment ask not found" });
    }

    res.status(200).json(updatedInvestmentAsk);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInvestmentAsk = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvestmentAsk = await InvestmentAsk.findByIdAndDelete(id);

    if (!deletedInvestmentAsk) {
      return res.status(404).json({ message: "Investment ask not found" });
    }

    res.status(200).json({ message: "Investment ask deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};