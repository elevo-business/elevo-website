#!/usr/bin/env python3
"""Ersetzt die Ansprechpartner-Portraitfotos in den Referenz-Magazinen durch
einen neutralen Avatar (kein reales Gesicht mehr — DSGVO/Showcase)."""
import fitz, io
from collections import Counter
from PIL import Image, ImageDraw

TARGETS = [
    # (pfad, seiten-index, portrait-bbox, ring-farbe)
    ("public/magazine/heko-voice-magazin.pdf", 9, (71, 162, 173, 264), (0, 159, 227)),   # HEKO-Blau
    ("public/magazine/greenchild-info-magazin.pdf", 1, (65, 403, 111, 448), (22, 163, 74)),  # Greenchild-Grün
]


def avatar_png(size, ring_rgb):
    S = 600
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = 8
    # Disc
    d.ellipse([pad, pad, S - pad, S - pad], fill=(228, 229, 231, 255))
    # Person (head + shoulders) — wird gleich per Maske auf den Kreis beschnitten
    cx = S / 2
    d.ellipse([cx - 96, 150, cx + 96, 342], fill=(160, 167, 176, 255))          # Kopf
    d.ellipse([cx - 190, 380, cx + 190, 720], fill=(160, 167, 176, 255))        # Schultern
    # Kreis-Maske (nichts außerhalb des Discs sichtbar)
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).ellipse([pad, pad, S - pad, S - pad], fill=255)
    img.putalpha(mask)
    # Ring
    d2 = ImageDraw.Draw(img)
    d2.ellipse([pad, pad, S - pad, S - pad], outline=ring_rgb + (255,), width=10)
    buf = io.BytesIO(); img.resize((size, size), Image.LANCZOS).save(buf, "PNG")
    return buf.getvalue()


def sample_bg(page, rect):
    pm = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    cnt = Counter()
    for (px, py) in [(rect[0] - 6, rect[1] + 4), (rect[0] - 6, (rect[1] + rect[3]) / 2),
                     (rect[2] + 6, rect[1] + 4), ((rect[0] + rect[2]) / 2, rect[1] - 6)]:
        x, y = int(px * 2), int(py * 2)
        if 0 <= x < pm.width and 0 <= y < pm.height:
            cnt[pm.pixel(x, y)] += 1
    if not cnt:
        return (1, 1, 1)
    r, g, b = cnt.most_common(1)[0][0][:3]
    return (r / 255, g / 255, b / 255)


for path, pi, bbox, ring in TARGETS:
    doc = fitz.open(path)
    page = doc[pi]
    rect = fitz.Rect(*bbox)
    bg = sample_bg(page, bbox)
    # Portraitfoto entfernen + Hintergrund füllen
    page.add_redact_annot(rect, fill=bg)
    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_REMOVE)
    # Avatar einsetzen
    px = max(120, int((bbox[2] - bbox[0]) * 3))
    page.insert_image(rect, stream=avatar_png(px, ring))
    doc.saveIncr() if False else doc.save(path, incremental=True, encryption=fitz.PDF_ENCRYPT_KEEP)
    doc.close()
    print(f"Avatar gesetzt: {path} (Seite {pi + 1})")
print("Fertig.")
