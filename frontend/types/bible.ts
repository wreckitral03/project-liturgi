export interface Book {
  id: number;
  name: string;
  abbr: string;
  chapters: number;
}

export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}