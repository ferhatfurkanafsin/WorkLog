<?php
/**
 * Feature List Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'features');

mct_block_wrapper_start($block_id, 'features');

if (!empty($data['items']) && is_array($data['items'])) :
    foreach ($data['items'] as $item) :
        ?>
        <div class="mct-feature-item">
            <div class="mct-feature-icon"><?php echo esc_html($item['icon']); ?></div>
            <div class="mct-feature-content">
                <h3><?php echo esc_html($item['title']); ?></h3>
                <p><?php echo esc_html($item['description']); ?></p>
            </div>
        </div>
        <?php
    endforeach;
endif;

mct_block_wrapper_end();
