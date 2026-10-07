from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={"width": 1440, "height": 900})

    page.goto("http://127.0.0.1:8080/showmeafeeling/", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(2500)
    body = page.inner_text("body")
    assert "Show Me A Feeling" in body or "Show Me a Feeling" in body
    assert "Red Thread" in body
    assert "Casa Amarilla" in body
    imgs = page.locator(".artwork-image")
    assert imgs.count() >= 7
    page.screenshot(path="C:/Users/annie/annieabstracts/_showme.png", full_page=False)

    page.goto("http://127.0.0.1:8080/threeelementsofarefraction/", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(2000)
    t = page.inner_text("body")
    assert "Cost of Love" in t
    assert "BE THE LIGHT" in t or "Be the Light" in t
    page.screenshot(path="C:/Users/annie/annieabstracts/_refraction.png", full_page=False)

    page.goto("http://127.0.0.1:8080/thisisabstraction/", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(1500)
    assert "De Donde Venimos" in page.inner_text("body")

    page.goto("http://127.0.0.1:8080/collections/", wait_until="networkidle", timeout=60000)
    assert page.locator(".image-container").count() == 3
    page.screenshot(path="C:/Users/annie/annieabstracts/_colls.png")
    print("OK")
    b.close()
