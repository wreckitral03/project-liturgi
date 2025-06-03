import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();  

async function main() {
  const filePath = './data/readings-2025-06-flat.json'; // Updated path to data directory
  const raw = fs.readFileSync(filePath, 'utf-8');
  const readings = JSON.parse(raw);

  for (const r of readings) {
    await prisma.reading.create({
      data: {
        date: r.date,
        firstReference: r.firstReference,
        firstContent: r.firstContent,
        psalmReference: r.psalmReference,
        psalmContent: r.psalmContent,
        secondReference: r.secondReference,
        secondContent: r.secondContent,
        gospelReference: r.gospelReference,
        gospelContent: r.gospelContent
      }
    });
    console.log(`Imported reading for ${r.date}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());