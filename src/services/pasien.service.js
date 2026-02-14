import prisma from "../../lib/prisma.js";

/**
 * Get all pasien with filtering and pagination
 */
export const getAllPasien = async (filters = {}) => {
  const { page = 1, limit = 10, search } = filters;

  const skip = (page - 1) * limit;
  const where = {};

  // Search by nama or NIK
  if (search) {
    where.OR = [
      { nama: { contains: search, mode: "insensitive" } },
      { nik: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.pasien.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: {
        created_at: "desc",
      },
    }),
    prisma.pasien.count({ where }),
  ]);

  return {
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get pasien by ID
 */
export const getPasienById = async (id) => {
  const data = await prisma.pasien.findUnique({
    where: { pasien_id: id },
    include: {
      pemeriksaan_kehamilan: {
        orderBy: { tanggal: "desc" },
        take: 5, // Last 5 records
      },
      persalinan: {
        orderBy: { tanggal_persalinan: "desc" },
        take: 5,
      },
      keluarga_berencana: {
        orderBy: { tanggal: "desc" },
        take: 5,
      },
      imunisasi: {
        orderBy: { tanggal: "desc" },
        take: 5,
      },
    },
  });

  if (!data) {
    throw new Error("Pasien tidak ditemukan");
  }

  return data;
};

/**
 * Create new pasien
 */
export const createPasien = async (payload) => {
  const { nik, nama, alamat_lengkap, tanggal_lahir } = payload;

  // Check if NIK already exists
  const existing = await prisma.pasien.findUnique({
    where: { nik },
  });

  if (existing) {
    throw new Error("NIK sudah terdaftar");
  }

  const data = await prisma.pasien.create({
    data: {
      nik,
      nama,
      alamat_lengkap,
      tanggal_lahir: new Date(tanggal_lahir),
    },
  });

  return data;
};

/**
 * Update pasien
 */
export const updatePasien = async (id, payload) => {
  const { nama, alamat_lengkap, tanggal_lahir } = payload;

  // Check if pasien exists
  const existing = await prisma.pasien.findUnique({
    where: { pasien_id: id },
  });

  if (!existing) {
    throw new Error("Pasien tidak ditemukan");
  }

  const data = await prisma.pasien.update({
    where: { pasien_id: id },
    data: {
      ...(nama && { nama }),
      ...(alamat_lengkap && { alamat_lengkap }),
      ...(tanggal_lahir && { tanggal_lahir: new Date(tanggal_lahir) }),
    },
  });

  return data;
};

/**
 * Delete pasien
 */
export const deletePasien = async (id) => {
  // Check if pasien exists
  const existing = await prisma.pasien.findUnique({
    where: { pasien_id: id },
    include: {
      pemeriksaan_kehamilan: true,
      persalinan: true,
      keluarga_berencana: true,
      imunisasi: true,
    },
  });

  if (!existing) {
    throw new Error("Pasien tidak ditemukan");
  }

  // Check if pasien has related data
  const hasRelatedData =
    existing.pemeriksaan_kehamilan.length > 0 ||
    existing.persalinan.length > 0 ||
    existing.keluarga_berencana.length > 0 ||
    existing.imunisasi.length > 0;

  if (hasRelatedData) {
    throw new Error(
      "Tidak dapat menghapus pasien yang memiliki data pemeriksaan",
    );
  }

  await prisma.pasien.delete({
    where: { pasien_id: id },
  });

  return { message: "Pasien berhasil dihapus" };
};
