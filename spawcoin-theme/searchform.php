<?php
/**
 * Search form template
 *
 * @package Spawcoin
 */
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
    <label>
        <span class="screen-reader-text"><?php _e('Search for:', 'spawcoin'); ?></span>
        <input type="search" class="search-field" placeholder="<?php echo esc_attr_x('Search...', 'placeholder', 'spawcoin'); ?>" value="<?php echo get_search_query(); ?>" name="s" />
    </label>
    <button type="submit" class="search-submit btn btn-primary">
        <i class="fas fa-search"></i> <?php echo esc_attr_x('Search', 'submit button', 'spawcoin'); ?>
    </button>
</form>
