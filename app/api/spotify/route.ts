import { NextResponse } from 'next/server';
import { getNowPlaying, getRecentlyPlayed } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Cek dulu, lagi main lagu gak?
    const response = await getNowPlaying();

    if (response.status === 200) {
      const song = await response.json();
      
      // Kalau lagi main, kirim datanya
      if (song.item) {
        return NextResponse.json({
          isPlaying: true,
          title: song.item.name,
          artist: song.item.artists.map((_artist: any) => _artist.name).join(', '),
          album: song.item.album.name,
          albumImageUrl: song.item.album.images[0].url,
          songUrl: song.item.external_urls.spotify,
          lastPlayed: null // Null karena sedang main
        });
      }
    }

    // 2. Kalau GAK main (Offline), ambil data History
    const recentResponse = await getRecentlyPlayed();
    const recentData = await recentResponse.json();

    if (recentData.items && recentData.items.length > 0) {
      const track = recentData.items[0].track;
      const playedAt = recentData.items[0].played_at; // Waktu terakhir didengar

      // 👇 INI LOGIKA MENGHITUNG WAKTU MUNDUR
      const now = new Date();
      const playedDate = new Date(playedAt);
      const diffInSeconds = Math.floor((now.getTime() - playedDate.getTime()) / 1000);
      
      let timeAgo = "";
      if (diffInSeconds < 60) timeAgo = "Just now";
      else if (diffInSeconds < 3600) timeAgo = `${Math.floor(diffInSeconds / 60)} mins ago`;
      else if (diffInSeconds < 86400) timeAgo = `${Math.floor(diffInSeconds / 3600)} hours ago`;
      else timeAgo = `${Math.floor(diffInSeconds / 86400)} days ago`;

      return NextResponse.json({
        isPlaying: false,
        title: track.name,
        artist: track.artists.map((_artist: any) => _artist.name).join(', '),
        album: track.album.name,
        albumImageUrl: track.album.images[0].url,
        songUrl: track.external_urls.spotify,
        lastPlayed: timeAgo // <-- Ini teks "3 hours ago" nya
      });
    }

    // Kalau history kosong banget
    return NextResponse.json({ isPlaying: false });

  } catch (error) {
    console.error("Error at spotify route", error);
    return NextResponse.json({ isPlaying: false });
  }
}