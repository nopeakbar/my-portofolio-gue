import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Header cerdas untuk mendelegasikan beban ke CDN Vercel
const smartCacheHeaders = {
  headers: {
    // Vercel akan menahan cache selama 15 detik. Ribuan request dalam 15 detik ini 
    // akan disajikan dari cache Vercel, tanpa menyentuh Last.fm API sama sekali.
    'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=59',
  },
};

export async function GET() {
  try {
    const username = process.env.LASTFM_USERNAME;
    const apiKey = process.env.LASTFM_API_KEY;    
    
    // Tambahan parameter &extended=1 untuk mendeteksi Loved Track
    const endpoint = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1&extended=1`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'User-Agent': 'PortfolioWidget/1.0',
        'Accept': 'application/json'
      },
      // Hapus cache: 'no-store' agar fetch internal Next.js menghormati CDN
    });

    if (!response.ok) {
      return NextResponse.json({ isPlaying: false }, smartCacheHeaders);
    }

    const data = await response.json();
    const tracksArray = data?.recenttracks?.track;
    
    // Total keseluruhan lagu yang pernah diputar seumur hidup
    const totalScrobbles = data?.recenttracks?.['@attr']?.total || '0';

    if (!tracksArray || tracksArray.length === 0) {
      return NextResponse.json({ isPlaying: false, totalScrobbles }, smartCacheHeaders);
    }

    const latestTrack = Array.isArray(tracksArray) ? tracksArray[0] : tracksArray;
    
    // Evaluasi anomali string "true" dan properti extended (loved track)
    const isPlaying = latestTrack['@attr'] && latestTrack['@attr'].nowplaying === 'true';
    const isLoved = latestTrack.loved === '1';

    const title = latestTrack.name || 'Unknown Track';
    const artist = latestTrack.artist['name'] || latestTrack.artist['#text'] || 'Unknown Artist';
    const album = latestTrack.album['#text'] || '';
    const songUrl = latestTrack.url;
    const albumImageUrl = latestTrack.image && latestTrack.image.length > 3 ? latestTrack.image[3]['#text'] : '';

    if (isPlaying) {
      return NextResponse.json({
        isPlaying: true,
        title,
        artist,
        album,
        albumImageUrl,
        songUrl,
        isLoved,
        totalScrobbles,
        lastPlayed: null 
      }, smartCacheHeaders);
    } else {
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
        isLoved,
        totalScrobbles,
        lastPlayed: timeAgo
      }, smartCacheHeaders);
    }

  } catch (error) {
    console.error("Error at Last.fm route:", error);
    return NextResponse.json({ isPlaying: false }, smartCacheHeaders);
  }
}