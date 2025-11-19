const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/checklistController');
const { body, param } = require('express-validator');

router.post('/',
  body('flightNumber').notEmpty().withMessage('FlightNumber required'),
  body('date').notEmpty().withMessage('Date required'),
  ctrl.createChecklist
);

router.get('/', ctrl.getAllChecklists);
router.get('/:id', ctrl.getChecklistById);

router.put('/:id',
  param('id').isMongoId(),
  ctrl.updateChecklist
);

router.delete('/:id', ctrl.deleteChecklist);

module.exports = router;
