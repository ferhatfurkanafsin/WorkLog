<?php
/**
 * Hero Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'hero');

mct_block_wrapper_start($block_id, 'hero');
?>

<div class="mct-block-hero-content">
    <h1><?php echo esc_html($data['title']); ?></h1>
    <p><?php echo esc_html($data['subtitle']); ?></p>

    <?php if (!empty($data['button_text']) && !empty($data['button_url'])) : ?>
        <a href="<?php echo esc_url($data['button_url']); ?>" class="mct-button">
            <?php echo esc_html($data['button_text']); ?>
        </a>
    <?php endif; ?>
</div>

<?php
mct_block_wrapper_end();
