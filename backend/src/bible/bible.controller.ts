import { Controller, Get, Param, Query, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { BibleService } from './bible.service';
import { VerseDto } from './dto/verse.dto';

class SearchQueryDto {
  q: string;
}

@Controller('bible')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get('search') //search function http://localhost:3000/bible/search?q=manusia
  search(@Query() query: SearchQueryDto) {
    return this.bibleService.search(query.q);
  }

  @Get('export') //http://localhost:3000/bible/seed kyknya ambil dari db?
  async exportBible() {
    return this.bibleService.exportBible();
  }

  @Get() //http://localhost:3000/bible/
  getBooks() {
    return this.bibleService.getBooks();
  }

  @Get(':bookId') //http://localhost:3000/bible/1
  getBooksNumber(@Param('bookId') bookId: string) {
    return this.bibleService.getBooksNumber(bookId);
  }

  @Get(':bookId/:chapter') //http://localhost:3000/bible/1/1
  getChapter(@Param('bookId') bookId: string, @Param('chapter') chapter: string) {
    return this.bibleService.getChapter(bookId, +chapter);
  }

  @Post('seed') //http://localhost:3000/bible/seed masih error
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async seedBible(@Body() verses: VerseDto[]) {
    return this.bibleService.seedBible(verses);
  }
}