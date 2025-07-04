import prisma from '../config/db.js';

export const uploadComplianceDocument = async (req, res) => {
  try {
    const document = await prisma.complianceDocument.create({
      data: req.body,
    });
    res.status(201).json(document);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload document' });
  }
};

export const getAllComplianceDocuments = async (req, res) => {
  try {
    const docs = await prisma.complianceDocument.findMany({
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
};

export const deleteComplianceDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.complianceDocument.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete document' });
  }
};
