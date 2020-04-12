const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, unique: true, required: [true, 'The description is mandatory'] },
  state: { type: Boolean, default: true },
});

module.exports = mongoose.model('Category', categorySchema);