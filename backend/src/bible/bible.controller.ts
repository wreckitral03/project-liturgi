import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { BibleService } from './bible.service';
import { VerseDto } from './dto/verse.dto';

@Controller('bible')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.bibleService.search(query);
  }

  @Get('export')
  async exportBible() {
    return this.bibleService.exportBible();
  }

  @Get('books')
  getBooks() {
    return this.bibleService.getBooks();
  }

  @Get(':book/:chapter')
  getChapter(@Param('book') book: string, @Param('chapter') chapter: string) {
    return this.bibleService.getChapter(book, +chapter);
  }

  @Post('seed')
  async seedBible(@Body() verses: VerseDto[]) {
    return this.bibleService.seedBible(verses);
  }
}