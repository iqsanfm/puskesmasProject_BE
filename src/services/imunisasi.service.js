import prisma from "../../lib/prisma.js";

/**
 * Get all imunisasi with filtering and pagination
 */
export const getAllImunisasi = async (filters = {}) => {
  const {
    page = 1,
    limit = 10,
    practice_id,
    pasien_id,
    tanggal_start,
    tanggal_end,
    jenis_imunisasi,
    search,
  } = filters;

  const skip = (page - 1) * limit;
  const where = {};

  // Filter by practice_id
  if (practice_id) {
    where.practice_id = practice_id;
  }

  // Filter by pasien_id (ID Bayi)
  if (pasien_id) {
    where.pasien_id = pasien_id;
  }

  // Filter by date range
  if (tanggal_start || tanggal_end) {
    where.tgl_imunisasi = {};
    if (tanggal_start) {
      where.tgl_imunisasi.gte = new Date(tanggal_start);
    }
    if (tanggal_end) {
      where.tgl_imunisasi.lte = new Date(tanggal_end);
    }
  }

  // Filter by jenis_imunisasi
  if (jenis_imunisasi) {
    where.jenis_imunisasi = jenis_imunisasi;
  }

  // Search by nama bayi/pasien or NIK or orang tua
  if (search) {
    where.OR = [
      {
        pasien: {
          OR: [
            { nama: { contains: search, mode: "insensitive" } },
            { nik: { contains: search, mode: "insensitive" } },
          ],
        },
      },
      { nama_orangtua: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.imunisasi.findMany({
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
        tgl_imunisasi: "desc",
      },
    }),
    prisma.imunisasi.count({ where }),
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
 * Get imunisasi by ID
 */
export const getImunisasiById = async (id) => {
  const data = await prisma.imunisasi.findUnique({
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
    throw new Error("Data imunisasi tidak ditemukan");
  }

  return data;
};

/**
 * Create new imunisasi
 */
export const createImunisasi = async (payload, userId) => {
  const {
    practice_id,
    pasien_id,
    tgl_imunisasi,
    berat_badan,
    suhu_badan,
    nama_orangtua,
    jenis_imunisasi,
    catatan,
  } = payload;

  // Validate pasien exists (Bayi)
  const pasien = await prisma.pasien.findUnique({
    where: { pasien_id },
  });

  if (!pasien) {
    throw new Error("Pasien (Bayi) tidak ditemukan");
  }

  // Validate practice_place exists
  const practicePlace = await prisma.practice_place.findUnique({
    where: { practice_id },
  });

  if (!practicePlace) {
    throw new Error("Practice place tidak ditemukan");
  }

  // Create imunisasi
  const data = await prisma.imunisasi.create({
    data: {
      practice_id,
      pasien_id,
      tgl_imunisasi: tgl_imunisasi ? new Date(tgl_imunisasi) : new Date(),
      berat_badan: parseFloat(berat_badan),
      suhu_badan: suhu_badan ? parseFloat(suhu_badan) : null,
      nama_orangtua,
      jenis_imunisasi,
      catatan,
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
 * Update imunisasi
 */
export const updateImunisasi = async (id, payload, userId) => {
  const {
    tgl_imunisasi,
    berat_badan,
    suhu_badan,
    nama_orangtua,
    jenis_imunisasi,
    catatan,
  } = payload;

  // Check if data exists
  const existing = await prisma.imunisasi.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Data imunisasi tidak ditemukan");
  }

  // Update imunisasi
  const data = await prisma.imunisasi.update({
    where: { id },
    data: {
      ...(tgl_imunisasi && { tgl_imunisasi: new Date(tgl_imunisasi) }),
      ...(berat_badan !== undefined && {
        berat_badan: parseFloat(berat_badan),
      }),
      ...(suhu_badan !== undefined && {
        suhu_badan: suhu_badan ? parseFloat(suhu_badan) : null,
      }),
      ...(nama_orangtua && { nama_orangtua }),
      ...(jenis_imunisasi && { jenis_imunisasi }),
      ...(catatan !== undefined && { catatan }),
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
 * Delete imunisasi
 */
export const deleteImunisasi = async (id) => {
  // Check if data exists
  const existing = await prisma.imunisasi.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Data imunisasi tidak ditemukan");
  }

  await prisma.imunisasi.delete({
    where: { id },
  });

  return { message: "Data imunisasi berhasil dihapus" };
};
