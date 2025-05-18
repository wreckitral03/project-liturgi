
import { Injectable } from '@nestjs/common';

@Injectable()
export class BibleService {
  getChapter(book: string, chapter: string) {
    return {
      book,
      chapter,
      verses: [
        { verse: 1, text: 'In the beginning God created the heavens and the earth.' },
        { verse: 2, text: 'Now the earth was formless and empty...' }
      ]
    };
  }

  search(query: string) {
    return [
      { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world...' }
    ];
  }
}
