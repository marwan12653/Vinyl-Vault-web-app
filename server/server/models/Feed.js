const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  albumTitle: {
    type: String,
    required: [true, 'Album title is required']
  },
  artistName: {
    type: String,
    required: [true, 'Artist name is required']
  },
  coverUrl: {
    type: String,
    required: [true, 'Album cover URL is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Review text note content is required'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feed', FeedSchema);