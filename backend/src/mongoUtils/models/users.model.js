const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  mobile: { type: String, unique: true },
  password: { type: String },
  isDeleted: { type: Boolean, default: false },
});

userSchema.index({ mobile: 1 });

module.exports = mongoose.model('users', userSchema, 'users');