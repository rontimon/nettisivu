const putEntry = async (req, res, next) => {
    const entryId = req.params.id;
    const userId = req.user.user_id;
    const entryData = {
      entry_date: req.body.entry_date,
      mood: req.body.mood,
      weight: req.body.weight,
      sleep_hours: req.body.sleep_hours,
      notes: req.body.notes,
    };
    const result = await updateEntryById(entryId, userId, entryData);
    if (result.error) {
      return next(customError(result.message, result.error));
    }
    return res.status(201).json(result);
  };