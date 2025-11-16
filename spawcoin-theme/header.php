<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <div class="container header-container">
        <div class="site-branding">
            <?php
            if (has_custom_logo()) {
                the_custom_logo();
            } else {
                ?>
                <a href="<?php echo esc_url(home_url('/')); ?>" class="site-logo">
                    <?php bloginfo('name'); ?>
                </a>
                <?php
            }
            ?>
        </div>

        <button class="mobile-menu-toggle" aria-label="Toggle Menu">
            <i class="fas fa-bars"></i>
        </button>

        <nav class="main-navigation">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_class' => 'primary-menu',
                'container' => false,
                'fallback_cb' => 'spawcoin_fallback_menu',
            ));
            ?>
        </nav>
    </div>
</header>

<?php
/**
 * Fallback menu if no menu is set
 */
function spawcoin_fallback_menu() {
    ?>
    <ul class="primary-menu">
        <li><a href="<?php echo esc_url(home_url('/')); ?>">Home</a></li>
        <li><a href="<?php echo esc_url(home_url('/#roadmap')); ?>">Roadmap</a></li>
        <li><a href="<?php echo esc_url(home_url('/#team')); ?>">Team</a></li>
        <li><a href="<?php echo esc_url(home_url('/blog')); ?>">Blog</a></li>
        <li><a href="<?php echo esc_url(home_url('/#contact')); ?>">Contact</a></li>
    </ul>
    <?php
}
?>
