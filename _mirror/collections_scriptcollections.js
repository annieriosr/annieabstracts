/* =============================================== */
/*   COLLECTIONS PAGE INTERACTIONS - FIXED NAV     */
/* =============================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Annie Rios Collections - Initializing Responsive Version');
    
    // Initialize all functionality
    initMenu();
    initLanguageSwitcher();
    initImageInteractions();
    initSmoothScrolling();
    initPageAnimations();
    initTouchInteractions();
    
    // Ensure menu starts closed
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    if (fullscreenMenu) {
        fullscreenMenu.classList.add('hidden');
    }
    
    // Add resize handler for responsive behavior
    window.addEventListener('resize', handleResize);
});

// ---------- RESPONSIVE HANDLING ----------
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    const imageContainers = document.querySelectorAll('.image-container');
    
    // Adjust hover effects for mobile
    imageContainers.forEach(container => {
        if (isMobile) {
            container.style.cursor = 'pointer';
        } else {
            container.style.cursor = 'default';
        }
    });
}

// ---------- TOUCH INTERACTIONS FOR MOBILE ----------
function initTouchInteractions() {
    const imageContainers = document.querySelectorAll('.image-container');
    let touchStartX = 0;
    let touchStartY = 0;
    
    imageContainers.forEach(container => {
        // Touch start
        container.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            
            // Add active state for mobile
            this.classList.add('touch-active');
        });
        
        // Touch end
        container.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            // Calculate distance
            const diffX = Math.abs(touchEndX - touchStartX);
            const diffY = Math.abs(touchEndY - touchStartY);
            
            // If it's a tap (not a swipe), trigger click
            if (diffX < 10 && diffY < 10) {
                this.click();
            }
            
            // Remove active state
            this.classList.remove('touch-active');
        });
        
        // Prevent long press context menu on mobile
        container.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
    });
}

// ---------- MENU FUNCTIONALITY - FIXED NAVIGATION ----------
function initMenu() {
    const menuOption = document.querySelector('.menu-option');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const body = document.body;

    if (menuOption && fullscreenMenu) {
        // Ensure menu starts in closed state
        fullscreenMenu.classList.add('hidden');
        body.style.overflow = 'auto';
        menuOption.setAttribute('aria-expanded', 'false');

        menuOption.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (fullscreenMenu.classList.contains('hidden')) {
                // Open menu
                openMenu();
            } else {
                // Close menu
                closeMenu();
            }
        });

        // FIXED: Allow menu links to work normally
        fullscreenMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't prevent default - let the link work normally
                closeMenu();
                // Navigation happens naturally via the href
            });
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !fullscreenMenu.classList.contains('hidden')) {
                closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!fullscreenMenu.classList.contains('hidden') && 
                !fullscreenMenu.contains(e.target) && 
                !menuOption.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Touch events for mobile menu
        fullscreenMenu.addEventListener('touchmove', function(e) {
            e.preventDefault();
        });
    }
}

function openMenu() {
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const body = document.body;
    const menuOption = document.querySelector('.menu-option');
    
    fullscreenMenu.classList.remove('hidden');
    body.style.overflow = 'hidden';
    menuOption.setAttribute('aria-expanded', 'true');
    animateMenuIn();
}

function closeMenu() {
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const body = document.body;
    const menuOption = document.querySelector('.menu-option');
    
    animateMenuOut();
    setTimeout(() => {
        fullscreenMenu.classList.add('hidden');
        body.style.overflow = 'auto';
        menuOption.setAttribute('aria-expanded', 'false');
    }, 500);
}

function animateMenuIn() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Reset any previous animations
    menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'none';
    });
    
    // Force reflow
    void document.querySelector('.fullscreen-menu').offsetHeight;
    
    // Animate in
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100 + 50);
    });
}

function animateMenuOut() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        }, index * 50);
    });
}

// ---------- LANGUAGE SWITCHER ----------
function initLanguageSwitcher() {
    const langOptions = document.querySelectorAll('.lang-option');
    
    const translations = {
        en: {
            header_title: "Annie Rios",
            header_description: "Collection of Works",
            menu_text: "Menu",
            menu_collections: "Collections",
            menu_about: "About",
            menu_studio: "The Studio",
            collection1_name: "This is Abstraction",
            collection1_year: "2019-2022",
            collection2_name: "Show me a Feeling",
            collection2_year: "2023-2024",
            collection3_name: "The 3 Elements of a Refraction",
            collection3_year: "2024-2025"
        },
        es: {
            header_title: "Annie Rios",
            header_description: "Colección de Obras",
            menu_text: "Menú",
            menu_collections: "Colecciones",
            menu_about: "Sobre Mí",
            menu_studio: "El Estudio",
            collection1_name: "Esto es Abstracción",
            collection1_year: "2019-2022",
            collection2_name: "Muéstrame un Sentimiento",
            collection2_year: "2023-2024",
            collection3_name: "Los 3 Elementos de una Refracción",
            collection3_year: "2024-2025"
        }
    };

    let currentLang = localStorage.getItem('language') || 'en';

    function updateLanguage(lang) {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Update active state
        langOptions.forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-lang') === lang);
        });

        // Save preference
        localStorage.setItem('language', lang);
        currentLang = lang;
    }

    // Add click events to language options
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            updateLanguage(lang);
        });
    });

    // Initialize with saved language
    updateLanguage(currentLang);
}

// ---------- IMAGE INTERACTIONS ----------
function initImageInteractions() {
    const imageContainers = document.querySelectorAll('.image-container');
    const isMobile = window.innerWidth <= 768;
    
    imageContainers.forEach(container => {
        // Desktop hover effects
        if (!isMobile && typeof gsap !== 'undefined') {
            container.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    scale: 1.02,
                    duration: 0.6,
                    ease: "power2.out"
                });
                
                gsap.to(this.querySelector('.number'), {
                    scale: 1.1,
                    duration: 0.6,
                    ease: "power2.out"
                });
                
                gsap.to(this.querySelector('.collection-name'), {
                    y: -5,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
            
            container.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out"
                });
                
                gsap.to(this.querySelector('.number'), {
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out"
                });
                
                gsap.to(this.querySelector('.collection-name'), {
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        }
        
        // Click/tap animation
        container.addEventListener('click', function(e) {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    scale: 0.98,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            }
            
            // FIXED: Allow the link to work naturally
            // Don't prevent default behavior
        });
    });
}

// ---------- SMOOTH SCROLLING ----------
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ---------- PAGE ANIMATIONS ----------
function initPageAnimations() {
    // Animate image containers on load
    if (typeof gsap !== 'undefined') {
        const imageContainers = document.querySelectorAll('.image-container');
        const isMobile = window.innerWidth <= 768;
        
        imageContainers.forEach((container, index) => {
            gsap.fromTo(container, 
                {
                    opacity: 0,
                    y: isMobile ? 30 : 50
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: "power2.out"
                }
            );
        });
    }
}

console.log('✨ Annie Rios Collections - Fixed Navigation Version Loaded');