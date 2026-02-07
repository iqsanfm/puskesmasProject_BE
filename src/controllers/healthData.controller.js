import {
    createHealthDataService,
    getAllHealthDataService,
    getHealthDataByIdService,
    updateHealthDataService,
    reviseHealthDataService,
    deleteHealthDataService,
    approveHealthDataService,
    rejectHealthDataService,
    getPendingHealthDataService,
    getRejectedHealthDataService
} from "../services/healthData.service.js";

export const createHealthDataController = async (req, res) => {
    try {
        // Ambil user_id dari token/session (sementara dari body untuk testing)
        const user_id = (req.body && req.body.user_id) || (req.query && req.query.user_id) || req.user?.user_id;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi'
            });
        }

        const newHealthData = await createHealthDataService(req.body, user_id);
        res.status(201).json({
            success: true,
            message: 'Data kesehatan berhasil dibuat',
            data: newHealthData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllHealthDataController = async (req, res) => {
    try {
        const user_id = (req.body && req.body.user_id) || (req.query && req.query.user_id) || req.user?.user_id;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi'
            });
        }

        const filters = {
            status_verifikasi: req.query.status_verifikasi,
            jenis_data: req.query.jenis_data
        };

        const healthData = await getAllHealthDataService(user_id, filters);
        res.status(200).json({
            success: true,
            data: healthData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getHealthDataByIdController = async (req, res) => {
    try {
        const user_id = (req.body && req.body.user_id) || (req.query && req.query.user_id) || req.user?.user_id;
        const { data_id } = req.params;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi'
            });
        }

        const healthData = await getHealthDataByIdService(data_id, user_id);
        res.status(200).json({
            success: true,
            data: healthData
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const updateHealthDataController = async (req, res) => {
    try {
        const user_id = (req.body && req.body.user_id) || (req.query && req.query.user_id) || req.user?.user_id;
        const { data_id } = req.params;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi'
            });
        }

        const updatedData = await updateHealthDataService(data_id, req.body, user_id);
        res.status(200).json({
            success: true,
            message: 'Data kesehatan berhasil diupdate',
            data: updatedData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const reviseHealthDataController = async (req, res) => {
    try {
        const user_id = (req.body && req.body.user_id) || (req.query && req.query.user_id) || req.user?.user_id;
        const { data_id } = req.params;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi'
            });
        }

        const revisedData = await reviseHealthDataService(data_id, req.body, user_id);
        res.status(200).json({
            success: true,
            message: 'Data kesehatan berhasil direvisi dan kembali ke status PENDING',
            data: revisedData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteHealthDataController = async (req, res) => {
    try {
        const user_id = (req.body && req.body.user_id) || (req.query && req.query.user_id) || req.user?.user_id;
        const { data_id } = req.params;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi'
            });
        }

        const result = await deleteHealthDataService(data_id, user_id);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const approveHealthDataController = async (req, res) => {
    try {
        const user_id = (req.body && req.body.user_id) || (req.query && req.query.user_id) || req.user?.user_id;
        const { data_id } = req.params;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi'
            });
        }

        const approvedData = await approveHealthDataService(data_id, user_id);
        res.status(200).json({
            success: true,
            message: 'Data kesehatan berhasil disetujui',
            data: approvedData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const rejectHealthDataController = async (req, res) => {
    try {
        const user_id = (req.body && req.body.user_id) || (req.query && req.query.user_id) || req.user?.user_id;
        const { data_id } = req.params;
        const { alasan_penolakan } = req.body;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi'
            });
        }

        const rejectedData = await rejectHealthDataService(data_id, alasan_penolakan, user_id);
        res.status(200).json({
            success: true,
            message: 'Data kesehatan berhasil ditolak',
            data: rejectedData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getPendingHealthDataController = async (req, res) => {
    try {
        const user_id = (req.body && req.body.user_id) || (req.query && req.query.user_id) || req.user?.user_id;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi'
            });
        }

        const pendingData = await getPendingHealthDataService(user_id);
        res.status(200).json({
            success: true,
            data: pendingData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getRejectedHealthDataController = async (req, res) => {
    try {
        const user_id = (req.body && req.body.user_id) || (req.query && req.query.user_id) || req.user?.user_id;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi'
            });
        }

        const rejectedData = await getRejectedHealthDataService(user_id);
        res.status(200).json({
            success: true,
            data: rejectedData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
