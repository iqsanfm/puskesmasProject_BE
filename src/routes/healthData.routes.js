import express from 'express';
import {
    createHealthDataController,
    getAllHealthDataController,
    getHealthDataByIdController,
    updateHealthDataController,
    reviseHealthDataController,
    deleteHealthDataController,
    approveHealthDataController,
    rejectHealthDataController,
    getPendingHealthDataController,
    getRejectedHealthDataController
} from '../controllers/healthData.controller.js';

const router = express.Router();

// CRUD Health Data
router.post('/health-data', createHealthDataController);
router.get('/health-data', getAllHealthDataController);
router.get('/health-data/:data_id', getHealthDataByIdController);
router.put('/health-data/:data_id', updateHealthDataController);
router.delete('/health-data/:data_id', deleteHealthDataController);

// Revision
router.put('/health-data/:data_id/revise', reviseHealthDataController);

// Verification
router.patch('/health-data/:data_id/approve', approveHealthDataController);
router.patch('/health-data/:data_id/reject', rejectHealthDataController);

// Special Endpoints
router.get('/health-data-pending', getPendingHealthDataController);
router.get('/health-data-rejected', getRejectedHealthDataController);

export default router;
