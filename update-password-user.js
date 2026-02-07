// Script untuk update password user
// Jalankan dengan: node update-password-user.js <email> <new_password>
// Contoh: node update-password-user.js faisal@gmail.com admin123

import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.js";

const updatePassword = async (email, newPassword) => {
  try {
    console.log(`🔐 Updating password untuk ${email}...\n`);

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update di database
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
        position_user: true,
      },
    });

    console.log("✅ Password berhasil diupdate!");
    console.log("\n📋 Detail User:");
    console.log(JSON.stringify(updatedUser, null, 2));
    console.log("\n🔑 Password baru:", newPassword);
    console.log("\n📝 Sekarang Anda bisa login dengan:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

const email = process.argv[2] || "faisal@gmail.com";
const password = process.argv[3] || "admin123";

updatePassword(email, password);
