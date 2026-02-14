import prisma from "../../lib/prisma.js";

/**
 * Get all persalinan with filtering and pagination
 */
export const getAllPersalinan = async (filters = {}) => {
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
    where.tanggal_partus = {};
    if (tanggal_start) {
      where.tanggal_partus.gte = new Date(tanggal_start);
    }
    if (tanggal_end) {
      where.tanggal_partus.lte = new Date(tanggal_end);
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
    prisma.persalinan.findMany({
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
        keadaan_ibu_persalinan: true,
        keadaan_bayi_persalinan: true,
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
        tanggal_partus: "desc",
      },
    }),
    prisma.persalinan.count({ where }),
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
 * Get persalinan by ID
 */
export const getPersalinanById = async (id) => {
  const data = await prisma.persalinan.findUnique({
    where: { id },
    include: {
      pasien: true,
      practice_place: {
        include: {
          village: true,
        },
      },
      keadaan_ibu_persalinan: true,
      keadaan_bayi_persalinan: true,
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
    throw new Error("Data persalinan tidak ditemukan");
  }

  return data;
};

/**
 * Create new persalinan
 */
export const createPersalinan = async (payload, userId) => {
  const {
    practice_id,
    pasien_id,
    tanggal_partus,
    gravida,
    para,
    abortus,
    vit_k,
    hb_0,
    vit_a_bufas,
    catatan,
    keadaan_ibu,
    keadaan_bayi,
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

  // Validate keadaan_bayi jenis_kelamin
  if (keadaan_bayi && !keadaan_bayi.jenis_kelamin) {
    throw new Error("Jenis kelamin bayi harus diisi");
  }

  // Create persalinan with optional keadaan_ibu and keadaan_bayi
  const data = await prisma.persalinan.create({
    data: {
      practice_id,
      pasien_id,
      tanggal_partus: tanggal_partus ? new Date(tanggal_partus) : new Date(),
      gravida: parseInt(gravida),
      para: parseInt(para),
      abortus: parseInt(abortus),
      vit_k: vit_k || false,
      hb_0: hb_0 || false,
      vit_a_bufas: vit_a_bufas || false,
      catatan,
      created_by: userId,
      ...(keadaan_ibu && {
        keadaan_ibu_persalinan: {
          create: {
            baik: keadaan_ibu.baik !== undefined ? keadaan_ibu.baik : true,
            hap: keadaan_ibu.hap || false,
            partus_lama: keadaan_ibu.partus_lama || false,
            pre_eklamsi: keadaan_ibu.pre_eklamsi || false,
            hidup: keadaan_ibu.hidup !== undefined ? keadaan_ibu.hidup : true,
          },
        },
      }),
      ...(keadaan_bayi && {
        keadaan_bayi_persalinan: {
          create: {
            pb: keadaan_bayi.pb ? parseFloat(keadaan_bayi.pb) : null,
            bb: keadaan_bayi.bb ? parseFloat(keadaan_bayi.bb) : null,
            jenis_kelamin: keadaan_bayi.jenis_kelamin,
            asfiksia: keadaan_bayi.asfiksia || false,
            rds: keadaan_bayi.rds || false,
            cacat_bawaan: keadaan_bayi.cacat_bawaan || false,
            keterangan_cacat: keadaan_bayi.keterangan_cacat || null,
            hidup: keadaan_bayi.hidup !== undefined ? keadaan_bayi.hidup : true,
          },
        },
      }),
    },
    include: {
      pasien: true,
      practice_place: true,
      keadaan_ibu_persalinan: true,
      keadaan_bayi_persalinan: true,
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
 * Update persalinan
 */
export const updatePersalinan = async (id, payload, userId) => {
  const {
    tanggal_partus,
    gravida,
    para,
    abortus,
    vit_k,
    hb_0,
    vit_a_bufas,
    catatan,
    keadaan_ibu,
    keadaan_bayi,
  } = payload;

  // Check if data exists
  const existing = await prisma.persalinan.findUnique({
    where: { id },
    include: {
      keadaan_ibu_persalinan: true,
      keadaan_bayi_persalinan: true,
    },
  });

  if (!existing) {
    throw new Error("Data persalinan tidak ditemukan");
  }

  // Update persalinan
  const updateData = {
    ...(tanggal_partus && { tanggal_partus: new Date(tanggal_partus) }),
    ...(gravida !== undefined && { gravida: parseInt(gravida) }),
    ...(para !== undefined && { para: parseInt(para) }),
    ...(abortus !== undefined && { abortus: parseInt(abortus) }),
    ...(vit_k !== undefined && { vit_k }),
    ...(hb_0 !== undefined && { hb_0 }),
    ...(vit_a_bufas !== undefined && { vit_a_bufas }),
    ...(catatan !== undefined && { catatan }),
    updated_by: userId,
  };

  // Handle keadaan_ibu update/create
  if (keadaan_ibu) {
    if (existing.keadaan_ibu_persalinan) {
      // Update existing
      updateData.keadaan_ibu_persalinan = {
        update: {
          baik:
            keadaan_ibu.baik !== undefined
              ? keadaan_ibu.baik
              : existing.keadaan_ibu_persalinan.baik,
          hap:
            keadaan_ibu.hap !== undefined
              ? keadaan_ibu.hap
              : existing.keadaan_ibu_persalinan.hap,
          partus_lama:
            keadaan_ibu.partus_lama !== undefined
              ? keadaan_ibu.partus_lama
              : existing.keadaan_ibu_persalinan.partus_lama,
          pre_eklamsi:
            keadaan_ibu.pre_eklamsi !== undefined
              ? keadaan_ibu.pre_eklamsi
              : existing.keadaan_ibu_persalinan.pre_eklamsi,
          hidup:
            keadaan_ibu.hidup !== undefined
              ? keadaan_ibu.hidup
              : existing.keadaan_ibu_persalinan.hidup,
        },
      };
    } else {
      // Create new
      updateData.keadaan_ibu_persalinan = {
        create: {
          baik: keadaan_ibu.baik !== undefined ? keadaan_ibu.baik : true,
          hap: keadaan_ibu.hap || false,
          partus_lama: keadaan_ibu.partus_lama || false,
          pre_eklamsi: keadaan_ibu.pre_eklamsi || false,
          hidup: keadaan_ibu.hidup !== undefined ? keadaan_ibu.hidup : true,
        },
      };
    }
  }

  // Handle keadaan_bayi update/create
  if (keadaan_bayi) {
    if (existing.keadaan_bayi_persalinan) {
      // Update existing
      updateData.keadaan_bayi_persalinan = {
        update: {
          pb:
            keadaan_bayi.pb !== undefined
              ? keadaan_bayi.pb
                ? parseFloat(keadaan_bayi.pb)
                : null
              : existing.keadaan_bayi_persalinan.pb,
          bb:
            keadaan_bayi.bb !== undefined
              ? keadaan_bayi.bb
                ? parseFloat(keadaan_bayi.bb)
                : null
              : existing.keadaan_bayi_persalinan.bb,
          jenis_kelamin:
            keadaan_bayi.jenis_kelamin ||
            existing.keadaan_bayi_persalinan.jenis_kelamin,
          asfiksia:
            keadaan_bayi.asfiksia !== undefined
              ? keadaan_bayi.asfiksia
              : existing.keadaan_bayi_persalinan.asfiksia,
          rds:
            keadaan_bayi.rds !== undefined
              ? keadaan_bayi.rds
              : existing.keadaan_bayi_persalinan.rds,
          cacat_bawaan:
            keadaan_bayi.cacat_bawaan !== undefined
              ? keadaan_bayi.cacat_bawaan
              : existing.keadaan_bayi_persalinan.cacat_bawaan,
          keterangan_cacat:
            keadaan_bayi.keterangan_cacat !== undefined
              ? keadaan_bayi.keterangan_cacat
              : existing.keadaan_bayi_persalinan.keterangan_cacat,
          hidup:
            keadaan_bayi.hidup !== undefined
              ? keadaan_bayi.hidup
              : existing.keadaan_bayi_persalinan.hidup,
        },
      };
    } else {
      // Create new
      if (!keadaan_bayi.jenis_kelamin) {
        throw new Error("Jenis kelamin bayi harus diisi");
      }
      updateData.keadaan_bayi_persalinan = {
        create: {
          pb: keadaan_bayi.pb ? parseFloat(keadaan_bayi.pb) : null,
          bb: keadaan_bayi.bb ? parseFloat(keadaan_bayi.bb) : null,
          jenis_kelamin: keadaan_bayi.jenis_kelamin,
          asfiksia: keadaan_bayi.asfiksia || false,
          rds: keadaan_bayi.rds || false,
          cacat_bawaan: keadaan_bayi.cacat_bawaan || false,
          keterangan_cacat: keadaan_bayi.keterangan_cacat || null,
          hidup: keadaan_bayi.hidup !== undefined ? keadaan_bayi.hidup : true,
        },
      };
    }
  }

  const data = await prisma.persalinan.update({
    where: { id },
    data: updateData,
    include: {
      pasien: true,
      practice_place: true,
      keadaan_ibu_persalinan: true,
      keadaan_bayi_persalinan: true,
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
 * Delete persalinan
 */
export const deletePersalinan = async (id) => {
  // Check if data exists
  const existing = await prisma.persalinan.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Data persalinan tidak ditemukan");
  }

  // Delete (keadaan_ibu and keadaan_bayi will be cascade deleted)
  await prisma.persalinan.delete({
    where: { id },
  });

  return { message: "Data persalinan berhasil dihapus" };
};
