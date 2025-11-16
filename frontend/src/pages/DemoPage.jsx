import { useState } from 'react';
import './DemoPage.css';

// Import all blocks
import {
  VideoEmbed,
  NewsletterPopup,
  SocialMediaFollow,
  WalletConnect,
  AdBlock,
  CustomButton
} from '../blocks';

// Import widgets
import { LanguageSelector } from '../widgets';
import Footer from '../widgets/Footer';

/**
 * DemoPage - Complete demonstration of all available blocks and widgets
 * This page shows how to integrate and use all components together
 */
function DemoPage() {
  const [walletConnected, setWalletConnected] = useState(false);

  const handleWalletConnect = (walletData) => {
    console.log('Wallet connected:', walletData);
    setWalletConnected(true);
  };

  const handleWalletDisconnect = () => {
    console.log('Wallet disconnected');
    setWalletConnected(false);
  };

  return (
    <div className="demo-page">
      {/* Fixed Top Elements */}
      <WalletConnect
        position="fixed-top"
        network="mainnet"
        onConnect={handleWalletConnect}
        onDisconnect={handleWalletDisconnect}
      />

      {/* Header */}
      <header className="demo-header">
        <div className="header-container">
          <div className="logo">
            <h1>🚀 Theme Demo</h1>
          </div>

          <nav className="main-nav">
            <a href="/">Home</a>
            <a href="/blog">Blog</a>
            <a href="/about">About</a>
            <a href="/signup">Sign Up</a>
          </nav>

          <LanguageSelector
            position="header"
            style="dropdown"
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            Build Amazing Crypto Websites
            <br />
            With Pre-Built Blocks
          </h1>
          <p className="hero-subtitle">
            Drag, drop, and customize powerful components for your blockchain project
          </p>

          <div className="hero-buttons">
            <CustomButton
              text="Get Started Free"
              link="/signup"
              style="primary"
              size="large"
              icon="fas fa-rocket"
            />

            <CustomButton
              text="View Documentation"
              link="/docs"
              style="outline"
              size="large"
              icon="fas fa-book"
            />
          </div>

          {walletConnected && (
            <div className="wallet-status">
              ✓ Wallet Connected! You're ready to receive airdrops.
            </div>
          )}
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <div className="container">
          <h2 className="section-title">Watch How It Works</h2>
          <VideoEmbed
            videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            title="Platform Introduction Video"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>TON Wallet Integration</h3>
              <p>Connect TonKeeper, TonHub, or any TON wallet with ease</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎁</div>
              <h3>Airdrop System</h3>
              <p>Automatic token distribution to new users</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Referral Program</h3>
              <p>Earn rewards when friends purchase tokens</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Multi-Language</h3>
              <p>Support for 12+ languages out of the box</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Blog System</h3>
              <p>Built-in blogging for SEO and content marketing</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Multi-Auth</h3>
              <p>Google, Facebook, and email authentication</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <section className="ad-section">
        <div className="container">
          <AdBlock
            position="header"
            adType="google"
            editable={false}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Launch Your Crypto Project?</h2>
            <p>Join thousands of users and start building today</p>
            <div className="cta-buttons">
              <CustomButton
                text="Sign Up & Get 100 TON"
                link="/signup"
                style="secondary"
                size="large"
                icon="fas fa-gift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Section */}
      <section className="social-section">
        <div className="container">
          <SocialMediaFollow
            title="Join Our Community"
            layout="horizontal"
            size="large"
            style="filled"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-item">
              <h3>$5M+</h3>
              <p>Tokens Distributed</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Countries</p>
            </div>
            <div className="stat-item">
              <h3>99.9%</h3>
              <p>Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Popup */}
      <NewsletterPopup
        delay={8000}
        title="Stay in the Loop!"
        message="Get exclusive crypto insights and early access to new features"
        showOnce={true}
      />

      {/* Footer */}
      <Footer showSocial={true} showAuthor={true} />
    </div>
  );
}

export default DemoPage;
