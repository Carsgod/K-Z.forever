// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    // Close mobile menu
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Handle scroll events for navbar transparency
    function handleNavbarScroll() {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        if (scrollY > heroHeight * 0.5) {
            navbar.classList.remove('transparent');
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('transparent');
            navbar.classList.remove('scrolled');
        }
    }

    // Smooth scroll to section
    function smoothScrollToSection(targetId) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Handle navigation link clicks
    function handleNavLinkClick(e) {
        const href = e.target.getAttribute('href');
        
        // Check if it's an internal anchor link
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            // Close mobile menu if open
            closeMobileMenu();
            
            // Smooth scroll to section
            smoothScrollToSection(href);
            
            // Update active nav link
            updateActiveNavLink(href);
        }
    }

    // Update active navigation link
    function updateActiveNavLink(activeHref) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeHref) {
                link.classList.add('active');
            }
        });
    }

    // Handle intersection observer for active link updates
    function setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeHref = `#${entry.target.id}`;
                    updateActiveNavLink(activeHref);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Setup hero text animations
    function setupHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero-text-overlay, .hero-card');
        const animationOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, animationOptions);

        heroElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
let sliderFrozen = false;
let forceSlideZeroOnReturn = false;

    function setupHeroSlider() {
        window.pauseSlider = function() {
    sliderFrozen = true;
    clearInterval(slideInterval);
};

window.resumeSlider = function() {
    sliderFrozen = false;

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[0].classList.add('active');
    dots[0].classList.add('active');

    currentSlide = 0;
    startAutoSlide();
};

        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        const videoControlBtn = document.getElementById('video-play-pause-btn');
        const videoControlIcon = videoControlBtn ? videoControlBtn.querySelector('i') : null;
        const videoMuteBtn = document.getElementById('video-mute-btn');
        const videoMuteIcon = videoMuteBtn ? videoMuteBtn.querySelector('i') : null;

        let currentSlide = 0;
        let slideInterval;

        // FIX: start auto slide safely
        function startAutoSlide() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                if (!sliderFrozen) {
                    nextSlide();
                }
            }, 5000);
        }
        
        function showSlide(index) {
            currentSlide = index;
            slides.forEach(slide => {
                slide.classList.remove('active');
                // Remove animate class from all slides
                const heroCard = slide.querySelector('.hero-card');
                const heroOverlay = slide.querySelector('.hero-text-overlay');
                if (heroCard) heroCard.classList.remove('animate');
                if (heroOverlay) heroOverlay.classList.remove('animate');
            });
            slides[index].classList.add('active');
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');

            // Add animate class to the active slide's hero elements
            const activeSlide = slides[index];
            const heroCard = activeSlide.querySelector('.hero-card');
            const heroOverlay = activeSlide.querySelector('.hero-text-overlay');
            if (heroCard) heroCard.classList.add('animate');
            if (heroOverlay) heroOverlay.classList.add('animate');

            // Handle video when navigating away from first slide
            const slideVideo = document.getElementById('slide-video');
            const slideVideoControls = document.querySelectorAll('.slide-video-control');
            const heroContainer = document.querySelector('.hero-container');
            const heroCenter = document.querySelector('.hero-center');

            if (index !== 0 && slideVideo) {
                slideVideo.pause();
                slideVideo.style.display = 'none';
                slideVideoControls.forEach(btn => btn.style.display = 'none');
            }
        }
        
        function stopAutoSlide() {
            clearInterval(slideInterval);
        }
        
                function nextSlide() {
            showSlide((currentSlide + 1) % slides.length);
        }

        function prevSlide() {
            showSlide((currentSlide - 1 + slides.length) % slides.length);
        }


        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoSlide();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startAutoSlide();
            });
        });

        const slider = document.querySelector('.hero-slider');
        if (slider) {
            slider.addEventListener('mouseenter', stopAutoSlide);
            slider.addEventListener('mouseleave', startAutoSlide);
        }

        showSlide(0);
        startAutoSlide();
    }

    function setupVideoPlayButton() {
        const playBtn = document.getElementById('video-play-btn');
        const slideVideo = document.getElementById('slide-video');
        const slideVideoPlayPauseBtn = document.getElementById('slide-video-play-pause-btn');
        const slideVideoMuteBtn = document.getElementById('video-mute-btn');
        const slideVideoControls = document.querySelectorAll('.slide-video-control');

        if (!playBtn || !slideVideo) return;

        playBtn.addEventListener('click', () => {
            window.pauseSlider();
            slideVideo.style.display = 'block';
            slideVideoControls.forEach(btn => btn.style.display = 'block');
            slideVideo.play();
        });

        function returnToHero() {
            slideVideo.pause();
            slideVideo.currentTime = 0;
            slideVideo.style.display = 'none';
            slideVideoControls.forEach(btn => btn.style.display = 'none');
            window.resumeSlider();
        }

        slideVideo.addEventListener('ended', returnToHero);

        if (slideVideoPlayPauseBtn) {
            slideVideoPlayPauseBtn.addEventListener('click', () => {
                if (slideVideo.paused) {
                    slideVideo.play();
                } else {
                    returnToHero();
                }
            });
        }

        if (slideVideoMuteBtn) {
            slideVideoMuteBtn.addEventListener('click', () => {
                slideVideo.muted = !slideVideo.muted;
                slideVideoMuteBtn.querySelector('i').className = slideVideo.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            });
        }
    }

    // Handle window resize
    function handleResize() {
        if (window.innerWidth <= 768) {
            navMenu.classList.add('mobile');
        } else {
            navMenu.classList.remove('mobile');
            closeMobileMenu();
        }
    }

    // Add event listeners
    hamburger.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });

    // Throttle scroll events for performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleNavbarScroll);
            ticking = true;
        }
    }

    window.addEventListener('scroll', () => {
        requestTick();
        ticking = false;
    });

    window.addEventListener('resize', handleResize);

    // Initialize navbar state
    handleNavbarScroll();
    handleResize();

    // Setup scroll spy
    setupScrollSpy();

    // Setup hero text animations
    setupHeroAnimations();

    // Setup hero slider
    setupHeroSlider();

    // Setup video play button
    setupVideoPlayButton();

    // Initialize RSVP form
    initializeRSVPForm();

    // Add loading animation for nav items
    function animateNavItems() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Call animation after a short delay
    setTimeout(animateNavItems, 500);

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Close mobile menu on Escape key
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Add touch swipe support for mobile menu
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 100;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && navMenu.classList.contains('active')) {
                // Swipe left - close menu
                closeMobileMenu();
            } else if (diff < 0 && !navMenu.classList.contains('active')) {
                // Swipe right - could implement opening menu from edge
                // Currently disabled for better UX
            }
        }
    }

    // Back to top functionality
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Show/hide back to top button
    function toggleBackToTopButton() {
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }

    window.addEventListener('scroll', toggleBackToTopButton);
});

// Countdown Timer Functionality
function initializeCountdown() {
    const weddingDate = new Date('2026-02-14T00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            // Wedding has passed
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }

    // Update immediately
    updateCountdown();

    // Update every second
    setInterval(updateCountdown, 1000);
}

// Initialize countdown when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCountdown();
});

  const elements = document.querySelectorAll(
    ".fade-in, .fade-in-up, .fade-in-left, .fade-in-right"
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  elements.forEach(el => observer.observe(el));



function createPetals() {
  for (let i = 0; i < 20; i++) {
    const petal = document.createElement("div");
    petal.classList.add("petal");

    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = 6 + Math.random() * 6 + "s";
    petal.style.opacity = Math.random();
    petal.style.transform = `scale(${0.6 + Math.random() * 0.8})`;

    document.getElementById('home').appendChild(petal);

    setTimeout(() => petal.remove(), 15000);
  }
}

setInterval(createPetals, 2000);




// RSVP Form Functionality
function initializeRSVPForm() {
    const rsvpForm = document.getElementById('rsvp-form');
    if (!rsvpForm) return;

    // Check if RSVP deadline has passed
    const deadline = new Date('2026-02-10T23:59:59');
    const now = new Date();
    if (now > deadline) {
        // Hide form and show closed message
        rsvpForm.style.display = 'none';
        const closedMessage = document.createElement('div');
        closedMessage.className = 'rsvp-closed-message';
        closedMessage.innerHTML = '<h3>RSVP Form Closed</h3><p>The RSVP deadline has passed on February 10, 2026. Thank you for your interest in celebrating with us!</p>';
        rsvpForm.parentNode.insertBefore(closedMessage, rsvpForm);
        return;
    }

    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(rsvpForm);
        const rsvpData = {
            fullName: formData.get('full-name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            guests: formData.get('guests'),
            attendance: formData.get('attendance'),
            category: formData.get('category'),
           
        };

        // Build message
        const message = `Hello, RSVP for Fauzia & Kuffour Wedding:
👤 Name: ${rsvpData.fullName}
📧 Email: ${rsvpData.email}
📞 Phone: ${rsvpData.phone || 'Not provided'}
👥 Guests: ${rsvpData.guests}
✅ Attendance: ${rsvpData.attendance}
📂 Category: ${rsvpData.category || 'None'}
Thank you!`;

        // Basic validation
        if (!rsvpData.fullName || !rsvpData.email || !rsvpData.guests || !rsvpData.attendance) {
            showRSVPMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(rsvpData.email)) {
            showRSVPMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Prepare links
        const emailSubject = encodeURIComponent('RSVP for Fauzia & Kuffour Wedding');
        const emailBody = encodeURIComponent(message);
        const emailLink = `mailto:Fauziaduut46@gmail.com?subject=${emailSubject}&body=${emailBody}`;

        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = "233207349801";
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Show modal
        const modal = document.getElementById('rsvp-modal');
        modal.style.display = 'block';

        // Handle Gmail button
        document.getElementById('rsvp-gmail-btn').onclick = function() {
            window.open(emailLink, '_blank');
            modal.style.display = 'none';
            showRSVPMessage('Thank you! Your RSVP has been sent via Gmail.', 'success');
            rsvpForm.reset();
        };

        // Handle WhatsApp button
        document.getElementById('rsvp-whatsapp-btn').onclick = function() {
            window.open(whatsappURL, '_blank');
            modal.style.display = 'none';
            showRSVPMessage('Thank you! Your RSVP has been sent via WhatsApp.', 'success');
            rsvpForm.reset();
        };

        // Handle SMS button
        document.getElementById('rsvp-sms-btn').onclick = function() {
            const smsURL = `sms:233207349801?body=${encodedMessage}`;
            window.open(smsURL, '_blank');
            modal.style.display = 'none';
            showRSVPMessage('Thank you! Your RSVP has been sent via SMS.', 'success');
            rsvpForm.reset();
        };

        // Show thank you message
        showRSVPMessage('Thank you!', 'success');

        // Reset form
        rsvpForm.reset();
    });
}

function showRSVPMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.rsvp-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `rsvp-message ${type}`;
    messageDiv.textContent = message;

    // Insert after form
    const form = document.getElementById('rsvp-form');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // Auto remove after 5 seconds for success, keep error until user interacts
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}





function initializeGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryRows = document.querySelectorAll('.gallery-row');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    let visibleItems = [];
    let lastScrollY = window.scrollY;
    let visibleRows = new Set([0]); // Track which rows are visible (index 0 is always visible)

    // Update visible items based on current filter
    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => {
            return item.style.display !== 'none';
        });
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });

            updateVisibleItems();
        });
    });

    // Initialize visible items
    updateVisibleItems();

    // Scroll reveal functionality
    function setupScrollReveal() {
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const rowIndex = Array.from(galleryRows).indexOf(entry.target);

                if (entry.isIntersecting) {
                    // Row is entering viewport
                    if (rowIndex > 0) {
                        visibleRows.add(rowIndex);
                        entry.target.classList.add('visible');
                        entry.target.classList.remove('hidden');
                    }
                } else {
                    // Row is leaving viewport
                    const currentScrollY = window.scrollY;
                    const scrollingDown = currentScrollY > lastScrollY;

                    if (rowIndex > 0 && !scrollingDown) {
                        // Scrolling up and row is above viewport
                        visibleRows.delete(rowIndex);
                        entry.target.classList.remove('visible');
                        entry.target.classList.add('hidden');
                    }

                    lastScrollY = currentScrollY;
                }
            });
        }, observerOptions);

        // Observe all scroll-reveal rows
        galleryRows.forEach((row, index) => {
            if (index > 0) { // Skip the always-visible row
                observer.observe(row);
            }
        });
    }

    // Initialize scroll reveal
    setupScrollReveal();

    // Show image in lightbox
    function showImage(index) {
        if (index < 0 || index >= visibleItems.length) return;

        currentImageIndex = index;
        const item = visibleItems[index];
        const img = item.querySelector('img');
        const info = item.querySelector('figcaption');

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;

        if (info) {
            lightboxCaption.textContent = info.textContent;
        } else {
            lightboxCaption.textContent = img.alt;
        }

        // Update counter
        lightboxCounter.textContent = `${index + 1} / ${visibleItems.length}`;

        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Hide navbar and back-to-top button
        const navbar = document.getElementById('navbar');
        const backToTop = document.getElementById('backToTop');
        if (navbar) navbar.style.display = 'none';
        if (backToTop) backToTop.style.display = 'none';
    }

    // Lightbox functionality
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateVisibleItems();
            const visibleIndex = visibleItems.indexOf(item);
            showImage(visibleIndex);
        });
    });

    // Navigation arrows
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : visibleItems.length - 1;
            showImage(newIndex);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = currentImageIndex < visibleItems.length - 1 ? currentImageIndex + 1 : 0;
            showImage(newIndex);
        });
    }

    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';

            // Show navbar and back-to-top button
            const navbar = document.getElementById('navbar');
            const backToTop = document.getElementById('backToTop');
            if (navbar) navbar.style.display = '';
            if (backToTop) backToTop.style.display = '';
        });
    }

    // Close lightbox when clicking outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';

            // Show navbar and back-to-top button
            const navbar = document.getElementById('navbar');
            const backToTop = document.getElementById('backToTop');
            if (navbar) navbar.style.display = '';
            if (backToTop) backToTop.style.display = '';
        }
    });

    // Touch navigation for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;

    lightbox.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = true;
        }
    }, { passive: false });

    lightbox.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;

        if (e.touches.length === 1) {
            touchEndX = e.touches[0].clientX;
            touchEndY = e.touches[0].clientY;

            // Prevent scrolling if it's a horizontal swipe
            const deltaX = Math.abs(touchEndX - touchStartX);
            const deltaY = Math.abs(touchEndY - touchStartY);

            if (deltaX > deltaY && deltaX > 10) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    lightbox.addEventListener('touchend', (e) => {
        if (!isSwiping) return;

        const deltaX = touchEndX - touchStartX;
        const deltaY = Math.abs(touchEndY - touchStartY);
        const minSwipeDistance = 50;

        // Only trigger swipe if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                // Swipe right - previous image
                const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : visibleItems.length - 1;
                showImage(newIndex);
            } else {
                // Swipe left - next image
                const newIndex = currentImageIndex < visibleItems.length - 1 ? currentImageIndex + 1 : 0;
                showImage(newIndex);
            }
        }

        isSwiping = false;
        touchStartX = 0;
        touchStartY = 0;
        touchEndX = 0;
        touchEndY = 0;
    }, { passive: false });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;

        if (e.key === 'Escape') {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : visibleItems.length - 1;
            showImage(newIndex);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const newIndex = currentImageIndex < visibleItems.length - 1 ? currentImageIndex + 1 : 0;
            showImage(newIndex);
        }
    });
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
});         
