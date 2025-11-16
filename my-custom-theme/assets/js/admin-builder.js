/**
 * Page Builder Admin JavaScript
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

(function($) {
    'use strict';

    let builderBlocks = [];
    let mediaUploader = null;
    let currentEditingBlock = null;

    /**
     * Initialize page builder
     */
    function initPageBuilder() {
        // Load existing blocks from hidden input
        loadBlocksFromInput();

        // Initialize sortable for drag and drop
        initSortable();

        // Bind event handlers
        bindEvents();
    }

    /**
     * Load blocks from hidden input
     */
    function loadBlocksFromInput() {
        const blocksData = $('#mct-page-builder-data').val();

        if (blocksData) {
            try {
                builderBlocks = JSON.parse(blocksData);
            } catch (e) {
                console.error('Error parsing blocks data:', e);
                builderBlocks = [];
            }
        }
    }

    /**
     * Save blocks to hidden input
     */
    function saveBlocksToInput() {
        $('#mct-page-builder-data').val(JSON.stringify(builderBlocks));
    }

    /**
     * Initialize sortable drag and drop
     */
    function initSortable() {
        $('#mct-blocks-container').sortable({
            handle: '.mct-block-handle',
            placeholder: 'mct-block-placeholder',
            tolerance: 'pointer',
            update: function(event, ui) {
                updateBlocksOrder();
            }
        });
    }

    /**
     * Update blocks order after drag and drop
     */
    function updateBlocksOrder() {
        const newOrder = [];

        $('.mct-builder-block').each(function(index) {
            const blockId = $(this).data('block-id');
            const block = builderBlocks.find(b => b.id === blockId);

            if (block) {
                newOrder.push(block);
                $(this).attr('data-index', index);
            }
        });

        builderBlocks = newOrder;
        saveBlocksToInput();
    }

    /**
     * Bind event handlers
     */
    function bindEvents() {
        // Add block button
        $('#mct-add-block-btn').on('click', function() {
            openBlockLibrary();
        });

        // Save blocks button
        $('#mct-save-blocks-btn').on('click', function() {
            saveBlocks();
        });

        // Clear all blocks button
        $('#mct-clear-blocks-btn').on('click', function() {
            if (confirm('Are you sure you want to clear all blocks?')) {
                clearAllBlocks();
            }
        });

        // Close library
        $('.mct-close-library').on('click', function() {
            closeBlockLibrary();
        });

        // Category tabs
        $('.mct-category-tab').on('click', function() {
            const category = $(this).data('category');
            filterBlocksByCategory(category);

            $('.mct-category-tab').removeClass('active');
            $(this).addClass('active');
        });

        // Block item click
        $(document).on('click', '.mct-block-item', function() {
            const blockType = $(this).data('type');
            const customId = $(this).data('custom-id');

            addBlock(blockType, customId);
            closeBlockLibrary();
        });

        // Edit block
        $(document).on('click', '.mct-edit-block', function() {
            const $block = $(this).closest('.mct-builder-block');
            openBlockSettings($block);
        });

        // Duplicate block
        $(document).on('click', '.mct-duplicate-block', function() {
            const $block = $(this).closest('.mct-builder-block');
            duplicateBlock($block);
        });

        // Delete block
        $(document).on('click', '.mct-delete-block', function() {
            if (confirm('Are you sure you want to delete this block?')) {
                const $block = $(this).closest('.mct-builder-block');
                deleteBlock($block);
            }
        });

        // Save block settings
        $(document).on('click', '.mct-save-block-settings', function() {
            const $block = $(this).closest('.mct-builder-block');
            saveBlockSettings($block);
        });

        // Cancel block settings
        $(document).on('click', '.mct-cancel-block-settings', function() {
            const $block = $(this).closest('.mct-builder-block');
            closeBlockSettings($block);
        });

        // Image upload
        $(document).on('click', '.mct-upload-image', function(e) {
            e.preventDefault();

            const $button = $(this);
            const $block = $button.closest('.mct-builder-block');

            openMediaUploader($button, $block);
        });

        // Delete custom block
        $(document).on('click', '.delete-custom-block', function(e) {
            e.stopPropagation();

            if (confirm('Delete this custom block?')) {
                const blockId = $(this).data('id');
                deleteCustomBlock(blockId);
            }
        });
    }

    /**
     * Open block library
     */
    function openBlockLibrary() {
        $('#mct-block-library').fadeIn(300);
    }

    /**
     * Close block library
     */
    function closeBlockLibrary() {
        $('#mct-block-library').fadeOut(300);
    }

    /**
     * Filter blocks by category
     */
    function filterBlocksByCategory(category) {
        if (category === 'all') {
            $('.mct-block-item').show();
        } else {
            $('.mct-block-item').hide();
            $('.mct-block-item[data-category="' + category + '"]').show();
        }
    }

    /**
     * Add new block
     */
    function addBlock(blockType, customId) {
        const blockId = 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        let blockData = {};

        // If it's a custom block, load its data
        if (customId) {
            // Load custom block data via AJAX
            $.ajax({
                url: mctBuilder.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'mct_get_custom_block',
                    nonce: mctBuilder.nonce,
                    block_id: customId
                },
                success: function(response) {
                    if (response.success) {
                        blockData = response.data.block_data;
                        createBlockElement(blockId, blockType, blockData);
                    }
                }
            });
        } else {
            createBlockElement(blockId, blockType, blockData);
        }
    }

    /**
     * Create block element
     */
    function createBlockElement(blockId, blockType, blockData) {
        const block = {
            id: blockId,
            type: blockType,
            data: blockData
        };

        builderBlocks.push(block);

        // Create block HTML via AJAX
        $.ajax({
            url: mctBuilder.ajaxUrl,
            type: 'POST',
            data: {
                action: 'mct_render_builder_block',
                nonce: mctBuilder.nonce,
                block: block,
                index: builderBlocks.length - 1
            },
            success: function(response) {
                if (response.success) {
                    // Remove empty state if exists
                    $('.mct-empty-state').remove();

                    $('#mct-blocks-container').append(response.data.html);
                    saveBlocksToInput();
                }
            }
        });
    }

    /**
     * Duplicate block
     */
    function duplicateBlock($block) {
        const blockId = $block.data('block-id');
        const block = builderBlocks.find(b => b.id === blockId);

        if (block) {
            const newBlockId = 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const newBlock = {
                id: newBlockId,
                type: block.type,
                data: JSON.parse(JSON.stringify(block.data)) // Deep clone
            };

            builderBlocks.push(newBlock);

            // Create new block element
            $.ajax({
                url: mctBuilder.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'mct_render_builder_block',
                    nonce: mctBuilder.nonce,
                    block: newBlock,
                    index: builderBlocks.length - 1
                },
                success: function(response) {
                    if (response.success) {
                        $block.after(response.data.html);
                        saveBlocksToInput();
                    }
                }
            });
        }
    }

    /**
     * Delete block
     */
    function deleteBlock($block) {
        const blockId = $block.data('block-id');
        const index = builderBlocks.findIndex(b => b.id === blockId);

        if (index !== -1) {
            builderBlocks.splice(index, 1);
            $block.fadeOut(300, function() {
                $(this).remove();

                // Show empty state if no blocks
                if (builderBlocks.length === 0) {
                    showEmptyState();
                }

                saveBlocksToInput();
            });
        }
    }

    /**
     * Open block settings
     */
    function openBlockSettings($block) {
        // Close any other open settings
        $('.mct-block-settings').slideUp(300);
        $('.mct-block-preview').slideDown(300);

        // Open this block's settings
        $block.find('.mct-block-preview').slideUp(300);
        $block.find('.mct-block-settings').slideDown(300);

        currentEditingBlock = $block;
    }

    /**
     * Close block settings
     */
    function closeBlockSettings($block) {
        $block.find('.mct-block-settings').slideUp(300);
        $block.find('.mct-block-preview').slideDown(300);

        currentEditingBlock = null;
    }

    /**
     * Save block settings
     */
    function saveBlockSettings($block) {
        const blockId = $block.data('block-id');
        const block = builderBlocks.find(b => b.id === blockId);

        if (!block) {
            return;
        }

        // Get all settings inputs
        const $settings = $block.find('.mct-setting-input');
        const newData = {};

        $settings.each(function() {
            const $input = $(this);
            const setting = $input.data('setting');

            if (setting) {
                if ($input.attr('type') === 'checkbox') {
                    newData[setting] = $input.is(':checked');
                } else {
                    newData[setting] = $input.val();
                }
            }
        });

        // Check for JSON editor
        const $jsonEditor = $block.find('.mct-setting-json');
        if ($jsonEditor.length) {
            try {
                const jsonData = JSON.parse($jsonEditor.val());
                Object.assign(newData, jsonData);
            } catch (e) {
                alert('Invalid JSON format');
                return;
            }
        }

        // Update block data
        block.data = newData;

        // Update preview
        updateBlockPreview($block, block);

        // Close settings
        closeBlockSettings($block);

        // Save to input
        saveBlocksToInput();
    }

    /**
     * Update block preview
     */
    function updateBlockPreview($block, block) {
        $.ajax({
            url: mctBuilder.ajaxUrl,
            type: 'POST',
            data: {
                action: 'mct_get_block_preview',
                nonce: mctBuilder.nonce,
                block_type: block.type,
                block_data: block.data
            },
            success: function(response) {
                if (response.success) {
                    $block.find('.mct-block-preview .preview-content').html(response.data.preview);
                }
            }
        });
    }

    /**
     * Save all blocks
     */
    function saveBlocks() {
        saveBlocksToInput();

        // Show success message
        const $btn = $('#mct-save-blocks-btn');
        const originalText = $btn.text();

        $btn.text('Saved!').prop('disabled', true);

        setTimeout(function() {
            $btn.text(originalText).prop('disabled', false);
        }, 2000);
    }

    /**
     * Clear all blocks
     */
    function clearAllBlocks() {
        builderBlocks = [];
        $('#mct-blocks-container').empty();
        showEmptyState();
        saveBlocksToInput();
    }

    /**
     * Show empty state
     */
    function showEmptyState() {
        const emptyStateHtml = '<div class="mct-empty-state"><p>No blocks added yet. Click "Add Block" to get started!</p></div>';
        $('#mct-blocks-container').html(emptyStateHtml);
    }

    /**
     * Open media uploader
     */
    function openMediaUploader($button, $block) {
        if (mediaUploader) {
            mediaUploader.open();
            return;
        }

        mediaUploader = wp.media({
            title: 'Select Image',
            button: {
                text: 'Select'
            },
            multiple: false
        });

        mediaUploader.on('select', function() {
            const attachment = mediaUploader.state().get('selection').first().toJSON();

            // Update input fields
            $block.find('[data-setting="image_url"]').val(attachment.url);
            $block.find('[data-setting="image_id"]').val(attachment.id);

            // Update preview
            $block.find('.image-preview').html('<img src="' + attachment.url + '" alt="" style="max-width: 200px;">');
        });

        mediaUploader.open();
    }

    /**
     * Delete custom block
     */
    function deleteCustomBlock(blockId) {
        $.ajax({
            url: mctBuilder.ajaxUrl,
            type: 'POST',
            data: {
                action: 'mct_delete_custom_block',
                nonce: mctBuilder.nonce,
                block_id: blockId
            },
            success: function(response) {
                if (response.success) {
                    $('.mct-custom-block-item[data-custom-id="' + blockId + '"]').fadeOut(300, function() {
                        $(this).remove();
                    });
                }
            }
        });
    }

    // Initialize on document ready
    $(document).ready(function() {
        if ($('#mct-page-builder').length) {
            initPageBuilder();
        }
    });

})(jQuery);
