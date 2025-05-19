import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//import Sabda from 'sabda-api';
//run this "npx ts-node scripts/fetch-alkitab.ts"

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

const books = [
  { abbr: 'Kej', name: 'Kejadian', chapters: 50 },
  { abbr: 'Kel', name: 'Keluaran', chapters: 40 },
  { abbr: 'Ima', name: 'Imamat', chapters: 27 },
  { abbr: 'Bil', name: 'Bilangan', chapters: 36 },
  { abbr: 'Ula', name: 'Ulangan', chapters: 34 },
  { abbr: 'Yos', name: 'Yosua', chapters: 24 },
  { abbr: 'Hak', name: 'Hakim-hakim', chapters: 21 },
  { abbr: 'Rut', name: 'Rut', chapters: 4 },
  { abbr: '1 Sam', name: '1 Samuel', chapters: 31 },
  { abbr: '2 Sam', name: '2 Samuel', chapters: 24 },
  { abbr: '1 Raj', name: '1 Raja-Raja', chapters: 22 },
  { abbr: '2 Raj', name: '2 Raja-Raja', chapters: 25 },
  { abbr: '1 Taw', name: '1 Tawarikh', chapters: 29 },
  { abbr: '2 Taw', name: '2 Tawarikh', chapters: 36 },
  { abbr: 'Ezr', name: 'Ezra', chapters: 10 },
  { abbr: 'Neh', name: 'Nehemia', chapters: 13 },
  { abbr: 'Est', name: 'Ester', chapters: 10 },
  { abbr: 'Ayb', name: 'Ayub', chapters: 42 },
  { abbr: 'Maz', name: 'Mazmur', chapters: 150 },
  { abbr: 'Ams', name: 'Amsal', chapters: 31 },
  { abbr: 'Pkh', name: 'Pengkhotbah', chapters: 12 },
  { abbr: 'Kid', name: 'Kidung Agung', chapters: 8 },
  { abbr: 'Yes', name: 'Yesaya', chapters: 66 },
  { abbr: 'Yer', name: 'Yeremia', chapters: 52 },
  { abbr: 'Rat', name: 'Ratapan', chapters: 5 },
  { abbr: 'Yeh', name: 'Yehezkiel', chapters: 48 },
  { abbr: 'Dan', name: 'Daniel', chapters: 12 },
  { abbr: 'Hos', name: 'Hosea', chapters: 14 },
  { abbr: 'Yoe', name: 'Yoel', chapters: 3 },
  { abbr: 'Amo', name: 'Amos', chapters: 9 },
  { abbr: 'Oba', name: 'Obaja', chapters: 1 },
  { abbr: 'Yun', name: 'Yunus', chapters: 4 },
  { abbr: 'Mik', name: 'Mikha', chapters: 7 },
  { abbr: 'Nah', name: 'Nahum', chapters: 3 },
  { abbr: 'Hab', name: 'Habakuk', chapters: 3 },
  { abbr: 'Zef', name: 'Zefanya', chapters: 3 },
  { abbr: 'Hag', name: 'Hagai', chapters: 2 },
  { abbr: 'Zak', name: 'Zakharia', chapters: 14 },
  { abbr: 'Mal', name: 'Maleakhi', chapters: 4 },
  { abbr: 'Mat', name: 'Matius', chapters: 28 },
  { abbr: 'Mar', name: 'Markus', chapters: 16 },
  { abbr: 'Luk', name: 'Lukas', chapters: 24 },
  { abbr: 'Yoh', name: 'Yohanes', chapters: 21 },
  { abbr: 'Kis', name: 'Kisah Para Rasul', chapters: 28 },
  { abbr: 'Rom', name: 'Roma', chapters: 16 },
  { abbr: '1 Kor', name: '1 Korintus', chapters: 16 },
  { abbr: '2 Kor', name: '2 Korintus', chapters: 13 },
  { abbr: 'Gal', name: 'Galatia', chapters: 6 },
  { abbr: 'Efe', name: 'Efesus', chapters: 6 },
  { abbr: 'Flp', name: 'Filipi', chapters: 4 },
  { abbr: 'Kol', name: 'Kolose', chapters: 4 },
  { abbr: '1 Tes', name: '1 Tesalonika', chapters: 5 },
  { abbr: '2 Tes', name: '2 Tesalonika', chapters: 3 },
  { abbr: '1 Tim', name: '1 Timotius', chapters: 6 },
  { abbr: '2 Tim', name: '2 Timotius', chapters: 4 },
  { abbr: 'Tit', name: 'Titus', chapters: 3 },
  { abbr: 'Flm', name: 'Filemon', chapters: 1 },
  { abbr: 'Ibr', name: 'Ibrani', chapters: 13 },
  { abbr: 'Yak', name: 'Yakobus', chapters: 5 },
  { abbr: '1 Pet', name: '1 Petrus', chapters: 5 },
  { abbr: '2 Pet', name: '2 Petrus', chapters: 3 },
  { abbr: '1 Yoh', name: '1 Yohanes', chapters: 5 },
  { abbr: '2 Yoh', name: '2 Yohanes', chapters: 1 },
  { abbr: '3 Yoh', name: '3 Yohanes', chapters: 1 },
  { abbr: 'Yud', name: 'Yudas', chapters: 1 },
  { abbr: 'Wah', name: 'Wahyu', chapters: 22 },
];

(async () => {
  const output: Record<string, Record<string, any[]>> = {};

  for (const book of books) {
    output[book.name] = {};

    for (let i = 1; i <= book.chapters; i++) {
      const url = `http://alkitab.sabda.org/api/passage.php?passage=${book.abbr}+${i}`;
      console.log(`📖 Fetching ${book.name} ${i}...`);

      try {
        const res = await fetch(url);
        const xml = await res.text();
        const parsed = await parseStringPromise(xml);

        const verses = parsed?.bible?.book?.[0]?.chapter?.[0]?.verses?.[0]?.verse || [];

        output[book.name][i] = verses.map((v: any) => ({
          number: v.number?.[0],
          text: v.text?.[0],
        }));
      } catch (err) {
        console.error(`❌ Failed ${book.name} ${i}`, err);
      }
    }
  }

  // fs.writeFileSync(path.join(__dirname, 'alkitab.json'), JSON.stringify(output, null, 2));

  for (const bookName in output) {
    const chapters = output[bookName];
    for (const chapterStr in chapters) {
      const chapter = parseInt(chapterStr, 10);
      const verses = chapters[chapterStr];

      const data = verses.map((v: any) => ({
        book: bookName,
        chapter,
        verse: parseInt(v.number, 10),
        text: v.text,
      }));

      await prisma.verse.createMany({
        data,
        skipDuplicates: true,
      });
    }
  }

  await prisma.$disconnect();
  console.log('✅ All verses saved to database.');
})();