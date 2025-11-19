const Checklist = require('../models/Checklist');
const { validationResult } = require('express-validator');

exports.createChecklist = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const data = req.body;
    const checklist = await Checklist.create(data);
    res.status(201).json(checklist);
  } catch (err) { next(err); }
};

exports.getAllChecklists = async (req, res, next) => {
  try {
    const lists = await Checklist.find().sort({ createdAt: -1 });
    res.json(lists);
  } catch (err) { next(err); }
};

exports.getChecklistById = async (req, res, next) => {
  try {
    const cl = await Checklist.findById(req.params.id);
    if(!cl) return res.status(404).json({ message: 'Not found' });
    res.json(cl);
  } catch (err){ next(err); }
};

exports.updateChecklist = async (req,res,next) => {
  try {
    const updated = await Checklist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err){ next(err); }
};

exports.deleteChecklist = async (req,res,next) => {
  try {
    const del = await Checklist.findByIdAndDelete(req.params.id);
    if(!del) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err){ next(err); }
};
