<?php
/**
 * Icon Box Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'iconbox');

mct_block_wrapper_start($block_id, 'iconbox');
?>

<div class="mct-iconbox-grid">
    <?php
    if (!empty($data['items']) && is_array($data['items'])) :
        foreach ($data['items'] as $item) :
            ?>
            <div class="mct-iconbox-item">
                <div class="mct-iconbox-icon"><?php echo esc_html($item['icon']); ?></div>
                <h3 class="mct-iconbox-title"><?php echo esc_html($item['title']); ?></h3>
                <p class="mct-iconbox-description"><?php echo esc_html($item['description']); ?></p>
            </div>
            <?php
        endforeach;
    endif;
    ?>
</div>

<?php
mct_block_wrapper_end();
