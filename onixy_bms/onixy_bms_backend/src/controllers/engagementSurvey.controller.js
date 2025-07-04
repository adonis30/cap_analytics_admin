import prisma from '../config/db.js';

export const createSurvey = async (req, res) => {
  try {
    const { employeeId, question, answer } = req.body;
    const survey = await prisma.engagementSurvey.create({
      data: {
        employeeId,
        question,
        answer,
      },
    });
    res.status(201).json(survey);
  } catch (err) {
    console.error('Error creating survey:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllSurveys = async (req, res) => {
  try {
    const surveys = await prisma.engagementSurvey.findMany({
      include: { employee: true },
    });
    res.json(surveys);
  } catch (err) {
    console.error('Error fetching surveys:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSurveyById = async (req, res) => {
  try {
    const survey = await prisma.engagementSurvey.findUnique({
      where: { id: req.params.id },
      include: { employee: true },
    });
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.json(survey);
  } catch (err) {
    console.error('Error fetching survey:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteSurvey = async (req, res) => {
  try {
    await prisma.engagementSurvey.delete({
      where: { id: req.params.id },
    });
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting survey:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
