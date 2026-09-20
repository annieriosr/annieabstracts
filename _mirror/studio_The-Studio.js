document.addEventListener('DOMContentLoaded', () => {
  /* ============================================================
     1. Set Up the Gallery Container
     - Use full viewport dimensions.
  ============================================================ */
  const gallery = document.querySelector('.gallery');
  const containerWidth = gallery.clientWidth; // Use gallery width
  const containerHeight = gallery.clientHeight; // Use gallery height
  gallery.style.position = 'relative';
  gallery.style.width = containerWidth + 'px';
  gallery.style.height = containerHeight + 'px';
  const introElement = document.getElementById('intro');
  const introContainer = document.querySelector('.intro-container');
  const horizontalImage = document.querySelector('.horizontal-image-container img');
  const artistName = document.getElementById("artist-name");
  const introOverlay = document.querySelector(".intro-overlay");
  const toggleBtn = document.querySelector('.mobile-intro-toggle');

  /* ============================================================
     2. Weighted Size Assignment & Absolute Positioning
     - Assign sizes based on your guide.
  ============================================================ */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const sizeDistribution = [
    'small', 'medium', 'small', 'small', 'medium', 'small', 'medium'
  ]; // 7 images per screen

  galleryItems.forEach((item, index) => {
    const sizeClass = sizeDistribution[index % sizeDistribution.length];
    item.classList.add(sizeClass);

    // Randomly assign landscape orientation to some images
    if (Math.random() > 0.7) { // 30% chance of landscape
      item.classList.add('landscape');
    }

    item.style.position = 'absolute';
  });

  /* ============================================================
     3. Random Positioning with Organic Placement
     - Ensure 7 images per screen with no overlapping.
  ============================================================ */
  const margin = 100; /* Increased margin for more spacing */
  const placedRects = [];
  const containerW = containerWidth;
  const containerH = containerHeight;

  function rectanglesOverlap(r1, r2) {
    return !(
      r1.left + r1.width + margin < r2.left ||
      r1.left > r2.left + r2.width + margin ||
      r1.top + r1.height + margin < r2.top ||
      r1.top > r2.top + r2.height + margin
    );
  }

  // Exclusion zone for the fixed title to ensure it's never covered.
  const exclusionZones = [];
  const fixedTitle = document.querySelector('.fixed-title');
  if (fixedTitle) {
    const titleRect = fixedTitle.getBoundingClientRect();
    exclusionZones.push({
      left: titleRect.left,
      top: titleRect.top,
      width: titleRect.width,
      height: titleRect.height
    });
  }

  function assignRandomPosition(item, containerW, containerH, exclusions, placed) {
    const maxAttempts = 200; // Increase attempts to find a non-overlapping position
    let attempt = 0;
    let pos = null;
    const itemWidth = item.offsetWidth;
    const itemHeight = item.offsetHeight;

    while (attempt < maxAttempts) {
      const left = Math.random() * (containerW - itemWidth);
      const top = Math.random() * (containerH - itemHeight);
      pos = { left, top, width: itemWidth, height: itemHeight };

      const overlapsExclusion = exclusions.some(zone => rectanglesOverlap(pos, zone));
      if (overlapsExclusion) {
        attempt++;
        continue;
      }

      const overlapsPlaced = placed.some(rect => rectanglesOverlap(pos, rect));
      if (!overlapsPlaced) {
        placed.push(pos);
        return pos;
      }

      attempt++;
    }

    console.warn("No non-overlapping position found for an item.");
    return null; // Return null if no valid position is found
  }

  // Place 7 images per screen
  galleryItems.forEach((item, index) => {
    const pos = assignRandomPosition(item, containerW, containerH, exclusionZones, placedRects);
    if (pos) {
      item.style.left = `${pos.left}px`;
      item.style.top = `${pos.top}px`;
    }
  });
  
  const currentLang = localStorage.getItem('language') || 'en';

  const translations = {
    en: {
      page_title: "About My Work & Bio | Annie Rios",
      meta_description: "Discover the abstract expressionist art of Annie Rios. Explore her collections, exhibitions, and modern reinterpretations of everyday life.",
      header_title: "Annie Rios",
      nav_center: "The Studio",
      gradient_close: "Close",
      fixed_title: "The Journey of Craft",
      gallery_alt_1: "Abstract artwork by Annie Rios featuring dynamic shapes and colors",
      footer_text: "© 2025 Annie Rios. All rights reserved."
    },
    es: {
      page_title: "Sobre mi obra y biografía | Annie Rios",
      meta_description: "Descubre el arte abstracto expresionista de Annie Rios. Explora sus colecciones, exposiciones y reinterpretaciones modernas de la vida cotidiana.",
      header_title: "Annie Rios",
      nav_center: "El Estudio",
      gradient_close: "Cerrar",
      fixed_title: "El Viaje de la Artesanía",
      gallery_alt_1: "Obra abstracta de Annie Rios con formas y colores dinámicos",
      footer_text: "© 2025 Annie Rios. Todos los derechos reservados."
    }
  };

  function translatePage(lang) {
    const trans = translations[lang];
    if (!trans) return;

    // Update document title
    document.title = trans.page_title;

    // Update meta description (if exists)
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', trans.meta_description);
    }

    // Loop through each element with data-i18n-alt and update text or alt attribute
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (trans[key]) {
        // If the element is an image, update its alt attribute.
        if (el.tagName.toLowerCase() === 'img') {
          el.setAttribute('alt', trans[key]);
        } else {
          el.textContent = trans[key];
        }
      }
    });
  }
   
  /* ============================================================
     4. Intersection Observer for Fade-In/Out
     - Use observer to trigger smooth fade-in.
  ============================================================ */
  const mediaItems = document.querySelectorAll('.gallery-item img, .gallery-item video');
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.tagName.toLowerCase() === 'video') {
          entry.target.play();
        }
      } else {
        entry.target.classList.remove('visible');
        if (entry.target.tagName.toLowerCase() === 'video') {
          entry.target.pause();
        }
      }
    });
  }, observerOptions);
  mediaItems.forEach(item => observer.observe(item));

  /* ============================================================
     5. Video Behavior
     - Ensure videos autoplay muted, loop, and have no controls.
  ============================================================ */
  const videos = document.querySelectorAll('.gallery-item video');
  videos.forEach(video => {
    video.controls = false;
    video.loop = true;
    video.muted = true;
    video.setAttribute('playsinline', '');
  });

  /* ============================================================
     6. Parallax Effect (Optional)
     - Apply subtle vertical and horizontal drift.
  ============================================================ */
  mediaItems.forEach(item => {
    const randomX = Math.random() * 20 - 10; // between -10 and +10 px
    item.dataset.offsetX = randomX;
  });
  function updateEffects() {
    const scrollY = window.scrollY;
    const verticalFactor = 0.03;  // Slight parallax intensity
    const horizontalFactor = 0.01; // Even subtler horizontal drift
    mediaItems.forEach(item => {
      item.style.setProperty('--parallax-y', `${scrollY * verticalFactor}px`);
      const baseOffset = parseFloat(item.dataset.offsetX) || 0;
      item.style.setProperty('--parallax-x', `${scrollY * horizontalFactor + baseOffset}px`);
    });
    requestAnimationFrame(updateEffects);
  }
  requestAnimationFrame(updateEffects);

  /* ============================================================
     7. Hover Interaction for Focus Mode
     - When hovering, enlarge and center the image; other items remain spaced.
  ============================================================ */
  galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('hovered');
      gallery.classList.add('item-hovered'); // Add class to parent
    });

    item.addEventListener('mouseleave', () => {
      item.classList.remove('hovered');
      gallery.classList.remove('item-hovered'); // Remove class from parent
    });
  });

  const introObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const introObserverCallback = (entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        introContainer.classList.add('animate');
        observerInstance.unobserve(entry.target);
      }
    });
  };
  const introObserver = new IntersectionObserver(introObserverCallback, introObserverOptions);
  if (introContainer) {
    introObserver.observe(introContainer);
  }

 const wrapIntroWords = (lang) => {
    if (!introElement) return;
    const text = translations[lang]['intro'];
    const words = text.split(' ');
    const wrappedWords = words.map((word, index) => {
      const match = word.match(/([A-Za-zÀ-ÿ]+)([.,?!]*)/);
      if (match) {
        const [ , cleanWord, punctuation ] = match;
        return `<span class="word" style="--delay: ${index * 0.05}s;">${cleanWord}</span>${punctuation}`;
      }
      return word;
    }).join(' ');
    introElement.innerHTML = wrappedWords;
  };



  // Toggle the overlay when clicking the artist name
  artistName.addEventListener("click", function(event) {
    event.preventDefault();
    // Toggle the "active" class on the overlay
    if (introOverlay.classList.contains("active")) {
      introOverlay.classList.remove("active");
    } else {
      introOverlay.classList.add("active");
    }
  });

  
    // Close overlay when clicking outside the intro text
    introOverlay.addEventListener("click", function (event) {
      if (event.target === introOverlay) {
        introOverlay.style.display = "none";
      }
    });



    // GSAP animation for the intro text
    gsap.fromTo(
      ".intro p",
      { opacity: 0, y: 20 },
      { 
          opacity: 1,
          y: 0,
          ease: "none",
          stagger: 0.05,
          immediateRender: false,
          scrollTrigger: {
              trigger: ".intro-container",
              start: "top 90%",
              end: "center center",
              scrub: true,
              // markers: true, // Uncomment for debugging
          }
      }
  );


  artistName.addEventListener("mouseenter", () => {
    introOverlay.classList.add("active");
  });
  
  artistName.addEventListener("click", (event) => {
    event.preventDefault();
    introOverlay.classList.add("active");
  });
  
  introOverlay.addEventListener("click", (event) => {
    if (event.target === introOverlay) {
      introOverlay.classList.remove("active");
    }
  });
  
  document.addEventListener("mouseleave", () => {
    introOverlay.classList.remove("active");
  });
  

});
