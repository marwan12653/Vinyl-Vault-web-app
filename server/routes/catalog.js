const express = require('express');
const router = express.Router();
const Album = require('../models/Album');

// Fetch catalog grouped by genres straight from your MongoDB cluster
router.get('/', async (req, res) => {
  try {
    const rawAlbums = await Album.find({});
    const genresMap = {};

    rawAlbums.forEach(album => {
      const gName = album.genreName;
      const aName = album.artistName;

      if (!genresMap[gName]) {
        genresMap[gName] = { name: gName, artists: {} };
      }

      if (!genresMap[gName].artists[aName]) {
        genresMap[gName].artists[aName] = { name: aName, albums: [] };
      }

      genresMap[gName].artists[aName].albums.push({
        title: album.title,
        cover: album.cover,
        tracks: album.tracks.map(t => ({ name: t.name, audio: t.audio }))
      });
    });

    const formattedCatalog = Object.values(genresMap).map(genre => ({
      name: genre.name,
      artists: Object.values(genre.artists)
    }));

    res.json(formattedCatalog);
  } catch (err) {
    console.error("❌ Catalog database pull failed:", err);
    res.status(500).json({ message: "Failed to read database catalog tree." });
  }
});

module.exports = router;