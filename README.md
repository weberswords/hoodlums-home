# hoodlums-home

Internet shingle for **The Intelligent Hoodlums** — Las Vegas, Est 2014.

Single page. Static HTML/CSS. Deploys to Vercel.

## Structure

```
index.html         single-page site
styles.css         all styles (tokens from brand kit)
fonts/             Avocado Sans Bold / Regular / Thin (self-hosted)
assets/            badge, favicon, wordmark strip
vercel.json        static config (clean URLs + font caching)
brand-kit/         full design system (see its README.md)
tih-site-prototype.html   design reference
```

## Dev

Any static server. For example:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Connect the repo to Vercel. No build step — Vercel serves `index.html` at root.

---

*When in doubt, trust a Hoodlum.*
