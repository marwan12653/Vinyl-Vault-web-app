const express = require('express');
const router = express.Router();
const Vault = require('../models/Vault');

// --- 1. ADD ALBUM TO VAULT (POST) ---
router.post('/add', async (req, res) => {
  try {
    const { userId, albumTitle, artistName, coverUrl } = req.body;

    // Check if user already has this specific album in their vault
    const alreadyExists = await Vault.findOne({ userId, albumTitle });
    if (alreadyExists) {
      return res.status(400).json({ message: 'Album is already inside your vault' });
    }

    const newVaultItem = new Vault({
      userId,
      albumTitle,
      artistName,
      coverUrl
    });

    const savedItem = await newVaultItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 2. GET USER'S VAULT ARCHIVE (GET) ---
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Query database for all items belonging to this specific user ID
    const userVault = await Vault.find({ userId }).sort({ addedAt: -1 });
    res.json(userVault);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 3. DYNAMICALLY UPDATE ALBUM PREFERENCES (PATCH) ---
// Handles toggling likes or changing rating stars smoothly
router.patch('/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params;
    const updates = req.body; // Can contain { isLiked } or { personalRating }

    const updatedItem = await Vault.findByIdAndUpdate(
      albumId, 
      { $set: updates }, 
      { new: true, runValidators: true } // Return the updated document version
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Album record not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 4. REMOVE ALBUM FROM VAULT (DELETE) ---
router.delete('/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params;
    const removedItem = await Vault.findByIdAndDelete(albumId);

    if (!removedItem) {
      return res.status(404).json({ message: 'Album record not found' });
    }

    res.json({ message: 'Album successfully dropped from your archive' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;