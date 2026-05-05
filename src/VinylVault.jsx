import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Music, Search, Plus, Check, X, Settings, 
  LogIn, UserPlus, LogOut, ShieldCheck, Mail, Lock, ArrowLeft 
} from 'lucide-react';

// 1. NESTED DATA STRUCTURE (Discovery Archive)
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
  }
];

export default function VinylVault() {
  // --- STATE MANAGEMENT ---
  const [collection, setCollection] = useState([]);
  const [view, setView] = useState('genres'); 
  const [selected, setSelected] = useState(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // --- AUTH & USER DATABASE STATE ---
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([
    { email: "marwan@vault.com", password: "123", name: "Marwan" } 
  ]);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const formatTime = (t) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;

  // 2. AUDIO SYNCHRONIZATION ENGINE
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

  // 3. VAULT LOGIC
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

  // 4. AUTHENTICATION LOGIC
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (registeredUsers.find(u => u.email === email)) {
      setAuthError("Email already exists!");
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
      setShowProfileMenu(false);
    } else {
      setAuthError("Invalid credentials!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setEmail("");
    setPassword("");
    setView('genres');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#f0f0f0] font-sans selection:bg-amber-500/30 relative overflow-hidden">
      <audio 
        ref={audioRef} 
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)} 
        onLoadedMetadata={(e) => setDuration(e.target.duration)} 
      />

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <h1 onClick={() => setView('player')} className="text-3xl tracking-tight text-amber-500 cursor-pointer" style={{ fontFamily: "'Permanent Marker', cursive" }}>
          Vinyl Vault
        </h1>
        <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          <button onClick={() => setView('player')} className={`transition-colors ${view === 'player' ? 'text-amber-500' : 'hover:text-white'}`}>Player</button>
          <button onClick={() => setView('genres')} className={`transition-colors ${view === 'genres' ? 'text-amber-500' : 'hover:text-white'}`}>Genres</button>
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
          
          {/* sidebar */}
          <aside className="xl:col-span-3 flex flex-col gap-4">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-2">Your Collection</p>
            {collection.length === 0 ? (
              <p className="text-zinc-500 text-xs px-2 italic">Vault is empty.</p>
            ) : (
              collection.map((album) => (
                <motion.div 
                  key={album.id} onClick={() => { setSelected(album); setView('player'); }}
                  className={`group flex items-center p-3 rounded-xl cursor-pointer transition-all border relative ${selected?.title === album.title ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                >
                  <img src={album.cover} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="ml-4"><h3 className="font-bold text-xs truncate w-32">{album.title}</h3><p className="text-zinc-500 text-[8px] uppercase">{album.artist}</p></div>
                  <button onClick={(e) => { e.stopPropagation(); handleVaultToggle(album); }} className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-500"><X size={14} /></button>
                </motion.div>
              ))
            )}
          </aside>

          {/* main view */}
          <section className="xl:col-span-9">
            <AnimatePresence mode="wait">
              
              {/* main player */}
              {view === 'player' && (
                selected ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/[0.02] backdrop-blur-3xl rounded-[40px] p-8 border border-white/5 shadow-2xl flex flex-col lg:flex-row items-center gap-12">
                    <div className="relative">
                       <div className="relative bg-[#121212] p-8 rounded-full shadow-2xl border-b-8 border-black">
                          <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatType: "loop" }} className="w-64 h-64 rounded-full bg-black flex items-center justify-center relative overflow-hidden">
                             <div className="absolute inset-0 bg-[repeating-radial-gradient(circle,_transparent_0,_transparent_2px,_rgba(255,255,255,0.03)_3px)] opacity-40" />
                             <img src={selected.cover} className="w-28 h-28 rounded-full border-[6px] border-black z-20 object-cover" />
                          </motion.div>
                          <motion.div animate={{ rotate: isPlaying ? -25 : 0 }} transition={{ type: "spring", stiffness: 30, damping: 12 }} className="absolute top-8 right-0 w-44 h-3 bg-gradient-to-r from-zinc-500 to-zinc-700 origin-right rounded-full z-30 shadow-xl" />
                       </div>
                    </div>
                    <div className="w-full">
                      <h2 className="text-5xl font-black mb-1">{selected.tracks[activeTrackIndex].name}</h2>
                      <p className="text-amber-500 font-mono text-[10px] uppercase mb-8">{selected.artist} — {selected.title}</p>
                      <button onClick={togglePlay} className="bg-amber-500 text-black p-5 rounded-full hover:scale-110 mb-8">{isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}</button>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {selected.tracks.map((t, i) => (
                          <div key={i} onClick={() => setActiveTrackIndex(i)} className={`flex justify-between text-xs py-3 border-b border-white/5 cursor-pointer ${activeTrackIndex === i ? 'text-amber-500' : 'opacity-50'}`}>
                            <span>{i+1}. {t.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-[50vh] flex flex-col items-center justify-center text-zinc-600"><Music size={48} className="mb-4 opacity-20" /><p>Your turntable is empty.</p></div>
                )
              )}

              {/* signing  up */}
              {view === 'signup' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-md mx-auto bg-white/[0.02] border border-white/5 rounded-[40px] p-10 backdrop-blur-3xl text-center">
                  <button onClick={() => setView('genres')} className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold mb-8 hover:text-white"><ArrowLeft size={14} /> Back</button>
                  <h2 className="text-4xl font-black mb-6">Create Account</h2>
                  <form onSubmit={handleSignUpSubmit} className="space-y-4">
                    <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none" />
                    <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none" />
                    {authError && <p className="text-red-500 text-[10px] font-bold uppercase">{authError}</p>}
                    <button type="submit" className="w-full bg-amber-500 text-black font-bold py-4 rounded-2xl">Create Account</button>
                    <p className="text-zinc-500 text-[10px] cursor-pointer mt-4" onClick={() => setView('login')}>Already a member? Log In</p>
                  </form>
                </motion.div>
              )}

              {/* login */}
              {view === 'login' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md mx-auto bg-white/[0.02] border border-white/5 rounded-[40px] p-10 backdrop-blur-3xl text-center">
                  <h2 className="text-4xl font-black mb-6">Welcome Back</h2>
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none" />
                    <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none" />
                    {authError && <p className="text-red-500 text-[10px] font-bold uppercase">{authError}</p>}
                    <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-2xl">Sign In</button>
                    <p className="text-zinc-500 text-[10px] cursor-pointer mt-4" onClick={() => setView('signup')}>New collector? Join here</p>
                  </form>
                </motion.div>
              )}

              {/* generes tab */}
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
                                  <img src={album.cover} className="w-10 h-10 rounded-lg object-cover" />
                                  <span className="text-sm font-bold">{album.title}</span>
                                </div>
                                <button onClick={() => handleVaultToggle(album, artist.name)} className={`p-2 rounded-full border ${isAdded ? 'bg-amber-500 text-black' : 'hover:bg-amber-500'}`}>
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

              {/* settings handling */}
              {view === 'settings' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl bg-white/[0.02] border border-white/5 rounded-[40px] p-10 backdrop-blur-3xl">
                  <h2 className="text-3xl font-black mb-10">Preferences</h2>
                  <div className="space-y-8">
                    <section>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-4">Account Status</p>
                      <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 flex items-center justify-between">
                        <span className="text-sm">{isLoggedIn ? `Logged in as ${user.name}` : "Guest Mode"}</span>
                        {!isLoggedIn && <button onClick={() => setView('login')} className="text-amber-500 text-xs font-bold uppercase tracking-widest">Connect</button>}
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