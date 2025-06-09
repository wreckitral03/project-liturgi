import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.chatMessage.deleteMany({});
  await prisma.userContext.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('All data deleted!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());