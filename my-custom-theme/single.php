<?php
/**
 * The template for displaying all single posts
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="site-container">
        <?php
        while (have_posts()) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header">
                    <?php the_title('<h1 class="entry-title">', '</h1>'); ?>

                    <div class="entry-meta">
                        <span class="posted-on">
                            <time datetime="<?php echo get_the_date('c'); ?>">
                                <?php echo get_the_date(); ?>
                            </time>
                        </span>
                        <span class="byline">
                            <?php _e('by', 'my-custom-theme'); ?>
                            <span class="author"><?php echo get_the_author(); ?></span>
                        </span>
                        <?php
                        $categories = get_the_category();
                        if (!empty($categories)) :
                            ?>
                            <span class="cat-links">
                                <?php _e('in', 'my-custom-theme'); ?>
                                <?php
                                foreach ($categories as $category) {
                                    echo '<a href="' . esc_url(get_category_link($category->term_id)) . '">' . esc_html($category->name) . '</a> ';
                                }
                                ?>
                            </span>
                            <?php
                        endif;
                        ?>
                    </div>
                </header>

                <?php if (has_post_thumbnail()) : ?>
                    <div class="post-thumbnail">
                        <?php the_post_thumbnail('large'); ?>
                    </div>
                <?php endif; ?>

                <div class="entry-content">
                    <?php
                    the_content();

                    wp_link_pages(array(
                        'before' => '<div class="page-links">' . __('Pages:', 'my-custom-theme'),
                        'after'  => '</div>',
                    ));
                    ?>
                </div>

                <footer class="entry-footer">
                    <?php
                    $tags = get_the_tags();
                    if ($tags) :
                        ?>
                        <div class="tags-links">
                            <strong><?php _e('Tags:', 'my-custom-theme'); ?></strong>
                            <?php
                            foreach ($tags as $tag) {
                                echo '<a href="' . esc_url(get_tag_link($tag->term_id)) . '">' . esc_html($tag->name) . '</a> ';
                            }
                            ?>
                        </div>
                        <?php
                    endif;
                    ?>
                </footer>
            </article>

            <?php
            // Post navigation
            mct_post_navigation();

            // If comments are open or we have at least one comment, load up the comment template
            if (comments_open() || get_comments_number()) :
                comments_template();
            endif;

        endwhile;
        ?>
    </div>
</main>

<?php
get_footer();
