import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Music } from 'lucide-react';

// Make sure to add this Google Font link in your index.html:
// <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Inter:wght@400;900&display=swap" rel="stylesheet">

const ALBUMS = [
  {
    id: 1,
    title: "Is This It",
    artist: "The Strokes",
    cover: "/is_this_it.png", 
    audio: "/is_this_it_TheStrokes.wav",
    tracks: ["Is This It", "The Modern Age", "Soma", "Barely Legal"]
  },
  {
    id: 2,
    title: "Abbey Road",
    artist: "The Beatles",
    cover: "/abbey_road.jpg",
    audio: "/come_together_TheBeatles.wav",
    tracks: ["Come Together", "Something", "Oh! Darling"]
  }
];

export default function VinylVault() {
  const [selected, setSelected] = useState(ALBUMS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = selected.audio;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [selected]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#fefefe] p-8 md:p-16 font-sans">
      <audio ref={audioRef} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20">
          <h1 
            className="text-8xl tracking-tight text-amber-500 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.1)]"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            Vinyl Vault
          </h1>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-20">
          
          <section className="xl:col-span-5 grid grid-cols-2 gap-10">
            {ALBUMS.map((album) => (
              <motion.div
                key={album.id}
                whileHover={{ scale: 1.05, rotate: album.id % 2 === 0 ? 1 : -1 }}
                onClick={() => { setSelected(album); setIsPlaying(true); }}
                className="cursor-pointer group"
              >
                <div className="relative aspect-square overflow-hidden shadow-[10px_10px_0px_rgba(245,158,11,0.2)] border-2 border-white/10 group-hover:border-amber-500 transition-colors">
                  <img 
                    src={album.cover} 
                    className="w-full h-full object-cover group-hover:opacity-40 transition-all duration-700" 
                    alt={album.title}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play fill="#f59e0b" className="text-amber-500" size={54} />
                  </div>
                </div>
                <h3 className="mt-4 font-black text-xl uppercase tracking-tighter">{album.title}</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic">{album.artist}</p>
              </motion.div>
            ))}
          </section>

          <section className="xl:col-span-7 bg-[#151515] rounded-xl p-12 border border-white/5 flex flex-col items-center shadow-2xl relative">
            
            <div className="relative bg-[#0a0a0a] p-12 rounded-lg shadow-inner border-b-8 border-black">
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="relative z-10"
              >
                <div className="w-[400px] h-[400px] rounded-full bg-[#050505] shadow-[0_0_80px_rgba(0,0,0,1)] flex items-center justify-center border-[10px] border-[#111] overflow-hidden relative">
                  <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,_transparent_0,_transparent_3px,_rgba(255,255,255,0.01)_4px)]" />
                  
                  <div className="w-36 h-36 rounded-full overflow-hidden border-[8px] border-black z-20">
                    <img src={selected.cover} className="w-full h-full object-cover shadow-inner" alt="label" />
                  </div>
                  <div className="absolute w-6 h-6 bg-zinc-900 rounded-full border border-zinc-700 z-30" />
                </div>
              </motion.div>

              <motion.div 
                // Needle swings from right (0) to left (-25) to sit on the record
                animate={{ rotate: isPlaying ? -25 : 0 }}
                transition={{ type: "spring", stiffness: 35, damping: 10 }}
                className="absolute top-12 right-12 w-60 h-6 bg-gradient-to-r from-zinc-300 via-zinc-500 to-zinc-700 origin-right rounded-full shadow-2xl z-30 flex items-center"
              >
                <div className="w-12 h-14 bg-zinc-800 rounded-sm -ml-4 border border-zinc-600 shadow-2xl relative">
                   <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-zinc-500 rounded-full" />
                </div>
              </motion.div>
            </div>

            <div className="mt-14 text-center w-full max-w-sm">
              <motion.h2 
                key={selected.title} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-6xl font-black italic text-amber-500 tracking-tighter"
              >
                {selected.title}
              </motion.h2>
              <p className="text-zinc-500 font-bold tracking-[0.4em] mt-2 uppercase text-[12px]">
                {selected.artist}
              </p>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="mt-12 bg-amber-500 text-black w-28 h-28 rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110 shadow-xl active:scale-95"
              >
                {isPlaying ? <Pause fill="black" size={48} /> : <Play fill="black" size={48} className="ml-2"/>}
              </button>

              <div className="mt-14 text-left bg-black/40 p-10 border-l-2 border-amber-500 shadow-inner">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <p className="text-[12px] text-zinc-500 font-bold flex items-center gap-2 tracking-widest uppercase italic">
                    <Music size={18} className="text-amber-500"/> Song Archive
                  </p>
                </div>
                {selected.tracks.map((t, i) => (
                  <div key={i} className="text-sm py-4 flex justify-between group transition-colors cursor-default border-b border-white/5 last:border-0 hover:text-amber-500">
                    <span className="font-bold tracking-tight text-zinc-300 group-hover:text-amber-500 transition-colors">
                      {i+1}. {t}
                    </span>
                    <span className="font-mono text-zinc-800 italic group-hover:text-amber-500 transition-colors">
                      03:4{i}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}