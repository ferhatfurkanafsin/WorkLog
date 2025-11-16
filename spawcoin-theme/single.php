<?php
/**
 * The template for displaying single posts
 *
 * @package Spawcoin
 */

get_header();
?>

<main class="site-main" style="margin-top: 100px;">
    <?php
    while (have_posts()) :
        the_post();
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('single-post'); ?>>
            <header class="post-header">
                <h1 class="post-title"><?php the_title(); ?></h1>
                <div class="post-meta">
                    <span class="post-date">
                        <i class="far fa-calendar"></i> <?php echo get_the_date(); ?>
                    </span>
                    <span class="post-author">
                        <i class="far fa-user"></i> By <?php the_author(); ?>
                    </span>
                    <?php if (has_category()) : ?>
                        <span class="post-categories">
                            <i class="far fa-folder"></i> <?php the_category(', '); ?>
                        </span>
                    <?php endif; ?>
                    <?php if (has_tag()) : ?>
                        <span class="post-tags">
                            <i class="fas fa-tags"></i> <?php the_tags('', ', ', ''); ?>
                        </span>
                    <?php endif; ?>
                </div>
            </header>

            <?php if (has_post_thumbnail()) : ?>
                <div class="post-thumbnail-wrapper">
                    <?php the_post_thumbnail('large', array('class' => 'post-thumbnail')); ?>
                </div>
            <?php endif; ?>

            <div class="post-content">
                <?php the_content(); ?>

                <?php
                wp_link_pages(array(
                    'before' => '<div class="page-links">' . __('Pages:', 'spawcoin'),
                    'after' => '</div>',
                ));
                ?>
            </div>

            <footer class="post-footer">
                <?php if (has_tag()) : ?>
                    <div class="post-tags-list">
                        <strong><?php _e('Tags:', 'spawcoin'); ?></strong>
                        <?php the_tags('', ' ', ''); ?>
                    </div>
                <?php endif; ?>
            </footer>

            <?php
            // Post navigation
            the_post_navigation(array(
                'prev_text' => '<span class="nav-subtitle">' . __('Previous Post', 'spawcoin') . '</span> <span class="nav-title">%title</span>',
                'next_text' => '<span class="nav-subtitle">' . __('Next Post', 'spawcoin') . '</span> <span class="nav-title">%title</span>',
            ));
            ?>

            <?php
            // Comments
            if (comments_open() || get_comments_number()) :
                comments_template();
            endif;
            ?>
        </article>
        <?php
    endwhile;
    ?>
</main>

<?php
get_footer();
