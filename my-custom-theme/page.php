<?php
/**
 * The template for displaying all pages
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php
    while (have_posts()) :
        the_post();

        // Check if page builder is active
        $blocks = get_post_meta(get_the_ID(), '_mct_page_builder_blocks', true);

        if (!empty($blocks)) :
            // Render page builder content
            ?>
            <div class="mct-page-builder-content">
                <?php mct_render_page_builder_blocks($blocks); ?>
            </div>
            <?php
        else :
            // Default page content
            ?>
            <div class="site-container">
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <header class="entry-header">
                        <?php the_title('<h1 class="entry-title">', '</h1>'); ?>
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
                </article>

                <?php
                // If comments are open or we have at least one comment, load up the comment template
                if (comments_open() || get_comments_number()) :
                    comments_template();
                endif;
                ?>
            </div>
            <?php
        endif;
    endwhile;
    ?>
</main>

<?php
get_footer();
