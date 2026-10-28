"""Creates static font instances for the PDF lead magnet (Chromium embeds variable fonts at their
thinnest default instance). Run once: python3 scripts/make-pdf-fonts.py  (needs: pip install fonttools brotli)"""
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
import os
base = "node_modules/@fontsource-variable/"
os.makedirs("scripts/.fonts", exist_ok=True)
jobs = [("newsreader/files/newsreader-%s-opsz-normal.woff2", {"wght": 400, "opsz": 24}, "N-400"),
        ("newsreader/files/newsreader-%s-opsz-italic.woff2", {"wght": 400, "opsz": 24}, "N-400i"),
        ("manrope/files/manrope-%s-wght-normal.woff2", {"wght": 450}, "M-400"),
        ("manrope/files/manrope-%s-wght-normal.woff2", {"wght": 650}, "M-600")]
for pat, axes, name in jobs:
    for sub in ["latin", "latin-ext"]:
        f = TTFont(base + pat % sub)
        present = {a.axisTag for a in f["fvar"].axes}
        inst = instancer.instantiateVariableFont(f, {k: v for k, v in axes.items() if k in present})
        inst.flavor = None
        inst.save(f"scripts/.fonts/{name}-{sub}.ttf")
print("fonts ready")
