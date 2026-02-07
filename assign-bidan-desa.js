// Script untuk assign bidan desa ke village
// Jalankan dengan: node assign-bidan-desa.js <email> <village_id>
// Contoh: node assign-bidan-desa.js bidan@example.com fdbc66ee-b684-4cb2-966a-e614fb1957d6

import prisma from "./lib/prisma.js";

const assignBidanDesa = async (email, villageId) => {
  try {
    console.log(
      `🏥 Assigning bidan desa ${email} ke village ${villageId}...\n`,
    );

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("❌ User tidak ditemukan!");
      await prisma.$disconnect();
      return;
    }

    // Cek apakah village ada
    const village = await prisma.village.findUnique({
      where: { village_id: villageId },
    });

    if (!village) {
      console.log("❌ Village tidak ditemukan!");
      await prisma.$disconnect();
      return;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        village_id: villageId,
        position_user: "bidan_desa", // Auto set position jika belum
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
        position_user: true,
        village_id: true,
        village: {
          select: {
            village_id: true,
            nama_desa: true,
          },
        },
      },
    });

    console.log("✅ Bidan desa berhasil di-assign!");
    console.log("\n📋 Detail User:");
    console.log(JSON.stringify(updatedUser, null, 2));

    // Hitung jumlah practice place di desa tersebut
    const practicePlaceCount = await prisma.practice_place.count({
      where: { village_id: villageId },
    });

    console.log(
      `\n🏥 Desa ${village.nama_desa} memiliki ${practicePlaceCount} practice place`,
    );
    console.log(
      `   Bidan desa ini bisa melihat semua health data dari ${practicePlaceCount} practice place tersebut.`,
    );

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Get arguments
const email = process.argv[2];
const villageId = process.argv[3];

if (!email || !villageId) {
  console.log("❌ Usage: node assign-bidan-desa.js <email> <village_id>");
  console.log("\nContoh:");
  console.log(
    "  node assign-bidan-desa.js bidan@example.com fdbc66ee-b684-4cb2-966a-e614fb1957d6",
  );
  process.exit(1);
}

assignBidanDesa(email, villageId);
