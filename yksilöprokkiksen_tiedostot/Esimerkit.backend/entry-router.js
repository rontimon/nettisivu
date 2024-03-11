import express from 'express';
import {
  getEntries,
  getEntryById,
  postEntry,
  putEntry,
  deleteEntry,
  getExerciseEntriesByUser,
  postExerciseEntry,
  getHrvMeasurementsByUser,
  postHrvDataByUser,
  getMedicationsByUser,
  postMedicationByUser,
  deleteExercise,
  deleteMedication,
  deleteHrv,
  putMedication,
  putExercise,
  getNutritionByUser,
  postNutritionByUser,
  putNutrition,
  deleteNutrition,
  putHrv,
} from '../controllers/entry-controller.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';

const entryRouter = express.Router();

entryRouter.route('/diaries/:id')
.get(authenticateToken, getEntries)

entryRouter.route('/medications/:id')
.get(authenticateToken, getMedicationsByUser)
.post(authenticateToken, postMedicationByUser)
.put(authenticateToken, putMedication)
.delete(authenticateToken, deleteMedication);

entryRouter.route('/:id')
.post(authenticateToken, postEntry)
.get(getEntryById)
.put(authenticateToken, putEntry)
.delete(authenticateToken, deleteEntry);

entryRouter.route('/exercise/:id')
.get(authenticateToken, getExerciseEntriesByUser)
.put(authenticateToken, putExercise)
.post(authenticateToken, postExerciseEntry)
.delete(authenticateToken, deleteExercise);

entryRouter.route('/hrv/:id')
.get(authenticateToken, getHrvMeasurementsByUser)
.put(authenticateToken, putHrv)
.post(authenticateToken, postHrvDataByUser)
.delete(authenticateToken, deleteHrv);

entryRouter.route('/nutrition/:id')
.get(authenticateToken, getNutritionByUser)
.post(authenticateToken, postNutritionByUser)
.put(authenticateToken, putNutrition)
.delete(authenticateToken, deleteNutrition);


export default entryRouter;