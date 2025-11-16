<?php
/**
 * The main template file
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="site-container">
        <?php
        if (have_posts()) :
            // Load posts loop
            while (have_posts()) :
                the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <header class="entry-header">
                        <?php
                        if (is_singular()) :
                            the_title('<h1 class="entry-title">', '</h1>');
                        else :
                            the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>');
                        endif;

                        if ('post' === get_post_type()) :
                            ?>
                            <div class="entry-meta">
                                <span class="posted-on">
                                    <?php echo get_the_date(); ?>
                                </span>
                                <span class="byline">
                                    <?php _e('by', 'my-custom-theme'); ?>
                                    <span class="author"><?php echo get_the_author(); ?></span>
                                </span>
                            </div>
                            <?php
                        endif;
                        ?>
                    </header>

                    <?php if (has_post_thumbnail()) : ?>
                        <div class="post-thumbnail">
                            <?php the_post_thumbnail('large'); ?>
                        </div>
                    <?php endif; ?>

                    <div class="entry-content">
                        <?php
                        if (is_singular()) :
                            the_content();
                        else :
                            the_excerpt();
                        endif;

                        wp_link_pages(array(
                            'before' => '<div class="page-links">' . __('Pages:', 'my-custom-theme'),
                            'after'  => '</div>',
                        ));
                        ?>
                    </div>

                    <?php if (!is_singular()) : ?>
                        <footer class="entry-footer">
                            <a href="<?php echo esc_url(get_permalink()); ?>" class="read-more">
                                <?php _e('Read More', 'my-custom-theme'); ?> &rarr;
                            </a>
                        </footer>
                    <?php endif; ?>
                </article>
                <?php
            endwhile;

            // Posts pagination
            the_posts_pagination(array(
                'prev_text' => __('&larr; Previous', 'my-custom-theme'),
                'next_text' => __('Next &rarr;', 'my-custom-theme'),
            ));

        else :
            ?>
            <div class="no-results">
                <h1><?php _e('Nothing Found', 'my-custom-theme'); ?></h1>
                <p><?php _e('It seems we can&rsquo;t find what you&rsquo;re looking for.', 'my-custom-theme'); ?></p>
            </div>
            <?php
        endif;
        ?>
    </div>
</main>

<?php
get_footer();
