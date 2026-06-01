#!/usr/bin/env python3
"""
Generate branded Pulse Check QR codes for the Classroom OS event.

Outputs two print-ready PNGs into assets/qr/:
  - pulse-before.png  → /survey?event_date=2026-06-01
  - pulse-after.png   → /survey?phase=after&event_date=2026-06-05

Brand: Ink card, Bone QR, Rufous accent rule, Tuscany kicker, Avocado Sans.
Run:  python3 scripts/make-qr.py
"""

import os
import qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image, ImageDraw, ImageFont

# ── brand tokens ───────────────────────────────────────────
INK     = (15, 20, 25)
PRUSSIAN= (11, 37, 69)
RUFOUS  = (183, 40, 15)
TUSCANY = (224, 164, 88)
BONE    = (242, 232, 213)
CADET   = (140, 163, 181)

ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "fonts")
OUT   = os.path.join(ROOT, "assets", "qr")
BASE  = "https://theintelligenthoodlums.com"

CARDS = [
    {
        "file": "pulse-before.png",
        "kicker": "DAY ONE  /  MONDAY",
        "title": "Start-of-Week\nPulse Check",
        "sub": "2 minutes. Tell us where your\nclassroom stands today.",
        "url": BASE + "/survey?event_date=2026-06-01",
        "caption": "theintelligenthoodlums.com / survey",
    },
    {
        "file": "pulse-after.png",
        "kicker": "DAY FIVE  /  FRIDAY",
        "title": "End-of-Week\nPulse Check",
        "sub": "Same email as Monday.\nTell us what moved.",
        "url": BASE + "/survey?phase=after&event_date=2026-06-05",
        "caption": "theintelligenthoodlums.com / survey",
    },
    {
        "file": "media-release.png",
        "kicker": "BEFORE YOU'RE ON CAMERA",
        "title": "Media\nRelease",
        "sub": "Sign once on your phone.\nGood for the whole week.",
        "url": BASE + "/release?event_date=2026-06-01",
        "caption": "theintelligenthoodlums.com / release",
    },
    {
        "file": "field-guide.png",
        "kicker": "CREW ONLY",
        "title": "Vlog\nField Guide",
        "sub": "The capture playbook.\nShoot to the pitch.",
        "url": BASE + "/vlog",
        "caption": "theintelligenthoodlums.com / vlog",
    },
]

# ── canvas geometry (print-friendly, ~1080x1500) ───────────
W, H   = 1080, 1500
MARGIN = 72
QR_PX  = 760


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def center(draw, text, fnt, y, fill, w=W, x0=0, spacing=10):
    """Draw text (supports \\n) horizontally centered within [x0, x0+w]."""
    for line in text.split("\n"):
        bbox = draw.textbbox((0, 0), line, font=fnt)
        tw = bbox[2] - bbox[0]
        draw.text((x0 + (w - tw) / 2, y), line, font=fnt, fill=fill)
        y += (bbox[3] - bbox[1]) + spacing
    return y


def make_qr(url):
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=10, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color=INK, back_color=BONE).convert("RGB")
    return img.resize((QR_PX, QR_PX), Image.NEAREST)


def build(card):
    canvas = Image.new("RGB", (W, H), INK)
    d = ImageDraw.Draw(canvas)

    # outer hairline frame
    d.rectangle([18, 18, W - 18, H - 18], outline=PRUSSIAN, width=3)

    f_brand  = font("AvocadoSans-Bold.otf", 30)
    f_kicker = font("AvocadoSans-Bold.otf", 30)
    f_title  = font("AvocadoSans-Bold.otf", 78)
    f_sub    = font("AvocadoSans-Regular.otf", 34)
    f_url    = font("AvocadoSans-Thin.otf", 24)
    f_foot   = font("AvocadoSans-Bold.otf", 24)

    y = 70
    center(d, "THE INTELLIGENT HOODLUMS", f_brand, y, BONE)
    y += 64
    center(d, card["kicker"], f_kicker, y, TUSCANY)
    y += 60

    # rufous rule
    d.rectangle([(W - 90) / 2, y, (W + 90) / 2, y + 6], fill=RUFOUS)
    y += 46

    y = center(d, card["title"], f_title, y, BONE, spacing=14)
    y += 14
    y = center(d, card["sub"], f_sub, y, CADET, spacing=12)
    y += 30

    # QR on a bone tile with quiet zone
    qr = make_qr(card["url"])
    tile = QR_PX + 56
    tx = (W - tile) // 2
    d.rectangle([tx, y, tx + tile, y + tile], fill=BONE)
    canvas.paste(qr, (tx + 28, y + 28))
    y += tile + 34

    # decorative caption only — Avocado Sans omits ? = & glyphs, so the live
    # URL (with its query string) is encoded in the QR, not printed here.
    center(d, card["caption"], f_url, y, CADET)

    # footer tagline
    center(d, "WHEN IN DOUBT, TRUST A HOODLUM.", f_foot, H - 84, RUFOUS)

    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, card["file"])
    canvas.save(path, "PNG")
    return path


if __name__ == "__main__":
    for c in CARDS:
        print("wrote", build(c))
