const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const roles = { 
  values: ['ADMIN_ROLE', 'USER_ROLE'], 
  message: '{VALUE} is not a valid role' 
};

const userSchema = new Schema({
  name: { type: String, required: [true, 'User name mandatory'] },
  email: { type: String, unique: true, required: [true, 'User email mandatory'] },
  password: { type: String, required: [true, 'User password mandatory'] },
  image: { type: String, required: false },
  role: { type: String, default: 'USER_ROLE', enum: roles },
  state: { type: Boolean, default: true },
  google: { type: Boolean, default: false },  
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });
module.exports = mongoose.model('User', userSchema);
