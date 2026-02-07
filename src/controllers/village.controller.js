import {
    createVillageService,
    getAllVillagesService,
    getVillageByIdService,
    updateVillageService,
    deleteVillageService
} from "../services/village.service.js";

export const createVillageController = async (req, res) => {
    try {
        const newVillage = await createVillageService(req.body);
        res.status(201).json({
            success: true,
            message: 'Desa berhasil dibuat',
            data: newVillage
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllVillagesController = async (req, res) => {
    try {
        const villages = await getAllVillagesService();
        res.status(200).json({
            success: true,
            data: villages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getVillageByIdController = async (req, res) => {
    try {
        const { village_id } = req.params;
        const village = await getVillageByIdService(village_id);
        res.status(200).json({
            success: true,
            data: village
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const updateVillageController = async (req, res) => {
    try {
        const { village_id } = req.params;
        const updatedVillage = await updateVillageService(village_id, req.body);
        res.status(200).json({
            success: true,
            message: 'Desa berhasil diupdate',
            data: updatedVillage
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteVillageController = async (req, res) => {
    try {
        const { village_id } = req.params;
        const result = await deleteVillageService(village_id);
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
