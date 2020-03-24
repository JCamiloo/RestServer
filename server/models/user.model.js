const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: [true, 'User name mandatory'] },
  email: { type: String, required: [true, 'User email mandatory'] },
  password: { type: String, required: [true, 'User password mandatory'] },
  image: { type: String, required: false },
  role: { type: String, default: 'USER_ROLE' },
  state: { type: Boolean, default: true },
  google: { type: Boolean, default: false },  
});

module.exports = mongoose.model('User', userSchema);
