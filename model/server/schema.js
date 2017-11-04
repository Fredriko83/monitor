const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Timestamp = require('../times')

const serverSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  timestamps: [{ type: Schema.Types.ObjectId, ref: 'Timestamp' }]
  //timestamps: [Timestamp]
});

module.exports = mongoose.model('Server', serverSchema);
