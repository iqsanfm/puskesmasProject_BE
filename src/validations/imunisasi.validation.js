import { z } from "zod";

export const createImunisasiSchema = z.object({
  body: z.object({
    practice_id: z
      .string()
      .uuid({ message: "Practice ID harus berupa UUID valid" })
      .optional(),
    pasien_id: z
      .string()
      .uuid({ message: "Pasien ID (Bayi) harus berupa UUID valid" }),

    tgl_imunisasi: z
      .string()
      .datetime({ message: "Tanggal harus format ISO 8601" })
      .optional()
      .or(z.date()),

    // Data Fisik Bayi
    berat_badan: z.coerce
      .number()
      .positive({ message: "Berat badan harus angka positif" }),
    suhu_badan: z.coerce.number().positive().optional(),

    // Data Orang Tua
    nama_orangtua: z.string().min(1, { message: "Nama orang tua wajib diisi" }),

    // Jenis Imunisasi (Single Choice)
    jenis_imunisasi: z.enum(
      [
        "HB_0",
        "BCG",
        "DPT_1",
        "DPT_2",
        "DPT_3",
        "POLIO_1",
        "POLIO_2",
        "POLIO_3",
        "POLIO_4",
        "IPV",
        "CAMPAK",
        "PCV_1",
        "PCV_2",
        "PCV_3",
        "BOSTER",
      ],
      {
        message: "Jenis imunisasi tidak valid. Pilihan: HB_0, BCG, DPT_1, ...",
      },
    ),

    catatan: z.string().optional(),
  }),
});

export const updateImunisasiSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "ID Imunisasi harus berupa UUID valid" }),
  }),
  body: z.object({
    tgl_imunisasi: z.string().datetime().optional().or(z.date()),
    berat_badan: z.coerce.number().positive().optional(),
    suhu_badan: z.coerce.number().positive().optional(),
    nama_orangtua: z.string().min(1).optional(),
    jenis_imunisasi: z
      .enum(
        [
          "HB_0",
          "BCG",
          "DPT_1",
          "DPT_2",
          "DPT_3",
          "POLIO_1",
          "POLIO_2",
          "POLIO_3",
          "POLIO_4",
          "IPV",
          "CAMPAK",
          "PCV_1",
          "PCV_2",
          "PCV_3",
          "BOSTER",
        ],
        {
          message: "Jenis imunisasi tidak valid",
        },
      )
      .optional(),
    catatan: z.string().optional(),
  }),
});
