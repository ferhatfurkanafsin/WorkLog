<?php
/**
 * The template for displaying comments
 *
 * @package Spawcoin
 */

if (post_password_required()) {
    return;
}
?>

<div id="comments" class="comments-area">
    <?php if (have_comments()) : ?>
        <h2 class="comments-title">
            <?php
            $comments_number = get_comments_number();
            if ('1' === $comments_number) {
                printf(_x('One comment on &ldquo;%s&rdquo;', 'comments title', 'spawcoin'), get_the_title());
            } else {
                printf(
                    _nx(
                        '%1$s comment on &ldquo;%2$s&rdquo;',
                        '%1$s comments on &ldquo;%2$s&rdquo;',
                        $comments_number,
                        'comments title',
                        'spawcoin'
                    ),
                    number_format_i18n($comments_number),
                    get_the_title()
                );
            }
            ?>
        </h2>

        <ol class="comment-list">
            <?php
            wp_list_comments(array(
                'style' => 'ol',
                'short_ping' => true,
                'avatar_size' => 50,
                'callback' => 'spawcoin_comment_callback',
            ));
            ?>
        </ol>

        <?php
        the_comments_navigation();

        if (!comments_open()) :
            ?>
            <p class="no-comments"><?php _e('Comments are closed.', 'spawcoin'); ?></p>
            <?php
        endif;
    endif;

    comment_form(array(
        'title_reply_before' => '<h2 id="reply-title" class="comment-reply-title">',
        'title_reply_after' => '</h2>',
        'class_submit' => 'btn btn-primary',
    ));
    ?>
</div>

<?php
/**
 * Custom comment callback
 */
function spawcoin_comment_callback($comment, $args, $depth) {
    ?>
    <li <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">
        <article id="div-comment-<?php comment_ID(); ?>" class="comment">
            <div class="comment-author vcard">
                <?php echo get_avatar($comment, $args['avatar_size']); ?>
                <b class="fn"><?php comment_author_link(); ?></b>
                <span class="says"><?php _e('says:', 'spawcoin'); ?></span>
            </div>

            <div class="comment-meta">
                <a href="<?php echo esc_url(get_comment_link($comment, $args)); ?>">
                    <time datetime="<?php comment_time('c'); ?>">
                        <?php printf(__('%1$s at %2$s', 'spawcoin'), get_comment_date('', $comment), get_comment_time()); ?>
                    </time>
                </a>
                <?php edit_comment_link(__('Edit', 'spawcoin'), '<span class="edit-link">', '</span>'); ?>
            </div>

            <?php if ('0' == $comment->comment_approved) : ?>
                <p class="comment-awaiting-moderation"><?php _e('Your comment is awaiting moderation.', 'spawcoin'); ?></p>
            <?php endif; ?>

            <div class="comment-content">
                <?php comment_text(); ?>
            </div>

            <?php
            comment_reply_link(array_merge($args, array(
                'add_below' => 'div-comment',
                'depth' => $depth,
                'max_depth' => $args['max_depth'],
                'before' => '<div class="reply">',
                'after' => '</div>',
            )));
            ?>
        </article>
    <?php
}
