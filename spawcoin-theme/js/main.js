/**
 * Spawcoin Theme JavaScript
 *
 * @package Spawcoin
 */

(function($) {
    'use strict';

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        const menuToggle = $('.mobile-menu-toggle');
        const navigation = $('.main-navigation');

        menuToggle.on('click', function(e) {
            e.preventDefault();
            navigation.toggleClass('active');
            $(this).toggleClass('active');

            // Toggle icon
            const icon = $(this).find('i');
            if (icon.hasClass('fa-bars')) {
                icon.removeClass('fa-bars').addClass('fa-times');
            } else {
                icon.removeClass('fa-times').addClass('fa-bars');
            }
        });

        // Close menu when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.main-navigation, .mobile-menu-toggle').length) {
                navigation.removeClass('active');
                menuToggle.removeClass('active');
                menuToggle.find('i').removeClass('fa-times').addClass('fa-bars');
            }
        });

        // Close menu when clicking on a link
        $('.main-navigation a').on('click', function() {
            if ($(window).width() <= 768) {
                navigation.removeClass('active');
                menuToggle.removeClass('active');
                menuToggle.find('i').removeClass('fa-times').addClass('fa-bars');
            }
        });
    }

    /**
     * Smooth Scrolling for Anchor Links
     */
    function initSmoothScroll() {
        $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').on('click', function(e) {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                let target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

                if (target.length) {
                    e.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top - 80
                    }, 800, 'swing');
                }
            }
        });
    }

    /**
     * Header Scroll Effect
     */
    function initHeaderScroll() {
        const header = $('.site-header');
        let lastScroll = 0;

        $(window).on('scroll', function() {
            const currentScroll = $(this).scrollTop();

            if (currentScroll > 100) {
                header.addClass('scrolled');
            } else {
                header.removeClass('scrolled');
            }

            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.css('transform', 'translateY(-100%)');
            } else {
                header.css('transform', 'translateY(0)');
            }

            lastScroll = currentScroll;
        });
    }

    /**
     * Fade In Up Animation on Scroll
     */
    function initScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe all elements that should animate
        document.querySelectorAll('.blog-card, .team-member, .testimonial-card, .video-item, .roadmap-item').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Back to Top Button
     */
    function initBackToTop() {
        // Create back to top button if it doesn't exist
        if (!$('#back-to-top').length) {
            $('body').append('<button id="back-to-top" class="back-to-top" aria-label="Back to Top"><i class="fas fa-arrow-up"></i></button>');
        }

        const backToTop = $('#back-to-top');

        // Show/hide button on scroll
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 300) {
                backToTop.addClass('show');
            } else {
                backToTop.removeClass('show');
            }
        });

        // Scroll to top on click
        backToTop.on('click', function(e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 600);
        });
    }

    /**
     * Add active class to current menu item
     */
    function initActiveMenuItem() {
        const currentUrl = window.location.href;
        $('.main-navigation a').each(function() {
            if (this.href === currentUrl) {
                $(this).parent().addClass('current-menu-item');
            }
        });
    }

    /**
     * Parallax Effect for Hero Section
     */
    function initParallax() {
        $(window).on('scroll', function() {
            const scrolled = $(this).scrollTop();
            $('.hero-section').css('background-position-y', -(scrolled * 0.5) + 'px');
        });
    }

    /**
     * Copy to Clipboard for Wallet Address
     */
    function initCopyToClipboard() {
        $('.copy-to-clipboard').on('click', function(e) {
            e.preventDefault();
            const text = $(this).data('clipboard-text');

            // Create temporary input
            const tempInput = $('<input>');
            $('body').append(tempInput);
            tempInput.val(text).select();
            document.execCommand('copy');
            tempInput.remove();

            // Show feedback
            const originalText = $(this).text();
            $(this).text('Copied!');
            setTimeout(() => {
                $(this).text(originalText);
            }, 2000);
        });
    }

    /**
     * Countdown Timer (if needed for launches)
     */
    function initCountdown(targetDate) {
        const countdownEl = $('#countdown');
        if (!countdownEl.length) return;

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                countdownEl.html('<p>Launch Time!</p>');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownEl.html(`
                <div class="countdown-item">
                    <span class="countdown-value">${days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${hours}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${minutes}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${seconds}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            `);
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    /**
     * Lazy Load Images (alternative to native lazy loading)
     */
    function initLazyLoad() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Initialize all functions on document ready
     */
    $(document).ready(function() {
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
        initScrollAnimations();
        initBackToTop();
        initActiveMenuItem();
        initParallax();
        initCopyToClipboard();
        initLazyLoad();

        // Initialize countdown if element exists
        // Example: initCountdown('2024-12-31 23:59:59');
    });

    /**
     * Re-initialize on window resize
     */
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Re-init functions that need to respond to resize
            if ($(window).width() > 768) {
                $('.main-navigation').removeClass('active');
                $('.mobile-menu-toggle').removeClass('active');
                $('.mobile-menu-toggle i').removeClass('fa-times').addClass('fa-bars');
            }
        }, 250);
    });

})(jQuery);
