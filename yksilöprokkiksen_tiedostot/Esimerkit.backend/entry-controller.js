import {customError} from '../middlewares/error-handler.mjs';
import {
  listAllEntries,
  findEntryById,
  addEntry,
  deleteEntryById,
  updateEntryById,
  listAllEntriesByUserId,
  listAllExerciseEntriesByUserId,
  addExerciseEntry,
  listHrvMeasurementsByUserId,
  addHrvmeasurement,
  listMedicationsByUser,
  postMedication,
  deleteExerciseById,
  deleteMedicationById,
  deleteHrvById,
  updateMedicationById,
  updateExerciseById,
  listNutritionByUserId,
  postNutrition,
  updateNutritionById,
  deleteNutritionById,
  updateHrvById
} from '../models/entry-model.mjs';

const getEntries = async (req, res) => {
  const result = await listAllEntriesByUserId(req.user.user_id);
  if (!result.error) {
    res.json(result);
  } else {
    next(new Error(result.error));
  }
};

const getEntryById = async (req, res) => {
  const entry = await findEntryById(req.params.id);
  if (entry) {
    res.json(entry);
  } else {
    next(customError('Entry not found', 404));
  }
};

const postEntry = async (req, res) => {
  const {user_id, entry_date, mood, weight, sleep_hours, notes} = req.body;
  if (entry_date && (weight || mood || sleep_hours || notes) && user_id) {
    const result = await addEntry(req.body);
    if (result.entry_id) {
      res.status(201);
      res.json({message: 'New entry added.', ...result});
    } else {
      res.status(500);
      res.json(result);
    }
  } else {
    res.sendStatus(400);
  }
};

const putEntry = async (req, res) => {
  const entry_id = req.params.id;
  const {entry_date, mood, weight, sleep_hours, notes} = req.body;
  // check that all needed fields are included in request
  if ((entry_date || weight || mood || sleep_hours || notes) && entry_id) {
    const result = await updateEntryById({entry_id, ...req.body});
    if (result.error) {
      return res.status(result.error).json(result);
    }
    return res.status(201).json(result);
  } else {
    return res.status(400).json({error: 400, message: 'bad request'});
  }
};

const deleteEntry = async (req, res) => {
  const result = await deleteEntryById(req.params.id);
  if (result.error) {
    return res.status(result.error).json(result);
  }
  return res.json(result);
};

const deleteNutrition = async (req, res) => {
  const result = await deleteNutritionById(req.params.id);
  if (result.error) {
    return res.status(result.error).json(result);
  }
  return res.json(result);
};

const deleteExercise = async (req, res) => {
  const result = await deleteExerciseById(req.params.id);
  if (result.error) {
    return res.status(result.error).json(result);
  }
  return res.json(result);
};

const deleteMedication = async (req, res) => {
  const result = await deleteMedicationById(req.params.id);
  if (result.error) {
    return res.status(result.error).json(result);
  }
  return res.json(result);
};

const deleteHrv = async (req, res) => {
  const result = await deleteHrvById(req.params.id);
  if (result.error) {
    return res.status(result.error).json(result);
  }
  return res.json(result);
};

const getMedicationsByUser = async (req, res) => {
  const userId = req.user.user_id;
  const result = await listMedicationsByUser(userId);
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500);
    res.json(result);
  }
};



const postMedicationByUser = async (req, res) => {
  const {user_id, name, dosage, frequency, start_date, end_date} = req.body;
  try {
    const result = await postMedication({
      user_id,
      name,
      dosage,
      frequency,
      start_date,
      end_date
    });
    return res.status(201).json(result);
  } catch (error) {
    console.error('error:', error);
    return res.status(500).json({error: 'Database error'});
  }
};

const postNutritionByUser = async (req, res) => {
  const {user_id, entry_date, calories_consumed, protein_grams, carbohydrates_grams, fat_grams, notes} = req.body;
  try {
    const result = await postNutrition({
      user_id,
      entry_date,
      calories_consumed,
      protein_grams,
      carbohydrates_grams,
      fat_grams,
      notes
    });
    return res.status(201).json(result);
  } catch (error) {
    console.error('error:', error);
    return res.status(500).json({error: 'Database error'});
  }
};

const putMedication = async (req, res) => {
  const medication_id = req.params.id;
  const {name, dosage, frequency, start_date, end_date} = req.body;
  // check that all needed fields are included in request
  if ((name || dosage || frequency || start_date || end_date) && medication_id) {
    const result = await updateMedicationById({medication_id, ...req.body});
    if (result.error) {
      return res.status(result.error).json(result);
    }
    return res.status(201).json(result);
  } else {
    return res.status(400).json({error: 400, message: 'bad request'});
  }
};

const putNutrition = async (req, res) => {
  const nutrition_id = req.params.id;
  const {entry_date, calories_consumed, protein_grams, carbohydrates_grams, fat_grams, notes} = req.body;
  if ((entry_date || calories_consumed || protein_grams || carbohydrates_grams || fat_grams || notes) && nutrition_id) {
    const result = await updateNutritionById({nutrition_id, ...req.body});
    if (result.error) {
      return res.status(result.error).json(result);
    }
    return res.status(201).json(result);
  } else {
    return res.status(400).json({error: 400, message: 'bad request'});
  }
};

const getNutritionByUser = async (req, res) => {
  const userId = req.user.user_id;

  try {

    const entries = await listNutritionByUserId(userId);
    return res.json(entries);
  } catch (error) {
    console.error('getNutritionByUser error:', error);
    return res.status(500).json({error: 'Database error'});
  }
};

const getExerciseEntriesByUser = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const entries = await listAllExerciseEntriesByUserId(userId);
    return res.json(entries);
  } catch (error) {
    console.error('getExerciseEntriesByUser error:', error);
    return res.status(500).json({error: 'Database error'});
  }
};

const getHrvMeasurementsByUser = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const entries = await listHrvMeasurementsByUserId(userId);
    return res.json(entries);
  } catch (error) {
    console.error('error:', error);
    return res.status(500).json({error: 'Database error'});
  }
};

const putExercise = async (req, res) => {
  const exercise_id = req.params.id;
  const {type, duration, intensity, date} = req.body;
  // check that all needed fields are included in request
  if ((type || duration || intensity || date ) && exercise_id) {
    const result = await updateExerciseById({exercise_id, ...req.body});
    if (result.error) {
      return res.status(result.error).json(result);
    }
    return res.status(201).json(result);
  } else {
    return res.status(400).json({error: 400, message: 'bad request'});
  }
};

const postExerciseEntry = async (req, res) => {
  const {user_id, date, type, duration, intensity} = req.body;

  try {
    const result = await addExerciseEntry({
      user_id,
      date,
      type,
      duration,
      intensity,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('postExerciseEntry error:', error);
    return res.status(500).json({error: 'Database error'});
  }
};

const postHrvDataByUser = async (req, res) => {
  const {user_id, measurement_date, time_of_day, hrv_value, notes} = req.body;

  try {
    const result = await addHrvmeasurement({
      user_id,
      measurement_date,
      time_of_day,
      hrv_value,
      notes,
    });
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Database error'});
  }
};

const putHrv = async (req, res) => {
  const hrv_id = req.params.id;
  const {measurement_date, time_of_day, hrv_value, notes} = req.body;
  if ((measurement_date || time_of_day || hrv_value || notes ) && hrv_id) {
    const result = await updateHrvById({hrv_id, ...req.body});
    if (result.error) {
      return res.status(result.error).json(result);
    }
    return res.status(201).json(result);
  } else {
    return res.status(400).json({error: 400, message: 'bad request'});
  }
};

export {
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
  putHrv
};
