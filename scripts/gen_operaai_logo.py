#!/usr/bin/env python3
"""Generate an OperaAI client logo PNG using the favicon SVG as icon reference."""

from PIL import Image, ImageDraw, ImageFont
import subprocess
import os
import math

# Work at 3x scale for crisp rendering, then downsample
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
    "client-7.png",
)

FAVICON_SVG = os.path.join(
    os.path.dirname(__file__),
    "..",
    "public",
    "assets",
    "img",
    "clients",
    "operaai-favicon.svg",
)

# --- Step 1: Render the favicon SVG to a high-res PNG icon ---
ICON_SIZE = 105 * SCALE  # icon size at 3x
icon_png_path = "/tmp/operaai-icon-tmp.png"
subprocess.run(
    ["rsvg-convert", "-w", str(ICON_SIZE), "-h", str(ICON_SIZE), FAVICON_SVG, "-o", icon_png_path],
    check=True,
)
icon_img = Image.open(icon_png_path).convert("RGBA")

# --- Step 2: Create the full logo canvas ---
img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Colors
PURPLE = (124, 58, 237)
DARK = (30, 30, 30)

# Paste the favicon icon on the left, vertically centered
icon_x = 10 * SCALE
icon_y = (HEIGHT - ICON_SIZE) // 2
img.paste(icon_img, (icon_x, icon_y), icon_img)

# --- Step 3: Draw "OperaAI" text (DIN Alternate Bold — geometric, tech) ---
FONT_SIZE = 58 * SCALE
try:
    text_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/DIN Alternate Bold.ttf", FONT_SIZE)
except OSError:
    try:
        text_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", FONT_SIZE)
    except OSError:
        text_font = ImageFont.load_default()

text_x = icon_x + ICON_SIZE + 18 * SCALE
text_bbox = draw.textbbox((0, 0), "OperaAI", font=text_font)
text_h = text_bbox[3] - text_bbox[1]
text_y = (HEIGHT - text_h) // 2 - 4 * SCALE

# "Opera" in dark, "AI" in purple
draw.text((text_x, text_y), "Opera", fill=DARK, font=text_font)
opera_bbox = draw.textbbox((text_x, text_y), "Opera", font=text_font)
draw.text((opera_bbox[2] + 2 * SCALE, text_y), "AI", fill=PURPLE, font=text_font)

# --- Step 4: Downsample with high-quality antialiasing ---
img = img.resize((FINAL_W, FINAL_H), Image.LANCZOS)

# Save
os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
img.save(OUTPUT, "PNG")
print(f"Saved to {os.path.abspath(OUTPUT)}")

# Cleanup
os.remove(icon_png_path)
