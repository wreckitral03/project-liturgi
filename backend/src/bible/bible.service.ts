function getAbbrFromName(name: string): string | undefined {
  return booksCanon.find((b) => b.name === name)?.abbr;
}
function getAbbrFromId(id: number): string | undefined {
  return booksCanon[id - 1]?.abbr;
}
const booksCanon = [

  { name: 'Kejadian', abbr: 'Kej' },
  { name: 'Keluaran', abbr: 'Kel' },
  { name: 'Imamat', abbr: 'Ima' },
  { name: 'Bilangan', abbr: 'Bil' },
  { name: 'Ulangan', abbr: 'Ula' },
  { name: 'Yosua', abbr: 'Yos' },
  { name: 'Hakim-hakim', abbr: 'Hak' },
  { name: 'Rut', abbr: 'Rut' },
  { name: '1 Samuel', abbr: '1 Sam' },
  { name: '2 Samuel', abbr: '2 Sam' },
  { name: '1 Raja-Raja', abbr: '1 Raj' },
  { name: '2 Raja-Raja', abbr: '2 Raj' },
  { name: '1 Tawarikh', abbr: '1 Taw' },
  { name: '2 Tawarikh', abbr: '2 Taw' },
  { name: 'Ezra', abbr: 'Ezr' },
  { name: 'Nehemia', abbr: 'Neh' },
  { name: 'Ester', abbr: 'Est' },
  { name: 'Ayub', abbr: 'Ayb' },
  { name: 'Mazmur', abbr: 'Maz' },
  { name: 'Amsal', abbr: 'Ams' },
  { name: 'Pengkhotbah', abbr: 'Pkh' },
  { name: 'Kidung Agung', abbr: 'Kid' },
  { name: 'Yesaya', abbr: 'Yes' },
  { name: 'Yeremia', abbr: 'Yer' },
  { name: 'Ratapan', abbr: 'Rat' },
  { name: 'Yehezkiel', abbr: 'Yeh' },
  { name: 'Daniel', abbr: 'Dan' },
  { name: 'Hosea', abbr: 'Hos' },
  { name: 'Yoel', abbr: 'Yoe' },
  { name: 'Amos', abbr: 'Amo' },
  { name: 'Obaja', abbr: 'Oba' },
  { name: 'Yunus', abbr: 'Yun' },
  { name: 'Mikha', abbr: 'Mik' },
  { name: 'Nahum', abbr: 'Nah' },
  { name: 'Habakuk', abbr: 'Hab' },
  { name: 'Zefanya', abbr: 'Zef' },
  { name: 'Hagai', abbr: 'Hag' },
  { name: 'Zakharia', abbr: 'Zak' },
  { name: 'Maleakhi', abbr: 'Mal' },
  { name: 'Matius', abbr: 'Mat' },
  { name: 'Markus', abbr: 'Mar' },
  { name: 'Lukas', abbr: 'Luk' },
  { name: 'Yohanes', abbr: 'Yoh' },
  { name: 'Kisah Para Rasul', abbr: 'Kis' },
  { name: 'Roma', abbr: 'Rom' },
  { name: '1 Korintus', abbr: '1 Kor' },
  { name: '2 Korintus', abbr: '2 Kor' },
  { name: 'Galatia', abbr: 'Gal' },
  { name: 'Efesus', abbr: 'Efe' },
  { name: 'Filipi', abbr: 'Flp' },
  { name: 'Kolose', abbr: 'Kol' },
  { name: '1 Tesalonika', abbr: '1 Tes' },
  { name: '2 Tesalonika', abbr: '2 Tes' },
  { name: '1 Timotius', abbr: '1 Tim' },
  { name: '2 Timotius', abbr: '2 Tim' },
  { name: 'Titus', abbr: 'Tit' },
  { name: 'Filemon', abbr: 'Flm' },
  { name: 'Ibrani', abbr: 'Ibr' },
  { name: 'Yakobus', abbr: 'Yak' },
  { name: '1 Petrus', abbr: '1 Pet' },
  { name: '2 Petrus', abbr: '2 Pet' },
  { name: '1 Yohanes', abbr: '1 Yoh' },
  { name: '2 Yohanes', abbr: '2 Yoh' },
  { name: '3 Yohanes', abbr: '3 Yoh' },
  { name: 'Yudas', abbr: 'Yud' },
  { name: 'Wahyu', abbr: 'Wah' },
];
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerseDto } from './dto/verse.dto';

@Injectable()
export class BibleService {
  constructor(private prisma: PrismaService) {}

  async seedBible(verses: VerseDto[]) {
    return this.prisma.verse.createMany({
      data: verses,
      skipDuplicates: true,
    });
  }

  async exportBible() {
    const verses = await this.prisma.verse.findMany();
    const output = {};

    for (const v of verses) {
      if (!output[v.book]) output[v.book] = {};
      if (!output[v.book][v.chapter]) output[v.book][v.chapter] = [];
      output[v.book][v.chapter].push({ number: v.verse, text: v.text });
    }

    return output;
  }

  async getBooks() {
    const raw = await this.prisma.verse.groupBy({
      by: ['book'],
      _max: { chapter: true },
    });

    const map = Object.fromEntries(raw.map((b) => [b.book, b._max.chapter]));

    return booksCanon
      .filter((b) => map[b.name] !== undefined)
      .map((b, i) => ({
        id: i + 1,
        abbr: b.abbr,
        name: b.name,
        chapters: map[b.name],
      }));
  }

  async getChapter(bookId: string, chapter: number) {
    const id = parseInt(bookId, 10);
    const abbr = getAbbrFromId(id);
    const found = booksCanon.find((b) => b.abbr === abbr);
    if (!found) throw new Error(`Unknown book ID: ${bookId}`);

    const verses = await this.prisma.verse.findMany({
      where: { book: found.name, chapter },
      orderBy: { verse: 'asc' },
    });

    return {
      book: found.name,
      chapter,
      verses: verses.map(v => ({
        number: v.verse,
        text: v.text,
      })),
    };
  }

  async search(query: string) {
    const results = await this.prisma.verse.findMany({
      where: {
        text: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: [{ book: 'asc' }, { chapter: 'asc' }, { verse: 'asc' }],
    });

    return results.map((v) => ({
      ...v,
      abbr: getAbbrFromName(v.book) || '',
    }));
  }
  async getBooksNumber(bookId: string) {
    const id = parseInt(bookId, 10);
    const abbr = getAbbrFromId(id);
    const found = booksCanon.find((b) => b.abbr === abbr);
    if (!found) throw new Error(`Unknown book ID: ${bookId}`);

    const result = await this.prisma.verse.aggregate({
      _max: {
        chapter: true,
      },
      where: {
        book: found.name,
      },
    });

    const totalChapters = result._max.chapter || 0;
    return {
      id,
      name: found.name,
      chapters: Array.from({ length: totalChapters }, (_, i) => i + 1),
    };
  }
}