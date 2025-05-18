
import { Controller, Get, Param, Query } from '@nestjs/common';
import { BibleService } from './bible.service';

@Controller('bible')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get(':book/:chapter')
  getChapter(@Param('book') book: string, @Param('chapter') chapter: string) {
    return this.bibleService.getChapter(book, chapter);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.bibleService.search(query);
  }
}
