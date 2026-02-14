import prisma from "../../lib/prisma.js";

/**
 * Get all keluarga berencana with filtering and pagination
 */
export const getAllKeluargaBerencana = async (filters = {}) => {
  const {
    page = 1,
    limit = 10,
    practice_id,
    pasien_id,
    tanggal_start,
    tanggal_end,
    search,
  } = filters;

  const skip = (page - 1) * limit;
  const where = {};

  // Filter by practice_id
  if (practice_id) {
    where.practice_id = practice_id;
  }

  // Filter by pasien_id
  if (pasien_id) {
    where.pasien_id = pasien_id;
  }

  // Filter by date range
  if (tanggal_start || tanggal_end) {
    where.tanggal_kunjungan = {};
    if (tanggal_start) {
      where.tanggal_kunjungan.gte = new Date(tanggal_start);
    }
    if (tanggal_end) {
      where.tanggal_kunjungan.lte = new Date(tanggal_end);
    }
  }

  // Search by nama pasien or NIK
  if (search) {
    where.pasien = {
      OR: [
        { nama: { contains: search, mode: "insensitive" } },
        { nik: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const [data, total] = await Promise.all([
    prisma.keluarga_berencana.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: {
        pasien: {
          select: {
            pasien_id: true,
            nik: true,
            nama: true,
            alamat_lengkap: true,
            tanggal_lahir: true,
          },
        },
        practice_place: {
          select: {
            practice_id: true,
            nama_praktik: true,
            alamat: true,
          },
        },
        creator: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
          },
        },
        updater: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
          },
        },
      },
      orderBy: {
        tanggal_kunjungan: "desc",
      },
    }),
    prisma.keluarga_berencana.count({ where }),
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
 * Get keluarga berencana by ID
 */
export const getKeluargaBerencanaById = async (id) => {
  const data = await prisma.keluarga_berencana.findUnique({
    where: { id },
    include: {
      pasien: true,
      practice_place: {
        include: {
          village: true,
        },
      },
      creator: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
        },
      },
      updater: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
        },
      },
    },
  });

  if (!data) {
    throw new Error("Data keluarga berencana tidak ditemukan");
  }

  return data;
};

/**
 * Create new keluarga berencana
 */
export const createKeluargaBerencana = async (payload, userId) => {
  const {
    practice_id,
    pasien_id,
    tanggal_kunjungan,
    jumlah_anak_laki,
    jumlah_anak_perempuan,
    at,
    alat_kontrasepsi,
    keterangan,
  } = payload;

  // Validate pasien exists
  const pasien = await prisma.pasien.findUnique({
    where: { pasien_id },
  });

  if (!pasien) {
    throw new Error("Pasien tidak ditemukan");
  }

  // Validate practice_place exists
  const practicePlace = await prisma.practice_place.findUnique({
    where: { practice_id },
  });

  if (!practicePlace) {
    throw new Error("Practice place tidak ditemukan");
  }

  // Create keluarga berencana
  const data = await prisma.keluarga_berencana.create({
    data: {
      practice_id,
      pasien_id,
      tanggal_kunjungan: tanggal_kunjungan
        ? new Date(tanggal_kunjungan)
        : new Date(),
      jumlah_anak_laki: parseInt(jumlah_anak_laki) || 0,
      jumlah_anak_perempuan: parseInt(jumlah_anak_perempuan) || 0,
      at: at || false,
      alat_kontrasepsi,
      keterangan,
      created_by: userId,
    },
    include: {
      pasien: true,
      practice_place: true,
      creator: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
        },
      },
    },
  });

  return data;
};

/**
 * Update keluarga berencana
 */
export const updateKeluargaBerencana = async (id, payload, userId) => {
  const {
    tanggal_kunjungan,
    jumlah_anak_laki,
    jumlah_anak_perempuan,
    at,
    alat_kontrasepsi,
    keterangan,
  } = payload;

  // Check if data exists
  const existing = await prisma.keluarga_berencana.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Data keluarga berencana tidak ditemukan");
  }

  // Update keluarga berencana
  const data = await prisma.keluarga_berencana.update({
    where: { id },
    data: {
      ...(tanggal_kunjungan && {
        tanggal_kunjungan: new Date(tanggal_kunjungan),
      }),
      ...(jumlah_anak_laki !== undefined && {
        jumlah_anak_laki: parseInt(jumlah_anak_laki),
      }),
      ...(jumlah_anak_perempuan !== undefined && {
        jumlah_anak_perempuan: parseInt(jumlah_anak_perempuan),
      }),
      ...(at !== undefined && { at }),
      ...(alat_kontrasepsi && { alat_kontrasepsi }),
      ...(keterangan !== undefined && { keterangan }),
      updated_by: userId,
    },
    include: {
      pasien: true,
      practice_place: true,
      creator: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
        },
      },
      updater: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
        },
      },
    },
  });

  return data;
};

/**
 * Delete keluarga berencana
 */
export const deleteKeluargaBerencana = async (id) => {
  // Check if data exists
  const existing = await prisma.keluarga_berencana.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Data keluarga berencana tidak ditemukan");
  }

  await prisma.keluarga_berencana.delete({
    where: { id },
  });

  return { message: "Data keluarga berencana berhasil dihapus" };
};
