const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Provide a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Provide a password confirmation'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
