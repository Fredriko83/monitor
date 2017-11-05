const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timestampSchema = new Schema({
  date: { type: Date, required: true },
  active: { type: Boolean, required: true },
  responseTime: { type: Number, required: true }
});

const serverSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  timestamps: [timestampSchema]
});

module.exports = mongoose.model('Server', serverSchema);
