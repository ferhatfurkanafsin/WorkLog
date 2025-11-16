<?php
/**
 * Text Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'text');
$alignment = isset($data['alignment']) ? $data['alignment'] : 'left';
$extra_classes = 'text-' . $alignment;

mct_block_wrapper_start($block_id, 'text', $extra_classes);
?>

<div class="mct-text-content">
    <?php echo wp_kses_post($data['content']); ?>
</div>

<?php
mct_block_wrapper_end();
