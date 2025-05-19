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
    const data = await this.prisma.verse.groupBy({
      by: ['book'],
      _max: { chapter: true },
    });

    // Add abbreviation matching for compatibility with frontend
    const abbrMap = {
      'Kejadian': 'Kej',
      'Keluaran': 'Kel',
      'Imamat': 'Ima',
      'Bilangan': 'Bil',
      'Ulangan': 'Ula',
      'Yosua': 'Yos',
      'Hakim-hakim': 'Hak',
      'Rut': 'Rut',
      '1 Samuel': '1 Sam',
      '2 Samuel': '2 Sam',
      '1 Raja-Raja': '1 Raj',
      '2 Raja-Raja': '2 Raj',
      '1 Tawarikh': '1 Taw',
      '2 Tawarikh': '2 Taw',
      'Ezra': 'Ezr',
      'Nehemia': 'Neh',
      'Ester': 'Est',
      'Ayub': 'Ayb',
      'Mazmur': 'Maz',
      'Amsal': 'Ams',
      'Pengkhotbah': 'Pkh',
      'Kidung Agung': 'Kid',
      'Yesaya': 'Yes',
      'Yeremia': 'Yer',
      'Ratapan': 'Rat',
      'Yehezkiel': 'Yeh',
      'Daniel': 'Dan',
      'Hosea': 'Hos',
      'Yoel': 'Yoe',
      'Amos': 'Amo',
      'Obaja': 'Oba',
      'Yunus': 'Yun',
      'Mikha': 'Mik',
      'Nahum': 'Nah',
      'Habakuk': 'Hab',
      'Zefanya': 'Zef',
      'Hagai': 'Hag',
      'Zakharia': 'Zak',
      'Maleakhi': 'Mal',
      'Matius': 'Mat',
      'Markus': 'Mar',
      'Lukas': 'Luk',
      'Yohanes': 'Yoh',
      'Kisah Para Rasul': 'Kis',
      'Roma': 'Rom',
      '1 Korintus': '1 Kor',
      '2 Korintus': '2 Kor',
      'Galatia': 'Gal',
      'Efesus': 'Efe',
      'Filipi': 'Flp',
      'Kolose': 'Kol',
      '1 Tesalonika': '1 Tes',
      '2 Tesalonika': '2 Tes',
      '1 Timotius': '1 Tim',
      '2 Timotius': '2 Tim',
      'Titus': 'Tit',
      'Filemon': 'Flm',
      'Ibrani': 'Ibr',
      'Yakobus': 'Yak',
      '1 Petrus': '1 Pet',
      '2 Petrus': '2 Pet',
      '1 Yohanes': '1 Yoh',
      '2 Yohanes': '2 Yoh',
      '3 Yohanes': '3 Yoh',
      'Yudas': 'Yud',
      'Wahyu': 'Wah',
    };

    return data.map((b, i) => ({
      id: i + 1,
      abbr: abbrMap[b.book] ?? b.book,
      name: b.book,
      chapters: b._max.chapter,
    }));
  }

  async getChapter(book: string, chapter: number) {
    return this.prisma.verse.findMany({
      where: { book, chapter },
      orderBy: { verse: 'asc' },
    });
  }

  async search(query: string) {
    return this.prisma.verse.findMany({
      where: {
        text: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: [{ book: 'asc' }, { chapter: 'asc' }, { verse: 'asc' }],
    });
  }
}