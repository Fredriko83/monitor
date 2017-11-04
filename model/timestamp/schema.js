const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timestampSchema = new Schema({
  date: { type: Number, required: true },
  active: { type: Boolean, required: true },
  responseTime: { type: Number, required: true },
  server: { type: Schema.Types.ObjectId, ref: 'Server' }
});

module.exports = mongoose.model('Timestamp', timestampSchema);
