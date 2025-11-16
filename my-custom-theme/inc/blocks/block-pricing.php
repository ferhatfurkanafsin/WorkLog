<?php
/**
 * Pricing Table Block Template
 *
 * @package My_Custom_Theme
 * @since 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$data = mct_get_block_data($block_data, 'pricing');

mct_block_wrapper_start($block_id, 'pricing');
?>

<div class="mct-pricing-table">
    <?php
    if (!empty($data['plans']) && is_array($data['plans'])) :
        foreach ($data['plans'] as $plan) :
            $featured_class = !empty($plan['featured']) ? ' featured' : '';
            ?>
            <div class="mct-pricing-plan<?php echo esc_attr($featured_class); ?>">
                <div class="mct-pricing-name"><?php echo esc_html($plan['name']); ?></div>
                <div class="mct-pricing-price"><?php echo esc_html($plan['price']); ?></div>
                <div class="mct-pricing-period"><?php echo esc_html($plan['period']); ?></div>

                <?php if (!empty($plan['features']) && is_array($plan['features'])) : ?>
                    <ul class="mct-pricing-features">
                        <?php foreach ($plan['features'] as $feature) : ?>
                            <li><?php echo esc_html($feature); ?></li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>

                <?php if (!empty($plan['button_text']) && !empty($plan['button_url'])) : ?>
                    <a href="<?php echo esc_url($plan['button_url']); ?>" class="mct-button">
                        <?php echo esc_html($plan['button_text']); ?>
                    </a>
                <?php endif; ?>
            </div>
            <?php
        endforeach;
    endif;
    ?>
</div>

<?php
mct_block_wrapper_end();
