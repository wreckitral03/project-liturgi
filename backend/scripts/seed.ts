// scripts/seed.ts
//npx ts-node scripts/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.reading.create({
    data: {
      date: '2025-05-23',
      firstReference: 'Kejadian 1:1-5',
      firstContent: `
1 Pada mulanya Allah menciptakan langit dan bumi.
2 Bumi belum berbentuk dan kosong; gelap gulita menutupi samudera raya, dan Roh Allah melayang-layang di atas permukaan air.
3 Berfirmanlah Allah: "Jadilah terang." Lalu terang itu jadi.
4 Allah melihat bahwa terang itu baik, lalu dipisahkan-Nyalah terang itu dari gelap.
5 Allah menamai terang itu siang, dan gelap itu malam. Jadilah petang dan jadilah pagi, itulah hari pertama.
      `.trim(),
      psalmReference: 'Mazmur 23:1-6',
      psalmContent: `
1 TUHAN adalah gembalaku, takkan kekurangan aku.
2 Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang;
3 Ia menyegarkan jiwaku. Ia menuntun aku di jalan yang benar oleh karena nama-Nya.
4 Sekalipun aku berjalan dalam lembah kekelaman, aku tidak takut bahaya, sebab Engkau besertaku; gada-Mu dan tongkat-Mu, itulah yang menghibur aku.
5 Engkau menyediakan hidangan bagiku, di hadapan lawanku; Engkau mengurapi kepalaku dengan minyak; pialaku penuh melimpah.
6 Kebajikan dan kemurahan belaka akan mengikuti aku, seumur hidupku; dan aku akan diam dalam rumah TUHAN sepanjang masa.
      `.trim(),
      secondReference: 'Roma 8:28-30',
      secondContent: `
28 Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia, yaitu bagi mereka yang terpanggil sesuai dengan rencana Allah.
29 Sebab semua orang yang dipilih-Nya dari semula, mereka juga ditentukan-Nya dari semula untuk menjadi serupa dengan gambaran Anak-Nya, supaya Ia, Anak-Nya itu, menjadi yang sulung di antara banyak saudara.
30 Dan mereka yang ditentukan-Nya dari semula, mereka juga dipanggil-Nya. Dan mereka yang dipanggil-Nya, mereka juga dibenarkan-Nya. Dan mereka yang dibenarkan-Nya, mereka juga dimuliakan-Nya.
      `.trim(),
      gospelReference: 'Yohanes 3:16',
      gospelContent: `
16 Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.
      `.trim(),
    }
  });
}

main().finally(() => prisma.$disconnect());