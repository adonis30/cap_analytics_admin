import prisma from "../config/db.js";
import { startOfMonth, endOfMonth } from "date-fns";

// 1. Attendance Summary Report
export const attendanceSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = endOfMonth(startDate);

    const data = await prisma.attendance.groupBy({
      by: ['status'],
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error generating attendance report", error });
  }
};

// 2. Leave Summary Report
export const leaveSummary = async (req, res) => {
  try {
    const summary = await prisma.leaveRequest.groupBy({
      by: ['status'],
      _count: true,
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Error generating leave report", error });
  }
};

// 3. Average Performance Score
export const averagePerformance = async (req, res) => {
  try {
    const data = await prisma.performanceReview.aggregate({
      _avg: { score: true },
      _count: { _all: true },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error generating performance report", error });
  }
};
