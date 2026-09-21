"""Desktop and mobile screenshots plus basic content checks. Run with a local server on :8080."""

from __future__ import annotations

from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "_verify"
OUT.mkdir(exist_ok=True)

PAGES = [
    ("/", "home"),
    ("/work/", "work"),
    ("/about/", "about"),
    ("/itinerary/", "itinerary"),
    ("/inquire/", "inquire"),
    ("/showmeafeeling/", "showmeafeeling"),
    ("/thisisabstraction/", "thisisabstraction"),
    ("/threeelementsofarefraction/", "refraction"),
    ("/aqui-donde-la-luz-nos-halla/", "show"),
    ("/journal/", "journal"),
    ("/studio/", "studio"),
]

MUST_CONTAIN = {
    "/": ["Past", "Now", "Future"],
    "/work/": ["Cost of Love", "This is Abstraction"],
    "/about/": ["chromatic flattening", "synergy between beauty and the fractured"],
    "/itinerary/": ["Habitante", "BoConcept", "Show me a Feeling"],
    "/inquire/": ["annieabstracts@gmail.com", "WhatsApp"],
    "/showmeafeeling/": ["Red Thread", "Casa Amarilla", "Final del Verano", "Blue Mosaics"],
    "/thisisabstraction/": ["De Donde Venimos", "Sailing Spirit"],
    "/threeelementsofarefraction/": ["Cost of Love", "Be the Light", "intimate spaces"],
    "/aqui-donde-la-luz-nos-halla/": ["Museo de Arte Decorativo"],
    "/journal/": ["Journal"],
    "/studio/": ["The Journey of Craft"],
}


def launch(p):
    try:
        return p.chromium.launch(channel="chrome", headless=True)
    except Exception:
        return p.chromium.launch(headless=True)


def file_for(src: str) -> Path | None:
    if not src or src.startswith("data:"):
        return None
    path = urlparse(src).path
    if not path.startswith("/"):
        return None
    return ROOT / unquote(path.lstrip("/"))


def missing_files(srcs):
    missing = []
    for src in srcs:
        disk = file_for(src)
        if disk is None:
            continue
        if not disk.exists():
            missing.append(src)
    return missing


def http_ok(url: str) -> bool:
    try:
        req = Request(url, method="HEAD")
        with urlopen(req, timeout=10) as res:
            return 200 <= res.status < 400
    except HTTPError as err:
        return 200 <= err.code < 400
    except (URLError, TimeoutError, OSError):
        try:
            req = Request(url, method="GET")
            with urlopen(req, timeout=20) as res:
                return 200 <= res.status < 400
        except Exception:
            return False


def broken_images(page, base: str):
    srcs = page.evaluate(
        """() => [...document.images]
          .map(i => i.getAttribute('src'))
          .filter(Boolean)"""
    )
    missing = missing_files(srcs)
    http_fail = []
    for src in srcs:
        if src in missing:
            continue
        url = src if src.startswith("http") else urljoin(base, src)
        if " " in url:
            http_fail.append(src)
            continue
        if not http_ok(url):
            http_fail.append(src)
    return missing, http_fail


def missing_alt(page):
    return page.evaluate(
        """() => [...document.querySelectorAll('img:not([alt])')]
          .map(i => i.getAttribute('src'))"""
    )


def overflow_x(page):
    return page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 2")


def broken_internal_links(page, base: str):
    hrefs = page.evaluate(
        """() => [...document.querySelectorAll('a[href]')]
          .map(a => a.getAttribute('href'))
          .filter(h => h && !h.startsWith('#') && !h.startsWith('mailto:') && !h.startsWith('tel:') && !h.startsWith('https://wa.me'))"""
    )
    broken = []
    for href in hrefs:
        if href.startswith("http") and "annieabstracts.com" not in href and "127.0.0.1" not in href:
            continue
        url = href if href.startswith("http") else urljoin(base, href)
        path = urlparse(url).path
        if path.startswith("/"):
            disk = ROOT / unquote(path.lstrip("/"))
            if disk.is_file():
                continue
            if (disk / "index.html").is_file():
                continue
            if path.endswith("/") and (ROOT / unquote(path.strip("/")) / "index.html").is_file():
                continue
        if not http_ok(url):
            broken.append(href)
    return broken


def main():
    problems = []
    with sync_playwright() as p:
        browser = launch(p)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("pageerror", lambda err: problems.append(f"console {err}"))

        for path, name in PAGES:
            base = f"http://127.0.0.1:8080{path}"
            page.goto(base, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(400)
            text = page.inner_text("body")
            for needle in MUST_CONTAIN.get(path, []):
                if needle not in text:
                    problems.append(f"{path} missing text: {needle}")
            missing, http_fail = broken_images(page, base)
            if missing:
                problems.append(f"{path} missing image files: {missing[:8]}")
            if http_fail:
                problems.append(f"{path} image HTTP fail: {http_fail[:8]}")
            alts = missing_alt(page)
            if alts:
                problems.append(f"{path} missing alt: {alts[:8]}")
            if overflow_x(page):
                problems.append(f"{path} horizontal overflow desktop")
            links = broken_internal_links(page, base)
            if links:
                problems.append(f"{path} broken links: {links[:8]}")
            page.screenshot(path=str(OUT / f"{name}.png"), full_page=False)

            page.set_viewport_size({"width": 390, "height": 844})
            page.goto(base, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(300)
            if overflow_x(page):
                problems.append(f"{path} horizontal overflow mobile")
            page.screenshot(path=str(OUT / f"{name}-mobile.png"), full_page=False)
            page.set_viewport_size({"width": 1440, "height": 900})

        page.goto("http://127.0.0.1:8080/", wait_until="domcontentloaded")
        page.wait_for_selector("[data-reel] img")
        page.locator('.time-col[data-time="now"] h2').click()
        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT / "home-now.png"), full_page=False)

        browser.close()

    print("problems", len(problems))
    for item in problems:
        print(" -", item)
    if problems:
        raise SystemExit(1)
    print("ok")


if __name__ == "__main__":
    main()
