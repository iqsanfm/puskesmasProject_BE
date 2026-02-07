import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUserService = async (userData) => {
    const { full_name, password, phone_number, email, address, position_user, role, status_user } = userData

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data: {
            full_name: full_name,
            password: hashedPassword,
            phone_number: phone_number,
            email: email,
            address: address,
            position_user: position_user,
            role,
            status_user
        }
    })

    delete newUser.password

    return newUser
}

