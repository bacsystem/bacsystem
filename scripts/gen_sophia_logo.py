#!/usr/bin/env python3
"""Generate a sophIA client logo PNG."""

from PIL import Image, ImageDraw, ImageFont
import subprocess
import os

SCALE = 3
FINAL_W, FINAL_H = 400, 125
WIDTH, HEIGHT = FINAL_W * SCALE, FINAL_H * SCALE
OUTPUT = os.path.join(
    os.path.dirname(__file__),
    "..",
    "public",
    "assets",
    "img",
    "clients",
    "client-8.png",
)

FAVICON_SVG = os.path.join(
    os.path.dirname(__file__),
    "..",
    "public",
    "assets",
    "img",
    "clients",
    "sophia-favicon.svg",
)

# --- Step 1: Render the favicon SVG to a high-res PNG icon ---
ICON_SIZE = 105 * SCALE
icon_png_path = "/tmp/sophia-icon-tmp.png"
subprocess.run(
    ["rsvg-convert", "-w", str(ICON_SIZE), "-h", str(ICON_SIZE), FAVICON_SVG, "-o", icon_png_path],
    check=True,
)
icon_img = Image.open(icon_png_path).convert("RGBA")

# --- Step 2: Create the full logo canvas ---
img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Colors
CYAN = (14, 165, 233)
DARK = (30, 30, 30)

# Paste the favicon icon on the left, vertically centered
icon_x = 10 * SCALE
icon_y = (HEIGHT - ICON_SIZE) // 2
img.paste(icon_img, (icon_x, icon_y), icon_img)

# --- Step 3: Draw "sophIA" text (Avenir Next Bold — elegant, humanist) ---
FONT_SIZE = 58 * SCALE
try:
    text_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Avenir Next.ttc", FONT_SIZE, index=0)
except OSError:
    try:
        text_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", FONT_SIZE)
    except OSError:
        text_font = ImageFont.load_default()

text_x = icon_x + ICON_SIZE + 18 * SCALE
text_bbox = draw.textbbox((0, 0), "sophIA", font=text_font)
text_h = text_bbox[3] - text_bbox[1]
text_y = (HEIGHT - text_h) // 2 - 4 * SCALE

# "soph" in dark, "IA" in cyan
draw.text((text_x, text_y), "soph", fill=DARK, font=text_font)
soph_bbox = draw.textbbox((text_x, text_y), "soph", font=text_font)
draw.text((soph_bbox[2] + 2 * SCALE, text_y), "IA", fill=CYAN, font=text_font)

# --- Step 4: Downsample with high-quality antialiasing ---
img = img.resize((FINAL_W, FINAL_H), Image.LANCZOS)

# Save
os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
img.save(OUTPUT, "PNG")
print(f"Saved to {os.path.abspath(OUTPUT)}")

# Cleanup
os.remove(icon_png_path)
