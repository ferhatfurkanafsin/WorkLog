<?php
/**
 * Page Builder Core Functionality
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get all available block types
 */
function mct_get_available_blocks() {
    return array(
        'text' => array(
            'name' => __('Text Block', 'my-custom-theme'),
            'icon' => '📝',
            'category' => 'content',
            'defaults' => array(
                'content' => '<h2>Add your heading here</h2><p>Add your text content here. You can use HTML formatting.</p>',
                'alignment' => 'left',
            ),
        ),
        'image' => array(
            'name' => __('Image Block', 'my-custom-theme'),
            'icon' => '🖼️',
            'category' => 'media',
            'defaults' => array(
                'image_url' => '',
                'image_id' => '',
                'alt_text' => '',
                'caption' => '',
                'rounded' => false,
            ),
        ),
        'video' => array(
            'name' => __('Video Block', 'my-custom-theme'),
            'icon' => '🎥',
            'category' => 'media',
            'defaults' => array(
                'video_url' => '',
                'video_type' => 'youtube', // youtube, vimeo, self-hosted
            ),
        ),
        'gallery' => array(
            'name' => __('Gallery Block', 'my-custom-theme'),
            'icon' => '🖼️',
            'category' => 'media',
            'defaults' => array(
                'images' => array(),
                'columns' => 3,
            ),
        ),
        'button' => array(
            'name' => __('Button Block', 'my-custom-theme'),
            'icon' => '🔘',
            'category' => 'content',
            'defaults' => array(
                'text' => 'Click Here',
                'url' => '#',
                'style' => 'primary', // primary, secondary, outline
                'new_tab' => false,
            ),
        ),
        'hero' => array(
            'name' => __('Hero Block', 'my-custom-theme'),
            'icon' => '🎯',
            'category' => 'layout',
            'defaults' => array(
                'title' => 'Welcome to Our Website',
                'subtitle' => 'We create amazing experiences',
                'button_text' => 'Get Started',
                'button_url' => '#',
                'background_color' => '',
            ),
        ),
        'testimonial' => array(
            'name' => __('Testimonial Block', 'my-custom-theme'),
            'icon' => '💬',
            'category' => 'content',
            'defaults' => array(
                'quote' => 'This is an amazing product! Highly recommended.',
                'author' => 'John Doe',
                'role' => 'CEO, Company Inc.',
            ),
        ),
        'pricing' => array(
            'name' => __('Pricing Table', 'my-custom-theme'),
            'icon' => '💰',
            'category' => 'content',
            'defaults' => array(
                'plans' => array(
                    array(
                        'name' => 'Basic',
                        'price' => '$9',
                        'period' => 'per month',
                        'features' => array('Feature 1', 'Feature 2', 'Feature 3'),
                        'button_text' => 'Get Started',
                        'button_url' => '#',
                        'featured' => false,
                    ),
                    array(
                        'name' => 'Pro',
                        'price' => '$29',
                        'period' => 'per month',
                        'features' => array('All Basic features', 'Feature 4', 'Feature 5', 'Priority Support'),
                        'button_text' => 'Get Started',
                        'button_url' => '#',
                        'featured' => true,
                    ),
                ),
            ),
        ),
        'iconbox' => array(
            'name' => __('Icon Box', 'my-custom-theme'),
            'icon' => '⭐',
            'category' => 'content',
            'defaults' => array(
                'items' => array(
                    array('icon' => '🚀', 'title' => 'Fast Performance', 'description' => 'Blazing fast load times'),
                    array('icon' => '🔒', 'title' => 'Secure', 'description' => 'Enterprise-grade security'),
                    array('icon' => '💡', 'title' => 'Innovative', 'description' => 'Cutting-edge features'),
                ),
            ),
        ),
        'features' => array(
            'name' => __('Feature List', 'my-custom-theme'),
            'icon' => '✓',
            'category' => 'content',
            'defaults' => array(
                'items' => array(
                    array('icon' => '✓', 'title' => 'Feature One', 'description' => 'Description of feature one'),
                    array('icon' => '✓', 'title' => 'Feature Two', 'description' => 'Description of feature two'),
                ),
            ),
        ),
        'custom_html' => array(
            'name' => __('Custom HTML', 'my-custom-theme'),
            'icon' => '⚙️',
            'category' => 'advanced',
            'defaults' => array(
                'html' => '',
                'css' => '',
                'js' => '',
            ),
        ),
        'map' => array(
            'name' => __('Map Block', 'my-custom-theme'),
            'icon' => '🗺️',
            'category' => 'media',
            'defaults' => array(
                'embed_url' => '',
                'height' => 400,
            ),
        ),
        'newsletter' => array(
            'name' => __('Newsletter Signup', 'my-custom-theme'),
            'icon' => '✉️',
            'category' => 'content',
            'defaults' => array(
                'title' => 'Subscribe to Our Newsletter',
                'description' => 'Get the latest updates delivered to your inbox',
                'placeholder' => 'Enter your email',
                'button_text' => 'Subscribe',
                'action_url' => '',
            ),
        ),
    );
}

/**
 * Render page builder blocks
 */
function mct_render_page_builder_blocks($blocks) {
    if (empty($blocks) || !is_array($blocks)) {
        return;
    }

    foreach ($blocks as $block) {
        if (!isset($block['type'])) {
            continue;
        }

        $block_type = $block['type'];
        $block_data = isset($block['data']) ? $block['data'] : array();
        $block_id = isset($block['id']) ? $block['id'] : uniqid('block_');

        // Get block template
        $template_file = MCT_INC_DIR . '/blocks/block-' . $block_type . '.php';

        if (file_exists($template_file)) {
            include $template_file;
        } else {
            // Fallback for missing template
            echo '<div class="mct-block mct-block-' . esc_attr($block_type) . '">';
            echo '<p>' . esc_html__('Block type not found:', 'my-custom-theme') . ' ' . esc_html($block_type) . '</p>';
            echo '</div>';
        }
    }
}

/**
 * Save custom blocks library
 */
function mct_save_custom_block($block_name, $block_data) {
    $custom_blocks = get_option('mct_custom_blocks', array());

    $block_id = sanitize_title($block_name);
    $custom_blocks[$block_id] = array(
        'name' => sanitize_text_field($block_name),
        'data' => $block_data,
        'created' => current_time('mysql'),
    );

    update_option('mct_custom_blocks', $custom_blocks);

    return $block_id;
}

/**
 * Get all custom blocks from library
 */
function mct_get_custom_blocks() {
    return get_option('mct_custom_blocks', array());
}

/**
 * Delete custom block from library
 */
function mct_delete_custom_block($block_id) {
    $custom_blocks = get_option('mct_custom_blocks', array());

    if (isset($custom_blocks[$block_id])) {
        unset($custom_blocks[$block_id]);
        update_option('mct_custom_blocks', $custom_blocks);
        return true;
    }

    return false;
}
