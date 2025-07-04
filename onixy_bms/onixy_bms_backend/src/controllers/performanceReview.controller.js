import prisma from '../config/db.js';

export const createPerformanceReview = async (req, res) => {
  try {
    const {
      employeeId,
      reviewerId,
      periodStart,
      periodEnd,
      score,
      feedback,
    } = req.body;

    const review = await prisma.performanceReview.create({
      data: {
        employeeId,
        reviewerId,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        score,
        feedback,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating performance review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllPerformanceReviews = async (req, res) => {
  try {
    const { employeeId } = req.query;

    const reviews = await prisma.performanceReview.findMany({
      where: employeeId ? { employeeId } : {},
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true },
        },
        reviewer: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { periodEnd: 'desc' },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPerformanceReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.performanceReview.findUnique({
      where: { id },
      include: {
        employee: true,
        reviewer: true,
      },
    });

    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePerformanceReview = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      periodStart,
      periodEnd,
      score,
      feedback,
      reviewerId,
    } = req.body;

    const updated = await prisma.performanceReview.update({
      where: { id },
      data: {
        reviewerId,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        score,
        feedback,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating performance review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePerformanceReview = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.performanceReview.delete({ where: { id } });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting performance review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
