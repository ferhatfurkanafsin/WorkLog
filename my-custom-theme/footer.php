<?php
/**
 * The footer for our theme
 *
 * @package My_Custom_Theme
 * @since 1.0
 */
?>

    </div><!-- #content -->

    <footer id="colophon" class="site-footer">
        <div class="site-container">
            <?php if (is_active_sidebar('footer-1')) : ?>
                <div class="footer-widgets">
                    <?php dynamic_sidebar('footer-1'); ?>
                </div>
            <?php endif; ?>

            <div class="site-info">
                <p>
                    &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>.
                    <?php _e('All rights reserved.', 'my-custom-theme'); ?>
                </p>
                <p>
                    <?php
                    printf(
                        __('Powered by %s', 'my-custom-theme'),
                        '<a href="' . esc_url(__('https://wordpress.org/', 'my-custom-theme')) . '">WordPress</a>'
                    );
                    ?>
                </p>
            </div>

            <?php
            if (has_nav_menu('footer')) {
                wp_nav_menu(array(
                    'theme_location' => 'footer',
                    'menu_id'        => 'footer-menu',
                    'container'      => 'nav',
                    'container_class' => 'footer-navigation',
                    'depth'          => 1,
                ));
            }
            ?>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
