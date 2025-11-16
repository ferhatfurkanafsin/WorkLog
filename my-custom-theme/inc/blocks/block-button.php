<?php
/**
 * Button Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'button');
$style = isset($data['style']) ? $data['style'] : 'primary';
$button_class = 'mct-button button-' . $style;
$target = !empty($data['new_tab']) ? '_blank' : '_self';

mct_block_wrapper_start($block_id, 'button');
?>

<a href="<?php echo esc_url($data['url']); ?>"
   class="<?php echo esc_attr($button_class); ?>"
   target="<?php echo esc_attr($target); ?>"
   <?php if ($target === '_blank') : ?>rel="noopener noreferrer"<?php endif; ?>>
    <?php echo esc_html($data['text']); ?>
</a>

<?php
mct_block_wrapper_end();
