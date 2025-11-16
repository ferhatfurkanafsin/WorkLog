<?php
/**
 * Theme Customizer
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register customizer settings
 */
function mct_customize_register($wp_customize) {
    // Add theme settings section
    $wp_customize->add_section('mct_theme_settings', array(
        'title'    => __('Theme Settings', 'my-custom-theme'),
        'priority' => 30,
    ));

    // Primary Color
    $wp_customize->add_setting('mct_primary_color', array(
        'default'           => '#2563eb',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'mct_primary_color', array(
        'label'    => __('Primary Color', 'my-custom-theme'),
        'section'  => 'mct_theme_settings',
        'settings' => 'mct_primary_color',
    )));

    // Secondary Color
    $wp_customize->add_setting('mct_secondary_color', array(
        'default'           => '#64748b',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'mct_secondary_color', array(
        'label'    => __('Secondary Color', 'my-custom-theme'),
        'section'  => 'mct_theme_settings',
        'settings' => 'mct_secondary_color',
    )));

    // Text Color
    $wp_customize->add_setting('mct_text_color', array(
        'default'           => '#1e293b',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'mct_text_color', array(
        'label'    => __('Text Color', 'my-custom-theme'),
        'section'  => 'mct_theme_settings',
        'settings' => 'mct_text_color',
    )));

    // Background Color
    $wp_customize->add_setting('mct_bg_color', array(
        'default'           => '#ffffff',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'mct_bg_color', array(
        'label'    => __('Background Color', 'my-custom-theme'),
        'section'  => 'mct_theme_settings',
        'settings' => 'mct_bg_color',
    )));

    // Font Family
    $wp_customize->add_setting('mct_font_family', array(
        'default'           => 'system',
        'sanitize_callback' => 'mct_sanitize_font_family',
    ));

    $wp_customize->add_control('mct_font_family', array(
        'label'    => __('Font Family', 'my-custom-theme'),
        'section'  => 'mct_theme_settings',
        'settings' => 'mct_font_family',
        'type'     => 'select',
        'choices'  => array(
            'system'  => __('System Fonts', 'my-custom-theme'),
            'serif'   => __('Serif', 'my-custom-theme'),
            'sans'    => __('Sans Serif', 'my-custom-theme'),
            'mono'    => __('Monospace', 'my-custom-theme'),
        ),
    ));

    // Font Size
    $wp_customize->add_setting('mct_font_size', array(
        'default'           => '16',
        'sanitize_callback' => 'absint',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('mct_font_size', array(
        'label'       => __('Base Font Size (px)', 'my-custom-theme'),
        'section'     => 'mct_theme_settings',
        'settings'    => 'mct_font_size',
        'type'        => 'number',
        'input_attrs' => array(
            'min'  => 12,
            'max'  => 24,
            'step' => 1,
        ),
    ));

    // Border Radius
    $wp_customize->add_setting('mct_border_radius', array(
        'default'           => '8',
        'sanitize_callback' => 'absint',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('mct_border_radius', array(
        'label'       => __('Border Radius (px)', 'my-custom-theme'),
        'section'     => 'mct_theme_settings',
        'settings'    => 'mct_border_radius',
        'type'        => 'number',
        'input_attrs' => array(
            'min'  => 0,
            'max'  => 50,
            'step' => 1,
        ),
    ));

    // Container Width
    $wp_customize->add_setting('mct_container_width', array(
        'default'           => '1200',
        'sanitize_callback' => 'absint',
    ));

    $wp_customize->add_control('mct_container_width', array(
        'label'       => __('Container Max Width (px)', 'my-custom-theme'),
        'section'     => 'mct_theme_settings',
        'settings'    => 'mct_container_width',
        'type'        => 'number',
        'input_attrs' => array(
            'min'  => 960,
            'max'  => 1920,
            'step' => 10,
        ),
    ));

    // Add footer section
    $wp_customize->add_section('mct_footer_settings', array(
        'title'    => __('Footer Settings', 'my-custom-theme'),
        'priority' => 31,
    ));

    // Footer Text
    $wp_customize->add_setting('mct_footer_text', array(
        'default'           => sprintf(__('&copy; %s. All rights reserved.', 'my-custom-theme'), date('Y')),
        'sanitize_callback' => 'wp_kses_post',
    ));

    $wp_customize->add_control('mct_footer_text', array(
        'label'    => __('Footer Text', 'my-custom-theme'),
        'section'  => 'mct_footer_settings',
        'settings' => 'mct_footer_text',
        'type'     => 'textarea',
    ));
}
add_action('customize_register', 'mct_customize_register');

/**
 * Sanitize font family
 */
function mct_sanitize_font_family($value) {
    $valid = array('system', 'serif', 'sans', 'mono');
    return in_array($value, $valid) ? $value : 'system';
}

/**
 * Output customizer CSS
 */
function mct_customizer_css() {
    $primary_color    = get_theme_mod('mct_primary_color', '#2563eb');
    $secondary_color  = get_theme_mod('mct_secondary_color', '#64748b');
    $text_color       = get_theme_mod('mct_text_color', '#1e293b');
    $bg_color         = get_theme_mod('mct_bg_color', '#ffffff');
    $font_size        = get_theme_mod('mct_font_size', '16');
    $border_radius    = get_theme_mod('mct_border_radius', '8');
    $container_width  = get_theme_mod('mct_container_width', '1200');
    $font_family      = get_theme_mod('mct_font_family', 'system');

    // Font family stacks
    $font_stacks = array(
        'system' => '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
        'serif'  => 'Georgia, "Times New Roman", Times, serif',
        'sans'   => 'Helvetica, Arial, sans-serif',
        'mono'   => '"Courier New", Courier, monospace',
    );

    $font_family_value = isset($font_stacks[$font_family]) ? $font_stacks[$font_family] : $font_stacks['system'];

    ?>
    <style type="text/css">
        :root {
            --primary-color: <?php echo esc_attr($primary_color); ?>;
            --secondary-color: <?php echo esc_attr($secondary_color); ?>;
            --text-color: <?php echo esc_attr($text_color); ?>;
            --bg-color: <?php echo esc_attr($bg_color); ?>;
            --font-family: <?php echo esc_attr($font_family_value); ?>;
            --font-size-base: <?php echo esc_attr($font_size); ?>px;
            --border-radius: <?php echo esc_attr($border_radius); ?>px;
        }

        .site-container {
            max-width: <?php echo esc_attr($container_width); ?>px;
        }
    </style>
    <?php
}
add_action('wp_head', 'mct_customizer_css');

/**
 * Live preview for customizer
 */
function mct_customizer_live_preview() {
    wp_enqueue_script('mct-customizer-preview', MCT_THEME_URI . '/assets/js/customizer-preview.js', array('customize-preview'), MCT_VERSION, true);
}
add_action('customize_preview_init', 'mct_customizer_live_preview');
