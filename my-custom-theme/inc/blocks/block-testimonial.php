<?php
/**
 * Testimonial Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'testimonial');

mct_block_wrapper_start($block_id, 'testimonial');
?>

<div class="mct-testimonial-content">
    <p class="mct-testimonial-text">"<?php echo esc_html($data['quote']); ?>"</p>
    <div class="mct-testimonial-author"><?php echo esc_html($data['author']); ?></div>
    <div class="mct-testimonial-role"><?php echo esc_html($data['role']); ?></div>
</div>

<?php
mct_block_wrapper_end();
