<?php
/**
 * Template Name: Homepage
 * The template for displaying the homepage
 *
 * @package Spawcoin
 */

get_header();
?>

<!-- Hero Section -->
<section class="hero-section">
    <div class="hero-content">
        <h1 class="hero-title">
            <?php echo esc_html(get_theme_mod('spawcoin_hero_title', 'Welcome to Spawcoin')); ?>
        </h1>
        <p class="hero-subtitle">
            <?php echo esc_html(get_theme_mod('spawcoin_hero_subtitle', 'The Next Generation Memecoin')); ?>
        </p>
        <div class="hero-cta">
            <a href="<?php echo esc_url(get_theme_mod('spawcoin_hero_button_url', '#')); ?>" class="btn btn-primary">
                <?php echo esc_html(get_theme_mod('spawcoin_hero_button_text', 'Get Started')); ?>
            </a>
            <a href="#roadmap" class="btn btn-secondary">View Roadmap</a>
        </div>
    </div>
</section>

<!-- About Section -->
<section class="section" id="about">
    <div class="container">
        <h2 class="section-title">About Spawcoin</h2>
        <?php
        // Get page content if homepage is set to a static page
        if (have_posts()) :
            while (have_posts()) : the_post();
                the_content();
            endwhile;
        else:
        ?>
            <div class="about-content text-center">
                <p>Spawcoin is more than just a memecoin - it's a community-driven movement that combines fun, innovation, and serious blockchain technology. Join us on our journey to the moon and beyond!</p>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- Roadmap Section -->
<section class="section section-dark roadmap-section" id="roadmap">
    <div class="container">
        <h2 class="section-title">Our Roadmap</h2>
        <div class="roadmap-timeline">
            <?php
            $roadmap_query = new WP_Query(array(
                'post_type' => 'roadmap',
                'posts_per_page' => -1,
                'orderby' => 'meta_value_num',
                'meta_key' => '_roadmap_order',
                'order' => 'ASC',
            ));

            if ($roadmap_query->have_posts()) :
                while ($roadmap_query->have_posts()) : $roadmap_query->the_post();
                    $phase = get_post_meta(get_the_ID(), '_roadmap_phase', true);
                    $status = get_post_meta(get_the_ID(), '_roadmap_status', true);
                    ?>
                    <div class="roadmap-item fade-in-up">
                        <div class="roadmap-marker"></div>
                        <div class="roadmap-content <?php echo esc_attr($status); ?>">
                            <?php if ($phase) : ?>
                                <div class="roadmap-phase"><?php echo esc_html($phase); ?></div>
                            <?php endif; ?>
                            <h3 class="roadmap-title"><?php the_title(); ?></h3>
                            <div class="roadmap-description"><?php the_content(); ?></div>
                            <?php if ($status) : ?>
                                <span class="roadmap-status-badge"><?php echo esc_html(ucfirst(str_replace('-', ' ', $status))); ?></span>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php
                endwhile;
                wp_reset_postdata();
            else:
                ?>
                <div class="roadmap-item">
                    <div class="roadmap-marker"></div>
                    <div class="roadmap-content">
                        <div class="roadmap-phase">Q1 2024</div>
                        <h3 class="roadmap-title">Launch Phase</h3>
                        <div class="roadmap-description">
                            <p>Initial token launch and community building</p>
                        </div>
                    </div>
                </div>
                <div class="roadmap-item">
                    <div class="roadmap-marker"></div>
                    <div class="roadmap-content">
                        <div class="roadmap-phase">Q2 2024</div>
                        <h3 class="roadmap-title">Exchange Listings</h3>
                        <div class="roadmap-description">
                            <p>List on major exchanges and expand liquidity</p>
                        </div>
                    </div>
                </div>
                <div class="roadmap-item">
                    <div class="roadmap-marker"></div>
                    <div class="roadmap-content">
                        <div class="roadmap-phase">Q3 2024</div>
                        <h3 class="roadmap-title">Ecosystem Growth</h3>
                        <div class="roadmap-description">
                            <p>Develop partnerships and expand use cases</p>
                        </div>
                    </div>
                </div>
                <?php
            endif;
            ?>
        </div>
    </div>
</section>

<!-- Team Section -->
<section class="section team-section" id="team">
    <div class="container">
        <h2 class="section-title">Meet Our Team</h2>
        <div class="team-grid">
            <?php
            $team_query = new WP_Query(array(
                'post_type' => 'team_member',
                'posts_per_page' => -1,
            ));

            if ($team_query->have_posts()) :
                while ($team_query->have_posts()) : $team_query->the_post();
                    $role = get_post_meta(get_the_ID(), '_team_member_role', true);
                    $twitter = get_post_meta(get_the_ID(), '_team_member_twitter', true);
                    $linkedin = get_post_meta(get_the_ID(), '_team_member_linkedin', true);
                    $telegram = get_post_meta(get_the_ID(), '_team_member_telegram', true);
                    ?>
                    <div class="team-member fade-in-up">
                        <?php if (has_post_thumbnail()) : ?>
                            <?php the_post_thumbnail('spawcoin-team-thumb', array('class' => 'team-member-image')); ?>
                        <?php else : ?>
                            <img src="https://via.placeholder.com/150" alt="<?php the_title(); ?>" class="team-member-image">
                        <?php endif; ?>
                        <h3 class="team-member-name"><?php the_title(); ?></h3>
                        <?php if ($role) : ?>
                            <div class="team-member-role"><?php echo esc_html($role); ?></div>
                        <?php endif; ?>
                        <div class="team-member-story"><?php the_content(); ?></div>
                        <div class="team-member-social">
                            <?php if ($twitter) : ?>
                                <a href="<?php echo esc_url($twitter); ?>" target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-twitter"></i>
                                </a>
                            <?php endif; ?>
                            <?php if ($linkedin) : ?>
                                <a href="<?php echo esc_url($linkedin); ?>" target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                            <?php endif; ?>
                            <?php if ($telegram) : ?>
                                <a href="<?php echo esc_url($telegram); ?>" target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-telegram"></i>
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php
                endwhile;
                wp_reset_postdata();
            else:
                ?>
                <div class="team-member">
                    <img src="https://via.placeholder.com/150" alt="Team Member" class="team-member-image">
                    <h3 class="team-member-name">Founder Name</h3>
                    <div class="team-member-role">Founder & CEO</div>
                    <div class="team-member-story">Add team members through WordPress admin to display them here.</div>
                </div>
                <?php
            endif;
            ?>
        </div>
    </div>
</section>

<!-- Testimonials Section -->
<section class="section testimonials-section" id="testimonials">
    <div class="container">
        <h2 class="section-title">What Our Community Says</h2>
        <div class="testimonials-grid">
            <?php
            $testimonial_query = new WP_Query(array(
                'post_type' => 'testimonial',
                'posts_per_page' => 6,
            ));

            if ($testimonial_query->have_posts()) :
                while ($testimonial_query->have_posts()) : $testimonial_query->the_post();
                    $company = get_post_meta(get_the_ID(), '_testimonial_company', true);
                    $rating = get_post_meta(get_the_ID(), '_testimonial_rating', true);
                    ?>
                    <div class="testimonial-card fade-in-up">
                        <div class="testimonial-content">
                            <?php the_content(); ?>
                        </div>
                        <?php if ($rating) : ?>
                            <div class="testimonial-rating">
                                <?php for ($i = 0; $i < intval($rating); $i++) : ?>
                                    <i class="fas fa-star"></i>
                                <?php endfor; ?>
                            </div>
                        <?php endif; ?>
                        <div class="testimonial-author">
                            <?php if (has_post_thumbnail()) : ?>
                                <?php the_post_thumbnail('thumbnail', array('class' => 'testimonial-avatar')); ?>
                            <?php else : ?>
                                <img src="https://via.placeholder.com/50" alt="<?php the_title(); ?>" class="testimonial-avatar">
                            <?php endif; ?>
                            <div class="testimonial-author-info">
                                <h4><?php the_title(); ?></h4>
                                <?php if ($company) : ?>
                                    <p><?php echo esc_html($company); ?></p>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                    <?php
                endwhile;
                wp_reset_postdata();
            else:
                ?>
                <div class="testimonial-card">
                    <div class="testimonial-content">
                        "Spawcoin is amazing! The community is fantastic and the team is super responsive."
                    </div>
                    <div class="testimonial-author">
                        <img src="https://via.placeholder.com/50" alt="Customer" class="testimonial-avatar">
                        <div class="testimonial-author-info">
                            <h4>Happy Customer</h4>
                            <p>Early Investor</p>
                        </div>
                    </div>
                </div>
                <?php
            endif;
            ?>
        </div>
    </div>
</section>

<!-- YouTube Videos Section -->
<section class="section youtube-section" id="videos">
    <div class="container">
        <h2 class="section-title">Latest Videos</h2>
        <div class="video-grid">
            <?php
            $video_query = new WP_Query(array(
                'post_type' => 'youtube_video',
                'posts_per_page' => 6,
            ));

            if ($video_query->have_posts()) :
                while ($video_query->have_posts()) : $video_query->the_post();
                    $video_id = get_post_meta(get_the_ID(), '_youtube_video_id', true);
                    ?>
                    <div class="video-item fade-in-up">
                        <?php if ($video_id) : ?>
                            <div class="video-thumbnail">
                                <iframe
                                    src="https://www.youtube.com/embed/<?php echo esc_attr($video_id); ?>"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                ></iframe>
                            </div>
                        <?php endif; ?>
                        <div class="video-info">
                            <h3 class="video-title"><?php the_title(); ?></h3>
                            <div class="video-description"><?php the_excerpt(); ?></div>
                        </div>
                    </div>
                    <?php
                endwhile;
                wp_reset_postdata();
            else:
                ?>
                <div class="video-item">
                    <div class="video-thumbnail">
                        <iframe
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">Sample Video</h3>
                        <div class="video-description">Add YouTube videos through WordPress admin to display them here.</div>
                    </div>
                </div>
                <?php
            endif;
            ?>
        </div>
    </div>
</section>

<!-- Social Media Section -->
<section class="social-section" id="social">
    <div class="container">
        <h2 class="social-title">Join Our Community</h2>
        <div class="social-links">
            <?php
            $twitter = get_theme_mod('spawcoin_twitter');
            $telegram = get_theme_mod('spawcoin_telegram');
            $discord = get_theme_mod('spawcoin_discord');
            $instagram = get_theme_mod('spawcoin_instagram');
            $youtube = get_theme_mod('spawcoin_youtube');

            if ($twitter) : ?>
                <a href="<?php echo esc_url($twitter); ?>" class="social-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-twitter"></i>
                </a>
            <?php endif;

            if ($telegram) : ?>
                <a href="<?php echo esc_url($telegram); ?>" class="social-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-telegram"></i>
                </a>
            <?php endif;

            if ($discord) : ?>
                <a href="<?php echo esc_url($discord); ?>" class="social-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-discord"></i>
                </a>
            <?php endif;

            if ($instagram) : ?>
                <a href="<?php echo esc_url($instagram); ?>" class="social-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-instagram"></i>
                </a>
            <?php endif;

            if ($youtube) : ?>
                <a href="<?php echo esc_url($youtube); ?>" class="social-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-youtube"></i>
                </a>
            <?php endif;

            // Show placeholder if no social links are set
            if (!$twitter && !$telegram && !$discord && !$instagram && !$youtube) : ?>
                <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-link"><i class="fab fa-telegram"></i></a>
                <a href="#" class="social-link"><i class="fab fa-discord"></i></a>
                <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Blog Section -->
<section class="section blog-section" id="blog">
    <div class="container">
        <h2 class="section-title">Latest News & Updates</h2>
        <div class="blog-grid">
            <?php
            $blog_query = new WP_Query(array(
                'post_type' => 'post',
                'posts_per_page' => 3,
            ));

            if ($blog_query->have_posts()) :
                while ($blog_query->have_posts()) : $blog_query->the_post();
                    ?>
                    <article class="blog-card fade-in-up">
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
                            <h3 class="blog-title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h3>
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
                wp_reset_postdata();
            else:
                ?>
                <p class="text-center">No blog posts yet. Start writing to share news and updates!</p>
                <?php
            endif;
            ?>
        </div>
        <?php if ($blog_query->post_count > 0) : ?>
            <div class="text-center mt-4">
                <a href="<?php echo esc_url(get_permalink(get_option('page_for_posts'))); ?>" class="btn btn-primary">
                    View All Posts
                </a>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php
get_footer();
