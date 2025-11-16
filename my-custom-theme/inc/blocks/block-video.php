<?php
/**
 * Video Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'video');

mct_block_wrapper_start($block_id, 'video');

if (!empty($data['video_url'])) :
    $video_url = esc_url($data['video_url']);
    $video_type = isset($data['video_type']) ? $data['video_type'] : 'youtube';

    if ($video_type === 'youtube' || $video_type === 'vimeo') :
        // Convert to embed URL
        if ($video_type === 'youtube') {
            preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/', $video_url, $matches);
            if (!empty($matches[1])) {
                $embed_url = 'https://www.youtube.com/embed/' . $matches[1];
            }
        } elseif ($video_type === 'vimeo') {
            preg_match('/vimeo\.com\/([0-9]+)/', $video_url, $matches);
            if (!empty($matches[1])) {
                $embed_url = 'https://player.vimeo.com/video/' . $matches[1];
            }
        }

        if (!empty($embed_url)) :
            ?>
            <iframe src="<?php echo esc_url($embed_url); ?>"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
            </iframe>
            <?php
        endif;
    else :
        ?>
        <video controls>
            <source src="<?php echo esc_url($video_url); ?>" type="video/mp4">
            <?php _e('Your browser does not support the video tag.', 'my-custom-theme'); ?>
        </video>
        <?php
    endif;
endif;

mct_block_wrapper_end();
