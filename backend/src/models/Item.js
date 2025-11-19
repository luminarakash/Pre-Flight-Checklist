const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  status: { type: String, enum: ['Pending','Completed'], default: 'Pending' },
  comments: { type: String, default: '' },
  order: { type: Number, default: 0 }
});

module.exports = ItemSchema; // schema export (embedded)
