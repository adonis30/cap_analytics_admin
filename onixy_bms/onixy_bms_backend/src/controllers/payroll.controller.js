import prisma from '../config/db.js';

export const createPayroll = async (req, res) => {
  try {
    const payroll = await prisma.payroll.create({
      data: req.body,
    });
    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: 'Error creating payroll record', error });
  }
};

export const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: { employee: true },
      orderBy: { periodEnd: 'desc' },
    });
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payroll records', error });
  }
};

export const getPayrollById = async (req, res) => {
  try {
    const payroll = await prisma.payroll.findUnique({
      where: { id: req.params.id },
      include: { employee: true },
    });

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payroll record', error });
  }
};

export const updatePayroll = async (req, res) => {
  try {
    const payroll = await prisma.payroll.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payroll record', error });
  }
};

export const deletePayroll = async (req, res) => {
  try {
    await prisma.payroll.delete({
      where: { id: req.params.id },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payroll record', error });
  }
};
