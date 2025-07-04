import prisma from '../config/db.js';

export const createRole = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'Role name is required' });

  try {
    const role = await prisma.role.create({ data: { name } });
    res.status(201).json({ role });
  } catch (error) {
    res.status(500).json({ message: 'Error creating role', error: error.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json({ roles });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles', error: error.message });
  }
};

export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedRole = await prisma.role.update({
      where: { id },
      data: { name },
    });
    res.json({ updatedRole });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.role.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting role', error: error.message });
  }
};
