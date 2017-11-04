const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const timestampSchema = new Schema({
  date: { type: Date, required: true },
  active: { type: Boolean, required: true },
  responseTime: { type: Number, required: true }
});


module.exports = mongoose.model('Timestamp', timestampSchema);
