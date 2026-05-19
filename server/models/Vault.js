const mongoose = require('mongoose');

const VaultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  albumTitle: {
    type: String,
    required: [true, 'Album title is required'],
    trim: true
  },
  artistName: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true
  },
  coverUrl: {
    type: String,
    required: [true, 'Cover image URL is required']
  },
  isLiked: {
    type: Boolean,
    default: false
  },
  personalRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vault', VaultSchema);