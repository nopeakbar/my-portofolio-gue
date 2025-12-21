"use client";

import React, { useState } from 'react';
import useSWR from 'swr'; // 1. INI DITAMBAHKAN
import { Github, ExternalLink, Smartphone, Book, FileText, Mail, ArrowRight, Music, ChevronLeft, ChevronRight, Binary, Instagram, Linkedin, Coffee, Mic, MousePointerClick } from 'lucide-react';

// 2. INI DITAMBAHKAN (Fetcher untuk API)
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Portfolio() {
  
  // 3. INI DITAMBAHKAN (Hook buat ambil data Spotify tiap 5 detik)
  const { data } = useSWR('/api/spotify', fetcher, { refreshInterval: 5000 });

  // --- CONFIG SLIDER SPOTIFY ---
  const spotifyEmbeds = [
    // 1. 2112
    "https://open.spotify.com/embed/track/5Gxwk3TSekI4GVMpFvPBEc?utm_source=generator",
    // 2. Lagu Baru
    "https://open.spotify.com/embed/track/0lAwrV80YlQCGeqPtMIQjB?utm_source=generator",
    // 3. Lagu Lama
    "https://open.spotify.com/embed/track/2dIBMHByUGcNPzmYBJ6OAj?utm_source=generator&theme=0",
    // 4. Lagu Lama
    "https://open.spotify.com/embed/track/4XHijJfABTtUCW3Bp6KFvr?utm_source=generator&theme=0",
  ];

  const [currentSong, setCurrentSong] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Fungsi Ganti Lagu
  const nextSong = () => {
    setCurrentSong((prev) => (prev === spotifyEmbeds.length - 1 ? 0 : prev + 1));
  };

  const prevSong = () => {
    setCurrentSong((prev) => (prev === 0 ? spotifyEmbeds.length - 1 : prev - 1));
  };

  // --- LOGIC SWIPE UNTUK MOBILE ---
  const minSwipeDistance = 50; 

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) nextSong();
    if (isRightSwipe) prevSong();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500 selection:text-white pb-20 overflow-x-hidden">
      
      {/* --- NAVBAR FLOATING --- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full px-6 py-3 flex gap-6 shadow-2xl">
        <a href="#home" className="hover:text-cyan-400 transition-colors text-sm font-medium">Home</a>
        <a href="#projects" className="hover:text-cyan-400 transition-colors text-sm font-medium">Projects</a>
        <a href="#writing" className="hover:text-cyan-400 transition-colors text-sm font-medium">Writing</a>
        <a href="#contact" className="hover:text-cyan-400 transition-colors text-sm font-medium">Contact</a>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="max-w-5xl mx-auto px-6 pt-40 pb-20 flex flex-col justify-center min-h-[80vh]">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-wider text-cyan-400 uppercase bg-cyan-900/20 rounded-full w-fit border border-cyan-800/50">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Open to Work
        </div>

        {/* JUDUL SUDAH DIBUAT BOLD MAKSIMAL (font-black) */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          BUILDING. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            THE. FUTURE.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-8">
          Hi, I'm <span className="text-white font-semibold">AKBAR</span>. I build modern web apps using 
          <span className="text-cyan-300"> React/Next.js</span> and mobile apps using 
          <span className="text-purple-400"> Flutter</span>. I focus on creating software solutions that solve real-world problems.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <a href="#projects" className="px-7 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-full transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] flex items-center gap-2 group">
            View Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </a>
          <a href="https://github.com/username" target="_blank" className="px-7 py-3 border border-slate-700 hover:border-slate-500 hover:bg-slate-900 rounded-full transition-all flex items-center gap-2">
            <Github size={20} /> GitHub
          </a>
        </div>
      </section>

      {/* ========================================= */}
      {/* SEGMENT 1: FEATURED PROJECTS (CODING)   */}
      {/* ========================================= */}
      <section id="projects" className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-10 w-1 bg-cyan-500 rounded-full"></div>
           <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px] md:auto-rows-[400px]">
          
          {/* CARD 1: ISBN (2 Cols) */}
          <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-slate-800 group-hover:scale-105 transition-transform duration-700 bg-[url('/thumbnail/thumb-isbn.png')] bg-cover bg-center opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
               <div className="flex justify-between items-end">
                <div>
                  <span className="bg-green-500/20 text-green-400 text-[10px] md:text-xs font-bold px-2 py-1 rounded mb-3 inline-block border border-green-500/30 backdrop-blur-sm">
                    DEPLOYED AT UPN "VETERAN" YOGYAKARTA
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">ISBN Data Management System</h3>
                  <p className="text-slate-300 text-sm md:text-base mb-4 line-clamp-2 md:line-clamp-none">
                    Digitized the ISBN submission workflow for the university. Transformed a previously manual application process into a fully integrated web system.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-slate-950/80 border border-slate-700 px-2 py-1 rounded text-slate-300">PHP</span>
                    {/* <span className="text-xs bg-slate-950/80 border border-slate-700 px-2 py-1 rounded text-slate-300">NodeJS</span> */}
                  </div>
                </div>
                <a href="https://penerbitlppm.site/v2" target="_blank" className="p-3 bg-white text-slate-950 rounded-full hover:bg-cyan-400 hover:scale-110 transition-all shadow-lg">
                  <ExternalLink size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* CARD 2: MOBILE (1 Col) */}
          <div className="md:col-span-1 relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all duration-300">
             <div className="absolute inset-0 bg-slate-900 group-hover:scale-105 transition-transform duration-700 bg-[url('/thumbnail/thumb-nonton-nyantai.png')] bg-cover bg-center opacity-40" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-purple-900/40 to-transparent z-10" />
             <Smartphone className="absolute -top-6 -right-6 text-purple-900/20 w-40 h-40 rotate-12 z-10" />
             <div className="absolute bottom-0 left-0 p-8 z-20 h-full flex flex-col justify-end">
                <div className="mb-auto mt-4">
                  <div className="w-12 h-12 bg-purple-900/50 backdrop-blur-md rounded-xl flex items-center justify-center border border-purple-500/30 mb-4 text-purple-300 shadow-lg">
                    <Smartphone size={24}/>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-shadow-sm">Nonton Nyantai App</h3>
                <p className="text-slate-300 text-sm mb-4 font-medium leading-relaxed">
                  A movie discovery app powered by OMDB API. Features real-time movie data and a location-based cinema finder in Yogyakarta.
                </p>
                <a href="https://nonton-nyantai-nopeakbar-porto.web.app/" target="_blank" className="flex items-center gap-2 text-sm text-purple-300 font-bold cursor-pointer hover:text-purple-100 transition-colors w-fit">
                  View Demo <ArrowRight size={16} />
                </a>
             </div>
          </div>

          {/* CARD 3: BOOK EXCHANGE (1 Col) */}
          <div className="md:col-span-1 relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-all duration-300">
             <div className="absolute inset-0 bg-slate-900 group-hover:scale-105 transition-transform duration-700 bg-[url('/thumbnail/thumb-book-exchange.png')] bg-cover bg-center opacity-40" />
             <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/30 to-slate-950 z-10" />
             <Book className="absolute top-4 right-4 text-slate-800 w-24 h-24 group-hover:text-orange-500/10 transition-colors" />
             <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-xl font-bold text-white mb-2">Book Exchange</h3>
                <p className="text-slate-400 text-sm mb-4">
                  A peer-to-peer platform for book lovers. Connects readers to swap their favorite titles.
                </p>
                <a href="https://bukutukar-nopeakbar.vercel.app/" target="_blank" className="flex items-center gap-2 text-sm text-orange-400 font-medium hover:text-orange-300">
                  Visit Platform <ExternalLink size={14} />
                </a>
             </div>
          </div>

          {/* CARD 4: AUDIO TRANSCRIBE (1 Col) */}
          <div className="md:col-span-1 relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 transition-all duration-300">
             <div className="absolute inset-0 bg-slate-900 group-hover:scale-105 transition-transform duration-700 bg-[url('/thumbnail/thumb-audio.gif')] bg-cover bg-center opacity-40" />
             <div className="absolute inset-0 bg-gradient-to-r from-pink-900/30 to-slate-950 z-10" />
             <Mic className="absolute top-4 right-4 text-pink-500/20 w-24 h-24 group-hover:text-pink-500/40 transition-colors" />

             <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-xl font-bold text-white mb-2">Audio Transcribe</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Automated speech-to-text conversion tool built with Python. Efficient and accurate.
                </p>
                <a href="https://github.com/nopeakbar/audio-transcribe-nopeakbar.git" target="_blank" className="flex items-center gap-2 text-sm text-pink-400 font-medium hover:text-pink-300">
                  <Github size={14} /> View Repo
                </a>
             </div>
          </div>

          {/* CARD 5: WEB AUTO CLICKER (1 Col) */}
          <div className="md:col-span-1 relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all duration-300">
             <div className="absolute inset-0 bg-slate-900 group-hover:scale-105 transition-transform duration-700 bg-[url('/thumbnail/thumb-colorbox.jpg')] bg-cover bg-center opacity-40" />
             <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/30 to-slate-950 z-10" />
             <MousePointerClick className="absolute top-4 right-4 text-teal-500/20 w-24 h-24 group-hover:text-teal-500/40 transition-colors" />

             <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-xl font-bold text-white mb-2">Auto Clicker</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Automation tool to mass download images from Colorbox and Uniqlo websites seamlessly.
                </p>
                <a href="https://github.com/nopeakbar/web-auto-clicker-nopeakbar.git" target="_blank" className="flex items-center gap-2 text-teal-400 font-medium hover:text-teal-300 text-sm">
                  <Github size={14} /> View Script
                </a>
             </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* SEGMENT 2: WRITING & THOUGHTS (MEDIUM)  */}
      {/* ========================================= */}
      <section id="writing" className="max-w-5xl mx-auto px-6 py-10">
         <div className="flex items-center gap-4 mb-8">
           <div className="h-10 w-1 bg-white rounded-full"></div>
           <h2 className="text-3xl font-bold text-white">Writing & Thoughts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
          {/* CARD 6: MEDIUM (FULL WIDTH 3 COLS biar standout) */}
          <div className="md:col-span-3 relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-white/50 transition-all duration-300">
             <div className="absolute inset-0 bg-slate-900 group-hover:scale-105 transition-transform duration-700 bg-[url('/thumbnail/thumb-medium.gif')] bg-cover bg-center opacity-40" />
             <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-transparent z-10" />
             <FileText className="absolute top-8 right-8 text-white/10 w-32 h-32 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-500" />

             <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full flex flex-col justify-end h-full">
               <div className="mt-auto">
                 <div className="flex items-center gap-2 text-white/70 mb-2">
                    <Binary size={18} />
                    <span className="text-xs font-bold tracking-widest uppercase">Data Science</span>
                 </div>
                 <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Writing on Medium</h3>
                 <p className="text-slate-300 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
                   Documenting my experiments in Data Science and breaking down complex concepts into actionable insights for everyone.
                 </p>
                 <a href="https://medium.com/@nopeakbar" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-sm font-bold hover:bg-slate-200 transition-colors">
                   Read Articles <ExternalLink size={16} />
                 </a>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* SEGMENT 3: CURATED COLLECTIONS (NOTION) */}
      {/* ========================================= */}
      <section id="collections" className="max-w-5xl mx-auto px-6 py-10">
         <div className="flex items-center gap-4 mb-8">
           <div className="h-10 w-1 bg-amber-500 rounded-full"></div>
           <h2 className="text-3xl font-bold text-white">Curated Collections</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
          {/* CARD 7: NOTION (FULL WIDTH 3 COLS) */}
          <div className="md:col-span-3 relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-300">
             <div className="absolute inset-0 bg-slate-900 group-hover:scale-105 transition-transform duration-700 bg-[url('/thumbnail/thumb-notion.png')] bg-cover bg-center opacity-40" />
             <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/30 to-slate-950 z-10" />
             <Coffee className="absolute top-8 right-8 text-amber-500/20 w-32 h-32 group-hover:text-amber-500/40 transition-colors" />

             <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Coffee Shop Hunter</h3>
                <p className="text-slate-300 text-base md:text-lg mb-8 max-w-2xl">
                  A personal curation of the best coffee spots in Yogyakarta. Reviewed based on ambiance, coffee quality, and work-friendliness.
                </p>
                <a href="https://treasure-clef-482.notion.site/d73789d729ac46da85500df19a83e3a4?v=a8f299db8e804d88ba26ba13e88a06e7&source=copy_link" target="_blank" className="flex items-center gap-2 text-amber-400 font-bold hover:text-amber-300 text-lg">
                  Visit Notion Page <ExternalLink size={18} />
                </a>
             </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* SEGMENT 3.5: NOW PLAYING (SPOTIFY API)  */}
      {/* ========================================= */}
      {/* 4. BAGIAN INI SAYA UPDATE DENGAN DATA DARI API */}
      {/* ========================================= */}
      {/* SEGMENT 3.5: NOW PLAYING (SPOTIFY API)  */}
      {/* ========================================= */}
      <section id="nowplaying" className="max-w-5xl mx-auto px-6 py-10">
         <div className="flex items-center gap-4 mb-8">
           <div className="h-10 w-1 bg-green-400 rounded-full"></div>
           <h2 className="text-3xl font-bold text-white">Currently Listening To</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-green-900/40 via-slate-900 to-slate-900 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 p-8">
             
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
             
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                 {/* UPDATE: Logic Warna (Hijau=Play, Abu=History) */}
                 <div className={`w-3 h-3 rounded-full ${data?.isPlaying ? "bg-green-400 animate-pulse" : "bg-slate-500"}`}></div>
                 
                 {/* UPDATE: Logic Teks (Live vs Last Played) */}
                 <span className={`font-bold text-sm tracking-wider uppercase ${data?.isPlaying ? "text-green-400" : "text-slate-400"}`}>
                    {data?.isPlaying ? "Live from Spotify" : data?.lastPlayed ? `Last Played ${data.lastPlayed}` : "Offline"}
                 </span>
               </div>

               <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                 {/* UPDATE: Gambar jadi Hitam Putih kalau Offline */}
                 <div className="w-32 h-32 bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-slate-700 group-hover:border-green-500/50 transition-all duration-300 flex-shrink-0 overflow-hidden relative">
                   {data?.albumImageUrl ? (
                      <img src={data.albumImageUrl} alt={data.album} className={`w-full h-full object-cover animate-in fade-in duration-700 ${!data.isPlaying && "grayscale opacity-70"}`} />
                   ) : (
                      <Music size={48} className="text-slate-600" />
                   )}
                 </div>

                 {/* Track Info */}
                 <div className="flex-1">
                   <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-1">
                     {data?.title || "Not playing right now"}
                   </h3>
                   <p className="text-slate-400 text-lg mb-4 line-clamp-1">
                     {data?.artist || "Spotify is currently offline"}
                   </p>
                   <div className="flex items-center gap-4">
                     {/* UPDATE: Tombol berubah jadi abu-abu kalau offline */}
                     <a 
                       href={data?.songUrl || "https://open.spotify.com"} 
                       target="_blank"
                       className={`inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-full transition-all text-sm ${data?.isPlaying ? "bg-green-600 hover:bg-green-500 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"}`}
                     >
                       <Music size={16} /> {data?.isPlaying ? "Listen on Spotify" : "Open Spotify"}
                     </a>
                   </div>
                 </div>
               </div>

             </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* SEGMENT 4: ON REPEAT (SPOTIFY)          */}
      {/* ========================================= */}
      <section id="playlist" className="max-w-5xl mx-auto px-6 py-10">
         <div className="flex items-center gap-4 mb-8">
           <div className="h-10 w-1 bg-green-500 rounded-full"></div>
           <h2 className="text-3xl font-bold text-white">On Repeat</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 8: SPOTIFY SLIDER (Full Width) */}
          <div 
            className="md:col-span-3 rounded-3xl bg-black border border-slate-800 overflow-hidden relative group h-[360px]"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
              <button 
                onClick={prevSong} 
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-green-500/80 p-2 rounded-full backdrop-blur-md transition-all text-white border border-slate-700 hover:border-green-400 hover:scale-110"
              >
                <ChevronLeft size={24} />
              </button>

              <button 
                onClick={nextSong} 
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-green-500/80 p-2 rounded-full backdrop-blur-md transition-all text-white border border-slate-700 hover:border-green-400 hover:scale-110"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {spotifyEmbeds.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSong ? "w-6 bg-green-500" : "w-2 bg-slate-600"}`}
                  />
                ))}
              </div>

              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-green-500 text-xs font-bold bg-black/80 px-4 py-1.5 rounded-full backdrop-blur-md border border-green-900 shadow-xl">
                <Music size={12} className="animate-pulse"/> MY LAGU GUE ({currentSong + 1}/{spotifyEmbeds.length})
              </div>

              <div className="w-full h-full relative">
                {spotifyEmbeds.map((link, index) => (
                   <iframe 
                    key={index}
                    style={{borderRadius: "12px", display: index === currentSong ? 'block' : 'none'}} 
                    src={link}
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    className="opacity-90 transition-opacity animate-in fade-in duration-500"
                  ></iframe>
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER (CONTACT) --- */}
      <footer id="contact" className="max-w-5xl mx-auto px-6 pt-10 text-center">
        <h2 className="text-2xl font-bold mb-6">Let's Connect</h2>
        
        {/* Email */}
        <a href="mailto:nopeakbar.blog@gmail.com" className="flex justify-center items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8 text-lg">
          <Mail size={24} /> nopeakbar.blog@gmail.com
        </a>

        {/* Social Links */}
        <div className="flex justify-center gap-8 mb-12 items-center">
          {/* LinkedIn */}
          <a href="https://www.linkedin.com/in/noveanto-nur-akbar/" target="_blank" className="text-slate-400 hover:text-blue-500 transition-colors transform hover:scale-110">
            <Linkedin size={32} />
          </a>
          
          {/* Instagram */}
          <a href="https://instagram.com/nopeakbar" target="_blank" className="text-slate-400 hover:text-pink-500 transition-colors transform hover:scale-110">
            <Instagram size={32} />
          </a>

          {/* Medium */}
          <a href="https://medium.com/@nopeakbar" target="_blank" className="text-slate-400 hover:text-white transition-colors transform hover:scale-110">
            <FileText size={32} />
          </a>

          {/* --- BAGIAN INI DITAMBAHKAN SESUAI REQUEST (SPOTIFY ICON) --- */}
          <a href="https://open.spotify.com/user/67tbuc3v934pih7w5u2nefkt1?si=07fcb99ad27e46e5" target="_blank" className="relative w-8 h-8 transform hover:scale-110 transition-transform group">
            {/* Image Default (Gray) - Hilang pas hover */}
            <img 
              src="/thumbnail/spotify.png" 
              alt="Spotify" 
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-0"
            />
            {/* Image Hover (Green) - Muncul pas hover */}
            <img 
              src="/thumbnail/spotify-hover.png" 
              alt="Spotify Hover" 
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
          </a>
          {/* ----------------------------------------------------------- */}

        </div>

        <div className="border-t border-slate-900 pt-8 pb-8 text-slate-600 text-sm">
          <p>© {new Date().getFullYear()} Nov Akbar's Portfolio. Built with Next.js.</p>
        </div>
      </footer>
    </main>
  );
}