<?php
/**
 * Gallery Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'gallery');
$columns = isset($data['columns']) ? intval($data['columns']) : 3;
$extra_classes = 'gallery-' . $columns . '-cols';

mct_block_wrapper_start($block_id, 'gallery', $extra_classes);

if (!empty($data['images']) && is_array($data['images'])) :
    foreach ($data['images'] as $image) :
        if (!empty($image['url'])) :
            ?>
            <div class="gallery-item">
                <img src="<?php echo esc_url($image['url']); ?>"
                     alt="<?php echo esc_attr($image['alt'] ?? ''); ?>"
                     loading="lazy">
            </div>
            <?php
        endif;
    endforeach;
endif;

mct_block_wrapper_end();
