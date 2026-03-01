import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@celestine.com";
  const name = process.env.ADMIN_NAME ?? "Super Admin";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe_Immediately!";
  const role = process.env.ADMIN_ROLE ?? "super_admin";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { name, role, passwordHash },
    create: { email, name, role, passwordHash },
  });

  const categories = [
    "Corporate", "Real Estate", "Litigation", "Compliance", "Tax", 
    "Employment", "Intellectual Property", "Mergers & Acquisitions", 
    "Banking & Finance", "Insurance", "Healthcare", "Technology", 
    "Energy", "Construction", "Family Law", "Estate Planning", "Other"
  ];

  for (const name of categories) {
    await prisma.caseCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seed complete:", { email, role, categories: categories.length });
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => prisma.$disconnect());
