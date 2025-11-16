<?php
/**
 * Map Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'map');
$height = !empty($data['height']) ? intval($data['height']) : 400;

mct_block_wrapper_start($block_id, 'map');

if (!empty($data['embed_url'])) :
    ?>
    <iframe src="<?php echo esc_url($data['embed_url']); ?>"
            style="height: <?php echo esc_attr($height); ?>px;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
    </iframe>
    <?php
endif;

mct_block_wrapper_end();
