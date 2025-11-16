<?php
/**
 * Custom HTML Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'custom_html');

mct_block_wrapper_start($block_id, 'custom-html');

// Add custom CSS if provided
if (!empty($data['css'])) :
    ?>
    <style>
        #<?php echo esc_attr($block_id); ?> {
            <?php echo wp_strip_all_tags($data['css']); ?>
        }
    </style>
    <?php
endif;

// Output HTML content
if (!empty($data['html'])) :
    echo wp_kses_post($data['html']);
endif;

// Add custom JavaScript if provided
if (!empty($data['js'])) :
    ?>
    <script>
        (function() {
            <?php echo wp_strip_all_tags($data['js']); ?>
        })();
    </script>
    <?php
endif;

mct_block_wrapper_end();
