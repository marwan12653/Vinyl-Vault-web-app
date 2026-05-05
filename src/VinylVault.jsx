import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Music, Search, Plus, Check, X, Settings, 
  LogIn, UserPlus, LogOut, ShieldCheck, Mail, Lock, ArrowLeft,
  SkipBack, SkipForward, Heart, Info
} from 'lucide-react';

// 1. NESTED DATA STRUCTURE (The Archive)
const GENRE_DATA = [
  {
    name: "Indie Rock",
    artists: [
      {
        name: "The Strokes",
        albums: [{ 
          title: "Is This It", 
          cover: "/is_this_it.png", 
          tracks: [
            { name: "Is This It", audio: "/is_this_it_TheStrokes.wav" },
            { name: "The Modern Age", audio: "/modern_age.wav" },
            { name: "Soma", audio: "/soma.wav" },
            { name: "Barely Legal", audio: "/barely_legal.wav" }
          ]
        }]
      },
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
      },
      {
        name: "Tame Impala",
        albums: [{ 
          title: "Currents", 
          cover: "/currents.jpg", 
          tracks: [
            { name: "The Less I Know The Better", audio: "/the_less_i_know_the_better.wav" }
          ]
        }]
      }
    ]
  },
  {
    name: "Classic Rock",
    artists: [
      {
        name: "The Beatles",
        albums: [{ 
          title: "Abbey Road", 
          cover: "/abbey_road.jpg", 
          tracks: [
            { name: "Come Together", audio: "/come_together_TheBeatles.wav" },
            { name: "Something", audio: "/something.wav" }
          ]
        }]
      }
    ]
  },
  {
    name: "Indie / Alt",
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
  // --- CORE STATE ---
  const [collection, setCollection] = useState([]);
  const [view, setView] = useState('genres'); 
  const [selected, setSelected] = useState(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // --- AUTH & USER DB STATE ---
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([
    { email: "marwan@vault.com", password: "123", name: "Marwan" } 
  ]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const formatTime = (t) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;

  // AUDIO SYNCHRONIZATION
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selected) return;
    audio.pause();
    audio.src = selected.tracks[activeTrackIndex]?.audio || selected.tracks[0].audio;
    audio.load();
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
  }, [selected, activeTrackIndex]);

  const togglePlay = () => {
    if (!selected) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleNext = () => {
    if (!selected) return;
    if (activeTrackIndex < selected.tracks.length - 1) {
      setActiveTrackIndex(prev => prev + 1);
    } else {
      setActiveTrackIndex(0); 
    }
    setCurrentTime(0);
  };

  const handlePrev = () => {
    if (!selected) return;
    if (activeTrackIndex > 0) {
      setActiveTrackIndex(prev => prev - 1);
    } else {
      setActiveTrackIndex(selected.tracks.length - 1);
    }
    setCurrentTime(0);
  };

  const handleSeek = (amount) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += amount;
  };

  const handleVaultToggle = (album, artistName) => {
    const exists = collection.find(a => a.title === album.title);
    if (exists) {
      const newCollection = collection.filter(a => a.title !== album.title);
      setCollection(newCollection);
      if (selected?.title === album.title) {
        setSelected(newCollection.length > 0 ? newCollection[0] : null);
        setActiveTrackIndex(0);
        setIsPlaying(false);
      }
    } else {
      const newAlbum = { ...album, artist: artistName, id: Date.now() };
      setCollection([...collection, newAlbum]);
      if (!selected) setSelected(newAlbum);
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (registeredUsers.find(u => u.email === email)) {
      setAuthError("Email already registered!");
      return;
    }
    const newUser = { email, password, name: email.split('@')[0] };
    setRegisteredUsers([...registeredUsers, newUser]);
    setIsLoggedIn(true);
    setUser(newUser);
    setView('player');
    setAuthError("");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const validUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (validUser) {
      setIsLoggedIn(true);
      setUser(validUser);
      setView('player');
      setAuthError("");
    } else {
      setAuthError("Invalid email or password.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setView('genres');
    setShowProfileMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#f0f0f0] font-sans selection:bg-amber-500/30 relative overflow-hidden">
      <audio 
        ref={audioRef} 
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)} 
        onLoadedMetadata={(e) => setDuration(e.target.duration)} 
        onEnded={handleNext}
      />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <h1 onClick={() => setView('player')} className="text-3xl tracking-tight text-amber-500 cursor-pointer" style={{ fontFamily: "'Permanent Marker', cursive" }}>
          Vinyl Vault
        </h1>
        <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          <button onClick={() => setView('player')} className={`transition-colors ${view === 'player' ? 'text-amber-500' : 'hover:text-white'}`}>Player</button>
          <button onClick={() => setView('genres')} className={`transition-colors ${view === 'genres' ? 'text-amber-500' : 'hover:text-white'}`}>Genres</button>
          <button onClick={() => setView('about')} className={`transition-colors ${view === 'about' ? 'text-amber-500' : 'hover:text-white'}`}>About</button>
          <button onClick={() => setView('settings')} className={`transition-colors ${view === 'settings' ? 'text-amber-500' : 'hover:text-white'}`}>Settings</button>
        </div>
        
        <div className="flex items-center gap-4 text-zinc-500 relative">
          <div className="relative">
            <div 
              onClick={() => { setShowProfileMenu(!showProfileMenu); setAuthError(""); }}
              className={`w-9 h-9 rounded-full cursor-pointer border-2 flex items-center justify-center transition-all ${isLoggedIn ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 bg-zinc-800'}`}
            >
              {isLoggedIn ? <span className="text-amber-500 font-bold text-xs">{user.name[0].toUpperCase()}</span> : <UserPlus size={16} />}
            </div>
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-52 bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-[60]">
                  {!isLoggedIn ? (
                    <>
                      <button onClick={() => {setView('login'); setShowProfileMenu(false);}} className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl text-xs text-left"><LogIn size={14} /> Log In</button>
                      <button onClick={() => {setView('signup'); setShowProfileMenu(false);}} className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl text-xs text-left text-amber-500"><UserPlus size={14} /> Create Account</button>
                    </>
                  ) : (
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 hover:bg-red-500/10 text-red-400 rounded-xl text-xs text-left"><LogOut size={14} /> Log Out</button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          
          {/* SIDEBAR */}
          <aside className="xl:col-span-3 flex flex-col gap-4">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-2">Your Collection</p>
            {collection.length === 0 ? (
              <p className="text-zinc-500 text-xs px-2 italic">Vault is empty.</p>
            ) : (
              collection.map((album) => (
                <motion.div 
                  key={album.id} onClick={() => { setSelected(album); setView('player'); }}
                  className={`group flex items-center p-3 rounded-xl cursor-pointer transition-all border relative ${selected?.title === album.title ? 'bg-white/10 border-white/20 shadow-md' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                >
                  <img src={album.cover} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="ml-4"><h3 className="font-bold text-xs truncate w-32">{album.title}</h3><p className="text-zinc-500 text-[8px] uppercase tracking-widest">{album.artist}</p></div>
                  <button onClick={(e) => { e.stopPropagation(); handleVaultToggle(album); }} className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"><X size={14} /></button>
                </motion.div>
              ))
            )}
          </aside>

          {/* MAIN CONTENT */}
          <section className="xl:col-span-9">
            <AnimatePresence mode="wait">
              
              {/* PLAYER VIEW */}
              {view === 'player' && (
                selected ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/[0.02] backdrop-blur-3xl rounded-[40px] p-10 border border-white/5 shadow-2xl flex flex-col lg:flex-row items-center gap-12">
                    <div className="relative">
                       <div className="relative bg-[#121212] p-8 rounded-full shadow-2xl border-b-8 border-black">
                          <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatType: "loop" }} className="w-64 h-64 rounded-full bg-black flex items-center justify-center relative overflow-hidden">
                             <div className="absolute inset-0 bg-[repeating-radial-gradient(circle,_transparent_0,_transparent_2px,_rgba(255,255,255,0.03)_3px)] opacity-40" />
                             <img src={selected.cover} className="w-28 h-28 rounded-full border-[6px] border-black z-20 object-cover" />
                          </motion.div>
                          <motion.div animate={{ rotate: isPlaying ? -25 : 0 }} transition={{ type: "spring", stiffness: 30, damping: 12 }} className="absolute top-8 right-0 w-44 h-3 bg-gradient-to-r from-zinc-500 to-zinc-700 origin-right rounded-full z-30 shadow-xl" />
                       </div>
                    </div>

                    <div className="w-full text-center lg:text-left">
                      <h2 className="text-5xl font-black mb-1 tracking-tighter">{selected.tracks[activeTrackIndex].name}</h2>
                      <p className="text-amber-500 font-mono text-[10px] uppercase mb-8 tracking-[0.3em]">{selected.artist} — {selected.title}</p>
                      
                      <div className="space-y-1 mb-8 max-w-md mx-auto lg:mx-0">
                        <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => audioRef.current.currentTime = e.target.value} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-amber-500 cursor-pointer" />
                        <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center lg:justify-start gap-6 mb-10">
                        <button onClick={handlePrev} className="text-zinc-500 hover:text-white transition-colors"><SkipBack size={24} /></button>
                        <button onClick={() => handleSeek(-10)} className="text-zinc-600 hover:text-amber-500 transition-colors text-[9px] font-bold font-mono">-10S</button>
                        <button onClick={togglePlay} className="bg-amber-500 text-black p-6 rounded-full hover:scale-110 transition-all shadow-xl shadow-amber-500/20">{isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} className="ml-1" fill="black" />}</button>
                        <button onClick={() => handleSeek(10)} className="text-zinc-600 hover:text-amber-500 transition-colors text-[9px] font-bold font-mono">+10S</button>
                        <button onClick={handleNext} className="text-zinc-500 hover:text-white transition-colors"><SkipForward size={24} /></button>
                      </div>
                      
                      {/* TRACK LIST (Always visible in Player view when an album is selected) */}
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 bg-black/20 rounded-2xl p-4 border border-white/5 scrollbar-hide">
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3">Tracklist</p>
                        {selected.tracks.map((t, i) => (
                          <div 
                            key={i} 
                            onClick={() => setActiveTrackIndex(i)} 
                            className={`flex justify-between items-center text-[11px] py-2 px-3 rounded-lg cursor-pointer transition-all ${activeTrackIndex === i ? 'bg-amber-500/10 text-amber-500' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
                          >
                            <span className="font-medium">{i+1}. {t.name}</span>
                            {activeTrackIndex === i && isPlaying && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-[50vh] flex flex-col items-center justify-center text-zinc-600"><Music size={48} className="mb-4 opacity-10" /><p className="text-sm">The vault is silent. Choose a record.</p></div>
                )
              )}

              {/* ABOUT VIEW */}
              {view === 'about' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-5xl font-black italic tracking-tighter" style={{ fontFamily: "'Permanent Marker', cursive" }}>Project Overview</h2>
                    <p className="text-amber-500 font-mono text-[10px] uppercase tracking-[0.4em]">A modern digital archive for physical music culture.</p>
                  </div>
                  
                  <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 backdrop-blur-3xl leading-relaxed text-zinc-400 text-sm">
                    <p className="mb-6">
                      <span className="text-amber-500 font-bold">Vinyl Vault</span> is a web application designed to simulate the tactile experience of a physical music collection. By integrating the HTML5 Audio API with motion physics, we aim to bridge the gap between high-fidelity digital streaming and the traditional turntable aesthetic.
                    </p>
                    <p>
                      This platform allows users to explore curated genres, manage a personalized digital vault, and engage with a playback interface that prioritizes album-centric listening over the randomized nature of modern algorithms.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/5 text-center">
                      <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest mb-3">Development Team</p>
                      <p className="text-lg font-black italic">Marwan Mohamed</p>
                      <p className="text-lg font-black italic">& Ahmed Osama</p>
                    </div>
                    <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/5 text-center">
                      <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest mb-3">Academic Supervision</p>
                      <p className="text-md font-bold">Dr. Noha Ghatawry</p>
                      <p className="text-md font-bold">Eng. Seif Mansour</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center items-center gap-2 text-zinc-700 text-[10px] uppercase tracking-widest font-bold py-10">
                    <Info size={14} className="text-amber-500" /> <span>Phase 1 Prototype // 2026</span>
                  </div>
                </motion.div>
              )}

              {/* LOGIN / SIGNUP / GENRES / SETTINGS remains as before */}
              {view === 'login' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto bg-white/[0.02] border border-white/5 rounded-[40px] p-10 text-center">
                   <h2 className="text-4xl font-black mb-6">Sign In</h2>
                   <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                      <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none placeholder:text-zinc-700" />
                      <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none placeholder:text-zinc-700" />
                      {authError && <p className="text-red-500 text-[10px] font-bold uppercase">{authError}</p>}
                      <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-amber-500 transition-all uppercase tracking-widest text-xs">Login</button>
                      <p className="text-zinc-600 text-[10px] mt-4 text-center">Need an account? <span className="text-amber-500 cursor-pointer" onClick={() => setView('signup')}>Register</span></p>
                   </form>
                </motion.div>
              )}

              {view === 'signup' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto bg-white/[0.02] border border-white/5 rounded-[40px] p-10 text-center">
                   <h2 className="text-4xl font-black mb-6 italic tracking-tighter">Join Vault</h2>
                   <form onSubmit={handleSignUpSubmit} className="space-y-4 text-left">
                      <input required type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none placeholder:text-zinc-700" />
                      <input required type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none placeholder:text-zinc-700" />
                      {authError && <p className="text-red-500 text-[10px] font-bold uppercase">{authError}</p>}
                      <button type="submit" className="w-full bg-amber-500 text-black font-bold py-4 rounded-2xl hover:brightness-110 uppercase tracking-widest text-xs">Register</button>
                   </form>
                </motion.div>
              )}

              {view === 'genres' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {GENRE_DATA.map((g) => (
                    <div key={g.name} className="space-y-6">
                      <h3 className="text-amber-500 font-bold uppercase tracking-widest text-[10px] border-l-2 border-amber-500 pl-4">{g.name}</h3>
                      {g.artists.map((artist) => (
                        <div key={artist.name} className="bg-white/[0.03] p-5 rounded-3xl border border-white/5 space-y-4">
                          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{artist.name}</p>
                          {artist.albums.map((album) => {
                            const isAdded = collection.find(a => a.title === album.title);
                            return (
                              <div key={album.title} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <img src={album.cover} className="w-12 h-12 rounded-lg object-cover shadow-lg" />
                                  <span className="text-sm font-bold">{album.title}</span>
                                </div>
                                <button onClick={() => handleVaultToggle(album, artist.name)} className={`p-2 rounded-full border transition-all ${isAdded ? 'bg-amber-500 text-black' : 'hover:bg-amber-500 border-white/10'}`}>
                                  {isAdded ? <Check size={14}/> : <Plus size={14}/>}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}

              {view === 'settings' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl bg-white/[0.02] border border-white/5 rounded-[40px] p-10 backdrop-blur-3xl">
                  <h2 className="text-3xl font-black mb-10 tracking-tight">System Preferences</h2>
                  <div className="space-y-8">
                    <section>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-4">Identity</p>
                      <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 flex items-center justify-between">
                        <span className="text-sm text-zinc-300">{isLoggedIn ? `Authenticated as ${user.name}` : "Local Guest Access"}</span>
                        {!isLoggedIn && <button onClick={() => setView('login')} className="text-amber-500 text-[10px] font-bold uppercase tracking-widest hover:underline">Link Account</button>}
                      </div>
                    </section>
                    <section>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-4">Playback Engine</p>
                      <div className="space-y-3">
                        {['Lossless Audio Quality', 'Automatic Needle Physics', 'Vinyl Surface Texture'].map(pref => (
                          <div key={pref} className="p-4 bg-white/[0.01] rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                            <span className="text-sm text-zinc-400">{pref}</span>
                            <div className="w-10 h-5 bg-amber-500 rounded-full flex items-center justify-end px-1"><div className="w-3 h-3 bg-white rounded-full shadow-md" /></div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}