import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma.js";

// Login User
export const loginService = async (email, password) => {
  // Cari user berdasarkan email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Email atau password salah.");
  }

  // Cek status user
  if (user.status_user === "INACTIVE") {
    throw new Error("Akun Anda tidak aktif. Hubungi administrator.");
  }

  // Verifikasi password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Email atau password salah.");
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }, // Token berlaku 7 hari
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      position_user: user.position_user,
      status_user: user.status_user,
    },
  };
};

// Get Profile (User yang sedang login)
export const getProfileService = async (user_id) => {
  const user = await prisma.user.findUnique({
    where: { user_id },
    select: {
      user_id: true,
      full_name: true,
      email: true,
      phone_number: true,
      address: true,
      position_user: true,
      village_id: true,
      role: true,
      status_user: true,
      created_at: true,
      updated_at: true,
      village: {
        select: {
          village_id: true,
          nama_desa: true,
        },
      },
      practice_place: {
        select: {
          practice_id: true,
          nama_praktik: true,
          alamat: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan.");
  }

  return user;
};

// Update Profile
export const updateProfileService = async (user_id, updateData) => {
  const { full_name, phone_number, address, password } = updateData;

  const dataToUpdate = {
    full_name,
    phone_number,
    address,
  };

  // Jika ada password baru, hash dulu
  if (password) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { user_id },
    data: dataToUpdate,
    select: {
      user_id: true,
      full_name: true,
      email: true,
      phone_number: true,
      address: true,
      position_user: true,
      role: true,
      status_user: true,
      updated_at: true,
    },
  });

  return updatedUser;
};
