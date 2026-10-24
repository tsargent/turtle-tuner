# Prototype dark-mode layers, generated from the day artwork: darken and cool
# the painted fills, keep the "backlit" display window lit, and turn the black
# lettering light. Painted night layers can replace these files later.
#
#   python3 -m pip install pillow numpy
#   python3 scripts/make-night-layers.py
import json, os
import numpy as np
from PIL import Image
P = os.path.join(os.path.dirname(__file__), '..', 'assets', 'tuner')
OUT = os.path.join(P, 'night')
os.makedirs(OUT, exist_ok=True)
m = json.load(open(f'{P}/manifest.json'))
DIM = np.array([0.42, 0.48, 0.62])   # per-channel multiply: darker and cooler
def night(rgb):
    return rgb * DIM
def load(key):
    return np.array(Image.open(f'{P}/{key}.png').convert('RGBA')).astype(float)
def save(key, a):
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(f'{OUT}/{key}.png', optimize=True)

# Body, bezel, mics: everything dims.
a = load('top'); a[:, :, :3] = night(a[:, :, :3]); save('top', a)

# Control panel: dims, except the display window (the yellow grid) stays lit.
a = load('bottom'); r = m['bottom']
h, w = a.shape[:2]
ys, xs = np.mgrid[0:h, 0:w]
dx = r['x'] + xs * r['width'] / w; dy = r['y'] + ys * r['height'] / h   # design units
window = (dx > 108) & (dx < 306) & (dy > 694) & (dy < 846)
rgb = a[:, :, :3]
a[:, :, :3] = np.where(window[..., None], rgb, night(rgb))
# The window's yellow is the page background showing through transparent grid
# cells; at night there's no yellow page, so paint the backlight in.
lit = np.array([242, 243, 104]); alpha = a[:, :, 3:4] / 255
filled = a[:, :, :3] * alpha + lit * (1 - alpha)
a[:, :, :3] = np.where(window[..., None], filled, a[:, :, :3]); a[:, :, 3] = np.where(window, 255, a[:, :, 3])
save('bottom', a)

# Wordmark: black ink becomes warm light ink.
a = load('name'); a[:, :, :3] = np.array([236, 232, 200]); save('name', a)

# Heads: a lighter dim, so the turtle reads in front of the lit window.
for key in ['headSleep', 'headWake', 'headLeft', 'headRight', 'headUp', 'headHappy']:
    a = load(key); a[:, :, :3] = a[:, :, :3] * np.array([0.82, 0.85, 0.92]); save(key, a)
