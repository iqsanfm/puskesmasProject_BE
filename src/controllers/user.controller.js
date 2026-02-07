import { createUserService, loginUserService, getUserService, updateUserStatusService, updateUserService, changePasswordService, resetPasswordByAdminService } from "../services/user.service.js";

export const createUserController = async (req, res) => {
    try {
        const user = await createUserService(req.body)
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await loginUserService(email, password)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getUserController = async (req, res) => {
    try {
        const result = await getUserService()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateUserStatusController = async (req, res) => {
    try {
        const { user_id } = req.params
        const { status_user } = req.body

        const result = await updateUserStatusService(user_id, status_user)
        res.status(200).json({
            message: 'Status user berhasil diubah',
            data: result
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateUserController = async (req, res) => {
    try {
        const { user_id } = req.params
        const result = await updateUserService(user_id, req.body)
        res.status(200).json({
            message: 'Data user berhasil diubah',
            data: result
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const changePasswordController = async (req, res) => {
    try {
        const { user_id } = req.params
        const { old_password, new_password } = req.body

        // Validasi input
        if (!old_password || !new_password) {
            return res.status(400).json({
                message: 'Password lama dan password baru harus diisi'
            })
        }

        const result = await changePasswordService(user_id, old_password, new_password)
        res.status(200).json({
            message: 'Password berhasil diubah',
            data: result
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const resetPasswordByAdminController = async (req, res) => {
    try {
        const { user_id } = req.params
        const { new_password } = req.body

        // Validasi input
        if (!new_password) {
            return res.status(400).json({
                message: 'Password baru harus diisi'
            })
        }

        const result = await resetPasswordByAdminService(user_id, new_password)
        res.status(200).json({
            message: 'Password berhasil direset oleh admin',
            data: result
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
