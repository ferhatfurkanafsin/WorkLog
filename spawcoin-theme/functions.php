<?php
/**
 * Spawcoin Theme Functions
 *
 * @package Spawcoin
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function spawcoin_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('automatic-feed-links');
    add_theme_support('custom-background');
    add_theme_support('custom-header');

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'spawcoin'),
        'footer' => __('Footer Menu', 'spawcoin'),
    ));

    // Set post thumbnail sizes
    set_post_thumbnail_size(800, 600, true);
    add_image_size('spawcoin-blog-thumb', 400, 300, true);
    add_image_size('spawcoin-team-thumb', 300, 300, true);
}
add_action('after_setup_theme', 'spawcoin_setup');

/**
 * Enqueue Styles and Scripts
 */
function spawcoin_enqueue_assets() {
    // Google Fonts
    wp_enqueue_style(
        'spawcoin-fonts',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@700;800;900&display=swap',
        array(),
        null
    );

    // Font Awesome for icons
    wp_enqueue_style(
        'font-awesome',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        array(),
        '6.4.0'
    );

    // Main stylesheet
    wp_enqueue_style('spawcoin-style', get_stylesheet_uri(), array(), '1.0.0');

    // Main JavaScript
    wp_enqueue_script(
        'spawcoin-script',
        get_template_directory_uri() . '/js/main.js',
        array('jquery'),
        '1.0.0',
        true
    );

    // Pass data to JavaScript
    wp_localize_script('spawcoin-script', 'spawcoinData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('spawcoin-nonce')
    ));
}
add_action('wp_enqueue_scripts', 'spawcoin_enqueue_assets');

/**
 * Register Widget Areas
 */
function spawcoin_widgets_init() {
    register_sidebar(array(
        'name' => __('Blog Sidebar', 'spawcoin'),
        'id' => 'sidebar-1',
        'description' => __('Add widgets here for blog pages', 'spawcoin'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget' => '</section>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));

    register_sidebar(array(
        'name' => __('Footer Widget 1', 'spawcoin'),
        'id' => 'footer-1',
        'description' => __('First footer widget area', 'spawcoin'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="footer-widget-title">',
        'after_title' => '</h3>',
    ));

    register_sidebar(array(
        'name' => __('Footer Widget 2', 'spawcoin'),
        'id' => 'footer-2',
        'description' => __('Second footer widget area', 'spawcoin'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="footer-widget-title">',
        'after_title' => '</h3>',
    ));

    register_sidebar(array(
        'name' => __('Footer Widget 3', 'spawcoin'),
        'id' => 'footer-3',
        'description' => __('Third footer widget area', 'spawcoin'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="footer-widget-title">',
        'after_title' => '</h3>',
    ));
}
add_action('widgets_init', 'spawcoin_widgets_init');

/**
 * Register Custom Post Types
 */

// Team Members Custom Post Type
function spawcoin_register_team_post_type() {
    $labels = array(
        'name' => __('Team Members', 'spawcoin'),
        'singular_name' => __('Team Member', 'spawcoin'),
        'add_new' => __('Add New', 'spawcoin'),
        'add_new_item' => __('Add New Team Member', 'spawcoin'),
        'edit_item' => __('Edit Team Member', 'spawcoin'),
        'new_item' => __('New Team Member', 'spawcoin'),
        'view_item' => __('View Team Member', 'spawcoin'),
        'search_items' => __('Search Team Members', 'spawcoin'),
        'not_found' => __('No team members found', 'spawcoin'),
        'not_found_in_trash' => __('No team members found in trash', 'spawcoin'),
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => false,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-groups',
        'supports' => array('title', 'editor', 'thumbnail'),
        'rewrite' => array('slug' => 'team'),
    );

    register_post_type('team_member', $args);
}
add_action('init', 'spawcoin_register_team_post_type');

// Testimonials Custom Post Type
function spawcoin_register_testimonial_post_type() {
    $labels = array(
        'name' => __('Testimonials', 'spawcoin'),
        'singular_name' => __('Testimonial', 'spawcoin'),
        'add_new' => __('Add New', 'spawcoin'),
        'add_new_item' => __('Add New Testimonial', 'spawcoin'),
        'edit_item' => __('Edit Testimonial', 'spawcoin'),
        'new_item' => __('New Testimonial', 'spawcoin'),
        'view_item' => __('View Testimonial', 'spawcoin'),
        'search_items' => __('Search Testimonials', 'spawcoin'),
        'not_found' => __('No testimonials found', 'spawcoin'),
        'not_found_in_trash' => __('No testimonials found in trash', 'spawcoin'),
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-testimonial',
        'supports' => array('title', 'editor', 'thumbnail'),
    );

    register_post_type('testimonial', $args);
}
add_action('init', 'spawcoin_register_testimonial_post_type');

// Roadmap Custom Post Type
function spawcoin_register_roadmap_post_type() {
    $labels = array(
        'name' => __('Roadmap Items', 'spawcoin'),
        'singular_name' => __('Roadmap Item', 'spawcoin'),
        'add_new' => __('Add New', 'spawcoin'),
        'add_new_item' => __('Add New Roadmap Item', 'spawcoin'),
        'edit_item' => __('Edit Roadmap Item', 'spawcoin'),
        'new_item' => __('New Roadmap Item', 'spawcoin'),
        'view_item' => __('View Roadmap Item', 'spawcoin'),
        'search_items' => __('Search Roadmap Items', 'spawcoin'),
        'not_found' => __('No roadmap items found', 'spawcoin'),
        'not_found_in_trash' => __('No roadmap items found in trash', 'spawcoin'),
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-chart-line',
        'supports' => array('title', 'editor'),
    );

    register_post_type('roadmap', $args);
}
add_action('init', 'spawcoin_register_roadmap_post_type');

// YouTube Videos Custom Post Type
function spawcoin_register_video_post_type() {
    $labels = array(
        'name' => __('YouTube Videos', 'spawcoin'),
        'singular_name' => __('YouTube Video', 'spawcoin'),
        'add_new' => __('Add New', 'spawcoin'),
        'add_new_item' => __('Add New Video', 'spawcoin'),
        'edit_item' => __('Edit Video', 'spawcoin'),
        'new_item' => __('New Video', 'spawcoin'),
        'view_item' => __('View Video', 'spawcoin'),
        'search_items' => __('Search Videos', 'spawcoin'),
        'not_found' => __('No videos found', 'spawcoin'),
        'not_found_in_trash' => __('No videos found in trash', 'spawcoin'),
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-video-alt3',
        'supports' => array('title', 'editor'),
    );

    register_post_type('youtube_video', $args);
}
add_action('init', 'spawcoin_register_video_post_type');

/**
 * Add Custom Meta Boxes
 */

// Team Member Meta Box
function spawcoin_add_team_meta_boxes() {
    add_meta_box(
        'team_member_info',
        __('Team Member Information', 'spawcoin'),
        'spawcoin_team_member_meta_box_callback',
        'team_member',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'spawcoin_add_team_meta_boxes');

function spawcoin_team_member_meta_box_callback($post) {
    wp_nonce_field('spawcoin_team_meta_box', 'spawcoin_team_meta_box_nonce');

    $role = get_post_meta($post->ID, '_team_member_role', true);
    $twitter = get_post_meta($post->ID, '_team_member_twitter', true);
    $linkedin = get_post_meta($post->ID, '_team_member_linkedin', true);
    $telegram = get_post_meta($post->ID, '_team_member_telegram', true);
    ?>
    <p>
        <label for="team_member_role"><?php _e('Role/Position:', 'spawcoin'); ?></label><br>
        <input type="text" id="team_member_role" name="team_member_role" value="<?php echo esc_attr($role); ?>" style="width: 100%;">
    </p>
    <p>
        <label for="team_member_twitter"><?php _e('Twitter URL:', 'spawcoin'); ?></label><br>
        <input type="url" id="team_member_twitter" name="team_member_twitter" value="<?php echo esc_url($twitter); ?>" style="width: 100%;">
    </p>
    <p>
        <label for="team_member_linkedin"><?php _e('LinkedIn URL:', 'spawcoin'); ?></label><br>
        <input type="url" id="team_member_linkedin" name="team_member_linkedin" value="<?php echo esc_url($linkedin); ?>" style="width: 100%;">
    </p>
    <p>
        <label for="team_member_telegram"><?php _e('Telegram URL:', 'spawcoin'); ?></label><br>
        <input type="url" id="team_member_telegram" name="team_member_telegram" value="<?php echo esc_url($telegram); ?>" style="width: 100%;">
    </p>
    <?php
}

function spawcoin_save_team_meta_box($post_id) {
    if (!isset($_POST['spawcoin_team_meta_box_nonce'])) {
        return;
    }
    if (!wp_verify_nonce($_POST['spawcoin_team_meta_box_nonce'], 'spawcoin_team_meta_box')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['team_member_role'])) {
        update_post_meta($post_id, '_team_member_role', sanitize_text_field($_POST['team_member_role']));
    }
    if (isset($_POST['team_member_twitter'])) {
        update_post_meta($post_id, '_team_member_twitter', esc_url_raw($_POST['team_member_twitter']));
    }
    if (isset($_POST['team_member_linkedin'])) {
        update_post_meta($post_id, '_team_member_linkedin', esc_url_raw($_POST['team_member_linkedin']));
    }
    if (isset($_POST['team_member_telegram'])) {
        update_post_meta($post_id, '_team_member_telegram', esc_url_raw($_POST['team_member_telegram']));
    }
}
add_action('save_post', 'spawcoin_save_team_meta_box');

// Testimonial Meta Box
function spawcoin_add_testimonial_meta_boxes() {
    add_meta_box(
        'testimonial_info',
        __('Testimonial Information', 'spawcoin'),
        'spawcoin_testimonial_meta_box_callback',
        'testimonial',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'spawcoin_add_testimonial_meta_boxes');

function spawcoin_testimonial_meta_box_callback($post) {
    wp_nonce_field('spawcoin_testimonial_meta_box', 'spawcoin_testimonial_meta_box_nonce');

    $company = get_post_meta($post->ID, '_testimonial_company', true);
    $rating = get_post_meta($post->ID, '_testimonial_rating', true);
    ?>
    <p>
        <label for="testimonial_company"><?php _e('Company/Position:', 'spawcoin'); ?></label><br>
        <input type="text" id="testimonial_company" name="testimonial_company" value="<?php echo esc_attr($company); ?>" style="width: 100%;">
    </p>
    <p>
        <label for="testimonial_rating"><?php _e('Rating (1-5):', 'spawcoin'); ?></label><br>
        <select id="testimonial_rating" name="testimonial_rating">
            <option value="5" <?php selected($rating, '5'); ?>>5 Stars</option>
            <option value="4" <?php selected($rating, '4'); ?>>4 Stars</option>
            <option value="3" <?php selected($rating, '3'); ?>>3 Stars</option>
            <option value="2" <?php selected($rating, '2'); ?>>2 Stars</option>
            <option value="1" <?php selected($rating, '1'); ?>>1 Star</option>
        </select>
    </p>
    <?php
}

function spawcoin_save_testimonial_meta_box($post_id) {
    if (!isset($_POST['spawcoin_testimonial_meta_box_nonce'])) {
        return;
    }
    if (!wp_verify_nonce($_POST['spawcoin_testimonial_meta_box_nonce'], 'spawcoin_testimonial_meta_box')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['testimonial_company'])) {
        update_post_meta($post_id, '_testimonial_company', sanitize_text_field($_POST['testimonial_company']));
    }
    if (isset($_POST['testimonial_rating'])) {
        update_post_meta($post_id, '_testimonial_rating', sanitize_text_field($_POST['testimonial_rating']));
    }
}
add_action('save_post', 'spawcoin_save_testimonial_meta_box');

// Roadmap Meta Box
function spawcoin_add_roadmap_meta_boxes() {
    add_meta_box(
        'roadmap_info',
        __('Roadmap Information', 'spawcoin'),
        'spawcoin_roadmap_meta_box_callback',
        'roadmap',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'spawcoin_add_roadmap_meta_boxes');

function spawcoin_roadmap_meta_box_callback($post) {
    wp_nonce_field('spawcoin_roadmap_meta_box', 'spawcoin_roadmap_meta_box_nonce');

    $phase = get_post_meta($post->ID, '_roadmap_phase', true);
    $order = get_post_meta($post->ID, '_roadmap_order', true);
    $status = get_post_meta($post->ID, '_roadmap_status', true);
    ?>
    <p>
        <label for="roadmap_phase"><?php _e('Phase (e.g., Q1 2024, Phase 1):', 'spawcoin'); ?></label><br>
        <input type="text" id="roadmap_phase" name="roadmap_phase" value="<?php echo esc_attr($phase); ?>" style="width: 100%;">
    </p>
    <p>
        <label for="roadmap_order"><?php _e('Order:', 'spawcoin'); ?></label><br>
        <input type="number" id="roadmap_order" name="roadmap_order" value="<?php echo esc_attr($order); ?>" min="1">
    </p>
    <p>
        <label for="roadmap_status"><?php _e('Status:', 'spawcoin'); ?></label><br>
        <select id="roadmap_status" name="roadmap_status">
            <option value="completed" <?php selected($status, 'completed'); ?>>Completed</option>
            <option value="in-progress" <?php selected($status, 'in-progress'); ?>>In Progress</option>
            <option value="upcoming" <?php selected($status, 'upcoming'); ?>>Upcoming</option>
        </select>
    </p>
    <?php
}

function spawcoin_save_roadmap_meta_box($post_id) {
    if (!isset($_POST['spawcoin_roadmap_meta_box_nonce'])) {
        return;
    }
    if (!wp_verify_nonce($_POST['spawcoin_roadmap_meta_box_nonce'], 'spawcoin_roadmap_meta_box')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['roadmap_phase'])) {
        update_post_meta($post_id, '_roadmap_phase', sanitize_text_field($_POST['roadmap_phase']));
    }
    if (isset($_POST['roadmap_order'])) {
        update_post_meta($post_id, '_roadmap_order', absint($_POST['roadmap_order']));
    }
    if (isset($_POST['roadmap_status'])) {
        update_post_meta($post_id, '_roadmap_status', sanitize_text_field($_POST['roadmap_status']));
    }
}
add_action('save_post', 'spawcoin_save_roadmap_meta_box');

// YouTube Video Meta Box
function spawcoin_add_video_meta_boxes() {
    add_meta_box(
        'video_info',
        __('YouTube Video Information', 'spawcoin'),
        'spawcoin_video_meta_box_callback',
        'youtube_video',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'spawcoin_add_video_meta_boxes');

function spawcoin_video_meta_box_callback($post) {
    wp_nonce_field('spawcoin_video_meta_box', 'spawcoin_video_meta_box_nonce');

    $video_id = get_post_meta($post->ID, '_youtube_video_id', true);
    ?>
    <p>
        <label for="youtube_video_id"><?php _e('YouTube Video ID:', 'spawcoin'); ?></label><br>
        <input type="text" id="youtube_video_id" name="youtube_video_id" value="<?php echo esc_attr($video_id); ?>" style="width: 100%;" placeholder="e.g., dQw4w9WgXcQ">
        <br><small><?php _e('Enter only the video ID from the YouTube URL (e.g., if the URL is https://www.youtube.com/watch?v=dQw4w9WgXcQ, enter dQw4w9WgXcQ)', 'spawcoin'); ?></small>
    </p>
    <?php
}

function spawcoin_save_video_meta_box($post_id) {
    if (!isset($_POST['spawcoin_video_meta_box_nonce'])) {
        return;
    }
    if (!wp_verify_nonce($_POST['spawcoin_video_meta_box_nonce'], 'spawcoin_video_meta_box')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['youtube_video_id'])) {
        update_post_meta($post_id, '_youtube_video_id', sanitize_text_field($_POST['youtube_video_id']));
    }
}
add_action('save_post', 'spawcoin_save_video_meta_box');

/**
 * Customizer Settings
 */
function spawcoin_customize_register($wp_customize) {
    // Social Media Section
    $wp_customize->add_section('spawcoin_social_media', array(
        'title' => __('Social Media Links', 'spawcoin'),
        'priority' => 30,
    ));

    // Twitter
    $wp_customize->add_setting('spawcoin_twitter', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('spawcoin_twitter', array(
        'label' => __('Twitter URL', 'spawcoin'),
        'section' => 'spawcoin_social_media',
        'type' => 'url',
    ));

    // Telegram
    $wp_customize->add_setting('spawcoin_telegram', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('spawcoin_telegram', array(
        'label' => __('Telegram URL', 'spawcoin'),
        'section' => 'spawcoin_social_media',
        'type' => 'url',
    ));

    // Discord
    $wp_customize->add_setting('spawcoin_discord', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('spawcoin_discord', array(
        'label' => __('Discord URL', 'spawcoin'),
        'section' => 'spawcoin_social_media',
        'type' => 'url',
    ));

    // Instagram
    $wp_customize->add_setting('spawcoin_instagram', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('spawcoin_instagram', array(
        'label' => __('Instagram URL', 'spawcoin'),
        'section' => 'spawcoin_social_media',
        'type' => 'url',
    ));

    // YouTube
    $wp_customize->add_setting('spawcoin_youtube', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('spawcoin_youtube', array(
        'label' => __('YouTube URL', 'spawcoin'),
        'section' => 'spawcoin_social_media',
        'type' => 'url',
    ));

    // Hero Section
    $wp_customize->add_section('spawcoin_hero', array(
        'title' => __('Hero Section', 'spawcoin'),
        'priority' => 35,
    ));

    $wp_customize->add_setting('spawcoin_hero_title', array(
        'default' => 'Welcome to Spawcoin',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('spawcoin_hero_title', array(
        'label' => __('Hero Title', 'spawcoin'),
        'section' => 'spawcoin_hero',
        'type' => 'text',
    ));

    $wp_customize->add_setting('spawcoin_hero_subtitle', array(
        'default' => 'The Next Generation Memecoin',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('spawcoin_hero_subtitle', array(
        'label' => __('Hero Subtitle', 'spawcoin'),
        'section' => 'spawcoin_hero',
        'type' => 'text',
    ));

    $wp_customize->add_setting('spawcoin_hero_button_text', array(
        'default' => 'Get Started',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('spawcoin_hero_button_text', array(
        'label' => __('Hero Button Text', 'spawcoin'),
        'section' => 'spawcoin_hero',
        'type' => 'text',
    ));

    $wp_customize->add_setting('spawcoin_hero_button_url', array(
        'default' => '#',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('spawcoin_hero_button_url', array(
        'label' => __('Hero Button URL', 'spawcoin'),
        'section' => 'spawcoin_hero',
        'type' => 'url',
    ));
}
add_action('customize_register', 'spawcoin_customize_register');

/**
 * Excerpt Length
 */
function spawcoin_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'spawcoin_excerpt_length');

/**
 * Excerpt More
 */
function spawcoin_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'spawcoin_excerpt_more');

/**
 * Body Classes
 */
function spawcoin_body_classes($classes) {
    if (!is_singular()) {
        $classes[] = 'hfeed';
    }
    return $classes;
}
add_filter('body_class', 'spawcoin_body_classes');
