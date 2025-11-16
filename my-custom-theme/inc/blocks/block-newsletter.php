<?php
/**
 * Newsletter Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'newsletter');

mct_block_wrapper_start($block_id, 'newsletter');
?>

<div class="mct-newsletter-content">
    <h2><?php echo esc_html($data['title']); ?></h2>
    <p><?php echo esc_html($data['description']); ?></p>

    <form class="mct-newsletter-form" method="post" action="<?php echo esc_url($data['action_url']); ?>">
        <input type="email"
               name="email"
               class="mct-newsletter-input"
               placeholder="<?php echo esc_attr($data['placeholder']); ?>"
               required>
        <button type="submit" class="mct-newsletter-submit">
            <?php echo esc_html($data['button_text']); ?>
        </button>
    </form>
</div>

<?php
mct_block_wrapper_end();
