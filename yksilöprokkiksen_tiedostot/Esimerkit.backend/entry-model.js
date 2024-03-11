// Note: db functions are async and must be
// called with await from the controller
// How to handle errors in controller?
import promisePool from '../utils/database.mjs';

const listAllEntries = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM DiaryEntries');
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};


const findEntryById = async (id) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM DiaryEntries WHERE entry_id = ?',
      [id]
    );
    console.log('rows', rows);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const addEntry = async (entry) => {
  const {user_id, entry_date, mood, weight, sleep_hours, notes} = entry;
  const sql = `INSERT INTO DiaryEntries 
  (user_id, entry_date, mood, weight, sleep_hours, notes)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, entry_date, mood, weight, sleep_hours, notes];
  try {
    const rows = await promisePool.query(sql, params);
    console.log('rows', rows);
    return {entry_id: rows[0].insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const updateEntryById = async (entry) => {
  const {entry_id, entry_date, mood, weight, sleep_hours, notes} = entry;
  try {
    const sql =
      'UPDATE DiaryEntries SET entry_date=?, mood=?, weight=?, sleep_hours=?, notes=? WHERE entry_id=?';
    const params = [entry_date, mood, weight, sleep_hours, notes, entry_id];
    const [result] = await promisePool.query(sql, params);
    // console.log(result);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'entry data updated', entry_id};
  } catch (error) {
    // fix error handling
    // now duplicate entry error is generic 500 error, should be fixed to 400 ?
    console.error('updateEntryById', error);
    return {error: 500, message: 'db error'};
  }
};

// Ei sama
const updateMedicationById = async (entry) => {
  const {medication_id, name, dosage, frequency, start_date, end_date} = entry;
  try {
    const sql =
      'UPDATE Medications SET name=?, dosage=?, frequency=?, start_date=?, end_date=? WHERE medication_id=?';
    const params = [name, dosage, frequency, start_date, end_date, medication_id];
    const [result] = await promisePool.query(sql, params);
    // console.log(result);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'Medication data updated', medication_id};
  } catch (error) {
    // fix error handling
    // now duplicate entry error is generic 500 error, should be fixed to 400 ?
    console.error('updateMedicationById', error);
    return {error: 500, message: 'db error'};
  }
};

// Ei sama
const updateNutritionById = async (entry) => {
  const {nutrition_id, entry_date, calories_consumed, protein_grams, carbohydrates_grams, fat_grams, notes} = entry;
  try {
    const sql =
      'UPDATE Nutrition SET entry_date=?, calories_consumed=?, protein_grams=?, carbohydrates_grams=?, fat_grams=?, notes=? WHERE nutrition_id=?';
    const params = [entry_date, calories_consumed, protein_grams, carbohydrates_grams, fat_grams, notes, nutrition_id];
    const [result] = await promisePool.query(sql, params);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'Nutrition data updated', nutrition_id};
  } catch (error) {
    // fix error handling
    // now duplicate entry error is generic 500 error, should be fixed to 400 ?
    console.error('updateNutritionById', error);
    return {error: 500, message: 'db error'};
  }
};

// Ei sama
const updateExerciseById = async (entry) => {
  const {exercise_id, type, duration, intensity, date} = entry;
  try {
    const sql =
      'UPDATE Exercises SET type=?, duration=?, intensity=?, date=? WHERE exercise_id=?';
    const params = [type, duration, intensity, date, exercise_id];
    const [result] = await promisePool.query(sql, params);
    // console.log(result);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'Exercise data updated', exercise_id};
  } catch (error) {
    // fix error handling
    // now duplicate entry error is generic 500 error, should be fixed to 400 ?
    console.error('updateExerciseById', error);
    return {error: 500, message: 'db error'};
  }
};

// Ei sama
const updateHrvById = async (entry) => {
  const {hrv_id, measurement_date, time_of_day, hrv_value, notes} = entry;
  try {
    const sql =
      'UPDATE HRVMeasurements SET measurement_date=?, time_of_day=?, hrv_value=?, notes=? WHERE hrv_id=?';
    const params = [measurement_date, time_of_day, hrv_value, notes, hrv_id];
    const [result] = await promisePool.query(sql, params);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'Hrv data updated', hrv_id};
  } catch (error) {
    // fix error handling
    // now duplicate entry error is generic 500 error, should be fixed to 400 ?
    console.error('updatHrvById', error);
    return {error: 500, message: 'db error'};
  }
};

const deleteEntryById = async (id) => {
  try {
    const sql = 'DELETE FROM DiaryEntries WHERE entry_id=?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'entry deleted', entry_id: id};
  } catch (error) {
    console.error('deleteEntryById', error);
    return {error: 500, message: 'db error'};
  }
};

const deleteNutritionById = async (id) => {
  try {
    const sql = 'DELETE FROM Nutrition WHERE nutrition_id=?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'entry deleted', entry_id: id};
  } catch (error) {
    console.error('deleteNutritionById', error);
    return {error: 500, message: 'db error'};
  }
};

const deleteMedicationById = async(id) => {
  try {
    const sql = 'DELETE FROM Medications WHERE medication_id=?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'medication deleted', entry_id: id};
  } catch (error) {
    console.error('deleteMedicationById', error);
    return {error: 500, message: 'db error'};
  }
};

const deleteHrvById = async(id) => {
  try {
    const sql = 'DELETE FROM HRVMeasurements WHERE hrv_id=?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'hrv deleted', hrv_id: id};
  } catch (error) {
    console.error('deleteHrvById', error);
    return {error: 500, message: 'db error'};
  }
};

const deleteExerciseById = async(id) => {
  try {
    const sql = 'DELETE FROM Exercises WHERE exercise_id=?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'exercise deleted', entry_id: id};
  } catch (error) {
    console.error('deleteExerciseById', error);
    return {error: 500, message: 'db error'};
  }
};

const addExerciseEntry = async (entry) => {
  const { user_id, date, type, duration, intensity } = entry;
  try {
    const sql = `INSERT INTO Exercises (user_id, date, type, duration, intensity) 
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [user_id, date, type, duration, intensity];
    const [result] = await promisePool.query(sql, params);
    if (result && result.insertId) {
      return { message: 'Exercise entry added', exercise_id: result.insertId };
    } else {
      throw new Error('Failed to add exercise entry');
    }
  } catch (e) {
    console.error('addExerciseEntry error:', e.message);
    return { error: e.message };
  }
};

const addHrvmeasurement = async (entry) => {
  const { user_id, measurement_date, time_of_day, hrv_value, notes } = entry;
  try {
    const sql = `INSERT INTO HRVMeasurements (user_id, measurement_date, time_of_day, hrv_value, notes ) 
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [user_id, measurement_date, time_of_day, hrv_value, notes ];
    const [result] = await promisePool.query(sql, params);
    if (result && result.insertId) {
      return { message: 'HRV measurement added'};
    } else {
      throw new Error('Failed to add HRV measurement');
    }
  } catch (e) {
    console.error(e.message);
    return { error: e.message };
  }
};

const postMedication = async (entry) => {
  const { user_id, name, dosage, frequency, start_date, end_date } = entry;
  try {
    const sql = `INSERT INTO Medications (user_id, name, dosage, frequency, start_date, end_date ) 
    VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [user_id, name, dosage, frequency, start_date, end_date ];
    const [result] = await promisePool.query(sql, params);
    if (result && result.insertId) {
      return { message: 'Medications added'};
    } else {
      throw new Error('Failed to add Medications');
    }
  } catch (e) {
    console.error(e.message);
    return { error: e.message };
  }
};

const postNutrition = async (entry) => {
  const { user_id, entry_date, calories_consumed, protein_grams, carbohydrates_grams, fat_grams, notes } = entry;
  try {
    const sql = `INSERT INTO Nutrition (user_id, entry_date, calories_consumed, protein_grams, carbohydrates_grams, fat_grams, notes ) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [user_id, entry_date, calories_consumed, protein_grams, carbohydrates_grams, fat_grams, notes ];
    const [result] = await promisePool.query(sql, params);
    if (result && result.insertId) {
      return { message: 'Nutrition entry added'};
    } else {
      throw new Error('Failed to add Nutrition entry');
    }
  } catch (e) {
    console.error(e.message);
    return { error: e.message };
  }
};

const listMedicationsByUser = async (id) => {
  try {
    const sql = 'SELECT * FROM Medications WHERE user_id = ?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const listAllEntriesByUserId = async (id) => {
  try {
    const sql = 'SELECT * FROM DiaryEntries WHERE user_id = ?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const listAllExerciseEntriesByUserId = async (id) => {
  try {
    const sql = 'SELECT * FROM Exercises WHERE user_id = ?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const listNutritionByUserId = async (id) => {
  try {
    const sql = 'SELECT * FROM Nutrition WHERE user_id = ?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const listHrvMeasurementsByUserId = async (id) => {
  try {
    const sql = 'SELECT * FROM HRVMeasurements WHERE user_id = ?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

export {
  listAllEntries,
  listAllEntriesByUserId,
  findEntryById,
  addEntry,
  updateEntryById,
  deleteEntryById,
  addExerciseEntry,
  listAllExerciseEntriesByUserId,
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

};
