import TicketSize from "../models/ticketSize.js"

export const getAllTicketSizes = async (req, res) => {
  try {
    const ticketSizes = await TicketSize.find();
    res.status(200).json(ticketSizes);
     
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTicketSizeById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticketSize = await TicketSize.findById(id);
    if (!ticketSize) return res.status(404).json({ message: "Ticket size not found" });
    res.status(200).json(ticketSize);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTicketSize = async (req, res) => {
  const { min, max, description } = req.body;

  try {
    if (min == null || max == null) {
      return res.status(400).json({ message: "Min and Max values are required." });
    }

    const newTicketSize = new TicketSize({ min, max, description });
    await newTicketSize.save();
    res.status(201).json(newTicketSize);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicketSize = async (req, res) => {
  const { id } = req.params;
  const { min, max, description } = req.body;

  try {
    const updatedTicketSize = await TicketSize.findByIdAndUpdate(
      id,
      { min, max, description },
      { new: true, runValidators: true }
    );

    if (!updatedTicketSize) {
      return res.status(404).json({ message: "Ticket size not found" });
    }

    res.status(200).json(updatedTicketSize);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTicketSize = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TicketSize.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Ticket size not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
