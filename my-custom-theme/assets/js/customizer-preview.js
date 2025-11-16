/**
 * Customizer Live Preview
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

(function($) {
    'use strict';

    // Primary Color
    wp.customize('mct_primary_color', function(value) {
        value.bind(function(to) {
            document.documentElement.style.setProperty('--primary-color', to);
        });
    });

    // Secondary Color
    wp.customize('mct_secondary_color', function(value) {
        value.bind(function(to) {
            document.documentElement.style.setProperty('--secondary-color', to);
        });
    });

    // Text Color
    wp.customize('mct_text_color', function(value) {
        value.bind(function(to) {
            document.documentElement.style.setProperty('--text-color', to);
        });
    });

    // Background Color
    wp.customize('mct_bg_color', function(value) {
        value.bind(function(to) {
            document.documentElement.style.setProperty('--bg-color', to);
        });
    });

    // Font Size
    wp.customize('mct_font_size', function(value) {
        value.bind(function(to) {
            document.documentElement.style.setProperty('--font-size-base', to + 'px');
        });
    });

    // Border Radius
    wp.customize('mct_border_radius', function(value) {
        value.bind(function(to) {
            document.documentElement.style.setProperty('--border-radius', to + 'px');
        });
    });

    // Container Width
    wp.customize('mct_container_width', function(value) {
        value.bind(function(to) {
            $('.site-container').css('max-width', to + 'px');
        });
    });

    // Footer Text
    wp.customize('mct_footer_text', function(value) {
        value.bind(function(to) {
            $('.site-info').html(to);
        });
    });

})(jQuery);
