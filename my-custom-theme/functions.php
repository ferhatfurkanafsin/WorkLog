<?php
/**
 * My Custom Theme Functions and Definitions
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define theme constants
define('MCT_VERSION', '1.0');
define('MCT_THEME_DIR', get_template_directory());
define('MCT_THEME_URI', get_template_directory_uri());
define('MCT_INC_DIR', MCT_THEME_DIR . '/inc');

/**
 * Theme Setup
 */
function mct_theme_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails
    add_theme_support('post-thumbnails');

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'my-custom-theme'),
        'footer' => __('Footer Menu', 'my-custom-theme'),
    ));

    // Switch default core markup to output valid HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));

    // Add theme support for custom logo
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // Add support for custom background
    add_theme_support('custom-background');

    // Add support for editor styles
    add_theme_support('editor-styles');

    // Add support for responsive embeds
    add_theme_support('responsive-embeds');
}
add_action('after_setup_theme', 'mct_theme_setup');

/**
 * Enqueue scripts and styles
 */
function mct_enqueue_scripts() {
    // Main stylesheet
    wp_enqueue_style('mct-style', get_stylesheet_uri(), array(), MCT_VERSION);

    // Admin page builder styles (only on page edit screen)
    if (is_admin()) {
        $screen = get_current_screen();
        if ($screen && $screen->base === 'post' && $screen->post_type === 'page') {
            wp_enqueue_style('mct-admin-builder', MCT_THEME_URI . '/assets/css/admin-builder.css', array(), MCT_VERSION);
            wp_enqueue_script('mct-admin-builder', MCT_THEME_URI . '/assets/js/admin-builder.js', array('jquery', 'jquery-ui-sortable'), MCT_VERSION, true);

            // Localize script with AJAX URL and nonce
            wp_localize_script('mct-admin-builder', 'mctBuilder', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('mct_builder_nonce'),
                'postId' => get_the_ID(),
            ));
        }
    }

    // Frontend page builder renderer
    if (!is_admin()) {
        wp_enqueue_style('mct-blocks', MCT_THEME_URI . '/assets/css/blocks.css', array('mct-style'), MCT_VERSION);
        wp_enqueue_script('mct-frontend', MCT_THEME_URI . '/assets/js/frontend.js', array('jquery'), MCT_VERSION, true);
    }
}
add_action('wp_enqueue_scripts', 'mct_enqueue_scripts');
add_action('admin_enqueue_scripts', 'mct_enqueue_scripts');

/**
 * Include required files
 */
require_once MCT_INC_DIR . '/page-builder.php';
require_once MCT_INC_DIR . '/blocks/block-renderer.php';
require_once MCT_INC_DIR . '/admin/meta-boxes.php';
require_once MCT_INC_DIR . '/admin/customizer.php';
require_once MCT_INC_DIR . '/rest-api.php';

/**
 * Register widget areas
 */
function mct_widgets_init() {
    register_sidebar(array(
        'name'          => __('Sidebar', 'my-custom-theme'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here to appear in your sidebar.', 'my-custom-theme'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));

    register_sidebar(array(
        'name'          => __('Footer Widget Area', 'my-custom-theme'),
        'id'            => 'footer-1',
        'description'   => __('Add widgets here to appear in your footer.', 'my-custom-theme'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'mct_widgets_init');

/**
 * Custom template tags for this theme
 */

/**
 * Display navigation to next/previous post
 */
function mct_post_navigation() {
    $prev_post = get_previous_post();
    $next_post = get_next_post();

    if ($prev_post || $next_post) {
        echo '<nav class="post-navigation">';

        if ($prev_post) {
            echo '<div class="nav-previous">';
            echo '<a href="' . get_permalink($prev_post) . '">&larr; ' . get_the_title($prev_post) . '</a>';
            echo '</div>';
        }

        if ($next_post) {
            echo '<div class="nav-next">';
            echo '<a href="' . get_permalink($next_post) . '">' . get_the_title($next_post) . ' &rarr;</a>';
            echo '</div>';
        }

        echo '</nav>';
    }
}

/**
 * Get theme option
 */
function mct_get_option($option, $default = '') {
    return get_theme_mod($option, $default);
}

/**
 * Check if page builder is active for current page
 */
function mct_is_page_builder_active() {
    if (is_singular('page')) {
        $blocks = get_post_meta(get_the_ID(), '_mct_page_builder_blocks', true);
        return !empty($blocks);
    }
    return false;
}
