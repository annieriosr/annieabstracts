#!/usr/bin/env python3
"""Build new-design pages from data/site.json and _old-site copy. Run from repo root."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OLD = ROOT / "_old-site"
DATA = json.loads((ROOT / "data" / "site.json").read_text(encoding="utf-8"))

RAIL = """    <aside class="rail">
      <a class="name" href="/">Annie Ríos</a>
      <nav>
        <a href="/work/"{work}>Work</a>
        <a href="/itinerary/"{itinerary}>Itinerary</a>
        <a href="/about/"{about}>Annie</a>
        <a href="/inquire/"{inquire}>Inquire</a>
      </nav>
      {langs}
    </aside>"""

LANGS = """      <div class="langs">
        <button type="button" data-set-lang="en" aria-pressed="true">En</button>
        <span aria-hidden="true">|</span>
        <button type="button" data-set-lang="es">Es</button>
      </div>"""


def rail(current="", langs=False):
    marks = {k: "" for k in ("work", "itinerary", "about", "inquire")}
    if current in marks:
        marks[current] = ' aria-current="page"'
    return RAIL.format(langs=LANGS if langs else "", **marks)


def page(title, desc, canonical, body, extra_head="", lang_switch=False):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="{canonical}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/css/site.css">
{extra_head}</head>
<body>
  <div class="sheet">
{rail(langs=lang_switch)}
    <main>
{body}
    </main>
  </div>
  <script src="/js/site.js"></script>
</body>
</html>
"""


def caption_line(work):
    bits = []
    if work.get("year"):
        bits.append(work["year"])
    med = (work.get("medium") or {}).get("en")
    if med:
        bits.append(med)
    if work.get("dimensions"):
        bits.append(work["dimensions"])
    if work.get("id") == "what-remains-below":
        bits.append("Diptych, 2 panel artwork")
    return "; ".join(bits)


def picture(src, alt, width=None, height=None, lazy=True, extra=""):
    attrs = [f'src="{src}"', f'alt="{alt}"']
    if width:
        attrs.append(f'width="{width}"')
    if height:
        attrs.append(f'height="{height}"')
    if lazy:
        attrs.append('loading="lazy"')
    if extra:
        attrs.append(extra)
    img = f"<img {' '.join(attrs)}>"
    webp = Path(src.replace("/images/", str(ROOT / "images") + "/")).with_suffix(".webp")
    if webp.exists():
        webp_src = src.rsplit(".", 1)[0] + ".webp"
        return f'<picture><source type="image/webp" srcset="{webp_src}">{img}</picture>'
    return img


def hang(work, first=False):
    title_en = work["title"]["en"]
    title_es = work["title"].get("es") or title_en
    alt = title_en
    img = picture(
        work["image"],
        alt,
        work.get("width"),
        work.get("height"),
        lazy=not first,
    )
    title_html = f'<em data-lang="en">{title_en}</em>'
    if title_es != title_en:
        title_html += f'<em data-lang="es">{title_es}</em>'
    thumbs = ""
    if work.get("details"):
        thumbs = '<div class="thumbs">' + "".join(
            f'<img src="{d}" alt="" loading="lazy">' for d in work["details"]
        ) + "</div>"
    # TODO: dimensions missing — left off the public caption
    return f"""      <article class="hang" id="{work['id']}">
        {img}
        <div class="caption">
          {title_html}
          <span class="line">{caption_line(work)}</span>
          <a class="ask" href="/inquire/?work={title_en}">Inquire</a>
          {thumbs}
        </div>
      </article>"""


def works_in(series_id):
    return [w for w in DATA["works"] if w["series"] == series_id]


def write(path: Path, html: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")
    print("wrote", path.relative_to(ROOT))


def build_series():
    essays = {
        "threeelementsofarefraction": {
            "en": {
                "title": "THREE ELEMENTS OF A REFRACTION",
                "by": "Annie Ríos, 2025",
                "paras": [
                    "Three Elements of A Refraction examines light's encounter with matter as both optical fact and perceptual challenge. Ríos isolates the three-stage process of refraction—incident ray, point of incidence, refracted ray—using it as structural framework for a body of work that questions how contemporary acceleration has diminished our capacity for sustained visual attention.",
                    "The paintings employ chromatic flattening, a technique in which acrylic is poured and layered to allow colors to coalesce organically. Linear elements trace light's trajectory while establishing geometric division. This approach extends Color Field painting's investigations into material behavior while reintroducing controlled gesture. The large-format canvases require physical engagement, resisting abbreviated viewing.",
                    'Working from Panama City, Ríos describes these works as "intimate spaces for absolute personal introspection"—paintings that demand optical commitment rather than passive consumption. The exhibition proposes that sustained attention to physical phenomena constitutes a form of resistance to distraction. Refraction functions here as both subject and method: a reproducible optical event made visible through paint\'s material properties.',
                    "The body of work positions abstraction not as departure from observable reality but as means of documenting it. These are paintings of something that exists—light bending through matter—insisting that deliberate looking might recalibrate habitual perception.",
                ],
            },
            "es": {
                "title": "LOS TRES ELEMENTOS DE UNA REFRACCIÓN",
                "by": "Annie Ríos, 2025",
                "paras": [
                    "Los Tres Elementos de una Refracción examina el encuentro de la luz con la materia como hecho óptico y desafío perceptual. Ríos aísla el proceso de tres etapas de la refracción—rayo incidente, punto de incidencia, rayo refractado—utilizándolo como marco estructural para un cuerpo de obra que cuestiona cómo la aceleración contemporánea ha disminuido nuestra capacidad de atención visual sostenida.",
                    "Las pinturas emplean aplanamiento cromático, una técnica en la que el acrílico se vierte y superpone en capas, permitiendo que los colores se fusionen de manera orgánica. Líneas blancas trazan la trayectoria de la luz mientras establecen divisiones geométricas. Este enfoque extiende las investigaciones sobre cómo los colores interactúan y se comportan materialmente, mientras reintroduce el gesto controlado. Los lienzos de gran formato exigen atención sostenida del espectador.",
                    'Trabajando desde Ciudad de Panamá, Ríos describe estas obras como "espacios íntimos para la introspección personal absoluta"—pinturas que exigen compromiso óptico en lugar de consumo pasivo.',
                    "El cuerpo de obra posiciona la abstracción no como alejamiento de la realidad observable sino como medio para documentarla. Estas son pinturas de algo que existe—la luz doblándose a través de la materia—insistiendo en que mirar deliberadamente podría recalibrar la percepción habitual.",
                ],
            },
        }
    }
    meta = {
        "showmeafeeling": (
            "Show Me a Feeling | Annie Ríos",
            "Annie Ríos' first solo exhibition Show Me a Feeling at Art & Sushi, Madrid (Feb–Jun 2024).",
            "https://www.annieabstracts.com/showmeafeeling",
        ),
        "thisisabstraction": (
            "This is Abstraction | Annie Ríos",
            "This is Abstraction at Gallery Artisans & Co., Lanzarote (2022–2023).",
            "https://www.annieabstracts.com/thisisabstraction",
        ),
        "threeelementsofarefraction": (
            "Three Elements of a Refraction | Annie Ríos",
            "Three Elements of a Refraction. Chromatic flattening and light. Annie Ríos, 2024–2025.",
            "https://www.annieabstracts.com/threeelementsofarefraction",
        ),
    }
    for series in DATA["series"]:
        sid = series["id"]
        title_en, title_es = series["title"]["en"], series["title"]["es"]
        langs = title_en != title_es or sid in essays
        head = f"""      <header class="series-head">
        <h1 data-lang="en">{title_en}</h1>
        <h1 data-lang="es">{title_es}</h1>
        <p>{series["years"]}</p>
      </header>
"""
        essay_html = ""
        if sid in essays:
            en, es = essays[sid]["en"], essays[sid]["es"]
            essay_html = "      <section class=\"essay\">\n"
            essay_html += f'        <div data-lang="en"><h2>{en["title"]}</h2><p class="by">{en["by"]}</p>'
            essay_html += "".join(f"<p>{p}</p>" for p in en["paras"]) + "</div>\n"
            essay_html += f'        <div data-lang="es"><h2>{es["title"]}</h2><p class="by">{es["by"]}</p>'
            essay_html += "".join(f"<p>{p}</p>" for p in es["paras"]) + "</div>\n"
            essay_html += "      </section>\n"
        hangs = "\n".join(hang(w, first=i == 0) for i, w in enumerate(works_in(sid)))
        t, d, c = meta[sid]
        html = page(t, d, c, head + essay_html + hangs, lang_switch=langs)
        html = html.replace(rail(langs=langs), rail(current="work", langs=langs))
        write(ROOT / sid / "index.html", html)


def build_about():
    en_paras = [
        "Annie Ríos (b. 2002), a Spanish-Panamanian abstract expressionist artist and pianist, explores the intersection between light, geometry, and the human-spiritual experience. Through a technique of chromatic flattening, she interprets the phenomenon of refraction, allowing color to coalesce organically—thus transforming everyday elements into serene compositions that invite introspection.",
        "For Annie, abstract art is a trace of identity and transformation—a composition charged with intuition and lived experience. Her work evolves like a canvas shaped over time: layers are applied, scraped, and recontextualized, yet its essential energy endures. Fascinated by the dialogue between light and matter, Annie finds in refraction a metaphor for questioning the accelerated pace of urban life, which often distracts us from the essential—the human and spiritual experience. Through abstraction, Annie constructs an intimate space oriented toward absolute personal introspection. She does not seek to impose, but rather to allow being.",
        "Her goal is to create a synergy between beauty and the fractured, enabling profound dialogues between the viewer's soul and the material. In this way, her work seeks to foster an internal dialogue within today's generations, proposing a reflective pause amid the abrupt tendency toward distraction.",
        "In this exchange between fluidity and geometry, it is the observer who completes the work, integrating their own experience to endow it with existential meaning.",
        # Visible old About HTML (more recent exhibition sentence). Typos fixed: adds→add, insitution→institution.
        'Recently, her piece "Composition of a Refraction" was selected to be part of a group exhibition at the Fundación Los Carbonell and her piece “COST OF LOVE” to be part of the 62nd exhibition and auction of the art institution JUANNIO in Guatemala City. These achievements add to her trajectory, which includes her first solo exhibition in Madrid (February 2024) and participations in group shows in Paris and Lanzarote. Annie has also expanded her collector base in Germany, the United States, France, and Panama.',
        "Committed to the social impact of her art, Annie donates part of her earnings to support an orphanage for children with HIV in Colón, Panama.",
    ]
    es_paras = [
        "Annie Ríos (n. 2002), artista expresionista abstracta y pianista de origen español-panameño, explora la intersección entre la luz, la geometría y la experiencia humano-espiritual. A través de una técnica de aplanamiento cromático, interpreta el fenómeno de la refracción, permitiendo que el color se fusione orgánicamente, transformando así elementos cotidianos en composiciones serenas que invitan a la introspección.",
        "Para Annie, el arte abstracto es una huella de identidad y transformación: una composición cargada de intuición y experiencia vivida. Su obra evoluciona como un lienzo trabajado en el tiempo: se aplican capas, se raspan y se recontextualizan, pero su energía esencial perdura. Fascinada por el diálogo entre la luz y la materia, Annie encuentra en la refracción una metáfora para cuestionar el ritmo acelerado de la vida urbana, que a menudo nos distrae de lo esencial: la experiencia humana y espiritual. A través de la abstracción, Annie construye un espacio íntimo orientado a la introspección personal absoluta. No busca imponer, sino permitir ser.",
        "Su objetivo es crear una sinergia entre lo bello y lo fracturado, habilitando diálogos profundos entre el alma del espectador y la materia. De este modo, su obra busca fomentar un diálogo interno en las generaciones actuales, proponiendo una pausa reflexiva ante la abrupta tendencia a la distracción.",
        "En este intercambio entre fluidez y geometría, es el observador quien completa la obra, integrando su propia experiencia para dotarla de sentido existencial.",
        "Recientemente, su obra “Composition of a Refraction” fue seleccionada por un prestigioso jurado para formar parte de una exposición colectiva en la Fundación Los Carbonel (septiembre de 2024), donde solo diez artistas fueron elegidos. Este logro se suma a su trayectoria, que incluye su primera exposición individual en Madrid (febrero de 2024) y participaciones en colectivas en París y Lanzarote. Annie también ha ampliado su base de coleccionistas en Alemania, Estados Unidos, Francia y Panamá.",
        "Comprometida con el impacto social de su arte, Annie destina parte de sus ganancias a apoyar un orfanato de niños con VIH en Colón, Panamá.",
    ]
    bio = '      <div class="portrait">' + picture("/images/1234.JPG", "Annie Ríos with two paintings", 2204, 1536, lazy=False) + "</div>\n"
    bio += '      <div class="bio" data-lang="en">\n'
    bio += "".join(f"        <p>{p}</p>\n" for p in en_paras)
    bio += "      </div>\n"
    bio += '      <div class="bio" data-lang="es">\n'
    bio += "".join(f"        <p>{p}</p>\n" for p in es_paras)
    bio += "      </div>\n"
    html = page(
        "Annie | Annie Ríos",
        "Annie Ríos (b. 2002) explores light, geometry, and refraction through abstract expressionism.",
        "https://www.annieabstracts.com/about",
        bio,
        lang_switch=True,
    )
    html = html.replace(rail(langs=True), rail(current="about", langs=True))
    write(ROOT / "about" / "index.html", html)


def build_itinerary():
    # Source: Portfolio_Annie_Rios_Agosto_2026 (1).pdf — Spanish text kept word for word.
    # Representation line from ANNIE_RIOS_CV_MAY_2026.pdf (not in the August PDF).
    sections = [
        (
            "Exposiciones individuales",
            [
                ("2028", "Aquí. Donde la Luz nos Halla", "11 obras en lienzo", "Museo de Arte Decorativo, Buenos Aires, Argentina", "/aqui-donde-la-luz-nos-halla/"),
                ("2026", "ALL THE WAYS WE ARE HUMANS", "12 obras en lienzo", "BoConcept, Panamá, Panamá", None),
                ("2024", "Show me a Feeling", "12 obras en lienzo y 2 obras en papel", "Art & Sushi, Madrid (ES)", "/showmeafeeling/"),
                ("2023", "This is Abstraction (Paper Works)", None, "Artisan Gallery, Lanzarote (ES)", "/thisisabstraction/"),
                ("2022", "This is Abstraction", "Selección curada de 10 obras de una colección de 43 piezas", "Artisan Gallery, Lanzarote (ES)", "/thisisabstraction/"),
            ],
        ),
        (
            "Exposiciones grupales",
            [
                ("2026", "Cost of Love", "Mayo 2026", "Museo Miraflores, Guatemala", None),
                ("2025", "Después de la Lluvia", "en colaboración con Fundación Los Carbonell y Proyecto Malayerba. Obra expuesta: Composition of a Refraction 1", "Centro Espacio Arte, Panamá", "/threeelementsofarefraction/"),
                ("2024", "Extensión de Show me a Feeling", None, "Showroom Le Marais, París (FR)", "/showmeafeeling/"),
            ],
        ),
        (
            "Proyectos / series",
            [
                ("2025", "The Three Elements of A Refraction", "Ongoing collection exploring light refraction as physical/symbolic phenomenon.", None, "/threeelementsofarefraction/"),
            ],
        ),
        (
            "Colecciones",
            [
                ("2023", "Serie This is Abstraction", "10% de las ganancias donadas al Albergue de Niños con VIH/SIDA, Colón (PA)", None, None),
                (None, "Serie Show Me A Feeling", "12 obras en canvas y 2 en papel. Muestra expuesta en Madrid individualmente y Paris en grupo.", None, None),
            ],
        ),
    ]
    body = """      <div class="cv">
        <div class="cv-head">
          <h1>Annie Ríos</h1>
          <p>b. 2002, Ciudad de Panamá, Panamá</p>
          <p>Vive y trabaja en Panamá</p>
          <p><a href="mailto:annieabstracts@gmail.com">annieabstracts@gmail.com</a></p>
          <p><a href="https://wa.me/34622907643">+34 622 907 643 WhatsApp</a></p>
          <p><a href="https://www.instagram.com/annieabstracts">Instagram</a></p>
        </div>
"""
    for heading, entries in sections:
        body += f'        <div class="cv-section">\n          <h2>{heading}</h2>\n'
        for year, title, note, place, href in entries:
            title_html = f"<em class=\"title\">{title}</em>"
            if href:
                title_html = f'<a href="{href}">{title_html}</a>'
            body += '          <div class="cv-entry">\n'
            body += f'            <div class="year">{year or ""}</div>\n'
            body += '            <div class="details">\n'
            body += f"              {title_html}\n"
            if place:
                body += f'              <span class="place">{place}</span>\n'
            if note:
                body += f'              <span class="note">{note}</span>\n'
            body += "            </div>\n          </div>\n"
        body += "        </div>\n"

    body += """        <div class="cv-section">
          <h2>Colecciones privadas</h2>
          <p class="cv-list">Obras adquiridas por coleccionistas en Panamá, España, Francia, Alemania y Estados Unidos</p>
        </div>
        <div class="cv-section">
          <h2>Logros destacados</h2>
          <div class="cv-list">
            <p>Puente cultural París–Madrid a través de la extensión de Show me a Feeling</p>
            <p>Primera colaboración institucional (Artisan Gallery, ES)</p>
            <p>Iniciativa filantrópica apoyando el albergue panameño de VIH/SIDA</p>
            <p>Artista seleccionada, exposición colectiva Después de la Lluvia, Centro Espacio Arte</p>
            <p>Seleccionada en el Proyecto Malayerba, Fondo Arte Joven</p>
            <p>Seleccionada para JUANNIO 2026 — 62.ª edición de una de las instituciones de arte más importantes de América Latina</p>
          </div>
        </div>
        <div class="cv-section">
          <h2>Representación</h2>
          <div class="cv-entry">
            <div class="year">2026</div>
            <div class="details">
              <em class="title">Galería Habitante</em>
              <span class="place">Panama City, Panamá</span>
            </div>
          </div>
        </div>
        <a class="cv-download" href="/files/Portfolio_Annie_Rios_Agosto_2026.pdf">Download CV</a>
      </div>
"""
    html = page(
        "Itinerary | Annie Ríos",
        "Curriculum of Annie Ríos. Exhibitions in Buenos Aires, Guatemala, Panama, Madrid, Paris, Lanzarote.",
        "https://www.annieabstracts.com/itinerary",
        body,
    )
    html = html.replace(rail(), rail(current="itinerary"))
    write(ROOT / "itinerary" / "index.html", html)


def build_inquire():
    options = ["Studio visit / other"] + [w["title"]["en"] for w in DATA["works"]]
    opts = "\n              ".join(f'<option>{o}</option>' for o in options)
    body = f"""      <div class="door">
        <p class="lead">Institutions, curators, collectors</p>
        <a class="mail" href="mailto:annieabstracts@gmail.com">annieabstracts@gmail.com</a>
        <a class="mail" href="https://wa.me/34622907643">+34 622 907 643 WhatsApp</a>
        <form data-inquire>
          <label>Name <input type="text" name="name" required></label>
          <label>Email <input type="email" name="email" required></label>
          <label>Work
            <select id="work" name="work">
              <option value="">—</option>
              {opts}
            </select>
          </label>
          <label>Message <textarea name="message" rows="5" required></textarea></label>
          <button type="submit">Send</button>
        </form>
      </div>
"""
    html = page(
        "Inquire | Annie Ríos",
        "Inquire about works by Annie Ríos.",
        "https://www.annieabstracts.com/inquire",
        body,
    )
    html = html.replace(rail(), rail(current="inquire"))
    write(ROOT / "inquire" / "index.html", html)


def build_work():
    featured = [
        ("cost-of-love", "/images/cost-of-love.jpg", "Cost of Love, 2025", "Cost of Love", "2025", "Guatemala City", "/threeelementsofarefraction/#cost-of-love"),
        ("composition-of-a-refraction", "/images/refraction1.jpeg", "Composition of a Refraction, 2025", "Composition of a Refraction", "2025", "Panama City", "/threeelementsofarefraction/#composition-of-a-refraction"),
        ("be-the-light", "/images/be-the-light.jpg", "Be the Light", "Be the Light", None, None, "/threeelementsofarefraction/#be-the-light"),
        ("red-thread", "/images/red-thread.jpg", "Red Thread", "Red Thread", None, "Madrid, Paris", "/showmeafeeling/#red-thread"),
        ("sailing-spirit", "/images/sailingspirit.jpg", "Sailing Spirit", "Sailing Spirit", None, "Lanzarote", "/thisisabstraction/#sailing-spirit"),
    ]
    rooms = []
    for i, (_id, src, alt, title, year, place, href) in enumerate(featured):
        spans = ""
        if year:
            spans += f"<span>{year}</span>"
        if place:
            spans += f"<span>{place}</span>"
        rooms.append(f"""    <section class="room">
      <figure>
        <a href="{href}">
          {picture(src, alt, lazy=i > 0)}
        </a>
        <figcaption class="caption"><em>{title}</em>{spans}</figcaption>
      </figure>
    </section>""")
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Work | Annie Ríos</title>
  <meta name="description" content="Paintings by Annie Ríos. Chromatic flattening and refraction.">
  <link rel="canonical" href="https://www.annieabstracts.com/work">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/css/site.css">
</head>
<body class="view">
{rail(current="work")}
  <main>
{chr(10).join(rooms)}
    <div class="bodies">
      <p>Bodies of work</p>
      <a href="/thisisabstraction/">This is Abstraction<span>2019–2022</span></a>
      <a href="/showmeafeeling/">Show Me a Feeling<span>2023–2024</span></a>
      <a href="/threeelementsofarefraction/">Three Elements of a Refraction<span>2024–2025</span></a>
    </div>
  </main>
  <script src="/js/site.js"></script>
</body>
</html>
"""
    write(ROOT / "work" / "index.html", html)


def extract_article(src: Path):
    text = src.read_text(encoding="utf-8", errors="replace")
    title_m = re.search(r'<h1 class="article-title">(.*?)</h1>', text, re.S)
    title = re.sub(r"<.*?>", "", title_m.group(1)).strip() if title_m else src.stem
    desc_m = re.search(r'<meta name="description" content="(.*?)"', text)
    desc = desc_m.group(1) if desc_m else title
    body_m = re.search(r'<article class="article-body">(.*?)</article>', text, re.S)
    body = body_m.group(1).strip() if body_m else ""
    body = body.replace("../images/", "/images/").replace("images/", "/images/")
    body = body.replace('src="//images/', 'src="/images/')
    return title, desc, body


def build_journal():
    articles = [
        ("panama-madrid-paris-artist-journey.html", "panama-madrid-paris"),
        ("artist-journey-panama-madrid-paris.html", "geography-shaped-my-voice"),
        ("refraction-collection-explained.html", "refraction-collection-explained"),
        ("chromatic-flattening-technique.html", "chromatic-flattening-technique"),
        ("pianist-to-visual-artist.html", "pianist-to-visual-artist"),
        ("color-relationships-abstract-art.html", "color-relationships"),
        ("emotions-abstract-expressionism.html", "emotions-abstract-expressionism"),
        ("exploring-abstract-art-paris.html", "exploring-abstract-art-paris"),
        ("creating-art-pandemic.html", "creating-art-pandemic"),
        ("show-me-feeling-series-story.html", "show-me-a-feeling"),
        ("process-pouring-layering.html", "process-pouring-layering"),
        ("refraction-artistic-philosophy.html", "refraction-artistic-philosophy"),
        ("centro-espacio-arte-exhibition.html", "centro-espacio-arte"),
        ("rhythms-reflections-urban-light.html", "rhythms-and-reflections"),
        ("artist-journey-panama-paris.html", "artist-journey-panama-paris"),
        ("from-pianist-to-visual-artist.html", "from-pianist-to-visual-artist"),
        ("materials-and-studio-practice.html", "materials-and-studio-practice"),
    ]
    index_items = []
    for filename, slug in articles:
        src = OLD / "journal" / filename
        if not src.exists():
            print("skip missing journal", filename)
            continue
        title, desc, body = extract_article(src)
        if not body:
            print("no body", filename)
            continue
        inner = f'      <article class="reading">\n        <h1>{title}</h1>\n        {body}\n      </article>\n'
        html = page(f"{title} | Annie Ríos", desc, f"https://www.annieabstracts.com/journal/{slug}", inner)
        write(ROOT / "journal" / slug / "index.html", html)
        if filename not in {
            "artist-journey-panama-paris.html",
            "from-pianist-to-visual-artist.html",
            "materials-and-studio-practice.html",
        }:
            index_items.append((slug, title, desc))

    cards = "\n".join(
        f'        <a href="/journal/{slug}/"><em>{title}</em><span>{desc}</span></a>'
        for slug, title, desc in index_items
    )
    index_body = f"""      <div class="reading">
        <h1>Journal</h1>
        <div class="journal-list">
{cards}
        </div>
      </div>
"""
    write(
        ROOT / "journal" / "index.html",
        page(
            "Journal | Annie Ríos",
            "Journal of Annie Ríos. Process, philosophy, and the journey behind the collections.",
            "https://www.annieabstracts.com/journal",
            index_body,
        ),
    )


def build_studio():
    intro = "The Panamanian artist follows a deliberate study of transcending the unknown into tangible pieces, carrying a unique message of the importance of self-understanding and to look from within. Through abstraction she found a loophole of opportunities that lets her express a lifestyle that is not written yet."
    src = (OLD / "studio" / "index.html").read_text(encoding="utf-8", errors="replace")
    media = re.findall(r'src="\.\./images/([^"]+)"', src)
    cells = []
    for name in media:
        path = f"/images/{name}"
        if name.lower().endswith(".mp4"):
            cells.append(f'<video controls preload="none" playsinline><source src="{path}" type="video/mp4"></video>')
        else:
            cells.append(f'<img src="{path}" alt="Studio view" loading="lazy">')
    body = f"""      <div class="studio-intro">
        <h1>The Journey of Craft</h1>
        <p>{intro}</p>
      </div>
      <div class="studio-grid">
        {"".join(cells)}
      </div>
"""
    write(
        ROOT / "studio" / "index.html",
        page(
            "The Studio | Annie Ríos",
            "Inside the studio of Annie Ríos. Chromatic flattening and refraction.",
            "https://www.annieabstracts.com/studio",
            body,
        ),
    )


def build_show_page():
    body = """      <div class="show">
        <h1>Aquí, donde la luz nos halla</h1>
        <p>Museo de Arte Decorativo</p>
        <p>Buenos Aires</p>
        <p>January–March 2028</p>
        <p>11 obras en lienzo</p>
        <a href="mailto:annieabstracts@gmail.com?subject=Aquí,%20donde%20la%20luz%20nos%20halla">Write</a>
      </div>
"""
    html = page(
        "Aquí, donde la luz nos halla | Annie Ríos",
        "Solo exhibition. Aquí, donde la luz nos halla. Museo de Arte Decorativo, Buenos Aires. January–March 2028.",
        "https://www.annieabstracts.com/aqui-donde-la-luz-nos-halla",
        body,
    )
    html = html.replace(rail(), rail(current="itinerary"))
    write(ROOT / "aqui-donde-la-luz-nos-halla" / "index.html", html)


def main():
    build_series()
    build_about()
    build_itinerary()
    build_inquire()
    build_work()
    build_journal()
    build_studio()
    build_show_page()


if __name__ == "__main__":
    main()
