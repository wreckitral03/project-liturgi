
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReadingsService {
  getReading(date: string) {
    return {
      date,
      bacaan_pertama: 'Kejadian 1:1-5',
      mazmur: 'Mazmur 23',
      bacaan_kedua: null,
      injil: 'Yohanes 1:1-14',
    };
  }
}
