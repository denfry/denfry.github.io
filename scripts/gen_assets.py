"""Generate raster favicon + OpenGraph image into ../public.
Run from anywhere: python scripts/gen_assets.py
Requires Pillow (pip install Pillow). Fails loudly if fonts/lib missing."""
import os
from PIL import Image, ImageDraw, ImageFont

ACCENT = (194, 73, 45)    # #C2492D
CREAM = (244, 241, 234)   # #F4F1EA
INK = (17, 17, 17)        # #111111
MUTED = (91, 85, 74)      # #5b554a

FONT_DIR = r"C:\Windows\Fonts"


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def icon(size: int, path: str) -> None:
    img = Image.new("RGB", (size, size), ACCENT)
    d = ImageDraw.Draw(img)
    f = font("arialbd.ttf", int(size * 0.66))
    bbox = d.textbbox((0, 0), "D", font=f)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - w) / 2 - bbox[0], (size - h) / 2 - bbox[1]), "D", font=f, fill=CREAM)
    img.save(path)


def og(path: str) -> None:
    W, H = 1200, 630
    m = 90
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)
    d.text((m, 150), "DENFRY", font=font("arialbd.ttf", 150), fill=INK)
    d.rectangle([m, 350, m + 120, 358], fill=ACCENT)
    d.text((m, 392), "Java developer — Minecraft servers & AI dev-tools",
           font=font("arial.ttf", 40), fill=INK)
    d.text((m, H - m - 30), "denfry.github.io", font=font("arial.ttf", 30), fill=MUTED)
    img.save(path)


def main() -> None:
    out = os.path.join(os.path.dirname(__file__), "..", "public")
    icon(32, os.path.join(out, "favicon-32.png"))
    icon(180, os.path.join(out, "apple-touch-icon.png"))
    og(os.path.join(out, "og.png"))
    print("assets written to", os.path.abspath(out))


if __name__ == "__main__":
    main()
