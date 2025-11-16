<?php
/**
 * Image Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'image');
$extra_classes = !empty($data['rounded']) ? 'image-rounded' : '';

mct_block_wrapper_start($block_id, 'image', $extra_classes);

if (!empty($data['image_url'])) :
    ?>
    <img src="<?php echo esc_url($data['image_url']); ?>"
         alt="<?php echo esc_attr($data['alt_text']); ?>"
         loading="lazy">

    <?php if (!empty($data['caption'])) : ?>
        <p class="image-caption"><?php echo esc_html($data['caption']); ?></p>
    <?php endif; ?>
    <?php
endif;

mct_block_wrapper_end();
