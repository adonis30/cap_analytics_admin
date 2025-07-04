import prisma from "../src/config/db.js";
import bcrypt from "bcryptjs";

const seed = async () => {
  console.log("🌱 Seeding database...");

  const roles = [
    {
      name: "SuperAdmin",
      description: "Has full access to the system",
      permissions: ["*"],
    },
    {
      name: "Admin",
      description: "Can manage users and system modules",
      permissions: ["users.manage", "departments.manage"],
    },
    {
      name: "HR Assistant",
      description: "Manages employee data",
      permissions: ["employees.view", "employees.edit"],
    },
    {
      name: "Workshop Staff",
      description: "Handles workshop tasks",
      permissions: ["workshop.view"],
    },
    {
      name: "Transport Staff",
      description: "Manages transportation",
      permissions: ["transport.view", "transport.schedule"],
    },
    {
      name: "Stores Staff",
      description: "Manages inventory",
      permissions: ["inventory.view", "inventory.update"],
    },
    {
      name: "Procurement Staff",
      description: "Handles purchases",
      permissions: ["procurement.create", "procurement.view"],
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {}, // Optional: Add updates if needed
      create: role,
    });
    console.log(`✅ Ensured role: ${role.name}`);
  }

  const superAdminEmail = "superadmin@example.com";
  const existingUser = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("SuperSecurePass123!", 10);

    await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        isEmailVerified: true,
        role: {
          connect: { name: "SuperAdmin" }, // since name is unique
        },
      },
    });

    console.log(`👤 SuperAdmin user created with email: ${superAdminEmail}`);
  } else {
    console.log(`ℹ️ SuperAdmin user already exists: ${superAdminEmail}`);
  }

  console.log("✅ Seeding complete.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seeding error:", err);
  process.exit(1);
});
