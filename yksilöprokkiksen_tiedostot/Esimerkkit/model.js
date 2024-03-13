// Oletetaan, että updateEntryById toimii jotakuinkin näin
const updateEntryById = async (entryId, userId, entryData) => {
    console.log(entryData);
    const fieldsToUpdate = Object.keys(entryData).map(key => ${key}=?).join(', ');
    const values = [...Object.values(entryData), entryId, userId];
    const sql = UPDATE DiaryEntries SET ${fieldsToUpdate} WHERE entry_id = ? AND user_id = ?;
  
    try {
      const [result] = await promisePool.query(sql, values);
      if (result.affectedRows === 0) {
        return {error: 404, message: 'Entry not found or no permission to edit'};
      }
      return {message: 'Entry updated successfully', entry_id: entryId};
    } catch (error) {
      console.error('Error updating entry:', error);
      return {error: 500, message: 'Database error during entry update'};
    }
  };