<?php
/**
 * Block Renderer Helper Functions
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get block data with defaults
 */
function mct_get_block_data($block_data, $block_type) {
    $available_blocks = mct_get_available_blocks();

    if (!isset($available_blocks[$block_type])) {
        return $block_data;
    }

    $defaults = $available_blocks[$block_type]['defaults'];

    return wp_parse_args($block_data, $defaults);
}

/**
 * Sanitize block data
 */
function mct_sanitize_block_data($block_data, $block_type) {
    // Basic sanitization - extend as needed
    if (is_array($block_data)) {
        return array_map('mct_sanitize_block_data', $block_data);
    }

    return wp_kses_post($block_data);
}

/**
 * Render block wrapper
 */
function mct_block_wrapper_start($block_id, $block_type, $extra_classes = '') {
    $classes = 'mct-block mct-block-' . esc_attr($block_type);
    if (!empty($extra_classes)) {
        $classes .= ' ' . esc_attr($extra_classes);
    }

    echo '<div id="' . esc_attr($block_id) . '" class="' . $classes . '">';
}

function mct_block_wrapper_end() {
    echo '</div>';
}
