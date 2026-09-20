/* ===============================================
   ABOUT JS
/* ---------- RESET & BASE STYLES ---------- */

 /* AnnieAbstracts.js
   by Annie Rios (2025)
*/

// When the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {

  // Shortcuts
  const $BODY = $('body');

  // Utility: Detect touch device
  function isTouchDevice() {
    return (
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0)
    );
  }

  // Scroll Restoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Dynamically set a CSS variable for viewport height
  function heightViewport() {
    document.documentElement.style.cssText = `
      --height-viewport: ${window.innerHeight}px;
    `;
  }
  heightViewport();

  /* Device Detection: Mobile vs. Desktop
     ================================================== */
  // If it's a mobile/touch device
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent || navigator.vendor || window.opera)
    || isTouchDevice() === true
  ) {
    $BODY.addClass('mobile');

    // Active pseudo-class fix on iOS
    document.addEventListener('touchstart', function(){}, {passive: true});

    // Recheck viewport height on orientation change
    window.addEventListener('orientationchange', function(){
      setTimeout(heightViewport, 50);
    });

    // (Optional) Special mobile menu logic can go here.
  } else {
    // Otherwise, it's likely desktop
    $BODY.addClass('desktop');

    // On window resize, reset viewport height (and close menus, if any)
    $(window).on('resize', function() {
      heightViewport();
    });
  }

  /* Loader Fade Out
     ================================================== */
  setTimeout(function() {
    $('#loader').fadeOut(200);
  }, 600);

  /* Fullscreen Menu Toggle (NEW for your site)
     ================================================== */
  // Show/hide .fullscreen-menu on ".menu-option" click
  const menuOption = document.querySelector('.menu-option');
  const fullscreenMenu = document.querySelector('.fullscreen-menu');

  if (menuOption && fullscreenMenu) {
    menuOption.addEventListener('click', function(e) {
      e.stopPropagation();
      fullscreenMenu.classList.toggle('hidden');
    });

    // Clicking outside the fullscreen menu closes it
    document.addEventListener('click', function(e) {
      if (!fullscreenMenu.contains(e.target) && !menuOption.contains(e.target)) {
        fullscreenMenu.classList.add('hidden');
      }
    });
  }

  /* Intersection Observer for .animated
     (Fade/slide in elements on scroll)
     ================================================== */
  function animateIn(el) {
    setTimeout(function(){
      el.classList.add('completed');
    }, 300);
  }

  const animatedElems = [].slice.call(document.querySelectorAll('.animated'));

  if ('IntersectionObserver' in window) {
    let obsAnimated = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateIn(entry.target);
          obsAnimated.unobserve(entry.target);
        }
      });
    });
    animatedElems.forEach(function(t) {
      obsAnimated.observe(t);
    });
  } else {
    // Fallback if IntersectionObserver not supported
    animatedElems.forEach(function(el) {
      animateIn(el);
    });
  }

  function lazyLoading(t) {
    if (t.tagName === 'IMG') {
      t.src = t.dataset.src;
    }
    if (t.tagName === 'VIDEO') {
      let playPromise = t.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // If it fails to autoplay, either show controls or do nothing
          if ($(t).hasClass('gif')) {
            t.classList.add('no-autoplay');
          } else {
            t.classList.add('controls');
            t.controls = true;
          }
        });
      }
    }
    $(t).removeClass('lazy').addClass('lazyloaded');
  }

  const lazyElems = [].slice.call(document.querySelectorAll('.lazy'));
  if ('IntersectionObserver' in window) {
    let obsLazy = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          lazyLoading(entry.target);
          obsLazy.unobserve(entry.target);
        }
      });
    });
    lazyElems.forEach(function(elem) {
      obsLazy.observe(elem);
    });
  } else {
    lazyElems.forEach(function(elem) {
      lazyLoading(elem);
    });
  }

  $.ajax({
    statusCode: {
      404: function() {
        window.location = "https://www.annieabstracts.com/";
      }
    }
  });

 


  /* ============================
     Persist Language Across Pages
     ============================ */

     // Retrieve saved language
let currentLanguage = localStorage.getItem("language") || "en";

// Define our translation dictionary
const translations = {
  en: {
    page_title: "About My Work & Bio | Annie Rios",
    header_title: "Annie Rios",
    menu_label: "Menu",
    lang_en: "En",
    lang_es: "Es",

    about_title: "About my work",
    about_text: `Annie Ríos (b. 2002), a Spanish-Panamanian abstract expressionist artist and pianist, explores the intersection between light, geometry, and the human-spiritual experience. Through a technique of chromatic flattening, she interprets the phenomenon of refraction, allowing color to coalesce organically—thus transforming everyday elements into serene compositions that invite introspection.

For Annie, abstract art is a trace of identity and transformation—a composition charged with intuition and lived experience. Her work evolves like a canvas shaped over time: layers are applied, scraped, and recontextualized, yet its essential energy endures. Fascinated by the dialogue between light and matter, Annie finds in refraction a metaphor for questioning the accelerated pace of urban life, which often distracts us from the essential—the human and spiritual experience. Through abstraction, Annie constructs an intimate space oriented toward absolute personal introspection. She does not seek to impose, but rather to allow being.

Her goal is to create a synergy between beauty and the fractured, enabling profound dialogues between the viewer’s soul and the material. In this way, her work seeks to foster an internal dialogue within today’s generations, proposing a reflective pause amid the abrupt tendency toward distraction.

In this exchange between fluidity and geometry, it is the observer who completes the work, integrating their own experience to endow it with existential meaning.

Recently, her piece “Composition of a Refraction” was selected by a prestigious jury to be part of a group exhibition at the Fundación Los Carbonel (September 2024), where only ten artists were chosen. This achievement adds to her trajectory, which includes her first solo exhibition in Madrid (February 2024) and participations in group shows in Paris and Lanzarote. Annie has also expanded her collector base in Germany, the United States, France, and Panama.

Committed to the social impact of her art, Annie donates part of her earnings to support an orphanage for children with HIV in Colón, Panama.`,

    download_portfolio: "(Download Portfolio)",

    solo_shows_title: "Solo Shows",
    solo_shows_2024_title: "Show me a Feeling",
    solo_shows_2024_location: "Art & Sushi",
    solo_shows_2024_city: "Madrid, Spain",
    solo_shows_2024_date: "Feb–Jun 2024",

    group_shows_title: "Group Shows",
    group_shows_2024_title: "Show me a Feeling",
    group_shows_2024_location: "Rue de Notre-Dame de Nazareth",
    group_shows_2024_city: "Paris, France",
    group_shows_2024_date: "Feb 2024",

    galleries_title: "Galleries",
    galleries_2022_title: "Gallery Artisans & Co.",
    galleries_2022_city: "Lanzarote, Spain",
    galleries_2022_exhibit: "This is Abstraction",
    galleries_2022_date: "July 2022 – October 2023",

    footer_text: "© 2025 Annie Rios. All rights reserved."
  },

  es: {
    page_title: "Sobre mi obra y biografía | Annie Rios",
    header_title: "Annie Rios",
    menu_label: "Menú",
    lang_en: "En",
    lang_es: "Es",

    about_title: "Sobre mi obra",
    about_text: `Annie Ríos (n. 2002), artista expresionista abstracta y pianista de origen español-panameño, explora la intersección entre la luz, la geometría y la experiencia humano-espiritual. A través de una técnica de aplanamiento cromático, interpreta el fenómeno de la refracción, permitiendo que el color se fusione orgánicamente, transformando así elementos cotidianos en composiciones serenas que invitan a la introspección.

Para Annie, el arte abstracto es una huella de identidad y transformación: una composición cargada de intuición y experiencia vivida. Su obra evoluciona como un lienzo trabajado en el tiempo: se aplican capas, se raspan y se recontextualizan, pero su energía esencial perdura. Fascinada por el diálogo entre la luz y la materia, Annie encuentra en la refracción una metáfora para cuestionar el ritmo acelerado de la vida urbana, que a menudo nos distrae de lo esencial: la experiencia humana y espiritual. A través de la abstracción, Annie construye un espacio íntimo orientado a la introspección personal absoluta. No busca imponer, sino permitir ser.

Su objetivo es crear una sinergia entre lo bello y lo fracturado, habilitando diálogos profundos entre el alma del espectador y la materia. De este modo, su obra busca fomentar un diálogo interno en las generaciones actuales, proponiendo una pausa reflexiva ante la abrupta tendencia a la distracción.

En este intercambio entre fluidez y geometría, es el observador quien completa la obra, integrando su propia experiencia para dotarla de sentido existencial.

Recientemente, su obra “Composition of a Refraction” fue seleccionada por un prestigioso jurado para formar parte de una exposición colectiva en la Fundación Los Carbonel (septiembre de 2024), donde solo diez artistas fueron elegidos. Este logro se suma a su trayectoria, que incluye su primera exposición individual en Madrid (febrero de 2024) y participaciones en colectivas en París y Lanzarote. Annie también ha ampliado su base de coleccionistas en Alemania, Estados Unidos, Francia y Panamá.

Comprometida con el impacto social de su arte, Annie destina parte de sus ganancias a apoyar un orfanato de niños con VIH en Colón, Panamá.`,

    download_portfolio: "(Descargar Portafolio)",

    solo_shows_title: "Exposiciones Individuales",
    solo_shows_2024_title: "Show me a Feeling",
    solo_shows_2024_location: "Art & Sushi",
    solo_shows_2024_city: "Madrid, España",
    solo_shows_2024_date: "Feb–Jun 2024",

    group_shows_title: "Exposiciones Colectivas",
    group_shows_2024_title: "Show me a Feeling",
    group_shows_2024_location: "Rue de Notre-Dame de Nazareth",
    group_shows_2024_city: "París, Francia",
    group_shows_2024_date: "Feb 2024",

    galleries_title: "Galerías",
    galleries_2022_title: "Gallery Artisans & Co.",
    galleries_2022_city: "Lanzarote, España",
    galleries_2022_exhibit: "This is Abstraction",
    galleries_2022_date: "Julio 2022 – Octubre 2023",

    footer_text: "© 2025 Annie Rios. Todos los derechos reservados."
  }
};


  // Function to update all text elements with data-i18n attributes
  function updateTranslations(language) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[language] && translations[language][key]) {
        if (el.tagName === 'META') {
          el.setAttribute('content', translations[language][key]);
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translations[language][key];
        } else {
          el.innerHTML = translations[language][key];
        }
      }
    });

    // Update document title
    if (translations[language]['page_title']) {
      document.title = translations[language]['page_title'];
    }
  }

  // Apply the language on page load
  updateTranslations(currentLanguage);

  // Update active language selection UI
  document.querySelectorAll('.lang-option').forEach(el => {
    el.classList.remove('active');
    if (el.getAttribute('data-lang') === currentLanguage) {
      el.classList.add('active');
    }
  });

  // Set up event listeners for language switcher
  document.querySelectorAll('.lang-option').forEach(el => {
    el.addEventListener('click', function() {
      const selectedLang = el.getAttribute('data-lang');
      if (selectedLang && selectedLang !== currentLanguage) {
        currentLanguage = selectedLang;
        localStorage.setItem('selectedLanguage', currentLanguage); // Save language preference
        updateTranslations(currentLanguage);
        
        // Update active class on language options
        document.querySelectorAll('.lang-option').forEach(langEl => {
          langEl.classList.remove('active');
        });
        el.classList.add('active');
      }
    });
  });
});
