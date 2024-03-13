.put(
    authenticateToken,
    param('id', 'must be integer').isInt(),
    // user_id is not allowed to be changed
    body('user_id', 'not allowed').not().exists(),
    body('entry_date').optional().isDate(),
    body('mood').optional().trim().isLength({min: 3, max: 20}).isString(),
    body('weight').optional().isFloat({min: 30, max: 200}),
    body('sleep_hours').optional().isInt({min: 0, max: 24}),
    body('notes').optional().isString().isLength({min: 3, max: 300}),
    validationErrorHandler,
    putEntry,
  )