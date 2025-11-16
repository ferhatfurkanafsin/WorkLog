<?php
/**
 * The template for displaying pages
 *
 * @package Spawcoin
 */

get_header();
?>

<main class="site-main" style="margin-top: 100px;">
    <div class="container">
        <div class="section">
            <?php
            while (have_posts()) :
                the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('page-content'); ?>>
                    <header class="page-header">
                        <h1 class="page-title"><?php the_title(); ?></h1>
                    </header>

                    <?php if (has_post_thumbnail()) : ?>
                        <div class="page-thumbnail">
                            <?php the_post_thumbnail('large'); ?>
                        </div>
                    <?php endif; ?>

                    <div class="entry-content">
                        <?php
                        the_content();

                        wp_link_pages(array(
                            'before' => '<div class="page-links">' . __('Pages:', 'spawcoin'),
                            'after' => '</div>',
                        ));
                        ?>
                    </div>

                    <?php
                    // Comments (if enabled for pages)
                    if (comments_open() || get_comments_number()) :
                        comments_template();
                    endif;
                    ?>
                </article>
                <?php
            endwhile;
            ?>
        </div>
    </div>
</main>

<?php
get_footer();
