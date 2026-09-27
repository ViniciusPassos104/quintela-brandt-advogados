"""Gera as fontes do site a partir dos pacotes @fontsource-variable.

Mantém apenas o subconjunto latino (português completo, pontuação tipográfica,
§ º ª) e restringe os eixos variáveis ao intervalo realmente usado no CSS.
Uso: python scripts/build-fonts.py
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "node_modules" / "@fontsource-variable"
OUT = ROOT / "public" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

UNICODES = "U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2010-2014,U+2018-201E,U+2022,U+2026,U+2039-203A,U+20AC,U+2122,U+2190-2193,U+2212"

# Títulos usam cortes estáticos no tamanho óptico de display (72); o texto
# corrido em serifa usa o corte de texto (opsz 16) com peso variável.
JOBS = [
    ("newsreader/files/newsreader-latin-opsz-normal.woff2", "newsreader-display.woff2", {"opsz": 72, "wght": 360}),
    ("newsreader/files/newsreader-latin-opsz-italic.woff2", "newsreader-display-italic.woff2", {"opsz": 72, "wght": 340}),
    ("newsreader/files/newsreader-latin-opsz-normal.woff2", "newsreader-text.woff2", {"opsz": 16, "wght": (400, 600)}),
    ("newsreader/files/newsreader-latin-opsz-italic.woff2", "newsreader-text-italic.woff2", {"opsz": 16, "wght": 420}),
    ("hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2", "hanken-grotesk.woff2", {"wght": (400, 650)}),
]

for src, dst, axes in JOBS:
    font = TTFont(SRC / src)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "liga", "calt", "onum", "lnum", "tnum", "pnum", "case", "ss01", "ccmp", "mark", "mkmk"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=subset.parse_unicodes(UNICODES))
    sub.subset(font)
    font = instancer.instantiateVariableFont(font, axes)
    out = OUT / dst
    font.flavor = "woff2"
    font.save(out)
    print(f"{dst}: {out.stat().st_size/1024:.1f} KB  axes={axes}")
