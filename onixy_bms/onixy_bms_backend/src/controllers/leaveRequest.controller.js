import prisma from '../config/db.js';

// Create a leave request
export const createLeaveRequest = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, type, reason } = req.body;

    const leave = await prisma.leaveRequest.create({
      data: {
        employeeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        reason,
      },
    });

    res.status(201).json(leave);
  } catch (err) {
    console.error('Error creating leave request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all leave requests (optional filter by employeeId)
export const getAllLeaveRequests = async (req, res) => {
  try {
    const { employeeId } = req.query;

    const where = employeeId ? { employeeId } : {};

    const leaves = await prisma.leaveRequest.findMany({
      where,
      include: {
        employee: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(leaves);
  } catch (err) {
    console.error('Error fetching leave requests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single leave request
export const getLeaveRequestById = async (req, res) => {
  try {
    const leave = await prisma.leaveRequest.findUnique({
      where: { id: req.params.id },
      include: {
        employee: true,
      },
    });

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.json(leave);
  } catch (err) {
    console.error('Error getting leave request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update leave request
export const updateLeaveRequest = async (req, res) => {
  try {
    const { startDate, endDate, type, reason, status } = req.body;

    const updated = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: {
        startDate: startDate && new Date(startDate),
        endDate: endDate && new Date(endDate),
        type,
        reason,
        status,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Error updating leave request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete leave request
export const deleteLeaveRequest = async (req, res) => {
  try {
    await prisma.leaveRequest.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting leave request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
