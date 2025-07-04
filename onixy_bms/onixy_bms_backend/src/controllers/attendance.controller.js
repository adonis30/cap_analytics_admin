import prisma from '../config/db.js';

export const createAttendance = async (req, res) => {
  try {
    const attendance = await prisma.attendance.create({
      data: req.body,
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error creating attendance record', error });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      include: { employee: true },
      orderBy: { date: 'desc' },
    });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records', error });
  }
};

export const getAttendanceById = async (req, res) => {
  try {
    const record = await prisma.attendance.findUnique({
      where: { id: req.params.id },
      include: { employee: true },
    });

    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance record', error });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const record = await prisma.attendance.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance record', error });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    await prisma.attendance.delete({
      where: { id: req.params.id },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting attendance record', error });
  }
};
