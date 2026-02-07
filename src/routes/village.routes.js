import express from 'express';
import {
    createVillageController,
    getAllVillagesController,
    getVillageByIdController,
    updateVillageController,
    deleteVillageController
} from '../controllers/village.controller.js';

const router = express.Router();

// CRUD Village
router.post('/village', createVillageController);
router.get('/village', getAllVillagesController);
router.get('/village/:village_id', getVillageByIdController);
router.put('/village/:village_id', updateVillageController);
router.delete('/village/:village_id', deleteVillageController);

export default router;
