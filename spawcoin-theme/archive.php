<?php
/**
 * The template for displaying archive pages
 *
 * @package Spawcoin
 */

get_header();
?>

<main class="site-main" style="margin-top: 100px;">
    <div class="container">
        <div class="blog-section section">
            <?php if (have_posts()) : ?>
                <header class="page-header">
                    <?php
                    the_archive_title('<h1 class="section-title">', '</h1>');
                    the_archive_description('<div class="archive-description">', '</div>');
                    ?>
                </header>

                <div class="blog-grid">
                    <?php
                    while (have_posts()) :
                        the_post();
                        ?>
                        <article id="post-<?php the_ID(); ?>" <?php post_class('blog-card'); ?>>
                            <?php if (has_post_thumbnail()) : ?>
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail('spawcoin-blog-thumb', array('class' => 'blog-thumbnail')); ?>
                                </a>
                            <?php endif; ?>
                            <div class="blog-content">
                                <div class="blog-meta">
                                    <span class="blog-date">
                                        <i class="far fa-calendar"></i> <?php echo get_the_date(); ?>
                                    </span>
                                    <span class="blog-author">
                                        <i class="far fa-user"></i> <?php the_author(); ?>
                                    </span>
                                </div>
                                <h2 class="blog-title">
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                </h2>
                                <div class="blog-excerpt">
                                    <?php the_excerpt(); ?>
                                </div>
                                <a href="<?php the_permalink(); ?>" class="read-more">
                                    Read More <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </article>
                        <?php
                    endwhile;
                    ?>
                </div>

                <?php
                // Pagination
                the_posts_pagination(array(
                    'mid_size' => 2,
                    'prev_text' => __('<i class="fas fa-arrow-left"></i> Previous', 'spawcoin'),
                    'next_text' => __('Next <i class="fas fa-arrow-right"></i>', 'spawcoin'),
                ));
                ?>

            <?php else : ?>
                <div class="no-posts">
                    <h2><?php _e('Nothing Found', 'spawcoin'); ?></h2>
                    <p><?php _e('Sorry, no posts matched your criteria.', 'spawcoin'); ?></p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php
get_footer();
