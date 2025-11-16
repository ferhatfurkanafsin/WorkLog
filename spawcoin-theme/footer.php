<footer class="site-footer">
    <div class="container">
        <div class="footer-content">
            <?php if (is_active_sidebar('footer-1')) : ?>
                <div class="footer-section">
                    <?php dynamic_sidebar('footer-1'); ?>
                </div>
            <?php else : ?>
                <div class="footer-section">
                    <h3><?php bloginfo('name'); ?></h3>
                    <p><?php bloginfo('description'); ?></p>
                </div>
            <?php endif; ?>

            <?php if (is_active_sidebar('footer-2')) : ?>
                <div class="footer-section">
                    <?php dynamic_sidebar('footer-2'); ?>
                </div>
            <?php else : ?>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="<?php echo esc_url(home_url('/')); ?>">Home</a></li>
                        <li><a href="<?php echo esc_url(home_url('/#roadmap')); ?>">Roadmap</a></li>
                        <li><a href="<?php echo esc_url(home_url('/#team')); ?>">Team</a></li>
                        <li><a href="<?php echo esc_url(home_url('/blog')); ?>">Blog</a></li>
                    </ul>
                </div>
            <?php endif; ?>

            <?php if (is_active_sidebar('footer-3')) : ?>
                <div class="footer-section">
                    <?php dynamic_sidebar('footer-3'); ?>
                </div>
            <?php else : ?>
                <div class="footer-section">
                    <h3>Connect With Us</h3>
                    <div class="footer-social">
                        <?php
                        $twitter = get_theme_mod('spawcoin_twitter');
                        $telegram = get_theme_mod('spawcoin_telegram');
                        $discord = get_theme_mod('spawcoin_discord');
                        $instagram = get_theme_mod('spawcoin_instagram');
                        $youtube = get_theme_mod('spawcoin_youtube');

                        if ($twitter) : ?>
                            <a href="<?php echo esc_url($twitter); ?>" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-twitter"></i> Twitter
                            </a>
                        <?php endif;

                        if ($telegram) : ?>
                            <a href="<?php echo esc_url($telegram); ?>" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-telegram"></i> Telegram
                            </a>
                        <?php endif;

                        if ($discord) : ?>
                            <a href="<?php echo esc_url($discord); ?>" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-discord"></i> Discord
                            </a>
                        <?php endif;

                        if ($instagram) : ?>
                            <a href="<?php echo esc_url($instagram); ?>" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-instagram"></i> Instagram
                            </a>
                        <?php endif;

                        if ($youtube) : ?>
                            <a href="<?php echo esc_url($youtube); ?>" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-youtube"></i> YouTube
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.</p>
            <p>Theme by <a href="https://spawcoin.com" target="_blank">ferhat furkan afsin</a></p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
