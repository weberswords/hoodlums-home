#!/bin/sh
# Renders scripts/og-card.html to assets/HM-og-v2.png at 1200x630.
# Needs a Chromium build; set CHROME to its path if it isn't the Playwright one.
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-$HOME/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell}"
"$CHROME" --headless --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --window-size=1200,630 --screenshot="$PWD/assets/HM-og-v2.png" "file://$PWD/scripts/og-card.html"
