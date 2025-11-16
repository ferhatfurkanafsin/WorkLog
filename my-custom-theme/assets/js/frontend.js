/**
 * Frontend JavaScript
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

(function($) {
    'use strict';

    /**
     * Initialize theme
     */
    function initTheme() {
        initMobileMenu();
        initSmoothScroll();
        initAnimateOnScroll();
        initLightbox();
        initNewsletterForm();
    }

    /**
     * Mobile menu toggle
     */
    function initMobileMenu() {
        const $nav = $('#site-navigation');
        const $menuToggle = $('<button class="mobile-menu-toggle" aria-label="Toggle Menu"><span></span><span></span><span></span></button>');

        if ($(window).width() <= 768) {
            if ($('.mobile-menu-toggle').length === 0) {
                $nav.before($menuToggle);
            }
        }

        $(document).on('click', '.mobile-menu-toggle', function() {
            $nav.slideToggle(300);
            $(this).toggleClass('active');
        });

        // Responsive handler
        $(window).on('resize', function() {
            if ($(window).width() > 768) {
                $nav.css('display', '');
                $('.mobile-menu-toggle').removeClass('active');
            }
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').on('click', function(e) {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
                location.hostname === this.hostname) {

                let target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

                if (target.length) {
                    e.preventDefault();

                    $('html, body').animate({
                        scrollTop: target.offset().top - 100
                    }, 800, function() {
                        const $target = $(target);
                        $target.focus();

                        if ($target.is(':focus')) {
                            return false;
                        } else {
                            $target.attr('tabindex', '-1');
                            $target.focus();
                        }
                    });
                }
            }
        });
    }

    /**
     * Animate blocks on scroll
     */
    function initAnimateOnScroll() {
        if (!window.IntersectionObserver) {
            return;
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-on-scroll');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.mct-block').forEach(function(block) {
            observer.observe(block);
        });
    }

    /**
     * Simple lightbox for gallery images
     */
    function initLightbox() {
        // Create lightbox HTML
        const lightboxHtml = `
            <div id="mct-lightbox" style="display: none;">
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <button class="lightbox-prev">&larr;</button>
                    <button class="lightbox-next">&rarr;</button>
                    <img src="" alt="">
                </div>
            </div>
        `;

        if ($('#mct-lightbox').length === 0) {
            $('body').append(lightboxHtml);
        }

        // Add lightbox styles
        const lightboxStyles = `
            <style>
                #mct-lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                }
                .lightbox-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                }
                .lightbox-content {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                }
                .lightbox-content img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }
                .lightbox-close,
                .lightbox-prev,
                .lightbox-next {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    font-size: 24px;
                    padding: 10px 15px;
                    cursor: pointer;
                    transition: background 0.3s;
                    z-index: 10001;
                }
                .lightbox-close:hover,
                .lightbox-prev:hover,
                .lightbox-next:hover {
                    background: white;
                }
                .lightbox-close {
                    top: 20px;
                    right: 20px;
                    font-size: 36px;
                }
                .lightbox-prev {
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .lightbox-next {
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            </style>
        `;

        if ($('#mct-lightbox-styles').length === 0) {
            $('head').append(lightboxStyles);
        }

        // Gallery image click
        let currentImages = [];
        let currentIndex = 0;

        $(document).on('click', '.mct-block-gallery img', function() {
            const $gallery = $(this).closest('.mct-block-gallery');
            currentImages = $gallery.find('img').map(function() {
                return $(this).attr('src');
            }).get();
            currentIndex = currentImages.indexOf($(this).attr('src'));

            showLightbox(currentImages[currentIndex]);
        });

        // Lightbox navigation
        $(document).on('click', '.lightbox-close, .lightbox-overlay', function() {
            hideLightbox();
        });

        $(document).on('click', '.lightbox-prev', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            showLightbox(currentImages[currentIndex]);
        });

        $(document).on('click', '.lightbox-next', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentImages.length;
            showLightbox(currentImages[currentIndex]);
        });

        // Keyboard navigation
        $(document).on('keydown', function(e) {
            if ($('#mct-lightbox').is(':visible')) {
                if (e.key === 'Escape') {
                    hideLightbox();
                } else if (e.key === 'ArrowLeft') {
                    $('.lightbox-prev').click();
                } else if (e.key === 'ArrowRight') {
                    $('.lightbox-next').click();
                }
            }
        });

        function showLightbox(imageSrc) {
            $('#mct-lightbox img').attr('src', imageSrc);
            $('#mct-lightbox').fadeIn(300);
            $('body').css('overflow', 'hidden');
        }

        function hideLightbox() {
            $('#mct-lightbox').fadeOut(300);
            $('body').css('overflow', '');
        }
    }

    /**
     * Newsletter form handling
     */
    function initNewsletterForm() {
        $('.mct-newsletter-form').on('submit', function(e) {
            e.preventDefault();

            const $form = $(this);
            const $email = $form.find('input[type="email"]');
            const $submit = $form.find('.mct-newsletter-submit');
            const originalText = $submit.text();

            // Basic validation
            if (!$email.val() || !isValidEmail($email.val())) {
                alert('Please enter a valid email address');
                return;
            }

            // Disable submit button
            $submit.prop('disabled', true).text('Subscribing...');

            // Here you would normally send the data to your backend
            // For now, we'll just simulate a success
            setTimeout(function() {
                $submit.text('Subscribed!');
                $email.val('');

                setTimeout(function() {
                    $submit.prop('disabled', false).text(originalText);
                }, 2000);
            }, 1000);
        });

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    }

    /**
     * Sticky header on scroll
     */
    function initStickyHeader() {
        const $header = $('.site-header');
        const headerOffset = $header.offset().top;

        $(window).on('scroll', function() {
            if ($(window).scrollTop() > headerOffset) {
                $header.addClass('sticky-header');
            } else {
                $header.removeClass('sticky-header');
            }
        });
    }

    // Initialize on document ready
    $(document).ready(function() {
        initTheme();
    });

})(jQuery);
