import prisma from '../config/db.js';

export const createAutomationTask = async (req, res) => {
  try {
    const task = await prisma.automationTask.create({ data: req.body });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

export const getAllAutomationTasks = async (req, res) => {
  try {
    const tasks = await prisma.automationTask.findMany();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

export const updateAutomationTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.automationTask.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
};

export const deleteAutomationTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.automationTask.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
};
