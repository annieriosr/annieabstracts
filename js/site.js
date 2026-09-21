function closeMenu() {
  document.querySelector(".time-nav")?.classList.remove("is-open");
  document.querySelectorAll(".time-col").forEach((c) => c.classList.remove("open"));
}

function initTimeNav() {
  const nav = document.querySelector(".time-nav");
  if (!nav) return;

  nav.querySelectorAll(".time-col").forEach((col) => {
    const title = col.querySelector("h2");
    const close = col.querySelector(".time-close");
    title?.addEventListener("click", (e) => {
      e.stopPropagation();
      const already = col.classList.contains("open");
      closeMenu();
      if (!already) {
        nav.classList.add("is-open");
        col.classList.add("open");
      }
    });
    close?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

function isPhoneHome() {
  return window.matchMedia("(max-width: 700px)").matches;
}

/* Contact-strip: cinematic drift + cursor scrub / phone drag */
function initReel() {
  const reel = document.querySelector("[data-reel]");
  const gate = document.querySelector(".gate");
  const nav = document.querySelector(".time-nav");
  if (!reel || !gate || !document.body.classList.contains("home")) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const originals = Array.from(reel.children);
  originals.forEach((node) => {
    const clone = node.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("img").forEach((img) => {
      img.loading = "lazy";
      img.removeAttribute("fetchpriority");
    });
    reel.appendChild(clone);
  });

  let offset = 0;
  let half = 0;
  let last = performance.now();
  let pulse = 0;
  let pointerX = 0.5;
  let pointerY = 0.5;
  let targetX = 0.5;
  let targetY = 0.5;
  let velocityBoost = 0;
  let dragging = false;
  let lastPointerX = 0;
  let flick = 0;

  const wrap = () => {
    if (half <= 0) return;
    while (offset >= half) offset -= half;
    while (offset < 0) offset += half;
  };

  const paint = () => {
    const lift = isPhoneHome() ? 0 : (pointerY - 0.5) * -6;
    reel.style.transform = `translate3d(${-offset}px, ${lift}px, 0)`;
  };

  const measure = () => {
    half = reel.scrollWidth / 2;
  };

  const images = reel.querySelectorAll("img");
  let pending = images.length;
  const ready = () => {
    pending -= 1;
    if (pending <= 0) measure();
  };
  images.forEach((img) => {
    if (img.complete) ready();
    else {
      img.addEventListener("load", ready, { once: true });
      img.addEventListener("error", ready, { once: true });
    }
  });
  window.addEventListener("resize", measure);

  if (!window.matchMedia("(pointer: coarse)").matches) {
    window.addEventListener(
      "pointermove",
      (e) => {
        targetX = e.clientX / window.innerWidth;
        targetY = e.clientY / window.innerHeight;
        velocityBoost += (targetX - 0.5) * 2.4;
        velocityBoost = Math.max(-90, Math.min(90, velocityBoost));
      },
      { passive: true }
    );
  }

  gate.addEventListener("pointerdown", (e) => {
    if (!isPhoneHome()) return;
    if (nav?.classList.contains("is-open")) return;
    dragging = true;
    lastPointerX = e.clientX;
    flick = 0;
    gate.setPointerCapture(e.pointerId);
  });
  gate.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastPointerX;
    lastPointerX = e.clientX;
    flick = dx;
    offset -= dx;
    wrap();
    paint();
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    velocityBoost += -flick * 8;
    velocityBoost = Math.max(-180, Math.min(180, velocityBoost));
  };
  gate.addEventListener("pointerup", endDrag);
  gate.addEventListener("pointercancel", endDrag);

  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    pulse += dt;

    if (!isPhoneHome()) {
      pointerX += (targetX - pointerX) * Math.min(1, dt * 7);
      pointerY += (targetY - pointerY) * Math.min(1, dt * 7);
      gate.style.setProperty("--mx", `${pointerX * 100}%`);
      gate.style.setProperty("--my", `${pointerY * 100}%`);
      gate.style.setProperty("--tilt", `${-0.6 + (pointerX - 0.5) * 1.8}deg`);
      gate.style.setProperty("--shift-y", `${(pointerY - 0.5) * 18}px`);
    }

    velocityBoost *= Math.pow(0.92, dt * 60);

    if (!dragging) {
      const crawl = reduce || isPhoneHome() ? (reduce ? 0 : 18) : 26 + Math.sin(pulse * 0.55) * 8;
      const scrub = isPhoneHome() ? 0 : (pointerX - 0.5) * 55;
      offset += (crawl + scrub + velocityBoost) * dt;
      wrap();
      paint();
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initInquire() {
  const params = new URLSearchParams(location.search);
  const work = params.get("work");
  const select = document.querySelector("#work");
  if (work && select) {
    const match = Array.from(select.options).find(
      (o) => o.value.toLowerCase() === work.toLowerCase()
    );
    if (match) select.value = match.value;
    else {
      const opt = document.createElement("option");
      opt.value = work;
      opt.textContent = work;
      opt.selected = true;
      select.appendChild(opt);
    }
  }

  const form = document.querySelector("form[data-inquire]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(
      `Inquiry${data.get("work") ? ": " + data.get("work") : ""}`
    );
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nWork: ${data.get("work") || "—"}\n\n${data.get("message")}`
    );
    window.location.href = `mailto:annieabstracts@gmail.com?subject=${subject}&body=${body}`;
  });
}

function applyLang(lang) {
  const next = lang === "es" ? "es" : "en";
  document.documentElement.lang = next;
  localStorage.setItem("language", next);
  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.getAttribute("data-set-lang") === next ? "true" : "false");
  });
}

function initLang() {
  applyLang(localStorage.getItem("language") || "en");
  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.getAttribute("data-set-lang")));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLang();
  initTimeNav();
  initReel();
  initInquire();
});
