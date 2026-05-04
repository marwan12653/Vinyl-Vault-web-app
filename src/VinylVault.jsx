import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, SkipBack, SkipForward, Search, Compass, ListMusic, Plus, Check, Info, X } from 'lucide-react';

// 1. NESTED DATA STRUCTURE (Discovery Archive)
const GENRE_DATA = [
  {
    name: "Indie Rock",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=60&w=500",
    artists: [
      {
        name: "The Symposium",
        albums: [{ 
          title: "The Symposium", 
          cover: "/the_symposium.png", 
          tracks: [
            { name: "The Physical Attractions", audio: "/the_symposium_the_physical_attraction.wav" },
            { name: "Cowboy", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" }
          ]
        }]
      },
      {
        name: "Arctic Monkeys",
        albums: [{ 
          title: "AM", 
          cover: "https://upload.wikimedia.org/wikipedia/en/0/04/Arctic_Monkeys_-_AM.png", 
          tracks: [
            { name: "Do I Wanna Know?", audio: "https://p.scdn.co/mp3-preview/abb00e263d5964f9f783226f991c49f87425f190" },
            { name: "Knee Socks", audio: "/knee_socks.wav" }
          ] 
        }]
      }
    ]
  },
  {
    name: "Indie / Alt",
    image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=60&w=500",
    artists: [
      {
        name: "Peach Pit",
        albums: [{ 
          title: "Being So Normal", 
          cover: "/being_so_normal.jpg", 
          tracks: [
            { name: "Peach Pit", audio: "/peach_pit.wav" },
            { name: "Tommy's Party", audio: "https://p.scdn.co/mp3-preview/13054f15697223b24619d9b68f5661d40a2325c3" }
          ]
        }]
      }
    ]
  }
];

export default function VinylVault() {
  // --- STATE MANAGEMENT ---
  const [collection, setCollection] = useState([
    { 
      id: 1, 
      title: "Is This It", 
      artist: "The Strokes", 
      cover: "/is_this_it.png", 
      tracks: [
        { name: "Is This It", audio: "/is_this_it_TheStrokes.wav" },
        { name: "The Modern Age", audio: "/modern_age.wav" },
        { name: "Soma", audio: "/soma.wav" },
        { name: "Barely Legal", audio: "/barely_legal.wav" }
      ] 
    },
    { 
      id: 2, 
      title: "Abbey Road", 
      artist: "The Beatles", 
      cover: "/abbey_road.jpg", 
      tracks: [
        { name: "Come Together", audio: "/come_together_TheBeatles.wav" },
        { name: "Something", audio: "/something.wav" },
        { name: "Oh! Darling", audio: "/oh_darling.wav" }
      ] 
    }
  ]);

  const [view, setView] = useState('player'); 
  const [selected, setSelected] = useState(collection[0]);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const formatTime = (t) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;

  // Audio Sync Logic Added
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = selected.tracks[activeTrackIndex]?.audio || selected.tracks[0].audio;
    audio.load();
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
  }, [selected, activeTrackIndex]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleVaultToggle = (album, artistName) => {
    const exists = collection.find(a => a.title === album.title);
    if (exists) {
      const newCollection = collection.filter(a => a.title !== album.title);
      setCollection(newCollection);
      if (selected.title === album.title && newCollection.length > 0) {
        setSelected(newCollection[0]);
        setActiveTrackIndex(0);
      }
    } else {
      const newAlbum = { ...album, artist: artistName, id: Date.now() };
      setCollection([...collection, newAlbum]);
    }
  };

  const removeFromSidebar = (e, albumTitle) => {
    e.stopPropagation();
    const newCollection = collection.filter(a => a.title !== albumTitle);
    setCollection(newCollection);
    if (selected.title === albumTitle && newCollection.length > 0) {
      setSelected(newCollection[0]);
      setActiveTrackIndex(0);
    }
  };

  return ( /* min h to make background black */
    <div className="min-h-screen bg-[#080808] text-[#f0f0f0] font-sans selection:bg-amber-500/30 relative overflow-hidden">
      <audio 
        ref={audioRef} 
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)} 
        onLoadedMetadata={(e) => setDuration(e.target.duration)} 
      />

      {/* navigation bar, used sticky to make menu stay at top */} 
      <nav className="sticky top-0 z-50 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <h1 onClick={() => setView('player')} className="text-3xl tracking-tight text-amber-500 cursor-pointer" style={{ fontFamily: "'Permanent Marker', cursive" }}>
          Vinyl Vault
        </h1>
        <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          <button onClick={() => setView('player')} className={`transition-colors ${view === 'player' ? 'text-amber-500' : 'hover:text-white'}`}>Player</button>
          <button onClick={() => setView('genres')} className={`transition-colors ${view === 'genres' ? 'text-amber-500' : 'hover:text-white'}`}>Genres</button>
          <button onClick={() => setView('about')} className={`transition-colors ${view === 'about' ? 'text-amber-500' : 'hover:text-white'}`}>About</button>
        </div>
        <div className="flex items-center gap-4 text-zinc-500">
          <Search size={18} className="hover:text-amber-500 cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10" />
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          
          {/* SIDEBAR */}
          <aside className="xl:col-span-3 flex flex-col gap-4">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-2">Your Collection</p>
            {collection.map((album) => (
              <motion.div 
                whileHover={{ x: 5 }}
                key={album.id}
                onClick={() => { setSelected(album); setActiveTrackIndex(0); setView('player'); }}
                className={`group flex items-center p-3 rounded-xl cursor-pointer transition-all border relative ${selected.title === album.title ? 'bg-white/10 border-white/20 shadow-lg' : 'bg-transparent border-transparent hover:bg-white/5'}`}
              >
                <img src={album.cover} className="w-14 h-14 rounded-lg shadow-md object-cover" alt={album.title} />
                <div className="ml-4 pr-6">
                  <h3 className="font-bold text-sm leading-tight">{album.title}</h3>
                  <p className="text-zinc-500 text-[9px] uppercase tracking-widest">{album.artist}</p>
                </div>
                <button onClick={(e) => removeFromSidebar(e, album.title)} className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-500"><X size={14} /></button>
              </motion.div> /* removeFromSidebar triggers filter()*/
            ))}
          </aside>

          {/* MAIN VIEW */}
          <section className="xl:col-span-9">
            <AnimatePresence mode="wait">
              {view === 'player' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/[0.02] backdrop-blur-3xl rounded-[40px] p-8 border border-white/5 shadow-2xl flex flex-col lg:flex-row items-center gap-12">
                  <div className="relative shrink-0">
                     <div className="relative bg-[#121212] p-8 rounded-full shadow-2xl border-b-8 border-black">
                        {/* SEAMLESS ROTATION FIX APPLIED BELOW */}
                        <motion.div 
                           animate={{ rotate: isPlaying ? 360 : 0 }} 
                           transition={{ 
                             duration: 4, 
                             repeat: Infinity, 
                             ease: "linear", 
                             repeatType: "loop" 
                           }} 
                           className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-black flex items-center justify-center relative overflow-hidden"
                        >
                           <div className="absolute inset-0 bg-[repeating-radial-gradient(circle,_transparent_0,_transparent_2px,_rgba(255,255,255,0.03)_3px)] opacity-40" />
                           <img src={selected.cover} className="w-20 h-20 md:w-28 md:h-28 rounded-full border-[6px] border-black z-20 object-cover" />
                        </motion.div>
                        <motion.div animate={{ rotate: isPlaying ? -25 : 0 }} transition={{ type: "spring", stiffness: 30, damping: 12 }} className="absolute top-8 right-0 w-36 md:w-44 h-3 bg-gradient-to-r from-zinc-500 to-zinc-700 origin-right rounded-full z-30 shadow-xl" />
                     </div>
                  </div>

                  <div className="w-full">
                    <h2 className="text-5xl font-black tracking-tighter mb-1">{selected.tracks[activeTrackIndex].name}</h2>
                    <p className="text-amber-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-6">{selected.artist} — {selected.title}</p>
                    
                    <div className="space-y-1 mb-8">
                      <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => audioRef.current.currentTime = e.target.value} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500" />
                      <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
                    </div>

                    <button onClick={togglePlay} className="bg-amber-500 text-black p-5 rounded-full hover:scale-110 shadow-xl mb-8">
                      {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                    </button>

                    <div className="bg-black/40 rounded-2xl p-5 border border-white/5 max-h-40 overflow-y-auto">
                      {selected.tracks.map((t, i) => (
                        <div key={i} onClick={() => setActiveTrackIndex(i)} className={`flex justify-between text-xs py-3 border-b border-white/5 last:border-0 cursor-pointer transition-all ${activeTrackIndex === i ? 'text-amber-500 opacity-100' : 'opacity-50 hover:opacity-100'}`}>
                          <span>{i+1}. {t.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* GENRE VIEW REMAINS THE SAME */}
              {view === 'genres' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {GENRE_DATA.map((g) => (
                    <div key={g.name} className="space-y-6">
                      <h3 className="text-amber-500 font-bold uppercase tracking-widest text-xs border-l-2 border-amber-500 pl-4">{g.name}</h3>
                      {g.artists.map((artist) => (
                        <div key={artist.name} className="bg-white/[0.03] p-5 rounded-3xl border border-white/5 space-y-4">
                          <p className="text-zinc-500 text-[10px] uppercase font-bold">{artist.name}</p>
                          {artist.albums.map((album) => {
                            const isAdded = collection.find(a => a.title === album.title);
                            return (
                              <div key={album.title} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <img src={album.cover} className="w-12 h-12 rounded-lg object-cover" />
                                  <span className="text-sm font-bold">{album.title}</span>
                                </div>
                                <button onClick={() => handleVaultToggle(album, artist.name)} className={`p-2 rounded-full border transition-all ${isAdded ? 'bg-amber-500 text-black' : 'hover:bg-amber-500'}`}>
                                  {isAdded ? <Check size={16}/> : <Plus size={16}/>} 
                                </button>
                              </div>/* /* handleVaultToggle checks if album is in collection, if yes it removes it, if no it adds it. It also passes artist name for proper display in sidebar **/ 
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}

              {view === 'about' && (
                <div className="h-[60vh] flex items-center justify-center overflow-hidden">
                   <motion.div initial={{ y: "100%" }} animate={{ y: "-150%" }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="text-center space-y-16">
                      <h2 className="text-6xl text-amber-500" style={{ fontFamily: "'Permanent Marker', cursive" }}>Credits</h2>
                      <div><p className="text-zinc-500 uppercase tracking-widest text-[10px]">Lead Engineering</p><p className="text-2xl font-black italic">MARWAN MOHAMED</p></div>
                      <p className="text-amber-500 font-mono text-[10px]">VAULT v1.0 // 2026</p>
                   </motion.div>
                </div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}