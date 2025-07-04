import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createWarehouse = async (req, res) => {
  try {
    const { name, location } = req.body;

    const warehouse = await prisma.warehouse.create({
      data: { name, location },
    });

    res.status(201).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
