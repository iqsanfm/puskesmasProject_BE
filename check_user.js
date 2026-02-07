
import prisma from "./lib/prisma.js";

async function checkUser(userId) {
    const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: {
            practice_place: true,
            village: true
        }
    });
    console.log("Detail User:");
    console.dir(user, { depth: null });
}

checkUser("6258b130-606f-4394-a667-869b5d05bde0")
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
