import { PrismaClient } from "../src/generated/prisma";

async function main() {
  const prisma = new PrismaClient();
  const before = await prisma.property.count();
  const result = await prisma.property.deleteMany();
  const after = await prisma.property.count();

  console.log(`Объектов было: ${before}`);
  console.log(`Удалено: ${result.count}`);
  console.log(`Осталось: ${after}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
