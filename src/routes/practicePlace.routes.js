import express from 'express';
import {
    createPracticePlaceController,
    getAllPracticePlacesController,
    getPracticePlacesByVillageController,
    getPracticePlaceByIdController,
    updatePracticePlaceController,
    deletePracticePlaceController
} from '../controllers/practicePlace.controller.js';

const router = express.Router();

// CRUD Practice Place
router.post('/practice-place', createPracticePlaceController);
router.get('/practice-place', getAllPracticePlacesController);
router.get('/practice-place/village/:village_id', getPracticePlacesByVillageController);
router.get('/practice-place/:practice_id', getPracticePlaceByIdController);
router.put('/practice-place/:practice_id', updatePracticePlaceController);
router.delete('/practice-place/:practice_id', deletePracticePlaceController);

export default router;
