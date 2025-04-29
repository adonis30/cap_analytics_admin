import TicketSize from "../models/TicketSize.js";

 
export const getAllTicketSizes = async (req, res) => {
  try {
    const ticketSizes = await TicketSize.find();
    res.status(200).json(ticketSizes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTicketSizeById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticketSize = await TicketSize.findById(id);

    if (!ticketSize) {
      return res.status(404).json({ message: "No ticket size found" });
    }

    res.status(200).json(ticketSize);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateTicketSize = async (req, res) => {
  const { id } = req.params;
  let { data } = req.body;

  try {
    // Map name ➔ number if it exists
    if (data.name) {
      data.number = data.name;
      delete data.name;
    }

    const updatedTicketSize = await TicketSize.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedTicketSize) {
      return res.status(404).json({ message: "No ticket size found" });
    }

    res.status(200).json(updatedTicketSize);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTicketSize = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTicketSize = await TicketSize.findByIdAndDelete(id);

    if (!deletedTicketSize) {
      return res.status(404).json({ message: "No ticket size found" });
    }

    res.status(200).json({ message: "Ticket size deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createTicketSize = async (req, res) => {
  const { name, description } = req.body;  
  console.log("Creating ticket size with name:", req.body); // Debugging line
  try {
    const newTicketSize = new TicketSize({
      number: name, // ✅ MAPPING name -> number
      description,
    });

    await newTicketSize.save();
    res.status(201).json(newTicketSize);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTicketSizeByName = async (req, res) => {
  try {
    const { name } = req.params;
    const ticketSize = await TicketSize.findOne({ name });

    if (!ticketSize) {
      return res.status(404).json({ message: "No ticket size found" });
    }

    res.status(200).json(ticketSize);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTicketSizeByDescription = async (req, res) => {
  try {
    const { description } = req.params;
    const ticketSize = await TicketSize.findOne({ description });

    if (!ticketSize) {
      return res.status(404).json({ message: "No ticket size found" });
    }

    res.status(200).json(ticketSize);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getTicketSizeByNameAndDescription = async (req, res) => {
  try {
    const { name, description } = req.params;
    const ticketSize = await TicketSize.findOne({
      name,
      description,
    }); 

    if (!ticketSize) {
      return res.status(404).json({ message: "No ticket size found" });
    }

    res.status(200).json(ticketSize);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
        }
    }
export const getTicketSizeByIdAndName = async (req, res) => {
    try {
        const { id, name } = req.params;
        const ticketSize = await TicketSize.findOne({
        _id: id,
        name,
        });
    
        if (!ticketSize) {
        return res.status(404).json({ message: "No ticket size found" });
        }
    
        res.status(200).json(ticketSize);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
    }
    
