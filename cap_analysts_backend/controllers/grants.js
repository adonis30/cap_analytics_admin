import Grants from "../models/grants.js";


export const getAllGrants = async (req, res) => {
    try {
      const grants = await Grants.find();
      res.status(200).json(grants);

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getGrantsById = async (req, res) => {
    try {
      const { id } = req.params;
      const grant = await Grants.findById(id);
      if(!grant){
        return res.status(404).json({message: "No grants found"});
      }
      res.status(200).json(grant);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


export const createGrant = async ( req, res) => {
    const { title, description, ...rest } = req.body;

    try {
        const newGrant = new Grants({ title, description, ...rest });
        const savedGrant = await newGrant.save();
        res.status(200).json({message: "New Grant created successfully"})
    } catch (error) {
        req.status(400).json({ message: error.message})
    }
}

export const updateGrant = async (req, res) => {

 const { id } = req.params;
 const { title , description, ...rest} = req.body;

 try {
    const updateGrant = await Grants.findByIdAndUpdate(
        id,
        { title, description, ...rest },
        { new: true, runValidators: true}
    );
    if (!updateGrant) {
        return res.status(400).json({ message: " No Grant found"})
    }
    res.status(200).json(updateGrant);
 } catch (error) {
    res.status(400).json({ message: error.message})
 }

}

export const deleteGrant = async (req, res) => {
    try {

        const { id } = req.params;
        const deleteGrant = await Grants.findByIdAndDelete(id);
        if(!deleteGrant) {
            return res.status(404).json({ message: "no grant found"})
        }
        res.status(200).json({ message: "Grant deleted sucessfully"})
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
} 
