/* ===============================================
   SHOW ME A FEELING: ENHANCED PROFESSIONAL GALLERY
   ============================================== */

gsap.registerPlugin(ScrollTrigger);

// Global variables for performance
let scrollTimeout;
let lastScrollTop = 0;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🖼️ Annie Rios Gallery - Initializing Professional Effects');
    
    // Initialize all gallery functionality
    initProfessionalScrollAnimations();
    initEnhancedLazyLoading();
    initEnquiryForms();
    initArtworkModal();
    initInquiryModal();
    
    // Enhanced professional features
    initMobileMenu();
    initEnhancedImageZoom();
    initEnhancedLoadingStates();
    initEnhancedPerformanceOptimizations();
    initEnhancedAnalytics();
    initParallaxEffects();
    initStaggeredReveals();
    initScrollProgress();
    initHeaderBehavior();
    
    // Initialize animations with professional timing
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initializeProfessionalAnimations();
    } else {
        // Reduced motion fallback - instant reveal
        const animatedElements = document.querySelectorAll('.artwork-item, .hero-background, .central-photo');
        animatedElements.forEach((elem) => {
            elem.style.opacity = 1;
            elem.style.transform = 'none';
        });
    }

    // Initialize additional functionality
    initializeLanguageSwitcher();
    initializeShareButton();
});

// =============================================
// ENHANCED PROFESSIONAL SCROLL ANIMATIONS
// =============================================

function initProfessionalScrollAnimations() {
    const observerOptions = {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = Math.min(entry.boundingClientRect.y * 0.1, 300);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Add subtle scale effect for depth
                    if (entry.target.classList.contains('artwork-item')) {
                        gsap.to(entry.target, {
                            scale: 1.02,
                            duration: 0.6,
                            ease: "power2.out",
                            yoyo: true,
                            repeat: 1
                        });
                    }
                }, delay);
            }
        });
    }, observerOptions);

    // Observe all artwork items with staggered timing
    document.querySelectorAll('.artwork-item').forEach((element, index) => {
        element.style.setProperty('--stagger-delay', `${index * 0.1}s`);
        observer.observe(element);
    });

    // Observe hero elements
    document.querySelectorAll('.hero-background, .central-photo').forEach(element => {
        observer.observe(element);
    });
}

// Enhanced lazy loading with progressive blur effect
function initEnhancedLazyLoading() {
    const lazyImages = document.querySelectorAll('.artwork-image[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Create smooth progressive loading effect
                gsap.to(img, {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power2.out',
                    onComplete: () => {
                        imageObserver.unobserve(img);
                    }
                });
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px 0px 50px 0px'
    });

    lazyImages.forEach(img => {
        // Set initial state for progressive loading
        img.style.opacity = '0';
        img.style.transform = 'scale(1.1)';
        img.style.filter = 'blur(5px)';
        img.style.transition = 'none'; // Let GSAP handle animations
        
        imageObserver.observe(img);
    });
}

// Enhanced enquiry forms with animation
function initEnquiryForms() {
    const enquiryButtons = document.querySelectorAll('.enquire-button');
    
    enquiryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Add click animation
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
            
            // Get artwork details
            const artworkItem = this.closest('.artwork-item');
            const image = artworkItem.querySelector('.artwork-image');
            const title = artworkItem.querySelector('.artwork-title');
            const details = artworkItem.querySelector('.artwork-details');
            
            const artworkDetails = {
                artist: 'Annie Rios',
                title: title ? title.textContent : 'Untitled',
                year: '2024-2025',
                medium: 'Acrylic and mixed media on canvas',
                dimensions: details ? details.textContent : '',
                imageSrc: image ? image.src : ''
            };
            
            // Show enquiry modal with artwork details
            showInquiryModal(artworkDetails);
        });
    });
}

// =============================================
// ENHANCED PROFESSIONAL ANIMATIONS
// =============================================

function initializeProfessionalAnimations() {
    const galleryItems = document.querySelectorAll('.artwork-item');
    
    if (!galleryItems.length) {
        console.warn('No artwork items found for animation.');
        return;
    }

    // Enhanced mobile-specific configuration
    if (window.innerWidth < 768) {
        initMobileAnimations(galleryItems);
    } else {
        initDesktopAnimations(galleryItems);
    }

    initHeroAnimations();
    initScrollIndicatorAnimations();
}

function initMobileAnimations(galleryItems) {
    // Enhanced mobile animations with better timing
    galleryItems.forEach((item, index) => {
        // Create staggered entrance with subtle variations
        const delay = index * 0.08;
        const yOffset = 40 + (index % 3) * 10; // Varied entrance depth
        
        gsap.fromTo(
            item,
            { 
                opacity: 0, 
                y: yOffset,
                rotationX: 5,
                scale: 0.95
            },
            {
                opacity: 1,
                y: 0,
                rotationX: 0,
                scale: 1,
                duration: 0.9,
                delay: delay,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    end: "top 60%",
                    toggleActions: "play none none none",
                    markers: false
                }
            }
        );
    });

    // Enhanced mobile image animations
    const mobileImages = document.querySelectorAll('.artwork-image, .central-photo, .hero-background');

    mobileImages.forEach((img, index) => {
        gsap.fromTo(
            img,
            { 
                opacity: 0, 
                scale: 0.92,
                filter: 'brightness(1.1) contrast(0.9)'
            },
            { 
                opacity: 1, 
                scale: 1,
                filter: 'brightness(1) contrast(1)',
                duration: 1.2,
                delay: index * 0.05,
                ease: 'sine.out',
                scrollTrigger: {
                    trigger: img,
                    start: "top 85%",
                    end: "top 50%",
                    scrub: false,
                    markers: false,
                }
            }
        );
    });
}

function initDesktopAnimations(galleryItems) {
    // Professional desktop animations with depth and sophistication
    galleryItems.forEach((item, index) => {
        const delay = index * 0.12;
        const yOffset = 80 + (index % 4) * 15; // Dynamic depth based on position
        
        gsap.fromTo(
            item,
            { 
                opacity: 0, 
                y: yOffset,
                rotationY: 2,
                scale: 0.98
            },
            {
                opacity: 1,
                y: 0,
                rotationY: 0,
                scale: 1,
                duration: 1.4,
                delay: delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    end: "top 40%",
                    toggleActions: "play none none none",
                    markers: false
                }
            }
        );

        // Add hover effect for desktop
        if (window.innerWidth > 1024) {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    scale: 1.03,
                    y: -5,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    scale: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        }
    });
}

function initHeroAnimations() {
    // Enhanced hero text animation
    const heroText = document.querySelector('.hero .text-container');
    if (heroText) {
        gsap.fromTo(
            heroText,
            { 
                opacity: 0, 
                y: 80,
                filter: 'blur(10px)'
            },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.hero',
                    start: "top 80%",
                    end: "top 30%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Hero background parallax
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        gsap.to(heroBackground, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: '.hero',
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }
}

function initScrollIndicatorAnimations() {
    // Enhanced scroll indicator with multiple animations
    const scrollIndicator = document.querySelector('.scroll-indicator-hero');
    if (scrollIndicator) {
        // Bouncing animation
        gsap.to(scrollIndicator, {
            y: 12,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Pulse effect
        gsap.to(scrollIndicator, {
            scale: 1.1,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Fade out on scroll
        gsap.to(scrollIndicator, {
            opacity: 0,
            duration: 0.5,
            scrollTrigger: {
                trigger: '.hero',
                start: "top 70%",
                end: "top 50%",
                toggleActions: "play reverse play reverse"
            }
        });
    }
}

// =============================================
// STAGGERED REVEAL & PARALLAX EFFECTS
// =============================================

function initStaggeredReveals() {
    // Create professional staggered reveal for gallery items
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.artwork-item');
                gsap.fromTo(items, 
                    {
                        opacity: 0,
                        y: 50,
                        scale: 0.95
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: {
                            each: 0.1,
                            from: "start"
                        },
                        ease: "power2.out",
                        delay: 0.2
                    }
                );
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const gallerySection = document.querySelector('.collection-grid');
    if (gallerySection) {
        revealObserver.observe(gallerySection);
    }
}

function initParallaxEffects() {
    // Only enable on desktop for performance
    if (window.innerWidth < 1024) return;
    // Subtle parallax for artwork images
    const artworkImages = document.querySelectorAll('.artwork-image');
    artworkImages.forEach((img, index) => {
        gsap.to(img, {
            yPercent: -25 - (index % 3) * 2, // Varied parallax depth
            ease: "none",
            scrollTrigger: {
                trigger: img.closest('.artwork-item'),
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
                markers: false 
            }
        });
    });
}

function initScrollProgress() {
    // Create scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
        width: 0%;
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// =============================================
// ENHANCED HEADER BEHAVIOR
// =============================================

function initHeaderBehavior() {
    const header = document.querySelector('.custom-header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    // Throttled scroll handler for performance
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down - hide header
            gsap.to(header, {
                y: -100,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            // Scrolling up - show header
            gsap.to(header, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
        
        // Add background when scrolled
        if (currentScrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollY = currentScrollY;
    };

    // Throttle scroll events
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    });
}

// =============================================
// UPDATED DETAIL IMAGES FUNCTIONALITY FOR MULTIPLE CONTAINERS
// =============================================

function initDetailImages(artworkId, mainImageSrc) {
    // Find the specific detail container for this artwork
    const detailContainer = document.getElementById(`detail-images-${artworkId}`);
    if (!detailContainer) return;
    
    const detailImages = detailContainer.querySelectorAll('.detail-image');
    const mainModalImage = document.getElementById('modal-image');
    
    if (!detailImages.length || !mainModalImage) return;
    
    // Update main detail image with current artwork image
    const mainDetailImage = detailContainer.querySelector('.detail-image.active');
    if (mainDetailImage) {
        mainDetailImage.src = mainImageSrc;
        mainDetailImage.setAttribute('data-full-image', mainImageSrc);
    }
    
    detailImages.forEach(image => {
        image.addEventListener('click', function() {
            // Update main modal image
            mainModalImage.src = this.getAttribute('data-full-image');
            
            // Update alt text
            mainModalImage.alt = this.alt;
            
            // Add active state to clicked image
            detailImages.forEach(img => img.classList.remove('active'));
            this.classList.add('active');
            
            // Reset zoom when switching detail images
            resetImageZoom();
        });
    });
}

function resetImageZoom() {
    const modalImage = document.getElementById('modal-image');
    if (!modalImage) return;
    
    gsap.to(modalImage, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
    });
    
    // Reset zoom state
    if (window.zoomState) {
        window.zoomState = {
            isZoomed: false,
            currentScale: 1,
            currentX: 0,
            currentY: 0
        };
    }
    
    modalImage.style.cursor = 'zoom-in';
}

// =============================================
// ENHANCED ARTWORK MODAL WITH DETAIL IMAGES
// =============================================

function initArtworkModal() {
    const modal = document.getElementById('artwork-modal');
    if (!modal) return;

    const modalImage = document.getElementById('modal-image');
    const modalArtist = document.getElementById('modal-artist');
    const modalTitle = document.getElementById('modal-title');
    const modalYear = document.getElementById('modal-year');
    const modalMedium = document.getElementById('modal-medium');
    const modalDimensions = document.getElementById('modal-dimensions');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const prevBtn = modal.querySelector('.prev-btn');
    const nextBtn = modal.querySelector('.next-btn');
    const inquireBtn = modal.querySelector('.inquire-btn');

    let currentArtworkIndex = 0;
    let artworks = [];

    // Initialize artworks array
    function initArtworks() {
        artworks = Array.from(document.querySelectorAll('.artwork-item'));
    }

    // Open modal with specific artwork
    function openModal(index) {
        const artwork = artworks[index];
        const img = artwork.querySelector('.artwork-image');
        const titleElement = artwork.querySelector('.artwork-title');
        const detailsElement = artwork.querySelector('.artwork-details');
        const detailsDivs = detailsElement ? detailsElement.querySelectorAll('div') : [];
        const artworkId = artwork.getAttribute('data-artwork-id');

        // Get data from elements
        const imgSrc = img.src;
        const imgAlt = img.alt;
        const titleText = titleElement ? titleElement.textContent : 'Untitled';

        // Populate modal
        modalImage.src = imgSrc;
        modalImage.alt = imgAlt;
        modalArtist.textContent = 'Annie Rios';
        modalTitle.textContent = titleText;
        modalYear.textContent = '2025';

        // UPDATED: Handle detail images for ALL artworks with detail containers
        // Hide all detail containers first
        document.querySelectorAll('.detail-images-container').forEach(container => {
            container.style.display = 'none';
        });
        
        // Show the specific detail container for this artwork
        const detailContainer = document.getElementById(`detail-images-${artworkId}`);
        if (detailContainer) {
            detailContainer.style.display = 'block';
            
            // Reset detail images active state and set main image as active
            const detailImages = detailContainer.querySelectorAll('.detail-image');
            detailImages.forEach(img => img.classList.remove('active'));
            
            // Set main detail image as active
            const mainDetailImage = detailContainer.querySelector('.detail-image');
            if (mainDetailImage) {
                mainDetailImage.classList.add('active');
            }
            
            // Initialize detail images functionality with current image
            setTimeout(() => {
                initDetailImages(artworkId, imgSrc);
            }, 100);
        }

        // Handle medium and dimensions
        if (detailsDivs.length >= 2) {
            modalMedium.textContent = detailsDivs[0].textContent;
            modalDimensions.textContent = detailsDivs[1].textContent;
        } else if (detailsElement) {
            const text = detailsElement.textContent;
            if (text.includes('Acrylic')) {
                modalMedium.textContent = text;
                modalDimensions.textContent = '';
            } else {
                modalMedium.textContent = 'Acrylic on canvas, oak wood frame';
                modalDimensions.textContent = text;
            }
        } else {
            modalMedium.textContent = 'Acrylic on canvas, oak wood frame';
            modalDimensions.textContent = '';
        }

        // Clear description if not used
        if (modalDescription) {
            modalDescription.textContent = '';
        }

        currentArtworkIndex = index;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset zoom when opening new artwork
        resetImageZoom();

        updateNavigation();
    }

    // Update navigation buttons
    function updateNavigation() {
        if (prevBtn && nextBtn) {
            prevBtn.style.display = currentArtworkIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentArtworkIndex < artworks.length - 1 ? 'block' : 'none';
        }
    }

    // Navigation functions
    function showNext() {
        if (currentArtworkIndex < artworks.length - 1) {
            openModal(currentArtworkIndex + 1);
        }
    }

    function showPrev() {
        if (currentArtworkIndex > 0) {
            openModal(currentArtworkIndex - 1);
        }
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (window.inquiryModalTimeout) {
            clearTimeout(window.inquiryModalTimeout);
        }
        
        // Reset zoom when closing modal
        resetImageZoom();
    }

    // Initialize
    initArtworks();

    // Event listeners for artworks
    document.querySelectorAll('.artwork-item').forEach((artwork, index) => {
        artwork.style.cursor = 'pointer';
        
        // Click on image container or artwork item (but not enquire button)
        const imageContainer = artwork.querySelector('.artwork-image-container');
        if (imageContainer) {
            imageContainer.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(index);
            });
        } else {
            artwork.addEventListener('click', (e) => {
                // Don't trigger if clicking on enquire button
                if (e.target.classList.contains('enquire-button') || e.target.closest('.enquire-button')) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                openModal(index);
            });
        }
    });

    // Modal control events
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    // Inquire button in modal
    if (inquireBtn) {
        inquireBtn.addEventListener('click', function() {
            const artworkDetails = {
                artist: modalArtist.textContent,
                title: modalTitle.textContent,
                year: modalYear.textContent,
                medium: modalMedium.textContent,
                dimensions: modalDimensions.textContent,
                imageSrc: modalImage.src
            };
            closeModal();
            showInquiryModal(artworkDetails);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Prevent modal close when clicking inside content
    const modalContainer = modal.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// =============================================
// ENHANCED IMAGE ZOOM WITH DETAIL IMAGES SUPPORT
// =============================================

function initEnhancedImageZoom() {
    const modalImage = document.getElementById('modal-image');
    if (!modalImage) return;

    // Initialize zoom state
    window.zoomState = {
        isZoomed: false,
        currentScale: 1,
        currentX: 0,
        currentY: 0
    };

    function resetZoom() {
        gsap.to(modalImage, {
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
        });
        window.zoomState = {
            isZoomed: false,
            currentScale: 1,
            currentX: 0,
            currentY: 0
        };
        modalImage.style.cursor = 'zoom-in';
    }

    modalImage.addEventListener('click', function(e) {
        // Check if any detail container is visible
        const visibleDetailContainer = document.querySelector('.detail-images-container[style*="display: block"]');
        
        if (visibleDetailContainer) {
            // Only allow zoom on the main modal image, not on detail images
            if (!window.zoomState.isZoomed) {
                // Smooth zoom in
                window.zoomState.currentScale = 2;
                gsap.to(modalImage, {
                    scale: window.zoomState.currentScale,
                    duration: 0.6,
                    ease: "power2.out"
                });
                modalImage.style.cursor = 'zoom-out';
                window.zoomState.isZoomed = true;
            } else {
                // Smooth zoom out
                resetZoom();
            }
        } else {
            // Regular zoom behavior for other artworks
            if (!window.zoomState.isZoomed) {
                window.zoomState.currentScale = 2;
                gsap.to(modalImage, {
                    scale: window.zoomState.currentScale,
                    duration: 0.6,
                    ease: "power2.out"
                });
                modalImage.style.cursor = 'zoom-out';
                window.zoomState.isZoomed = true;
            } else {
                resetZoom();
            }
        }
    });

    // Enhanced pan functionality
    let startX, startY;
    let isDragging = false;

    modalImage.addEventListener('mousedown', function(e) {
        if (!window.zoomState.isZoomed) return;
        
        e.preventDefault();
        isDragging = true;
        startX = e.clientX - window.zoomState.currentX;
        startY = e.clientY - window.zoomState.currentY;
        modalImage.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !window.zoomState.isZoomed) return;
        
        window.zoomState.currentX = e.clientX - startX;
        window.zoomState.currentY = e.clientY - startY;
        
        gsap.to(modalImage, {
            x: window.zoomState.currentX,
            y: window.zoomState.currentY,
            duration: 0.1,
            ease: "power1.out"
        });
    });

    document.addEventListener('mouseup', function() {
        if (window.zoomState.isZoomed) {
            modalImage.style.cursor = 'zoom-out';
        }
        isDragging = false;
    });

    // Enhanced touch events
    modalImage.addEventListener('touchstart', function(e) {
        if (!window.zoomState.isZoomed) return;
        
        e.preventDefault();
        isDragging = true;
        startX = e.touches[0].clientX - window.zoomState.currentX;
        startY = e.touches[0].clientY - window.zoomState.currentY;
    });

    modalImage.addEventListener('touchmove', function(e) {
        if (!isDragging || !window.zoomState.isZoomed) return;
        
        e.preventDefault();
        window.zoomState.currentX = e.touches[0].clientX - startX;
        window.zoomState.currentY = e.touches[0].clientY - startY;
        
        gsap.to(modalImage, {
            x: window.zoomState.currentX,
            y: window.zoomState.currentY,
            duration: 0.1,
            ease: "power1.out"
        });
    });

    modalImage.addEventListener('touchend', function() {
        isDragging = false;
    });

    // Reset zoom when modal closes
    const modal = document.getElementById('artwork-modal');
    if (modal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (!modal.classList.contains('active')) {
                        resetZoom();
                    }
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
    }
}

// =============================================
// INQUIRY MODAL
// =============================================

function initInquiryModal() {
    const modal = document.getElementById('inquiry-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const form = document.getElementById('inquiry-form');
    const errorRow = form ? form.querySelector('.error-row') : null;
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("k6NvTeVJUSB2nGne4"); // Your EmailJS public key
    }

    // Artwork preview elements
    const previewImg = document.getElementById('inquiry-preview-img');
    const previewArtist = document.getElementById('inquiry-preview-artist');
    const previewTitle = document.getElementById('inquiry-preview-title');
    const previewYear = document.getElementById('inquiry-preview-year');
    const previewMedium = document.getElementById('inquiry-preview-medium');
    const previewDimensions = document.getElementById('inquiry-preview-dimensions');

    let currentArtworkData = null;

    // Make showInquiryModal globally accessible
    window.showInquiryModal = function(artworkDetails) {
        currentArtworkData = artworkDetails;
        
        // Populate artwork preview
        if (previewImg && artworkDetails.imageSrc) previewImg.src = artworkDetails.imageSrc;
        if (previewArtist) previewArtist.textContent = artworkDetails.artist || 'Annie Rios';
        if (previewTitle) previewTitle.textContent = artworkDetails.title || 'Untitled';
        if (previewYear) previewYear.textContent = artworkDetails.year || '2024-2025';
        if (previewMedium) previewMedium.textContent = artworkDetails.medium || 'Acrylic and mixed media on canvas';
        if (previewDimensions) previewDimensions.textContent = artworkDetails.dimensions || '';
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Clear messages
        if (errorRow) errorRow.style.display = 'none';
        if (form) form.style.display = 'block';
    }

    function closeInquiryModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (form) form.reset();
        currentArtworkData = null;
    }

    // Form validation
    function validateForm(formData) {
        const errors = [];
        
        if (!formData.name?.trim()) {
            errors.push('Name is required');
        }
        
        if (!formData.email?.trim()) {
            errors.push('Email is required');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.push('Please enter a valid email address');
        }
        
        return errors;
    }

    // Form submission handler
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('inquiry-name').value,
                email: document.getElementById('inquiry-email').value,
                phone: document.getElementById('inquiry-phone').value,
                message: document.getElementById('inquiry-message').value
            };
            
            const errors = validateForm(formData);
            
            if (errors.length > 0) {
                if (errorRow) {
                    errorRow.textContent = errors.join(', ');
                    errorRow.style.display = 'block';
                }
                return;
            }
            
            // Show loading state
            const submitButton = form.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            try {
                // Prepare template parameters
                const templateParams = {
                    from_name: formData.name,
                    from_email: formData.email,
                    phone: formData.phone || 'Not provided',
                    message: formData.message || 'No message provided',
                    artwork_title: currentArtworkData.title,
                    artwork_artist: currentArtworkData.artist,
                    artwork_year: currentArtworkData.year,
                    artwork_medium: currentArtworkData.medium,
                    artwork_dimensions: currentArtworkData.dimensions,
                    inquiry_date: new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })
                };
                
                // Send email using EmailJS
                if (typeof emailjs !== 'undefined') {
                    await emailjs.send(
                        'service_7r5tim4',    // Your Service ID
                        'template_2y9sdk8',   // Your Template ID
                        templateParams
                    );
                }
                
                // Success handling
                alert('Thank you! Your enquiry about "' + currentArtworkData.title + '" has been sent successfully. We will get back to you within 24 hours.');
                closeInquiryModal();
                
            } catch (error) {
                console.error('EmailJS error:', error);
                if (errorRow) {
                    errorRow.textContent = 'Sorry, there was an error sending your enquiry. Please try again or contact us directly.';
                    errorRow.style.display = 'block';
                }
            } finally {
                // Reset loading state
                if (submitButton) {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }
            }
        });
    }

    // Close modal events
    if (closeBtn) closeBtn.addEventListener('click', closeInquiryModal);
    if (overlay) overlay.addEventListener('click', closeInquiryModal);
    
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active') && e.key === 'Escape') {
            closeInquiryModal();
        }
    });
}

// =============================================
// LANGUAGE SWITCHER
// =============================================

function initializeLanguageSwitcher() {
    const langOptions = document.querySelectorAll(".lang-option");

    const translations = {
        en: {
            // Header & Menu
            header_title: "Annie Rios",
            menu_text: "Menu",
            menu_collections: "Collections",
            menu_about: "About",
            menu_studio: "The Studio",

            // Hero Section
            hero_title: "Show Me A Feeling",
            hero_subtitle: "Collection",
            hero_year: "2023-2024",

            // Scroll
            scroll_text: "Scroll",

            // Artworks
            artwork_red_thread: "Red Thread",
            artwork_casa_amarilla: "Casa Amarilla",
            artwork_el_ocaso: "El Ocaso",
            artwork_blue_mosaics: "Blue Mosaics",
            artwork_final_verano: "Final del Verano",
            artwork_details_medium: "Acrylic and mixed media on canvas",
            enquire_button: "Enquire",

            // Modal
            modal_artist: "Annie Rios",
            modal_inquire: "Inquire",
            modal_share: "Share",

            // Inquiry form
            inquiry_form_header: "Enquiry form",
            inquiry_label_name: "Name *",
            inquiry_label_email: "Email *",
            inquiry_label_phone: "Phone",
            inquiry_label_message: "Message",
            inquiry_placeholder_message: "Your message about this artwork...",
            inquiry_submit_button: "Send enquiry",
            inquiry_required_note: "* denotes required fields",
            inquiry_privacy: "In order to respond to your enquiry, we will process the personal data you have supplied in accordance with our private rights"
        },

        es: {
            // Header & Menu
            header_title: "Annie Rios",
            menu_text: "Menú",
            menu_collections: "Colecciones",
            menu_about: "Sobre mí",
            menu_studio: "El Estudio",

            // Hero Section
            hero_title: "Muéstrame un Sentimiento",
            hero_subtitle: "Colección",
            hero_year: "2023-2024",

            // Scroll
            scroll_text: "Desplazar",

            // Artworks
            artwork_red_thread: "Hilo Rojo",
            artwork_casa_amarilla: "Casa Amarilla",
            artwork_el_ocaso: "El Ocaso",
            artwork_blue_mosaics: "Mosaicos Azules",
            artwork_final_verano: "Final del Verano",
            artwork_details_medium: "Acrílico y técnica mixta sobre lienzo",
            enquire_button: "Consultar",

            // Modal
            modal_artist: "Annie Rios",
            modal_inquire: "Consultar",
            modal_share: "Compartir",

            // Inquiry form
            inquiry_form_header: "Formulario de consulta",
            inquiry_label_name: "Nombre *",
            inquiry_label_email: "Correo electrónico *",
            inquiry_label_phone: "Teléfono",
            inquiry_label_message: "Mensaje",
            inquiry_placeholder_message: "Tu mensaje sobre esta obra...",
            inquiry_submit_button: "Enviar consulta",
            inquiry_required_note: "* indica campos obligatorios",
            inquiry_privacy: "Para responder a tu consulta, procesaremos los datos personales que has proporcionado de acuerdo con nuestra política"
        }
    };

    let currentLang = localStorage.getItem("language") || "en";

    function updateLanguage(lang) {
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.getAttribute("data-i18n");
            if (translations[lang]?.[key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // Update active state
        langOptions.forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });
        
        // Save to localStorage
        localStorage.setItem("language", lang);
        currentLang = lang;
    }

    langOptions.forEach((option) => {
        option.addEventListener("click", () => {
            const lang = option.getAttribute('data-lang');
            updateLanguage(lang);
        });
    });

    // Initialize with saved language
    updateLanguage(currentLang);

    // Scroll indicator
    const scrollIndicator = document.querySelector(".scroll-indicator-hero");
    if (scrollIndicator) {
        window.addEventListener("scroll", () => {
            scrollIndicator.classList.toggle("scrolled", window.scrollY > 50);
        });
    }
}

// =============================================
// SHARE BUTTON FUNCTIONALITY
// =============================================

function initializeShareButton() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const sharingContainer = this.closest('.social_sharing_wrap');
            const sharingLinks = sharingContainer.querySelector('.social_sharing_links');
            
            sharingLinks.classList.toggle('dropdown_open');
            
            // Close other open sharing menus
            document.querySelectorAll('.social_sharing_links').forEach(menu => {
                if (menu !== sharingLinks) {
                    menu.classList.remove('dropdown_open');
                }
            });
        });
    });

    // Close sharing menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.social_sharing_wrap')) {
            document.querySelectorAll('.social_sharing_links').forEach(menu => {
                menu.classList.remove('dropdown_open');
            });
        }
    });
}

// =============================================
// FIXED MOBILE MENU FUNCTIONALITY
// =============================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-option');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const body = document.body;

    if (menuToggle && fullscreenMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (!body.classList.contains('menu-open')) {
                // Open menu
                body.classList.add('menu-open');
                fullscreenMenu.classList.add('visible');
                menuToggle.setAttribute('aria-expanded', 'true');
            } else {
                // Close menu
                fullscreenMenu.classList.remove('visible');
                setTimeout(() => {
                    body.classList.remove('menu-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }, 800);
            }
        });

        // Close menu when clicking on links
        fullscreenMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                fullscreenMenu.classList.remove('visible');
                setTimeout(() => {
                    body.classList.remove('menu-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }, 800);
            });
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && body.classList.contains('menu-open')) {
                fullscreenMenu.classList.remove('visible');
                setTimeout(() => {
                    body.classList.remove('menu-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }, 800);
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (body.classList.contains('menu-open') && 
                !fullscreenMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                fullscreenMenu.classList.remove('visible');
                setTimeout(() => {
                    body.classList.remove('menu-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }, 800);
            }
        });
    } else {
        console.error('Menu elements not found:', {
            menuToggle: !!menuToggle,
            fullscreenMenu: !!fullscreenMenu
        });
    }
}

// ENHANCED LOADING STATES WITH ANIMATIONS
function initEnhancedLoadingStates() {
    const images = document.querySelectorAll('.artwork-image, .hero-background, .central-photo');
    
    images.forEach(img => {
        img.classList.add('loading');
        
        img.addEventListener('load', function() {
            this.classList.remove('loading');
            this.classList.add('loaded');
            
            // Add subtle scale animation when loaded
            gsap.fromTo(this, 
                { scale: 1.1 }, 
                { scale: 1, duration: 0.6, ease: "power2.out" }
            );
        });
        
        img.addEventListener('error', function() {
            this.classList.remove('loading');
            this.classList.add('error');
            console.error('Failed to load image:', this.src);
        });
    });

    // Add loading state for modal images
    const modalImage = document.getElementById('modal-image');
    if (modalImage) {
        modalImage.addEventListener('load', function() {
            this.classList.remove('loading');
            this.classList.add('loaded');
        });
        
        modalImage.addEventListener('error', function() {
            this.classList.remove('loading');
            this.classList.add('error');
            this.alt = 'Image failed to load';
        });
    }
}

// ENHANCED PERFORMANCE OPTIMIZATIONS
function initEnhancedPerformanceOptimizations() {
    // Throttle expensive operations
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Optimized scroll handler
    window.addEventListener('scroll', throttle(function() {
        // Performance-critical scroll operations
    }, 16)); // ~60fps

    // Preload critical images with priority
    function preloadCriticalImages() {
        const criticalImages = [
            '../images/IMG_1435.JPG',
            '../images/image34.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Lazy load non-critical resources
    function lazyLoadResources() {
        const lazyResources = document.querySelectorAll('[data-lazy-src]');
        const resourceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const resource = entry.target;
                    resource.src = resource.getAttribute('data-lazy-src');
                    resourceObserver.unobserve(resource);
                }
            });
        });

        lazyResources.forEach(resource => resourceObserver.observe(resource));
    }

    preloadCriticalImages();
    lazyLoadResources();
}

// ENHANCED ANALYTICS WITH PERFORMANCE TRACKING
function initEnhancedAnalytics() {
    const startTime = performance.now();
    
    window.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        console.log(`🖼️ Gallery loaded in ${loadTime.toFixed(2)}ms`);
    });

    // Track user interactions
    document.addEventListener('click', function(e) {
        if (e.target.closest('.artwork-image-container')) {
            const artworkTitle = e.target.closest('.artwork-item').querySelector('.artwork-title').textContent;
            console.log('🎨 Artwork viewed:', artworkTitle);
        }
        
        if (e.target.classList.contains('enquire-button')) {
            console.log('Enquiry initiated for artwork');
        }
    });

    // Track form submissions
    const enquiryForm = document.getElementById('inquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function() {
            console.log('Enquiry form submitted');
        });
    }

    // Track language changes
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            console.log('Language changed to:', this.getAttribute('data-lang'));
        });
    });
}

// =============================================
// SMOOTH SCROLLING ENHANCEMENT
// =============================================

// Enhanced smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (!href || href === '#' || href === '#!') {
            return;
        }
        
        try {
            document.querySelector(href);
        } catch (error) {
            console.error('Invalid CSS selector:', href, error);
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            // Smooth scroll with offset for fixed header
            const headerHeight = document.querySelector('.custom-header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =============================================
// FALLBACKS & ERROR HANDLING
// =============================================

// Enhanced fallback for older browsers
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported - using fallback animations');
    
    document.querySelectorAll('.artwork-item').forEach(el => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
    
    document.querySelectorAll('.artwork-image').forEach(img => {
        img.style.opacity = '1';
        img.style.filter = 'none';
    });
}

// Error boundary for GSAP
if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded - animations disabled');
    document.querySelectorAll('[class]').forEach(el => {
        el.style.animation = 'none';
    });
}

console.log('✨ Annie Rios Gallery - Professional Effects with Detail Images Loaded');