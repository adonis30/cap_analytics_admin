 
import SdgFocus from "../models/SdgFocus.js";

import mongoose from "mongoose";


export const getAllSdgFocus = async (req, res) => {
    
     try {
        const sdgFocus = await SdgFocus.find()
        res.status(200).json(sdgFocus)
     } catch (error) {
        res.status(404).json({ message: error.message});
     }
    
};


export const getSdgFocusById = async (req, res) => {

    try {

        const { id } = req.params;
        const sdgFocus = await SdgFocus.findById(id);

        if (!sdgFocus) {
            return res.status(404).json({message: "no SDG Focus found"});
        }

        res.status(200).json(sdgFocus);
        
    } catch (error) {
       res.status(404).json({message: error.message}); 
    }
    
};


export const updateSdgFocus = async (req, res) => {

    const { id } = req.params;
    const { data } = req.body;

    try {
        const updateSdgFocus = await SdgFocus.findByIdAndUpdate(
            id,
            { $set: data},
            {new: true, runValidators: true}
        );

        if(!updateSdgFocus){
            return res.status(404).json({message: "no SDG Focus found"})
        }
        res.status(200).json(updateSdgFocus);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

export const deleteSdgFocus = async (req, res) => {
    const {id} = req.params;

    try {
        const deleteSdgFocus = await SdgFocus.findByIdAndDelete(id)
        if(!deleteSdgFocus){
            return res.status(404).json({message: "SDG Focus not found"})
        }

        res.status(200).json({message: "SDG Focus deleted successfully"})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
};


export const createSdgFocus = async (req, res) => {
    
    const { value, label, ...rest } = req.body

    try {
        const newSdgFocus = new SdgFocus({
            value,
            label,
            ...rest,
        });
        const savedSdgFocus = await newSdgFocus.save()
        res.status(200).json({message: "SGD created successfully!"});

    } catch (error) {
        res.status(400).json({message: error.message})
    }
};