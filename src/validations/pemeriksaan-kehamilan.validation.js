import { z } from "zod";

export const createPemeriksaanKehamilanSchema = z.object({
  body: z.object({
    practice_id: z
      .string()
      .uuid({ message: "Practice ID harus berupa UUID valid" })
      .optional(), // Optional for admin, required/checked for bidan
    pasien_id: z
      .string()
      .uuid({ message: "Pasien ID harus berupa UUID valid" }),
    tanggal: z
      .string()
      .datetime({ message: "Tanggal harus format ISO 8601" })
      .optional()
      .or(z.date()),

    // Data Kehamilan
    gpa: z.string().min(1, { message: "GPA wajib diisi" }),
    umur_kehamilan: z.coerce
      .number()
      .int()
      .min(0)
      .max(45, { message: "Umur kehamilan tidak valid (0-45 minggu)" }),
    status_tt: z.enum(["TT1", "TT2", "TT3", "TT4", "TT5"], {
      message: "Status TT harus TT1, TT2, TT3, TT4, atau TT5",
    }),
    jenis_kunjungan: z.enum(["K1", "K2", "K3", "K4", "K5", "K6"], {
      message: "Jenis Kunjungan harus K1, K2, K3, K4, K5, atau K6",
    }),

    // Vital Signs
    td: z.string().regex(/^\d{2,3}\/\d{2,3}$/, {
      message: "Format TD harus XXX/YYY (contoh: 120/80)",
    }),
    lila: z.coerce.number().positive().optional(),
    bb: z.coerce.number().positive().optional(),

    // Resiko
    resti: z.enum(["RENDAH", "SEDANG", "TINGGI"], {
      message: "RESTI harus RENDAH, SEDANG, atau TINGGI",
    }),
    catatan: z.string().optional(),

    // Cek Lab (Optional)
    ceklab_report: z
      .object({
        hiv: z.boolean().default(false),
        hbsag: z.boolean().default(false),
        sifilis: z.boolean().default(false),
        hb: z.coerce.number().positive().optional(),
        golongan_darah: z.enum(["A", "B", "AB", "O"]).optional(),
      })
      .optional(),
  }),
});

export const updatePemeriksaanKehamilanSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "ID Pemeriksaan harus berupa UUID valid" }),
  }),
  body: z.object({
    tanggal: z.string().datetime().optional().or(z.date()),
    gpa: z.string().min(1).optional(),
    umur_kehamilan: z.coerce.number().int().min(0).max(45).optional(),
    status_tt: z.enum(["TT1", "TT2", "TT3", "TT4", "TT5"]).optional(),
    jenis_kunjungan: z.enum(["K1", "K2", "K3", "K4", "K5", "K6"]).optional(),
    td: z
      .string()
      .regex(/^\d{2,3}\/\d{2,3}$/)
      .optional(),
    lila: z.coerce.number().positive().optional(),
    bb: z.coerce.number().positive().optional(),
    resti: z.enum(["RENDAH", "SEDANG", "TINGGI"]).optional(),
    catatan: z.string().optional(),

    ceklab_report: z
      .object({
        hiv: z.boolean().optional(),
        hbsag: z.boolean().optional(),
        sifilis: z.boolean().optional(),
        hb: z.coerce.number().positive().optional(),
        golongan_darah: z.enum(["A", "B", "AB", "O"]).optional(),
      })
      .optional(),
  }),
});
