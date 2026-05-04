import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const smartCacheHeaders = {
  headers: {
    'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=59',
  },
};

export async function GET() {
  try {
    const username = process.env.LASTFM_USERNAME;
    const apiKey = process.env.LASTFM_API_KEY;    
    
    // 1. Endpoint Recent Tracks
    const recentEndpoint = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1&extended=1`;
    // 2. Endpoint Top Tracks (1 month, limit 5)
    const topTracksEndpoint = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${apiKey}&format=json&period=1month&limit=5`;
    // 3. Endpoint Top Artists (1 month, limit 5)
    const topArtistsEndpoint = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${apiKey}&format=json&period=1month&limit=5`;

    // Fetch semua data secara paralel agar tetap ngebut
    const [recentRes, topTracksRes, topArtistsRes] = await Promise.all([
      fetch(recentEndpoint, { headers: { 'User-Agent': 'PortfolioWidget/1.0', 'Accept': 'application/json' } }),
      fetch(topTracksEndpoint, { headers: { 'User-Agent': 'PortfolioWidget/1.0', 'Accept': 'application/json' } }),
      fetch(topArtistsEndpoint, { headers: { 'User-Agent': 'PortfolioWidget/1.0', 'Accept': 'application/json' } })
    ]);

    if (!recentRes.ok) {
      return NextResponse.json({ isPlaying: false }, smartCacheHeaders);
    }

    const data = await recentRes.json();
    const topTracksData = await topTracksRes.json();
    const topArtistsData = await topArtistsRes.json();

    const tracksArray = data?.recenttracks?.track;
    const totalScrobbles = data?.recenttracks?.['@attr']?.total || '0';

    // Parsing Top 5 Tracks & Artists
    const topTracks = topTracksData?.toptracks?.track?.map((t: any) => ({
      name: t.name,
      artist: t.artist.name,
      url: t.url,
    })) || [];

    const topArtists = topArtistsData?.topartists?.artist?.map((a: any) => ({
      name: a.name,
      url: a.url,
    })) || [];

    if (!tracksArray || tracksArray.length === 0) {
      return NextResponse.json({ isPlaying: false, totalScrobbles, topTracks, topArtists }, smartCacheHeaders);
    }

    const latestTrack = Array.isArray(tracksArray) ? tracksArray[0] : tracksArray;
    const isPlaying = latestTrack['@attr'] && latestTrack['@attr'].nowplaying === 'true';
    const isLoved = latestTrack.loved === '1';

    const title = latestTrack.name || 'Unknown Track';
    const artist = latestTrack.artist['name'] || latestTrack.artist['#text'] || 'Unknown Artist';
    const album = latestTrack.album['#text'] || '';
    const songUrl = latestTrack.url;
    const albumImageUrl = latestTrack.image && latestTrack.image.length > 3 ? latestTrack.image[3]['#text'] : '';

    if (isPlaying) {
      return NextResponse.json({
        isPlaying: true, title, artist, album, albumImageUrl, songUrl, isLoved, totalScrobbles, lastPlayed: null, topTracks, topArtists
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
        isPlaying: false, title, artist, album, albumImageUrl, songUrl, isLoved, totalScrobbles, lastPlayed: timeAgo, topTracks, topArtists
      }, smartCacheHeaders);
    }

  } catch (error) {
    console.error("Error at Last.fm route:", error);
    return NextResponse.json({ isPlaying: false }, smartCacheHeaders);
  }
}