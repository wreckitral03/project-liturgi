const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const readingsDir = path.join(__dirname, '..', 'readings-raw');

async function main() {
  const files = fs.readdirSync(readingsDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(readingsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    console.log(`📄 Importing ${file} (${data.length} entries)...`);

    for (const entry of data) {
      if (!entry.date) {
        console.warn(`⚠️ Skipping entry without date in ${file}`);
        continue;
      }

      await prisma.reading.upsert({
        where: { date: entry.date },
        update: {},
        create: {
          date: entry.date,
          firstReference: entry.firstReference ?? "",
          firstContent: entry.firstContent ?? "",
          psalmReference: entry.psalmReference ?? "",
          psalmContent: entry.psalmContent ?? "",
          secondReference: entry.secondReference ?? null,
          secondContent: entry.secondContent ?? null,
          gospelReference: entry.gospelReference ?? "",
          gospelContent: entry.gospelContent ?? "",
        },
      });
    }
  }

  console.log('✅ All readings imported.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());