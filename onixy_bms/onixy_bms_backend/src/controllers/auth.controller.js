import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import prisma from "../config/db.js";
import { getTranslation } from "../i18n/index.js";

// Allowed roles that can be assigned through registration
const PUBLIC_REGISTERABLE_ROLES = [
  "HR Assistant",
  "Workshop Staff",
  "Transport Staff",
  "Stores Staff",
  "Procurement Staff",
];
const DEFAULT_ROLE = "HR Assistant";

// REGISTER
export const registerUser = async (req, res) => {
  const t = (key) => getTranslation(req.locale, key);

  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: t("auth.missing_fields") });
    }

    // Sanitize role input: allow only safe roles
    const safeRole = role && PUBLIC_REGISTERABLE_ROLES.includes(role) ? role : DEFAULT_ROLE;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: t("auth.user_exists") });
    }

    // Look up or create the safe role in DB
    let assignedRole = await prisma.role.findUnique({ where: { name: safeRole } });
    if (!assignedRole) {
      assignedRole = await prisma.role.create({ data: { name: safeRole } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: assignedRole.id,
      },
      include: { role: true },
    });

    const token = generateToken({ userId: user.id, role: user.role.name });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(201).json({
      message: t("auth.registration_success"),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: t("error.server"), error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const t = (key) => getTranslation(req.locale, key);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: t("auth.missing_fields") });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: t("auth.invalid_credentials") });
    }

    const token = generateToken({ userId: user.id, role: user.role.name });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: t("auth.login_success"),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: t("error.server"), error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id; // Ensure `req.user` is populated by auth middleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true, // add or remove fields as needed
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching current user:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET USERS
export const getUsers = async (req, res) => {
  const t = (key) => getTranslation(req.locale, key);

  try {
    const users = await prisma.user.findMany({
      include: { role: true },
    });

    res.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.name,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: t("error.server") });
  }
};
