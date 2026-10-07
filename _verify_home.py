from pathlib import Path
from playwright.sync_api import sync_playwright

out = Path("_verify")
out.mkdir(exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://127.0.0.1:8080/", wait_until="networkidle", timeout=60000)
    page.wait_for_selector("[data-reel] img")
    page.wait_for_timeout(1800)
    page.screenshot(path=str(out / "home.png"))
    page.locator('.time-col[data-time="now"] h2').click()
    page.wait_for_timeout(700)
    page.screenshot(path=str(out / "home-now.png"))
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto("http://127.0.0.1:8080/", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(1500)
    page.screenshot(path=str(out / "home-mobile.png"))
    n = page.evaluate("() => document.querySelectorAll('[data-reel] img').length")
    print("frames", n)
    browser.close()
print("ok")
