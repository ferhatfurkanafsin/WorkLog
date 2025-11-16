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

    // Add Gutenberg wide alignment support
    add_theme_support('align-wide');

    // Add editor styles support
    add_theme_support('editor-styles');

    // Add responsive embeds support
    add_theme_support('responsive-embeds');

    // Add support for Block Editor features
    add_theme_support('wp-block-styles');
}
add_action('after_setup_theme', 'spawcoin_setup');

/**
 * Add Elementor Support
 */
function spawcoin_elementor_support() {
    // Add Elementor support for custom post types
    update_option('elementor_cpt_support', array('page', 'post', 'team_member'));

    // Disable Elementor default colors and fonts
    update_option('elementor_disable_color_schemes', 'yes');
    update_option('elementor_disable_typography_schemes', 'yes');
}
add_action('after_setup_theme', 'spawcoin_elementor_support');

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

    // Web3.js library for wallet integration
    wp_enqueue_script(
        'web3',
        'https://cdn.jsdelivr.net/npm/web3@1.8.0/dist/web3.min.js',
        array(),
        '1.8.0',
        true
    );

    // Ethers.js (alternative to Web3.js, more modern)
    wp_enqueue_script(
        'ethers',
        'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js',
        array(),
        '5.7.2',
        true
    );

    // Wallet Connect JavaScript
    wp_enqueue_script(
        'spawcoin-web3',
        get_template_directory_uri() . '/js/web3-wallet.js',
        array('jquery', 'web3', 'ethers'),
        '1.0.0',
        true
    );

    // Main JavaScript
    wp_enqueue_script(
        'spawcoin-script',
        get_template_directory_uri() . '/js/main.js',
        array('jquery'),
        '1.0.0',
        true
    );

    // Pass data to JavaScript
    wp_localize_script('spawcoin-web3', 'spawcoinConfig', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('spawcoin-nonce'),
        'contractAddress' => get_option('spawcoin_contract_address', ''),
        'chainId' => get_option('spawcoin_chain_id', '1'), // 1 = Ethereum Mainnet
        'tokenSymbol' => 'SPAWN',
        'tokenDecimals' => 18,
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

    // Web3 Settings Section
    $wp_customize->add_section('spawcoin_web3', array(
        'title' => __('Web3 & Token Settings', 'spawcoin'),
        'priority' => 40,
        'description' => __('Configure your token contract and blockchain settings', 'spawcoin'),
    ));

    $wp_customize->add_setting('spawcoin_contract_address', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('spawcoin_contract_address', array(
        'label' => __('Token Contract Address', 'spawcoin'),
        'section' => 'spawcoin_web3',
        'type' => 'text',
        'description' => __('Enter your Spawcoin token contract address (0x...)', 'spawcoin'),
    ));

    $wp_customize->add_setting('spawcoin_chain_id', array(
        'default' => '1',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('spawcoin_chain_id', array(
        'label' => __('Blockchain Network', 'spawcoin'),
        'section' => 'spawcoin_web3',
        'type' => 'select',
        'choices' => array(
            '1' => 'Ethereum Mainnet',
            '56' => 'BNB Smart Chain',
            '137' => 'Polygon',
            '42161' => 'Arbitrum',
            '10' => 'Optimism',
            '8453' => 'Base',
        ),
    ));

    $wp_customize->add_setting('spawcoin_buy_link', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('spawcoin_buy_link', array(
        'label' => __('Buy Token Link (Uniswap/PancakeSwap)', 'spawcoin'),
        'section' => 'spawcoin_web3',
        'type' => 'url',
        'description' => __('DEX link where users can buy your token', 'spawcoin'),
    ));

    $wp_customize->add_setting('spawcoin_airdrop_enabled', array(
        'default' => false,
        'sanitize_callback' => 'wp_validate_boolean',
    ));
    $wp_customize->add_control('spawcoin_airdrop_enabled', array(
        'label' => __('Enable Airdrop', 'spawcoin'),
        'section' => 'spawcoin_web3',
        'type' => 'checkbox',
    ));

    $wp_customize->add_setting('spawcoin_airdrop_amount', array(
        'default' => '1000',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('spawcoin_airdrop_amount', array(
        'label' => __('Airdrop Amount (per user)', 'spawcoin'),
        'section' => 'spawcoin_web3',
        'type' => 'text',
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

/**
 * AJAX Handler: Claim Airdrop
 */
function spawcoin_claim_airdrop() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'], 'spawcoin-nonce')) {
        wp_send_json_error(array('message' => 'Security check failed'));
        return;
    }

    $wallet_address = sanitize_text_field($_POST['wallet_address']);

    // Validate wallet address format
    if (!preg_match('/^0x[a-fA-F0-9]{40}$/', $wallet_address)) {
        wp_send_json_error(array('message' => 'Invalid wallet address'));
        return;
    }

    // Check if airdrop is enabled
    if (!get_theme_mod('spawcoin_airdrop_enabled', false)) {
        wp_send_json_error(array('message' => 'Airdrop is not currently active'));
        return;
    }

    // Check if wallet has already claimed
    global $wpdb;
    $table_name = $wpdb->prefix . 'spawcoin_airdrops';

    // Create table if it doesn't exist
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        wallet_address varchar(42) NOT NULL,
        claim_date datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        amount varchar(50) NOT NULL,
        status varchar(20) DEFAULT 'pending' NOT NULL,
        PRIMARY KEY  (id),
        UNIQUE KEY wallet_address (wallet_address)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    // Check for existing claim
    $existing_claim = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM $table_name WHERE wallet_address = %s",
        $wallet_address
    ));

    if ($existing_claim) {
        wp_send_json_error(array('message' => 'This wallet has already claimed the airdrop'));
        return;
    }

    // Insert new claim
    $airdrop_amount = get_theme_mod('spawcoin_airdrop_amount', '1000');

    $inserted = $wpdb->insert(
        $table_name,
        array(
            'wallet_address' => $wallet_address,
            'amount' => $airdrop_amount,
            'status' => 'pending'
        ),
        array('%s', '%s', '%s')
    );

    if ($inserted) {
        // Send notification email to admin (optional)
        $admin_email = get_option('admin_email');
        $subject = 'New Airdrop Claim - Spawcoin';
        $message = sprintf(
            "New airdrop claim received:\n\nWallet Address: %s\nAmount: %s SPAWN\nTime: %s",
            $wallet_address,
            number_format($airdrop_amount),
            current_time('mysql')
        );

        wp_mail($admin_email, $subject, $message);

        wp_send_json_success(array(
            'message' => 'Airdrop claimed successfully! Tokens will be sent to your wallet within 24-48 hours.',
            'wallet' => $wallet_address,
            'amount' => $airdrop_amount
        ));
    } else {
        wp_send_json_error(array('message' => 'Failed to process claim. Please try again.'));
    }
}
add_action('wp_ajax_spawcoin_claim_airdrop', 'spawcoin_claim_airdrop');
add_action('wp_ajax_nopriv_spawcoin_claim_airdrop', 'spawcoin_claim_airdrop');

/**
 * Shortcode: Wallet Connect Button
 * Usage: [spawcoin_wallet_connect]
 */
function spawcoin_wallet_connect_shortcode($atts) {
    $atts = shortcode_atts(array(
        'text' => 'Connect Wallet',
        'class' => '',
    ), $atts);

    ob_start();
    ?>
    <div class="wallet-connect-section">
        <div class="wallet-status">
            <span class="wallet-address"></span>
            <button class="connect-wallet-btn <?php echo esc_attr($atts['class']); ?>">
                <i class="fas fa-wallet"></i> <?php echo esc_html($atts['text']); ?>
            </button>
            <button class="disconnect-wallet-btn">
                <i class="fas fa-sign-out-alt"></i> Disconnect
            </button>
        </div>

        <div class="wallet-connected-content">
            <div class="wallet-info">
                <div class="token-balance-display">
                    <span>Your SPAWN Balance:</span>
                    <span class="token-balance">0</span>
                </div>
                <div class="token-balance-display">
                    <span>Connected Network:</span>
                    <span id="network-name">-</span>
                </div>
            </div>
            <div style="margin-top: 1rem; text-align: center;">
                <button class="add-token-btn">
                    <i class="fas fa-plus-circle"></i> Add SPAWN to Wallet
                </button>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('spawcoin_wallet_connect', 'spawcoin_wallet_connect_shortcode');

/**
 * Shortcode: Buy Token Button
 * Usage: [spawcoin_buy_button]
 */
function spawcoin_buy_button_shortcode($atts) {
    $atts = shortcode_atts(array(
        'text' => 'Buy SPAWN',
        'class' => '',
    ), $atts);

    $buy_link = get_theme_mod('spawcoin_buy_link', '#');

    ob_start();
    ?>
    <a href="<?php echo esc_url($buy_link); ?>"
       class="buy-token-btn <?php echo esc_attr($atts['class']); ?>"
       target="_blank"
       rel="noopener noreferrer">
        <i class="fas fa-shopping-cart"></i> <?php echo esc_html($atts['text']); ?>
    </a>
    <?php
    return ob_get_clean();
}
add_shortcode('spawcoin_buy_button', 'spawcoin_buy_button_shortcode');

/**
 * Shortcode: Token Purchase Widget
 * Usage: [spawcoin_purchase_widget]
 */
function spawcoin_purchase_widget_shortcode() {
    $contract_address = get_theme_mod('spawcoin_contract_address', '');
    $buy_link = get_theme_mod('spawcoin_buy_link', '#');

    ob_start();
    ?>
    <div class="token-purchase-widget">
        <h3><i class="fas fa-coins"></i> Buy SPAWN Tokens</h3>

        <div class="wallet-disconnected-content">
            <p style="text-align: center; margin-bottom: 1rem;">Connect your wallet to purchase tokens</p>
            <div style="text-align: center;">
                <button class="connect-wallet-btn">
                    <i class="fas fa-wallet"></i> Connect Wallet
                </button>
            </div>
        </div>

        <div class="wallet-connected-content">
            <div class="purchase-input-group">
                <label>Amount (ETH/BNB)</label>
                <input type="number" id="purchase-amount" placeholder="0.1" step="0.01" min="0">
            </div>

            <div class="token-price-info">
                <span>You will receive (approx):</span>
                <span id="token-amount">0 SPAWN</span>
            </div>

            <div class="purchase-actions">
                <a href="<?php echo esc_url($buy_link); ?>"
                   class="buy-token-btn"
                   target="_blank"
                   rel="noopener noreferrer">
                    <i class="fas fa-shopping-cart"></i> Buy on DEX
                </a>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 1rem; text-align: center;">
                Powered by Uniswap/PancakeSwap
            </p>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('spawcoin_purchase_widget', 'spawcoin_purchase_widget_shortcode');

/**
 * Shortcode: Token Balance Display
 * Usage: [spawcoin_balance]
 */
function spawcoin_balance_shortcode() {
    ob_start();
    ?>
    <div class="wallet-connected-content" style="display: inline-block;">
        <span class="token-balance">0</span> SPAWN
    </div>
    <div class="wallet-disconnected-content" style="display: inline-block;">
        <button class="connect-wallet-btn" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
            Connect to View Balance
        </button>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('spawcoin_balance', 'spawcoin_balance_shortcode');

/**
 * Add Admin Menu for Airdrop Management
 */
function spawcoin_add_admin_menu() {
    add_menu_page(
        'Spawcoin Airdrops',
        'Airdrops',
        'manage_options',
        'spawcoin-airdrops',
        'spawcoin_airdrops_page',
        'dashicons-tickets-alt',
        30
    );
}
add_action('admin_menu', 'spawcoin_add_admin_menu');

/**
 * Airdrop Management Page
 */
function spawcoin_airdrops_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'spawcoin_airdrops';

    // Get all claims
    $claims = $wpdb->get_results("SELECT * FROM $table_name ORDER BY claim_date DESC");

    ?>
    <div class="wrap">
        <h1>Airdrop Claims Management</h1>

        <?php if (isset($_GET['action']) && $_GET['action'] == 'export') :
            // Export to CSV
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="spawcoin-airdrops-' . date('Y-m-d') . '.csv"');
            $output = fopen('php://output', 'w');
            fputcsv($output, array('ID', 'Wallet Address', 'Amount', 'Status', 'Claim Date'));
            foreach ($claims as $claim) {
                fputcsv($output, array(
                    $claim->id,
                    $claim->wallet_address,
                    $claim->amount,
                    $claim->status,
                    $claim->claim_date
                ));
            }
            fclose($output);
            exit;
        endif; ?>

        <p>
            <a href="?page=spawcoin-airdrops&action=export" class="button button-primary">
                <span class="dashicons dashicons-download"></span> Export to CSV
            </a>
        </p>

        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Wallet Address</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Claim Date</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($claims) :
                    foreach ($claims as $claim) : ?>
                        <tr>
                            <td><?php echo esc_html($claim->id); ?></td>
                            <td><code><?php echo esc_html($claim->wallet_address); ?></code></td>
                            <td><?php echo esc_html(number_format($claim->amount)); ?> SPAWN</td>
                            <td>
                                <span class="status-<?php echo esc_attr($claim->status); ?>">
                                    <?php echo esc_html(ucfirst($claim->status)); ?>
                                </span>
                            </td>
                            <td><?php echo esc_html($claim->claim_date); ?></td>
                        </tr>
                    <?php endforeach;
                else : ?>
                    <tr>
                        <td colspan="5">No airdrop claims yet.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <style>
            .status-pending { color: #ff9800; font-weight: 600; }
            .status-completed { color: #4caf50; font-weight: 600; }
            .status-failed { color: #f44336; font-weight: 600; }
        </style>
    </div>
    <?php
}
