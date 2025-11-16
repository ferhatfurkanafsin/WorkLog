<?php
/**
 * Template Name: Airdrop Page
 * The template for displaying the airdrop claim page
 *
 * @package Spawcoin
 */

get_header();

$airdrop_enabled = get_theme_mod('spawcoin_airdrop_enabled', false);
$airdrop_amount = get_theme_mod('spawcoin_airdrop_amount', '1000');
$twitter_url = get_theme_mod('spawcoin_twitter', 'https://twitter.com/spawcoin');
$telegram_url = get_theme_mod('spawcoin_telegram', '');
$discord_url = get_theme_mod('spawcoin_discord', '');
?>

<!-- Airdrop Hero -->
<section class="airdrop-hero">
    <div class="container">
        <h1>Spawcoin Airdrop</h1>
        <p class="hero-subtitle">Join our community and claim your free SPAWN tokens!</p>
        <div class="airdrop-amount"><?php echo esc_html(number_format($airdrop_amount)); ?> SPAWN</div>
        <p>per eligible participant</p>
    </div>
</section>

<div class="airdrop-container">

    <?php if (!$airdrop_enabled) : ?>
        <div class="airdrop-card">
            <h2>Airdrop Not Active</h2>
            <p>The airdrop is not currently active. Please check back later or follow our social media for updates!</p>
        </div>
    <?php else : ?>

        <!-- Wallet Connection Card -->
        <div class="airdrop-card dark">
            <h2>Step 1: Connect Your Wallet</h2>
            <p>Connect your Web3 wallet to receive your airdrop tokens</p>

            <div class="wallet-status" style="margin-top: 2rem;">
                <span class="wallet-address"></span>
                <button class="connect-wallet-btn">
                    <i class="fas fa-wallet"></i> Connect Wallet
                </button>
                <button class="disconnect-wallet-btn">
                    <i class="fas fa-sign-out-alt"></i> Disconnect
                </button>
            </div>

            <div class="wallet-connected-content">
                <div class="wallet-info">
                    <div class="token-balance-display">
                        <span>Your SPAWN Balance:</span>
                        <span class="token-balance">0</span>
                    </div>
                    <div class="token-balance-display">
                        <span>Wallet Status:</span>
                        <span style="color: var(--success-color);">✓ Connected</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Social Tasks Card -->
        <div class="airdrop-card">
            <h2>Step 2: Complete Social Tasks</h2>
            <p>Follow us on social media to be eligible for the airdrop</p>

            <ul class="social-tasks">
                <li class="social-task">
                    <input type="checkbox" id="twitter-follow" name="twitter-follow">
                    <i class="fab fa-twitter fa-2x" style="color: #1DA1F2;"></i>
                    <div class="step-content">
                        <h4>Follow us on X (Twitter)</h4>
                        <p>Follow our official X account for updates and announcements</p>
                    </div>
                    <a href="<?php echo esc_url($twitter_url); ?>" target="_blank" rel="noopener noreferrer">
                        Follow <i class="fas fa-external-link-alt"></i>
                    </a>
                </li>

                <?php if ($telegram_url) : ?>
                <li class="social-task">
                    <input type="checkbox" id="telegram-join" name="telegram-join">
                    <i class="fab fa-telegram fa-2x" style="color: #0088cc;"></i>
                    <div class="step-content">
                        <h4>Join our Telegram</h4>
                        <p>Join our Telegram community for real-time updates</p>
                    </div>
                    <a href="<?php echo esc_url($telegram_url); ?>" target="_blank" rel="noopener noreferrer">
                        Join <i class="fas fa-external-link-alt"></i>
                    </a>
                </li>
                <?php endif; ?>

                <?php if ($discord_url) : ?>
                <li class="social-task">
                    <input type="checkbox" id="discord-join" name="discord-join">
                    <i class="fab fa-discord fa-2x" style="color: #5865F2;"></i>
                    <div class="step-content">
                        <h4>Join our Discord</h4>
                        <p>Join our Discord server and connect with the community</p>
                    </div>
                    <a href="<?php echo esc_url($discord_url); ?>" target="_blank" rel="noopener noreferrer">
                        Join <i class="fas fa-external-link-alt"></i>
                    </a>
                </li>
                <?php endif; ?>

                <li class="social-task">
                    <input type="checkbox" id="retweet-post" name="retweet-post">
                    <i class="fab fa-twitter fa-2x" style="color: #1DA1F2;"></i>
                    <div class="step-content">
                        <h4>Retweet our announcement</h4>
                        <p>Retweet and like our pinned airdrop announcement</p>
                    </div>
                    <a href="<?php echo esc_url($twitter_url); ?>" target="_blank" rel="noopener noreferrer">
                        Retweet <i class="fas fa-external-link-alt"></i>
                    </a>
                </li>
            </ul>

            <p style="margin-top: 1rem; font-size: 0.9rem; color: #888;">
                <i class="fas fa-info-circle"></i> Check the boxes above after completing each task
            </p>
        </div>

        <!-- Claim Card -->
        <div class="airdrop-card dark">
            <h2>Step 3: Claim Your Airdrop</h2>
            <p>Once you've completed all tasks and connected your wallet, claim your tokens!</p>

            <div class="airdrop-steps">
                <div class="airdrop-step dark">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>Wallet Connected</h4>
                        <p>Make sure your wallet is connected</p>
                    </div>
                </div>

                <div class="airdrop-step dark">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>Tasks Completed</h4>
                        <p>All social tasks must be checked off</p>
                    </div>
                </div>

                <div class="airdrop-step dark">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4>Click Claim</h4>
                        <p>Submit your claim and receive tokens to your wallet</p>
                    </div>
                </div>
            </div>

            <div style="text-align: center; margin-top: 2rem;">
                <button class="claim-airdrop-btn">
                    <i class="fas fa-gift"></i> Claim <?php echo esc_html(number_format($airdrop_amount)); ?> SPAWN
                </button>
            </div>

            <div class="airdrop-status"></div>
        </div>

        <!-- Share & Earn More Card -->
        <div class="airdrop-card">
            <div class="airdrop-social-share">
                <h3><i class="fas fa-share-alt"></i> Share & Earn More</h3>
                <p>Share Spawcoin with your friends and earn bonus tokens!</p>
                <p style="font-size: 1.2rem; color: var(--primary-color); font-weight: 600; margin: 1rem 0;">
                    +<?php echo esc_html(number_format($airdrop_amount * 0.1)); ?> SPAWN per referral
                </p>

                <div class="social-share-buttons">
                    <a href="https://twitter.com/intent/tweet?text=Join%20the%20Spawcoin%20airdrop%20and%20get%20<?php echo urlencode($airdrop_amount); ?>%20SPAWN%20tokens!&url=<?php echo urlencode(get_permalink()); ?>"
                       class="social-share-btn twitter"
                       target="_blank"
                       rel="noopener noreferrer">
                        <i class="fab fa-twitter"></i>
                    </a>

                    <?php if ($telegram_url) : ?>
                    <a href="https://t.me/share/url?url=<?php echo urlencode(get_permalink()); ?>&text=Join%20the%20Spawcoin%20airdrop!"
                       class="social-share-btn telegram"
                       target="_blank"
                       rel="noopener noreferrer">
                        <i class="fab fa-telegram"></i>
                    </a>
                    <?php endif; ?>

                    <?php if ($discord_url) : ?>
                    <a href="<?php echo esc_url($discord_url); ?>"
                       class="social-share-btn discord"
                       target="_blank"
                       rel="noopener noreferrer">
                        <i class="fab fa-discord"></i>
                    </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Important Notes Card -->
        <div class="airdrop-card">
            <h3><i class="fas fa-exclamation-circle"></i> Important Information</h3>
            <ul style="list-style-position: inside; line-height: 1.8;">
                <li>Airdrop tokens will be distributed within 24-48 hours after claiming</li>
                <li>One claim per wallet address only</li>
                <li>You must hold the tokens for at least 30 days to receive the full amount</li>
                <li>Early sales may result in reduced future airdrops</li>
                <li>Follow us on social media for updates on future airdrops and events</li>
                <li>Make sure you're connected to the correct network in your wallet</li>
            </ul>
        </div>

        <!-- FAQ Section -->
        <div class="airdrop-card dark">
            <h3><i class="fas fa-question-circle"></i> Frequently Asked Questions</h3>

            <div style="margin-top: 1.5rem;">
                <h4>How long does it take to receive tokens?</h4>
                <p>Tokens are typically distributed within 24-48 hours after successfully claiming.</p>
            </div>

            <div style="margin-top: 1.5rem;">
                <h4>Which wallets are supported?</h4>
                <p>We support MetaMask, WalletConnect, Trust Wallet, and any Web3-compatible wallet.</p>
            </div>

            <div style="margin-top: 1.5rem;">
                <h4>Can I claim multiple times?</h4>
                <p>No, each wallet address can only claim once. Duplicate claims will be rejected.</p>
            </div>

            <div style="margin-top: 1.5rem;">
                <h4>What network should I use?</h4>
                <p>Make sure your wallet is connected to the <?php
                    $chain_names = array(
                        '1' => 'Ethereum Mainnet',
                        '56' => 'BNB Smart Chain',
                        '137' => 'Polygon',
                        '42161' => 'Arbitrum',
                        '10' => 'Optimism',
                        '8453' => 'Base',
                    );
                    $chain_id = get_theme_mod('spawcoin_chain_id', '1');
                    echo esc_html($chain_names[$chain_id] ?? 'correct network');
                ?>.</p>
            </div>
        </div>

    <?php endif; ?>
</div>

<?php
get_footer();
