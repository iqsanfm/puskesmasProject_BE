import prisma from "../../lib/prisma.js";

export const createPracticePlaceService = async (practicePlaceData) => {
    const { nama_praktik, village_id, alamat, user_id } = practicePlaceData;

    // Validasi: Field wajib
    if (!nama_praktik || !village_id || !alamat || !user_id) {
        throw new Error('Nama praktik, village_id, alamat, dan user_id wajib diisi');
    }

    // Cek apakah village ada
    const village = await prisma.village.findUnique({
        where: { village_id }
    });

    if (!village) {
        throw new Error('Desa tidak ditemukan');
    }

    // Cek apakah user ada dan posisinya bidan_praktik
    const user = await prisma.user.findUnique({
        where: { user_id }
    });

    if (!user) {
        throw new Error('User tidak ditemukan');
    }

    if (user.position_user !== 'bidan_praktik') {
        throw new Error('User harus memiliki posisi bidan_praktik');
    }

    // Cek apakah user sudah punya tempat praktik
    const existingPractice = await prisma.practice_place.findUnique({
        where: { user_id }
    });

    if (existingPractice) {
        throw new Error('User sudah memiliki tempat praktik');
    }

    const newPracticePlace = await prisma.practice_place.create({
        data: {
            nama_praktik,
            village_id,
            alamat,
            user_id
        },
        include: {
            village: true,
            user: {
                select: {
                    user_id: true,
                    full_name: true,
                    email: true,
                    position_user: true
                }
            }
        }
    });

    return newPracticePlace;
};

export const getAllPracticePlacesService = async () => {
    const practicePlaces = await prisma.practice_place.findMany({
        include: {
            village: true,
            user: {
                select: {
                    user_id: true,
                    full_name: true,
                    email: true,
                    position_user: true
                }
            },
            _count: {
                select: {
                    health_data: true
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    });

    return practicePlaces;
};

export const getPracticePlacesByVillageService = async (village_id) => {
    // Cek apakah village ada
    const village = await prisma.village.findUnique({
        where: { village_id }
    });

    if (!village) {
        throw new Error('Desa tidak ditemukan');
    }

    const practicePlaces = await prisma.practice_place.findMany({
        where: { village_id },
        include: {
            user: {
                select: {
                    user_id: true,
                    full_name: true,
                    email: true,
                    position_user: true
                }
            },
            _count: {
                select: {
                    health_data: true
                }
            }
        }
    });

    return practicePlaces;
};

export const getPracticePlaceByIdService = async (practice_id) => {
    const practicePlace = await prisma.practice_place.findUnique({
        where: { practice_id },
        include: {
            village: true,
            user: {
                select: {
                    user_id: true,
                    full_name: true,
                    email: true,
                    position_user: true
                }
            },
            health_data: {
                take: 10,
                orderBy: {
                    created_at: 'desc'
                },
                select: {
                    data_id: true,
                    nama_pasien: true,
                    jenis_data: true,
                    tanggal_periksa: true,
                    status_verifikasi: true
                }
            }
        }
    });

    if (!practicePlace) {
        throw new Error('Tempat praktik tidak ditemukan');
    }

    return practicePlace;
};

export const updatePracticePlaceService = async (practice_id, practicePlaceData) => {
    const { nama_praktik, village_id, alamat } = practicePlaceData;

    // Cek apakah practice place ada
    const existingPractice = await prisma.practice_place.findUnique({
        where: { practice_id }
    });

    if (!existingPractice) {
        throw new Error('Tempat praktik tidak ditemukan');
    }

    // Validasi: Field wajib
    if (!nama_praktik || !village_id || !alamat) {
        throw new Error('Nama praktik, village_id, dan alamat wajib diisi');
    }

    // Cek apakah village baru ada (jika diubah)
    if (village_id !== existingPractice.village_id) {
        const village = await prisma.village.findUnique({
            where: { village_id }
        });

        if (!village) {
            throw new Error('Desa tidak ditemukan');
        }
    }

    const updatedPracticePlace = await prisma.practice_place.update({
        where: { practice_id },
        data: {
            nama_praktik,
            village_id,
            alamat
        },
        include: {
            village: true,
            user: {
                select: {
                    user_id: true,
                    full_name: true,
                    email: true,
                    position_user: true
                }
            }
        }
    });

    return updatedPracticePlace;
};

export const deletePracticePlaceService = async (practice_id) => {
    // Cek apakah practice place ada
    const existingPractice = await prisma.practice_place.findUnique({
        where: { practice_id },
        include: {
            _count: {
                select: {
                    health_data: true
                }
            }
        }
    });

    if (!existingPractice) {
        throw new Error('Tempat praktik tidak ditemukan');
    }

    // Validasi: Tidak bisa hapus tempat praktik yang masih punya data kesehatan
    if (existingPractice._count.health_data > 0) {
        throw new Error('Tidak bisa menghapus tempat praktik yang masih memiliki data kesehatan');
    }

    await prisma.practice_place.delete({
        where: { practice_id }
    });

    return { message: 'Tempat praktik berhasil dihapus' };
};
