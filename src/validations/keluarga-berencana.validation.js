import { z } from "zod";

export const createKeluargaBerencanaSchema = z.object({
  body: z.object({
    practice_id: z
      .string()
      .uuid({ message: "Practice ID harus berupa UUID valid" })
      .optional(),
    pasien_id: z
      .string()
      .uuid({ message: "Pasien ID harus berupa UUID valid" }),
    tanggal_kunjungan: z
      .string()
      .datetime({ message: "Tanggal harus format ISO 8601" })
      .optional()
      .or(z.date()),

    // Data Anak (Historis)
    jumlah_anak_laki: z.coerce.number().int().min(0).default(0),
    jumlah_anak_perempuan: z.coerce.number().int().min(0).default(0),

    // Indikasi
    at: z.boolean().default(false), // Abortus Terancam

    // Alat Kontrasepsi (Single Choice)
    alat_kontrasepsi: z.enum(
      ["PIL", "SUNTIK", "IMPLANT", "IUD", "KONDOM", "MOW", "MOP", "MAL"],
      {
        message:
          "Alat kontrasepsi harus PIL, SUNTIK, IMPLANT, IUD, KONDOM, MOW, MOP, atau MAL",
      },
    ),

    keterangan: z.string().optional(),
  }),
});

export const updateKeluargaBerencanaSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "ID KB harus berupa UUID valid" }),
  }),
  body: z.object({
    tanggal_kunjungan: z.string().datetime().optional().or(z.date()),
    jumlah_anak_laki: z.coerce.number().int().min(0).optional(),
    jumlah_anak_perempuan: z.coerce.number().int().min(0).optional(),
    at: z.boolean().optional(),
    alat_kontrasepsi: z
      .enum(["PIL", "SUNTIK", "IMPLANT", "IUD", "KONDOM", "MOW", "MOP", "MAL"])
      .optional(),
    keterangan: z.string().optional(),
  }),
});
