const mongoose = require('mongoose');
const ItemSchema = require('./Item');

const ChecklistSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true },
  date: { type: Date, required: true },
  filedBy: { type: String },
  filingTime: { type: String },
  departureLocation: String,
  departureTime: String,
  arrivalLocation: String,
  estArrivalTime: String,
  items: [ItemSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Checklist', ChecklistSchema);
