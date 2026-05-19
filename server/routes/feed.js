const express = require('express');
const router = express.Router();
const Feed = require('../models/Feed');

// --- 1. POST A NEW REVIEW TO THE GLOBAL FEED (POST) ---
router.post('/post', async (req, res) => {
  try {
    const { authorId, username, albumTitle, artistName, coverUrl, rating, comment } = req.body;

    const newFeedPost = new Feed({
      authorId,
      username,
      albumTitle,
      artistName,
      coverUrl,
      rating,
      comment
    });

    const savedPost = await newFeedPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 2. GET ALL RECENT REVIEWS (GET) ---
router.get('/', async (req, res) => {
  try {
    // Fetch all timeline posts and sort them reverse-chronologically (newest first)
    const socialTimeline = await Feed.find().sort({ timestamp: -1 });
    res.json(socialTimeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;