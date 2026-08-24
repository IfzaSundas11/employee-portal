import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("admin123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@company.com" },
    update: {},
    create: {
      email: "admin@company.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Test user created:", user.email);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());