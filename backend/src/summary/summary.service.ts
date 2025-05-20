import { Injectable } from '@nestjs/common';

@Injectable()
export class SummaryService {
  getSummary(date: string) {
    return {
      date,
      summary: 'Hari ini kita diajak untuk bersyukur dan terbuka pada karya Roh Kudus.',
      checklist: [
        { text: 'Saya merenungkan makna damai dalam hidup saya', completed: false },
        { text: 'Saya berdoa untuk orang lain', completed: false },
        { text: 'Saya membaca Injil dengan tenang', completed: false }
      ]
    };
  }
}
