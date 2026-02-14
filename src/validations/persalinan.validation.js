import { z } from "zod";

export const createPersalinanSchema = z.object({
  body: z.object({
    practice_id: z
      .string()
      .uuid({ message: "Practice ID harus berupa UUID valid" })
      .optional(),
    pasien_id: z
      .string()
      .uuid({ message: "Pasien ID harus berupa UUID valid" }),
    tanggal_partus: z
      .string()
      .datetime({ message: "Tanggal harus format ISO 8601" })
      .optional()
      .or(z.date()),

    // Data GPA
    gravida: z.coerce
      .number()
      .int()
      .min(0, { message: "Gravida harus angka positif" }),
    para: z.coerce
      .number()
      .int()
      .min(0, { message: "Para harus angka positif" }),
    abortus: z.coerce
      .number()
      .int()
      .min(0, { message: "Abortus harus angka positif" }),

    // Vitamin & Imunisasi
    vit_k: z.boolean().default(false),
    hb_0: z.boolean().default(false),
    vit_a_bufas: z.boolean().default(false),

    catatan: z.string().optional(),

    // Keadaan Ibu (Optional)
    keadaan_ibu: z
      .object({
        baik: z.boolean().default(true),
        hap: z.boolean().default(false),
        partus_lama: z.boolean().default(false),
        pre_eklamsi: z.boolean().default(false),
        hidup: z.boolean().default(true),
      })
      .optional(),

    // Keadaan Bayi (Optional)
    keadaan_bayi: z
      .object({
        pb: z.coerce.number().positive().optional(),
        bb: z.coerce.number().positive().optional(),
        jenis_kelamin: z.enum(["LAKI_LAKI", "PEREMPUAN"], {
          message: "Jenis kelamin harus LAKI_LAKI atau PEREMPUAN",
        }),
        asfiksia: z.boolean().default(false),
        rds: z.boolean().default(false),
        cacat_bawaan: z.boolean().default(false),
        keterangan_cacat: z.string().optional(),
        hidup: z.boolean().default(true),
      })
      .optional(),
  }),
});

export const updatePersalinanSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "ID Persalinan harus berupa UUID valid" }),
  }),
  body: z.object({
    tanggal_partus: z.string().datetime().optional().or(z.date()),
    gravida: z.coerce.number().int().min(0).optional(),
    para: z.coerce.number().int().min(0).optional(),
    abortus: z.coerce.number().int().min(0).optional(),

    vit_k: z.boolean().optional(),
    hb_0: z.boolean().optional(),
    vit_a_bufas: z.boolean().optional(),

    catatan: z.string().optional(),

    keadaan_ibu: z
      .object({
        baik: z.boolean().optional(),
        hap: z.boolean().optional(),
        partus_lama: z.boolean().optional(),
        pre_eklamsi: z.boolean().optional(),
        hidup: z.boolean().optional(),
      })
      .optional(),

    keadaan_bayi: z
      .object({
        pb: z.coerce.number().positive().optional(),
        bb: z.coerce.number().positive().optional(),
        jenis_kelamin: z.enum(["LAKI_LAKI", "PEREMPUAN"]).optional(),
        asfiksia: z.boolean().optional(),
        rds: z.boolean().optional(),
        cacat_bawaan: z.boolean().optional(),
        keterangan_cacat: z.string().optional(),
        hidup: z.boolean().optional(),
      })
      .optional(),
  }),
});
