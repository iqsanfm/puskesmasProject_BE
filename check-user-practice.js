// Script untuk cek user dan practice place
// Jalankan dengan: node check-user-practice.js

import prisma from "./lib/prisma.js";

const checkUser = async (email) => {
  try {
    console.log(`🔍 Checking user: ${email}\n`);

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        practice_place: true,
        village: true,
      },
    });

    if (!user) {
      console.log("❌ User tidak ditemukan!");
      return;
    }

    console.log("✅ User ditemukan:");
    console.log(JSON.stringify(user, null, 2));

    console.log("\n📋 Summary:");
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- Position: ${user.position_user || "NULL"}`);
    console.log(`- Status: ${user.status_user}`);
    console.log(`- Village ID: ${user.village_id || "NULL"}`);
    console.log(`- Has Practice Place: ${user.practice_place ? "YES" : "NO"}`);

    if (user.practice_place) {
      console.log(`\n🏥 Practice Place:`);
      console.log(`- ID: ${user.practice_place.practice_id}`);
      console.log(`- Name: ${user.practice_place.nama_praktik}`);
      console.log(`- Address: ${user.practice_place.alamat}`);
    } else {
      console.log("\n⚠️  User belum punya practice place!");
      console.log(
        "   Bidan praktik harus punya practice place untuk akses health data.",
      );
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Ganti email sesuai user yang mau dicek
const emailToCheck = process.argv[2] || "iqsanfm@gmail.com";
checkUser(emailToCheck);
