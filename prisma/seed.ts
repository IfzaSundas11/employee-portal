import { PrismaClient } from "./generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const departments = [
    { name: "Human Resources", code: "HR", description: "Handles hiring and employee relations" },
    { name: "Information Technology", code: "IT", description: "Manages tech infrastructure and software" },
    { name: "Finance", code: "FIN", description: "Handles budgeting and accounting" },
    { name: "Sales", code: "SALES", description: "Manages client relationships and revenue" },
    { name: "Operations", code: "OPS", description: "Oversees day-to-day business operations" },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
  }

  console.log("Departments seeded successfully.");

  const passwordHash = await hash("admin123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@company.com" },
    update: {},
    create: {
      username: "admin",
      firstName: "Admin",
      lastName: "User",
      email: "admin@company.com",
      password: passwordHash,
    },
  });

  console.log("Test user created:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });