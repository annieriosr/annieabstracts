#!/usr/bin/env python3
"""Make display-sized WebP next to originals. Never overwrites source files."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
IMAGES = ROOT / "images"
DISPLAY = IMAGES / "display"
STRIP = IMAGES / "slide" / "strip"
DATA = json.loads((ROOT / "data" / "site.json").read_text(encoding="utf-8"))

ART_MAX = 1600
STRIP_H = 560


def save_webp(im: Image.Image, dest: Path, quality=78):
    dest.parent.mkdir(parents=True, exist_ok=True)
    rgb = im.convert("RGB")
    rgb.save(dest, "WEBP", quality=quality, method=4)


def fit_max(im: Image.Image, max_edge: int) -> Image.Image:
    w, h = im.size
    if max(w, h) <= max_edge:
        return im
    scale = max_edge / max(w, h)
    return im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.Resampling.LANCZOS)


def fit_height(im: Image.Image, height: int) -> Image.Image:
    w, h = im.size
    if h <= height:
        return im
    return im.resize((max(1, round(w * height / h)), height), Image.Resampling.LANCZOS)


def open_image(path: Path) -> Image.Image:
    im = Image.open(path)
    im.load()
    return im


def display_name(src: Path) -> str:
    return f"{src.stem}-w{ART_MAX}.webp"


def main():
    sources = []
    for work in DATA["works"]:
        sources.append(ROOT / work["image"].lstrip("/"))
        for detail in work.get("details") or []:
            sources.append(ROOT / detail.lstrip("/"))
    sources.append(IMAGES / "1234.JPG")
    for alias in ("cost-of-love.jpg", "be-the-light.jpg", "red-thread.jpg"):
        sources.append(IMAGES / alias)

    written = 0
    for src in sources:
        if not src.exists() or not src.is_file():
            print("skip missing", src.relative_to(ROOT))
            continue
        dest = DISPLAY / display_name(src)
        if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
            continue
        with open_image(src) as im:
            save_webp(fit_max(im, ART_MAX), dest)
        written += 1
        print("display", dest.relative_to(ROOT), dest.stat().st_size)

    for src in sorted((IMAGES / "slide").glob("IMG_*.jpg")):
        dest = STRIP / f"{src.stem}.webp"
        if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
            continue
        with open_image(src) as im:
            save_webp(fit_height(im, STRIP_H), dest, quality=72)
        written += 1
        print("strip", dest.relative_to(ROOT), dest.stat().st_size)

    print("wrote", written, "files")


if __name__ == "__main__":
    main()
