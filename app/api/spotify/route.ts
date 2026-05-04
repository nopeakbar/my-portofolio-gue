import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const username = process.env.LASTFM_USERNAME;
    const apiKey = process.env.LASTFM_API_KEY;    
    
    // Memanggil endpoint user.getrecenttracks dengan limit=1
    const endpoint = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'User-Agent': 'PortfolioWidget/1.0', // Header User-Agent diwajibkan oleh Last.fm
        'Accept': 'application/json'
      },
      cache: 'no-store', 
    });

    if (!response.ok) {
      return NextResponse.json({ isPlaying: false });
    }

    const data = await response.json();
    const tracksArray = data?.recenttracks?.track;

    if (!tracksArray || tracksArray.length === 0) {
      return NextResponse.json({ isPlaying: false });
    }

    // Resolusi anomali struktur objek vs array dari Last.fm
    const latestTrack = Array.isArray(tracksArray) ? tracksArray[0] : tracksArray;

    // Evaluasi string "true" pada nested attribute
    const isPlaying = latestTrack['@attr'] && latestTrack['@attr'].nowplaying === 'true';

    // Normalisasi skema properti bersarang (#text)
    const title = latestTrack.name || 'Unknown Track';
    const artist = latestTrack.artist['#text'] || 'Unknown Artist';
    const album = latestTrack.album['#text'] || '';
    const songUrl = latestTrack.url;
    
    // Ekstraksi resolusi gambar tertinggi (indeks ke-3 untuk extralarge)
    const albumImageUrl = latestTrack.image && latestTrack.image.length > 3 ? latestTrack.image[3]['#text'] : '';

    if (isPlaying) {
      return NextResponse.json({
        isPlaying: true,
        title,
        artist,
        album,
        albumImageUrl,
        songUrl,
        lastPlayed: null 
      });
    } else {
      // Kalkulasi waktu mundur untuk lagu historis
      const playedAtUts = latestTrack.date?.uts;
      let timeAgo = "A while ago";

      if (playedAtUts) {
        const nowInSeconds = Math.floor(Date.now() / 1000);
        const diffInSeconds = nowInSeconds - parseInt(playedAtUts, 10);

        if (diffInSeconds < 60) timeAgo = "Just now";
        else if (diffInSeconds < 3600) timeAgo = `${Math.floor(diffInSeconds / 60)} mins ago`;
        else if (diffInSeconds < 86400) timeAgo = `${Math.floor(diffInSeconds / 3600)} hours ago`;
        else timeAgo = `${Math.floor(diffInSeconds / 86400)} days ago`;
      }

      return NextResponse.json({
        isPlaying: false,
        title,
        artist,
        album,
        albumImageUrl,
        songUrl,
        lastPlayed: timeAgo
      });
    }

  } catch (error) {
    console.error("Error at Last.fm route:", error);
    return NextResponse.json({ isPlaying: false });
  }
}