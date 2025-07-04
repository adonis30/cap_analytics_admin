import prisma from '../config/db.js';

export const createContract = async (req, res) => {
  try {
    const contract = await prisma.contract.create({
      data: req.body,
    });
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: 'Error creating contract', error });
  }
};

export const getAllContracts = async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      include: { employee: true },
    });
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contracts', error });
  }
};

export const getContractById = async (req, res) => {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id },
      include: { employee: true },
    });

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contract', error });
  }
};

export const updateContract = async (req, res) => {
  try {
    const contract = await prisma.contract.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contract', error });
  }
};

export const deleteContract = async (req, res) => {
  try {
    await prisma.contract.delete({
      where: { id: req.params.id },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contract', error });
  }
};
