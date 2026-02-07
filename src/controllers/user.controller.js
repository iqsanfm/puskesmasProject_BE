import {
  createUserService,
  getUserService,
  updateUserStatusService,
  updateUserService,
  changePasswordService,
  resetPasswordByAdminService,
} from "../services/user.service.js";

export const createUserController = async (req, res) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserController = async (req, res) => {
  try {
    const result = await getUserService();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserStatusController = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { status_user } = req.body;

    const result = await updateUserStatusService(user_id, status_user);
    res.status(200).json({
      success: true,
      message: "Status user berhasil diubah",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await updateUserService(user_id, req.body);
    res.status(200).json({
      success: true,
      message: "Data user berhasil diubah",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { old_password, new_password } = req.body;

    // Validasi input
    if (!old_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: "Password lama dan password baru harus diisi",
      });
    }

    const result = await changePasswordService(
      user_id,
      old_password,
      new_password,
    );
    res.status(200).json({
      success: true,
      message: "Password berhasil diubah",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPasswordByAdminController = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { new_password } = req.body;

    // Validasi input
    if (!new_password) {
      return res.status(400).json({
        success: false,
        message: "Password baru harus diisi",
      });
    }

    const result = await resetPasswordByAdminService(user_id, new_password);
    res.status(200).json({
      success: true,
      message: "Password berhasil direset oleh admin",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
