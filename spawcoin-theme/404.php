<?php
/**
 * The template for displaying 404 pages
 *
 * @package Spawcoin
 */

get_header();
?>

<main class="site-main" style="margin-top: 100px;">
    <div class="container">
        <div class="section text-center">
            <div class="error-404">
                <h1 style="font-size: 6rem; color: var(--primary-color); margin-bottom: 1rem;">404</h1>
                <h2 style="margin-bottom: 1rem;"><?php _e('Oops! Page Not Found', 'spawcoin'); ?></h2>
                <p style="font-size: 1.2rem; color: #666; margin-bottom: 2rem;">
                    <?php _e('The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.', 'spawcoin'); ?>
                </p>

                <div class="error-404-actions" style="margin-bottom: 3rem;">
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-primary">
                        <i class="fas fa-home"></i> <?php _e('Go to Homepage', 'spawcoin'); ?>
                    </a>
                </div>

                <div class="error-404-search" style="max-width: 600px; margin: 0 auto;">
                    <h3><?php _e('Try searching for what you need:', 'spawcoin'); ?></h3>
                    <?php get_search_form(); ?>
                </div>

                <div class="error-404-links" style="margin-top: 3rem;">
                    <h3><?php _e('Or check out these popular pages:', 'spawcoin'); ?></h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 0.5rem 0;">
                            <a href="<?php echo esc_url(home_url('/')); ?>">
                                <i class="fas fa-angle-right"></i> <?php _e('Home', 'spawcoin'); ?>
                            </a>
                        </li>
                        <li style="margin: 0.5rem 0;">
                            <a href="<?php echo esc_url(home_url('/#roadmap')); ?>">
                                <i class="fas fa-angle-right"></i> <?php _e('Roadmap', 'spawcoin'); ?>
                            </a>
                        </li>
                        <li style="margin: 0.5rem 0;">
                            <a href="<?php echo esc_url(home_url('/#team')); ?>">
                                <i class="fas fa-angle-right"></i> <?php _e('Team', 'spawcoin'); ?>
                            </a>
                        </li>
                        <li style="margin: 0.5rem 0;">
                            <a href="<?php echo esc_url(get_permalink(get_option('page_for_posts'))); ?>">
                                <i class="fas fa-angle-right"></i> <?php _e('Blog', 'spawcoin'); ?>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</main>

<?php
get_footer();
