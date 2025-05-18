
import { Injectable } from '@nestjs/common';

@Injectable()
export class SummaryService {
  getSummary(date: string) {
    return {
      date,
      summary: 'Hari ini kita diajak untuk bersyukur dan terbuka pada karya Roh Kudus.',
      reflectionChecklist: [
        'Saya merenungkan makna damai dalam hidup saya',
        'Saya berdoa untuk orang lain',
        'Saya membaca Injil dengan tenang'
      ]
    };
  }
}
