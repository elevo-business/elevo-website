#!/usr/bin/env python3
"""Anonymisiert die Referenz-Magazine fuer den oeffentlichen Showcase auf elevo.solutions.

Ersetzt die personenbezogenen Ansprechpartner-/Empfaenger-Daten durch neutrale
Platzhalter ([Name], [Ansprechpartner], [Telefon], [E-Mail], [Firmenname], [Gruender]),
behaelt aber Layout, Farben und Marken-Identitaet der Magazine bei.

Quelle: Upload-Ordner (Originale).  Ziel: public/ (anonymisierte Versionen).
"""
import fitz  # PyMuPDF
from collections import Counter

SRC = "/root/.claude/uploads/362160af-bc50-5b51-bf9a-5e2313573fb2"
HEKO_IN = f"{SRC}/c6c77d39-HEKO_Voice_Magazin_DRUCKFERTIG.pdf"
GC_IN = f"{SRC}/f0305aa9-Greenchild_Info_Magazin.pdf"
HEKO_OUT = "public/magazine/heko-voice-magazin.pdf"
GC_OUT = "public/magazine/greenchild-info-magazin.pdf"

# Globale Ersetzungen (ueber das gesamte Dokument gesucht).
HEKO_REPLACEMENTS = [
    ("Mert Efe Celik", "[Ansprechpartner]"),
    ("Müller Elektrotechnik", "[Firmenname]"),
    ("m.celik@heko-bs.de", "[E-Mail]"),
    ("info@heko-bs.de", "[E-Mail]"),
    ("02451 / 48200-24", "[Telefon]"),
    ("HERR MÜLLER", "[NAME]"),
    ("Herr Müller", "[Name]"),
]
GC_REPLACEMENTS = [
    ("Nazim Azemi", "[Name]"),
]


def map_font(font: str) -> str:
    """Mappt die eingebetteten Liberation-Fonts auf PDF-Base-14-Aequivalente."""
    serif = "Serif" in font
    bold = "Bold" in font
    italic = "Italic" in font or "Oblique" in font
    if serif:
        if bold and italic:
            return "tibi"
        if bold:
            return "tibo"
        if italic:
            return "tiit"
        return "tiro"
    if bold and italic:
        return "hebi"
    if bold:
        return "hebo"
    if italic:
        return "heit"
    return "helv"


def int_to_rgb01(c: int):
    return ((c >> 16 & 255) / 255, (c >> 8 & 255) / 255, (c & 255) / 255)


def sample_bg(pix, rect, zoom):
    """Liest die Hintergrundfarbe aus schmalen Baendern ueber/unter dem Text-Rect."""
    cnt = Counter()
    xs = [rect.x0 + (rect.width) * f for f in (0.1, 0.35, 0.6, 0.85)]
    bands = [rect.y0 - 3, rect.y0 - 2, rect.y1 + 2, rect.y1 + 3]
    for y in bands:
        for x in xs:
            px = int(x * zoom)
            py = int(y * zoom)
            if 0 <= px < pix.width and 0 <= py < pix.height:
                cnt[pix.pixel(px, py)] += 1
    if not cnt:
        return (1, 1, 1)
    r, g, b = cnt.most_common(1)[0][0][:3]
    return (r / 255, g / 255, b / 255)


def anonymize(src_path, out_path, replacements):
    doc = fitz.open(src_path)
    zoom = 2.0
    mat = fitz.Matrix(zoom, zoom)
    total_hits = 0
    for page in doc:
        pix = page.get_pixmap(matrix=mat, alpha=False)
        page_hits = []
        for needle, repl in replacements:
            for rect in page.search_for(needle):
                # Original-Farbe/-Groesse/-Font exakt an dieser Stelle ermitteln.
                dd = page.get_text("dict", clip=rect)
                spans = [sp for blk in dd["blocks"] for ln in blk.get("lines", []) for sp in ln["spans"]]
                if spans:
                    sp = max(spans, key=lambda s: len(s["text"]))
                    color = int_to_rgb01(sp["color"])
                    size = sp["size"]
                    font = map_font(sp["font"])
                else:
                    color = (0, 0, 0)
                    size = max(6.0, rect.height / 1.3)
                    font = "helv"
                bg = sample_bg(pix, rect, zoom)
                # Etwas kleinere Schrift, damit der Platzhalter sicher ins Rect passt.
                fs = max(5.0, size * 0.92)
                page.add_redact_annot(rect, text=repl, fontname=font, fontsize=fs,
                                      align=0, fill=bg, text_color=color, cross_out=False)
                page_hits.append((needle, repl))
        if page_hits:
            # Bilder NICHT entfernen — nur die Fill-Flaeche ueber den Text legen.
            page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
            total_hits += len(page_hits)
            print(f"  Seite {page.number + 1}: " + ", ".join(f"{n}→{r}" for n, r in page_hits))
    doc.save(out_path, garbage=4, deflate=True)
    doc.close()
    print(f"  → gespeichert: {out_path} ({total_hits} Ersetzungen)\n")


if __name__ == "__main__":
    import os
    os.makedirs("public/magazine", exist_ok=True)
    print("HEKO Voice Magazin:")
    anonymize(HEKO_IN, HEKO_OUT, HEKO_REPLACEMENTS)
    print("Greenchild Info-Magazin:")
    anonymize(GC_IN, GC_OUT, GC_REPLACEMENTS)
    print("Fertig.")
