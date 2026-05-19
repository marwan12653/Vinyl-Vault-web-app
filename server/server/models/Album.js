const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  audio: { type: String, required: true }
});

const AlbumSchema = new mongoose.Schema({
  genreName: { type: String, required: true },
  artistName: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String, required: true },
  tracks: [TrackSchema] // This embeds your track array straight into the album document
});

module.exports = mongoose.model('Album', AlbumSchema);