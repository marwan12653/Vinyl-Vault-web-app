const mongoose = require('mongoose');
const Album = require('./models/Album');
require('dotenv').config();

const catalogPayload = [
  {
    genreName: "Indie Rock",
    artistName: "The Strokes",
    title: "Is This It",
    cover: "/is_this_it.png", // Kept exactly as it was on your PC!
    tracks: [
      { name: "Is This It", audio: "/is_this_it_TheStrokes.wav" },
      { name: "The Modern Age", audio: "/modern_age.wav" },
      { name: "Soma", audio: "/soma.wav" },
      { name: "Barely Legal", audio: "/barely_legal.wav" }
    ]
  },
  {
    genreName: "Indie Rock",
    artistName: "The Symposium",
    title: "The Symposium",
    cover: "/the_symposium.png", // Kept exactly as it was on your PC!
    tracks: [
      { name: "The Physical Attractions", audio: "/the_symposium_the_physical_attraction.wav" }
    ]
  },
  {
    genreName: "Indie Rock",
    artistName: "Arctic Monkeys",
    title: "AM",
    cover: "https://upload.wikimedia.org/wikipedia/en/0/04/Arctic_Monkeys_-_AM.png",
    tracks: [
      { name: "Do I Wanna Know?", audio: "https://vinyldiscos.b-cdn.net/previews/do_i_wanna_know.mp3" },
      { name: "Knee Socks", audio: "https://vinyldiscos.b-cdn.net/previews/knee_socks.mp3" }
    ]
  },
  {
    genreName: "Indie Rock",
    artistName: "Tame Impala",
    title: "Currents",
    cover: "https://upload.wikimedia.org/wikipedia/en/9/9b/Tame_Impala_-_Currents.png",
    tracks: [
      { name: "The Less I Know The Better", audio: "https://vinyldiscos.b-cdn.net/previews/the_less_i_know.mp3" }
    ]
  },
  {
    genreName: "Classic Rock",
    artistName: "The Beatles",
    title: "Abbey Road",
    cover: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
    tracks: [
      { name: "Come Together", audio: "https://vinyldiscos.b-cdn.net/previews/come_together.mp3" },
      { name: "Something", audio: "https://vinyldiscos.b-cdn.net/previews/something.mp3" }
    ]
  },
  {
    genreName: "Indie / Alt",
    artistName: "Peach Pit",
    title: "Being So Normal",
    cover: "https://upload.wikimedia.org/wikipedia/en/d/df/Being_So_Normal_Peach_Pit.jpg",
    tracks: [
      { name: "Peach Pit", audio: "https://vinyldiscos.b-cdn.net/previews/peach_pit.mp3" },
      { name: "Tommy's Party", audio: "https://vinyldiscos.b-cdn.net/previews/tommys_party.mp3" }
    ]
  },
  {
    genreName: "Classic Rock",
    artistName: "Pink Floyd",
    title: "The Dark Side of the Moon",
    cover: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
    tracks: [
      { name: "Breathe (In the Air)", audio: "https://vinyldiscos.b-cdn.net/previews/breathe.mp3" },
      { name: "Money", audio: "https://vinyldiscos.b-cdn.net/previews/money.mp3" }
    ]
  },
  {
    genreName: "Indie Rock",
    artistName: "Mac DeMarco",
    title: "Salad Days",
    cover: "https://upload.wikimedia.org/wikipedia/en/8/81/Mac_DeMarco_-_Salad_Days.png",
    tracks: [
      { name: "Salad Days", audio: "https://vinyldiscos.b-cdn.net/previews/salad_days.mp3" },
      { name: "Chamber of Reflection", audio: "https://vinyldiscos.b-cdn.net/previews/chamber_of_reflection.mp3" }
    ]
  },
  {
    genreName: "Indie / Alt",
    artistName: "Steve Lacy",
    title: "Gemini Rights",
    cover: "https://upload.wikimedia.org/wikipedia/en/1/1b/Steve_Lacy_-_Gemini_Rights.png",
    tracks: [
      { name: "Bad Habit", audio: "https://vinyldiscos.b-cdn.net/previews/bad_habit.mp3" },
      { name: "Static", audio: "https://vinyldiscos.b-cdn.net/previews/static.mp3" }
    ]
  },
  {
    genreName: "Indie Rock",
    artistName: "Cage the Elephant",
    title: "Melophobia",
    cover: "https://upload.wikimedia.org/wikipedia/en/f/f1/Melophobia_cover.jpg",
    tracks: [
      { name: "Cigarette Daydreams", audio: "https://vinyldiscos.b-cdn.net/previews/cigarette_daydreams.mp3" },
      { name: "Come a Little Closer", audio: "https://vinyldiscos.b-cdn.net/previews/come_a_little_closer.mp3" }
    ]
  },
  {
    genreName: "Indie / Alt",
    artistName: "Mild High Club",
    title: "Skiptracing",
    cover: "https://upload.wikimedia.org/wikipedia/en/e/ee/Mild_High_Club_Skiptracing.jpg",
    tracks: [
      { name: "Homage", audio: "https://vinyldiscos.b-cdn.net/previews/homage.mp3" },
      { name: "Skiptracing", audio: "https://vinyldiscos.b-cdn.net/previews/skiptracing_track.mp3" }
    ]
  }
];

const seedMusicDatabase = async () => {
  try {
    console.log("⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🧹 Clearing old placeholder logs...");
    await Album.deleteMany({});
    console.log("🚀 Seeding authentic record covers and streaming audio previews...");
    await Album.insertMany(catalogPayload);
    console.log("✅ SUCCESS! Authentic music catalog synced with cloud database cluster!");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

seedMusicDatabase();