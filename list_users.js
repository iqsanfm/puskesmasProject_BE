
import prisma from "./lib/prisma.js";

async function listUsers() {
    const users = await prisma.user.findMany();
    console.log("Daftar User:");
    users.forEach(u => {
        console.log(`ID: ${u.user_id} - Nama: ${u.full_name} - Role: ${u.role}`);
    });
}

listUsers()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
