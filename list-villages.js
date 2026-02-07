// Script untuk list semua village
// Jalankan dengan: node list-villages.js

import prisma from "./lib/prisma.js";

const listVillages = async () => {
  try {
    console.log("🏘️  Daftar Semua Village:\n");

    const villages = await prisma.village.findMany({
      include: {
        _count: {
          select: {
            users: true,
            practice_places: true,
          },
        },
      },
      orderBy: {
        nama_desa: "asc",
      },
    });

    if (villages.length === 0) {
      console.log("❌ Belum ada village di database!");
      await prisma.$disconnect();
      return;
    }

    console.log(`Total: ${villages.length} village\n`);
    console.log("─".repeat(80));

    villages.forEach((village, index) => {
      console.log(`\n${index + 1}. ${village.nama_desa}`);
      console.log(`   ID: ${village.village_id}`);
      console.log(`   👥 Users: ${village._count.users}`);
      console.log(`   🏥 Practice Places: ${village._count.practice_places}`);
      console.log(`   📅 Created: ${village.created_at.toLocaleString()}`);
    });

    console.log("\n" + "─".repeat(80));
    console.log("\n💡 Untuk assign bidan desa ke village, gunakan:");
    console.log("   node assign-bidan-desa.js <email> <village_id>");

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

listVillages();
