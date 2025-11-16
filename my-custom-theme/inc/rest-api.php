<?php
/**
 * REST API Endpoints for Page Builder
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register AJAX endpoints
 */
function mct_register_ajax_endpoints() {
    // Render builder block
    add_action('wp_ajax_mct_render_builder_block', 'mct_ajax_render_builder_block');

    // Get block preview
    add_action('wp_ajax_mct_get_block_preview', 'mct_ajax_get_block_preview');

    // Get custom block
    add_action('wp_ajax_mct_get_custom_block', 'mct_ajax_get_custom_block');

    // Save custom block
    add_action('wp_ajax_mct_save_custom_block', 'mct_ajax_save_custom_block');

    // Delete custom block
    add_action('wp_ajax_mct_delete_custom_block', 'mct_ajax_delete_custom_block');
}
add_action('init', 'mct_register_ajax_endpoints');

/**
 * AJAX: Render builder block
 */
function mct_ajax_render_builder_block() {
    check_ajax_referer('mct_builder_nonce', 'nonce');

    if (!current_user_can('edit_posts')) {
        wp_send_json_error('Insufficient permissions');
    }

    $block = isset($_POST['block']) ? $_POST['block'] : array();
    $index = isset($_POST['index']) ? intval($_POST['index']) : 0;

    if (empty($block)) {
        wp_send_json_error('Invalid block data');
    }

    ob_start();
    mct_render_builder_block($block, $index);
    $html = ob_get_clean();

    wp_send_json_success(array(
        'html' => $html
    ));
}

/**
 * AJAX: Get block preview
 */
function mct_ajax_get_block_preview() {
    check_ajax_referer('mct_builder_nonce', 'nonce');

    if (!current_user_can('edit_posts')) {
        wp_send_json_error('Insufficient permissions');
    }

    $block_type = isset($_POST['block_type']) ? sanitize_text_field($_POST['block_type']) : '';
    $block_data = isset($_POST['block_data']) ? $_POST['block_data'] : array();

    if (empty($block_type)) {
        wp_send_json_error('Invalid block type');
    }

    ob_start();
    mct_render_block_preview($block_type, $block_data);
    $preview = ob_get_clean();

    wp_send_json_success(array(
        'preview' => $preview
    ));
}

/**
 * AJAX: Get custom block
 */
function mct_ajax_get_custom_block() {
    check_ajax_referer('mct_builder_nonce', 'nonce');

    if (!current_user_can('edit_posts')) {
        wp_send_json_error('Insufficient permissions');
    }

    $block_id = isset($_POST['block_id']) ? sanitize_text_field($_POST['block_id']) : '';

    if (empty($block_id)) {
        wp_send_json_error('Invalid block ID');
    }

    $custom_blocks = mct_get_custom_blocks();

    if (!isset($custom_blocks[$block_id])) {
        wp_send_json_error('Block not found');
    }

    wp_send_json_success(array(
        'block_data' => $custom_blocks[$block_id]['data']
    ));
}

/**
 * AJAX: Save custom block
 */
function mct_ajax_save_custom_block() {
    check_ajax_referer('mct_builder_nonce', 'nonce');

    if (!current_user_can('edit_posts')) {
        wp_send_json_error('Insufficient permissions');
    }

    $block_name = isset($_POST['block_name']) ? sanitize_text_field($_POST['block_name']) : '';
    $block_data = isset($_POST['block_data']) ? $_POST['block_data'] : array();

    if (empty($block_name)) {
        wp_send_json_error('Block name is required');
    }

    $block_id = mct_save_custom_block($block_name, $block_data);

    wp_send_json_success(array(
        'block_id' => $block_id,
        'message' => 'Custom block saved successfully'
    ));
}

/**
 * AJAX: Delete custom block
 */
function mct_ajax_delete_custom_block() {
    check_ajax_referer('mct_builder_nonce', 'nonce');

    if (!current_user_can('edit_posts')) {
        wp_send_json_error('Insufficient permissions');
    }

    $block_id = isset($_POST['block_id']) ? sanitize_text_field($_POST['block_id']) : '';

    if (empty($block_id)) {
        wp_send_json_error('Invalid block ID');
    }

    $result = mct_delete_custom_block($block_id);

    if ($result) {
        wp_send_json_success(array(
            'message' => 'Custom block deleted successfully'
        ));
    } else {
        wp_send_json_error('Failed to delete block');
    }
}
