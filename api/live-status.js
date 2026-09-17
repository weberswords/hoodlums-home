// Serverless live-status probe for the events page stream box.
//
// The page does not load the OneStream embed until it knows we are live: when
// nothing is streaming, that embed returns a raw JSON/offline payload and the
// browser renders its own "Pretty-print" viewer inside the frame. This function
// checks the embed server-side (no CORS, no API keys) and reports whether the
// player is live, so the page can auto-flip from the off-air poster to the
// player on its own.
//
// It fails safe: any error, timeout, or ambiguous response returns live:false,
// so the worst case is the poster staying up (never the raw JSON box). Add
// ?debug=1 to see the raw signal (content-type + a short snippet) for
// recalibrating the heuristic against a real live run.

// The OneStream embed the events page uses. Kept here (not read from the page)
// so the probe is self-contained; update both if the token ever changes.
const EMBED_URL = 'https://player.onestream.live/embed?token=OTc2OTM=&type=up';
const TIMEOUT_MS = 6000;

// Markers that only appear in a real player document (HLS source, the video
// element, the player runtime), not in the offline JSON payload.
const PLAYER_MARKERS = /\.m3u8|hls|jwplayer|videojs|<video|playerconfig|"islive"\s*:\s*true|"status"\s*:\s*"(live|online|streaming)"/i;

function decideLive(contentType, body) {
  const ct = (contentType || '').toLowerCase();
  const text = (body || '').slice(0, 20000);
  const trimmed = text.trim();
  const looksJson = ct.includes('application/json') || trimmed.startsWith('{') || trimmed.startsWith('[');

  // If it is JSON, it is the offline/status payload. Parse it and only call it
  // live on an explicit truthy live/online field; default to offline.
  if (looksJson) {
    try {
      const data = JSON.parse(trimmed);
      const flag = data.live ?? data.isLive ?? data.online ?? data.streaming;
      if (flag === true) return true;
      const status = String(data.status || data.state || '').toLowerCase();
      if (status === 'live' || status === 'online' || status === 'streaming') return true;
    } catch {
      /* fall through to marker check */
    }
    if (PLAYER_MARKERS.test(text)) return true;
    return false;
  }

  // Otherwise it is the HTML player document — live only if it actually carries
  // player/stream markup (an empty or error HTML page should not count).
  if (ct.includes('text/html') || trimmed.startsWith('<')) {
    return PLAYER_MARKERS.test(text);
  }
  return false;
}

module.exports = async (req, res) => {
  const debug = req.query && (req.query.debug === '1' || req.query.debug === 'true');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let live = false;
  let contentType = '';
  let snippet = '';
  let error = null;

  try {
    const r = await fetch(EMBED_URL, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HoodlumsLiveProbe/1.0)' },
    });
    contentType = r.headers.get('content-type') || '';
    const body = await r.text();
    snippet = body.slice(0, 300);
    live = r.ok && decideLive(contentType, body);
  } catch (e) {
    error = e.name === 'AbortError' ? 'timeout' : 'fetch_failed';
  } finally {
    clearTimeout(timer);
  }

  // Edge-cache briefly so a burst of visitors does not hammer the embed, while
  // still flipping within about half a minute of going live.
  res.setHeader('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=40');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const payload = { live, checkedAt: new Date().toISOString() };
  if (error) payload.error = error;
  if (debug) payload.debug = { contentType, snippet };

  res.status(200).send(JSON.stringify(payload));
};
