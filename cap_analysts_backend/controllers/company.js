import Company from "../models/Companies.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import FundingInstruments from "../models/FundingInstruments.js";
import FundingRounds from "../models/FundingRounds.js";
import FundingTypes from "../models/FundingTypes.js";




const populateCompany = async (query) => {
    try {
        return await query
            .populate({ path: 'companyCreator', model: User, select: '_id firstName lastName' })
            .populate({ path: 'categories', model: Category, select: '_id name' }) 
            .populate({ path: 'fundingTypes', model: FundingTypes, select: '_id name' }) 
          //  .populate({ path: 'fundingInstruments', model: FundingInstruments, select: '_id name' })
           // .populate({ path: 'fundingRounds', model: FundingRounds, select: '_id name' })
            .exec(); 
    } catch (error) {
        console.error('Error populating company data:', error);
        throw error;
    }
};


// Get all companies
export const getCompanies = async (req, res) => {
    try {
        let query = Company.find();
        const companies = await populateCompany(query);
        
        res.status(200).json(companies);
         
    } catch (error) {
        console.error('Error getting companies:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single company by ID
export const getCompanyById = async (req, res) => {
    const { id } = req.params;

    try {
        let query = Company.findById(id);
        const company = await populateCompany(query);

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json(company);
        
    } catch (error) {
        console.error('Error getting company by ID:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create a new company
export const createCompany = async (req, res) => {
     

    const { company } = req.body;
    if (!company) {
        return res.status(400).json({ message: "Invalid request: Missing company data." });
    }

    const { boardMembers = [], organizationName, description, industries, location, imageUrl, ...rest } = company;

    try {
        // ✅ Ensure `member` inside `boardMembers` is a valid ObjectId
        const validatedBoardMembers = boardMembers.map(member => ({
            position: member.position,
            member: mongoose.Types.ObjectId.isValid(member.member) ? new mongoose.Types.ObjectId(member.member) : null
        }));

        // ✅ Check for invalid ObjectIds
        if (validatedBoardMembers.some(member => member.member === null)) {
            return res.status(400).json({ message: "Invalid ObjectId in boardMembers.member" });
        }

        const newCompany = new Company({
            organizationName,
            description,
            industries,
            location,
            imageUrl,
            boardMembers: validatedBoardMembers, // Use validated board members
            ...rest,
        });

        

        const savedCompany = await newCompany.save();
        res.status(201).json(savedCompany);
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(400).json({ message: error.message });
    }
};

// Update an existing company
export const updateCompany = async (req, res) => {
    const { companyId } = req.params;
    
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json(updatedCompany);
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a company by ID
export const deleteCompany = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCompany = await Company.findByIdAndDelete(id);

        if (!deletedCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        console.error('Error deleting company:', error);
        res.status(500).json({ message: error.message });
    }
};
