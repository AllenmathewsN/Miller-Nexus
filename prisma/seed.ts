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
  console.log("Seed complete:", { email, role });
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => prisma.$disconnect());
