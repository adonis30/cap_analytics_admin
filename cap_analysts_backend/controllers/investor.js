import { Investor, IndividualInvestor, InstitutionInvestor } from "../models/Investors.js";

/**
 * Get all investors
 */
export const getAllInvestors = async (req, res) => {
  try {
    console.log("Fetching investors...");

    const individualInvestors = await IndividualInvestor.find();
    const institutionInvestors = await InstitutionInvestor.find();
    

    

    const investors = [...individualInvestors, ...institutionInvestors];
   

    if (!investors.length) {
      return res.status(404).json({ message: "No investors found" });
    }

    res.status(200).json(investors);
  } catch (error) {
    console.error("Error fetching investors:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get investor by ID
 */
export const getInvestorById = async (req, res) => {
  const { id } = req.params;
  try {
    let investor = await IndividualInvestor.findById(id).populate("fundingTypes fundedCompaniesIds");
    if (!investor) {
      investor = await InstitutionInvestor.findById(id).populate("fundingTypes fundedCompaniesIds");
    }
    if (!investor) return res.status(404).json({ message: "Investor not found" });

    res.status(200).json(investor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new investor (Individual or Institution)
 */
export const createInvestor = async (req, res) => {
  const { type, ...rest } = req.body;

  try {
    let newInvestor;
    if (type === "Individual") {
      newInvestor = new IndividualInvestor(rest);
    } else if (type === "Institution") {
      newInvestor = new InstitutionInvestor(rest);
    } else {
      return res.status(400).json({ message: "Invalid investor type" });
    }

    await newInvestor.save();
    res.status(201).json(newInvestor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update an investor
 */
export const updateInvestor = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    let updatedInvestor = await IndividualInvestor.findByIdAndUpdate(id, updates, { new: true }).populate("fundingTypes fundedCompaniesIds");
    if (!updatedInvestor) {
      updatedInvestor = await InstitutionInvestor.findByIdAndUpdate(id, updates, { new: true }).populate("fundingTypes fundedCompaniesIds");
    }
    if (!updatedInvestor) return res.status(404).json({ message: "Investor not found" });

    res.status(200).json(updatedInvestor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete an investor
 */
export const deleteInvestor = async (req, res) => {
  const { id } = req.params;
  try {
    let deletedInvestor = await IndividualInvestor.findByIdAndDelete(id);
    if (!deletedInvestor) {
      deletedInvestor = await InstitutionInvestor.findByIdAndDelete(id);
    }
    if (!deletedInvestor) return res.status(404).json({ message: "Investor not found" });

    res.status(200).json({ message: "Investor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
