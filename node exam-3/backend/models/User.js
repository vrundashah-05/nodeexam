const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  articles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
