<?php
/**
 * Admin Meta Boxes for Page Builder
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add page builder meta box
 */
function mct_add_page_builder_meta_box() {
    add_meta_box(
        'mct_page_builder',
        __('Page Builder', 'my-custom-theme'),
        'mct_page_builder_meta_box_callback',
        'page',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'mct_add_page_builder_meta_box');

/**
 * Page builder meta box callback
 */
function mct_page_builder_meta_box_callback($post) {
    // Add nonce for security
    wp_nonce_field('mct_page_builder_save', 'mct_page_builder_nonce');

    // Get existing blocks
    $blocks = get_post_meta($post->ID, '_mct_page_builder_blocks', true);
    if (empty($blocks)) {
        $blocks = array();
    }

    // Get available blocks
    $available_blocks = mct_get_available_blocks();

    // Get custom blocks
    $custom_blocks = mct_get_custom_blocks();
    ?>

    <div id="mct-page-builder" class="mct-page-builder-wrapper">
        <!-- Builder Controls -->
        <div class="mct-builder-controls">
            <button type="button" class="button button-primary" id="mct-add-block-btn">
                <?php _e('Add Block', 'my-custom-theme'); ?>
            </button>
            <button type="button" class="button" id="mct-save-blocks-btn">
                <?php _e('Save Layout', 'my-custom-theme'); ?>
            </button>
            <button type="button" class="button" id="mct-clear-blocks-btn">
                <?php _e('Clear All Blocks', 'my-custom-theme'); ?>
            </button>
        </div>

        <!-- Block Library Panel -->
        <div id="mct-block-library" class="mct-block-library" style="display: none;">
            <div class="mct-block-library-header">
                <h3><?php _e('Block Library', 'my-custom-theme'); ?></h3>
                <button type="button" class="mct-close-library">&times;</button>
            </div>

            <div class="mct-block-categories">
                <button class="mct-category-tab active" data-category="all">
                    <?php _e('All', 'my-custom-theme'); ?>
                </button>
                <button class="mct-category-tab" data-category="content">
                    <?php _e('Content', 'my-custom-theme'); ?>
                </button>
                <button class="mct-category-tab" data-category="media">
                    <?php _e('Media', 'my-custom-theme'); ?>
                </button>
                <button class="mct-category-tab" data-category="layout">
                    <?php _e('Layout', 'my-custom-theme'); ?>
                </button>
                <button class="mct-category-tab" data-category="advanced">
                    <?php _e('Advanced', 'my-custom-theme'); ?>
                </button>
            </div>

            <div class="mct-block-list">
                <?php foreach ($available_blocks as $type => $block) : ?>
                    <div class="mct-block-item" data-type="<?php echo esc_attr($type); ?>" data-category="<?php echo esc_attr($block['category']); ?>">
                        <span class="block-icon"><?php echo esc_html($block['icon']); ?></span>
                        <span class="block-name"><?php echo esc_html($block['name']); ?></span>
                    </div>
                <?php endforeach; ?>

                <?php if (!empty($custom_blocks)) : ?>
                    <div class="mct-block-list-divider">
                        <strong><?php _e('Custom Blocks', 'my-custom-theme'); ?></strong>
                    </div>
                    <?php foreach ($custom_blocks as $id => $block) : ?>
                        <div class="mct-block-item mct-custom-block-item" data-type="custom" data-custom-id="<?php echo esc_attr($id); ?>" data-category="advanced">
                            <span class="block-icon">⭐</span>
                            <span class="block-name"><?php echo esc_html($block['name']); ?></span>
                            <button class="delete-custom-block" data-id="<?php echo esc_attr($id); ?>" title="<?php _e('Delete', 'my-custom-theme'); ?>">&times;</button>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>

        <!-- Blocks Container -->
        <div id="mct-blocks-container" class="mct-blocks-container">
            <?php if (empty($blocks)) : ?>
                <div class="mct-empty-state">
                    <p><?php _e('No blocks added yet. Click "Add Block" to get started!', 'my-custom-theme'); ?></p>
                </div>
            <?php else : ?>
                <?php foreach ($blocks as $index => $block) : ?>
                    <?php mct_render_builder_block($block, $index); ?>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>

        <!-- Hidden input to store blocks data -->
        <input type="hidden" name="mct_page_builder_blocks" id="mct-page-builder-data" value="<?php echo esc_attr(json_encode($blocks)); ?>">
    </div>

    <?php
}

/**
 * Render a single block in the builder
 */
function mct_render_builder_block($block, $index) {
    $block_type = isset($block['type']) ? $block['type'] : 'text';
    $block_id = isset($block['id']) ? $block['id'] : uniqid('block_');
    $block_data = isset($block['data']) ? $block['data'] : array();

    $available_blocks = mct_get_available_blocks();
    $block_info = isset($available_blocks[$block_type]) ? $available_blocks[$block_type] : array('name' => $block_type, 'icon' => '📦');
    ?>

    <div class="mct-builder-block" data-block-id="<?php echo esc_attr($block_id); ?>" data-block-type="<?php echo esc_attr($block_type); ?>" data-index="<?php echo esc_attr($index); ?>">
        <div class="mct-block-header">
            <span class="mct-block-handle">☰</span>
            <span class="mct-block-icon"><?php echo esc_html($block_info['icon']); ?></span>
            <span class="mct-block-title"><?php echo esc_html($block_info['name']); ?></span>
            <div class="mct-block-actions">
                <button type="button" class="mct-edit-block" title="<?php _e('Edit', 'my-custom-theme'); ?>">✏️</button>
                <button type="button" class="mct-duplicate-block" title="<?php _e('Duplicate', 'my-custom-theme'); ?>">📋</button>
                <button type="button" class="mct-delete-block" title="<?php _e('Delete', 'my-custom-theme'); ?>">🗑️</button>
            </div>
        </div>

        <div class="mct-block-preview">
            <?php mct_render_block_preview($block_type, $block_data); ?>
        </div>

        <div class="mct-block-settings" style="display: none;">
            <?php mct_render_block_settings($block_type, $block_data, $block_id); ?>
        </div>
    </div>

    <?php
}

/**
 * Render block preview
 */
function mct_render_block_preview($block_type, $block_data) {
    echo '<div class="preview-content">';

    switch ($block_type) {
        case 'text':
            echo '<p>' . esc_html(wp_trim_words(strip_tags($block_data['content'] ?? ''), 20)) . '</p>';
            break;

        case 'image':
            if (!empty($block_data['image_url'])) {
                echo '<img src="' . esc_url($block_data['image_url']) . '" alt="" style="max-width: 100%; height: auto;">';
            } else {
                echo '<p>' . __('No image selected', 'my-custom-theme') . '</p>';
            }
            break;

        case 'hero':
            echo '<strong>' . esc_html($block_data['title'] ?? 'Hero Section') . '</strong>';
            break;

        default:
            echo '<p>' . sprintf(__('Block type: %s', 'my-custom-theme'), esc_html($block_type)) . '</p>';
            break;
    }

    echo '</div>';
}

/**
 * Render block settings form
 */
function mct_render_block_settings($block_type, $block_data, $block_id) {
    ?>
    <div class="mct-settings-form">
        <?php
        switch ($block_type) {
            case 'text':
                ?>
                <div class="mct-setting-field">
                    <label><?php _e('Content:', 'my-custom-theme'); ?></label>
                    <textarea class="mct-setting-input" data-setting="content" rows="10"><?php echo esc_textarea($block_data['content'] ?? ''); ?></textarea>
                </div>
                <div class="mct-setting-field">
                    <label><?php _e('Alignment:', 'my-custom-theme'); ?></label>
                    <select class="mct-setting-input" data-setting="alignment">
                        <option value="left" <?php selected($block_data['alignment'] ?? 'left', 'left'); ?>><?php _e('Left', 'my-custom-theme'); ?></option>
                        <option value="center" <?php selected($block_data['alignment'] ?? 'left', 'center'); ?>><?php _e('Center', 'my-custom-theme'); ?></option>
                        <option value="right" <?php selected($block_data['alignment'] ?? 'left', 'right'); ?>><?php _e('Right', 'my-custom-theme'); ?></option>
                    </select>
                </div>
                <?php
                break;

            case 'image':
                ?>
                <div class="mct-setting-field">
                    <label><?php _e('Image:', 'my-custom-theme'); ?></label>
                    <button type="button" class="button mct-upload-image"><?php _e('Select Image', 'my-custom-theme'); ?></button>
                    <input type="hidden" class="mct-setting-input" data-setting="image_url" value="<?php echo esc_attr($block_data['image_url'] ?? ''); ?>">
                    <input type="hidden" class="mct-setting-input" data-setting="image_id" value="<?php echo esc_attr($block_data['image_id'] ?? ''); ?>">
                    <div class="image-preview">
                        <?php if (!empty($block_data['image_url'])) : ?>
                            <img src="<?php echo esc_url($block_data['image_url']); ?>" alt="" style="max-width: 200px;">
                        <?php endif; ?>
                    </div>
                </div>
                <div class="mct-setting-field">
                    <label><?php _e('Alt Text:', 'my-custom-theme'); ?></label>
                    <input type="text" class="mct-setting-input" data-setting="alt_text" value="<?php echo esc_attr($block_data['alt_text'] ?? ''); ?>">
                </div>
                <div class="mct-setting-field">
                    <label><?php _e('Caption:', 'my-custom-theme'); ?></label>
                    <input type="text" class="mct-setting-input" data-setting="caption" value="<?php echo esc_attr($block_data['caption'] ?? ''); ?>">
                </div>
                <div class="mct-setting-field">
                    <label>
                        <input type="checkbox" class="mct-setting-input" data-setting="rounded" <?php checked($block_data['rounded'] ?? false, true); ?>>
                        <?php _e('Rounded Corners', 'my-custom-theme'); ?>
                    </label>
                </div>
                <?php
                break;

            // Add more block types settings as needed
            default:
                ?>
                <div class="mct-setting-field">
                    <label><?php _e('Block Data (JSON):', 'my-custom-theme'); ?></label>
                    <textarea class="mct-setting-json" rows="10"><?php echo esc_textarea(json_encode($block_data, JSON_PRETTY_PRINT)); ?></textarea>
                    <p class="description"><?php _e('Edit block data in JSON format.', 'my-custom-theme'); ?></p>
                </div>
                <?php
                break;
        }
        ?>

        <div class="mct-setting-actions">
            <button type="button" class="button button-primary mct-save-block-settings">
                <?php _e('Save Settings', 'my-custom-theme'); ?>
            </button>
            <button type="button" class="button mct-cancel-block-settings">
                <?php _e('Cancel', 'my-custom-theme'); ?>
            </button>
        </div>
    </div>
    <?php
}

/**
 * Save page builder data
 */
function mct_save_page_builder_data($post_id) {
    // Check if nonce is set
    if (!isset($_POST['mct_page_builder_nonce'])) {
        return;
    }

    // Verify nonce
    if (!wp_verify_nonce($_POST['mct_page_builder_nonce'], 'mct_page_builder_save')) {
        return;
    }

    // Check for autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check user permissions
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // Save blocks data
    if (isset($_POST['mct_page_builder_blocks'])) {
        $blocks_json = stripslashes($_POST['mct_page_builder_blocks']);
        $blocks = json_decode($blocks_json, true);

        if (json_last_error() === JSON_ERROR_NONE) {
            update_post_meta($post_id, '_mct_page_builder_blocks', $blocks);
        }
    } else {
        delete_post_meta($post_id, '_mct_page_builder_blocks');
    }
}
add_action('save_post_page', 'mct_save_page_builder_data');
