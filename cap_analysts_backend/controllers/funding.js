import FundingInstruments from "../models/FundingInstruments.js";
import Fundingrounds from "../models/FundingRounds.js";
import FundingType from "../models/FundingTypes.js";

import mongoose from "mongoose";


export const getAllFundingInstruments = async (req, res) => {
   
    try {
      
      const fundingInstruments = await FundingInstruments.find();
      res.status(200).json(fundingInstruments)
    } catch (error) {
      res.status(404).json({ message: error.message });
    }

  }
   
  export const getFundingInstrumentById = async (req, res) => {

    try {
      const { id } = req.params;
      const fundingInstrument = await FundingInstruments.findById(id);
      if(!fundingInstrument) {
        return res.status(404).json({ message: " no founding Instrument found" });
      }
      res.status(200).json(fundingInstrument);
    } catch (error) {
      res.status(404).json({message: error.message});
    }
  }

  export const updateFundingInstrument = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;  
    
    try {
      const updatedFundingInstrument = await FundingInstruments.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );
  
      if (!updatedFundingInstrument) {
        return res.status(404).json({ message: "No funding instrument found" });
      }
  
      res.status(200).json(updatedFundingInstrument);
       
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


  export const deleteFundingInstrument = async(req, res) => {

    const {id} = req.params;

    try {
      const deleteFundingInstrument = await FundingInstruments.findByIdAndDelete(id)

      if (!deleteFundingInstrument) {
        return res.status(404).json({ message: "Funding instrument not found" });
    }

    res.status(200).json({ message: "Funding instrument deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message});
    }
  };

  export const createFundingInstrument = async (req, res) => {
    const { value, label, ...rest} = req.body
   try {
    const newFundingInstrument = new FundingInstruments({
      value,
      label,
      ...rest,
    });

    const savedFundingInstrument = await newFundingInstrument.save();
    res.status(200).json({ message: "Funding instrument created successfully!"});
    
   } catch (error) {
    res.status(400).json({ message: error.message});
   }

  };

  export const createFundingRound = async (req, res) => {
    const { value, label, ...rest} = req.body
    try{
    const newFundingRound = new Fundingrounds({
      value,
      label,
      ...rest,
    });
    const savedFundingRound = await newFundingRound.save();
    res.status(200).json({message: "Funding Round created successfully!"});
  } catch (error) {
    res.status(400).json({ message: error.message});
  }
  };

  export const getAllFundingRound = async (req, res) => {

    try {
      const fundingRounds = await Fundingrounds.find();
      res.status(200).json({fundingRounds})
    } catch (error) {
      res.status(400).json({message: error.message});
    }
  }

  export const getFundingRoundById = async (req, res) => {
    try {
      const { id } = req.params;
      const fundingRound = await Fundingrounds.findById(id);
      if (!fundingRound) {
        return res.status(404).json({ message: "No funding round found" });
      }
      res.status(200).json(fundingRound);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  export const updateFundingRound = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;  
     
    try {
      const updatedFundingRound = await Fundingrounds.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );
      if (!updatedFundingRound) {
        return res.status(404).json({ message: "No funding round found" });
      }
      res.status(200).json(updatedFundingRound);
       
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


  export const deleteFundingRound = async (req, res) => {
    const { id } = req.params;

   try {
    const deleteFundingRound = await Fundingrounds.findByIdAndDelete(id);
    if (!deleteFundingRound) {
      return res.status(404).json({ message: "Funding round not found" });
  }

  res.status(200).json({ message: "Funding round deleted successfully" });
   } catch (error) {
    res.status(400).json({ message: error.message });
   }

  };
    
  export const createFundingType = async (req, res) => {
   
    const { value, label, ...rest} = req.body
    try{
    const newFundingType = new FundingType({
      value,
      label,
      ...rest,
    });
    const savedFundingType = await newFundingType.save();
    res.status(200).json({message: "Funding type created successfully!"});
  } catch (error) {
    res.status(400).json({ message: error.message});
  }

  };

  export const getFundingTypeById = async (req, res) => {

    try {
      const { id } = req.params;

      const fundingType = await FundingType.findById(id)
      if (!fundingType) {
        return res.status(404).json({ message: " no founding type found" });
      }
      res.status(200).json({fundingType})
      
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  export const getAllFundingTypes = async (req, res) => {
    try {
      // Fetch all funding types from the database
      const fundingTypes = await FundingType.find();
      
  
      // Respond with the list of funding types
      res.status(200).json(fundingTypes);
    } catch (error) {
      // In case of an error, send the error message as the response
      res.status(400).json({ message: error.message });
    }
  };
  

  export const updateFundingType = async (req, res) => {
    
    const { id } = req.params;
    const { data } = req.body; 


    try {
      const updateFundingType = await FundingType.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true } // Return updated document and validate inputs
  
      )
      if (!updateFundingType) {
        return res.status(404).json({ message: " no founding type  found" });
    }

    res.status(200).json(updateFundingType);
    
    } catch (error) {
      res.status(400).json({message: error.message});
    }
  }

  export const deleteFundingType = async (req, res) => {
    const { id } = req.params;

   try {
    const deleteFundingType = await FundingType.findByIdAndDelete(id);
    if (!deleteFundingType) {
      return res.status(404).json({ message: "Funding type  not found" });
  }

  res.status(200).json({ message: "Funding type deleted successfully" });
   } catch (error) {
    res.status(400).json({ message: error.message });
   }

  };