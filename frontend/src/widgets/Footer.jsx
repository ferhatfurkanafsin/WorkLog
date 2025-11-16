import { useState, useEffect } from 'react';
import './Footer.css';
import SocialMediaFollow from '../blocks/SocialMediaFollow';

/**
 * Footer Widget Component
 * Site footer with social links and author credit
 *
 * Props:
 * - showSocial: Show social media links (default: true)
 * - showAuthor: Show author credit (default: true)
 */
function Footer({ showSocial = true, showAuthor = true }) {
  const [authorLink, setAuthorLink] = useState('');

  useEffect(() => {
    // Get author Instagram link from settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(settings => {
        setAuthorLink(settings.author_instagram || 'https://www.instagram.com/_furkan.afsin/');
      })
      .catch(() => {
        setAuthorLink('https://www.instagram.com/_furkan.afsin/');
      });
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        {showSocial && (
          <div className="footer-social">
            <SocialMediaFollow
              title="Connect With Us"
              layout="horizontal"
              size="medium"
              style="outlined"
            />
          </div>
        )}

        <div className="footer-links">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/team">Our Team</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/docs">Documentation</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/support">Support</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
              <li><a href="/disclaimer">Disclaimer</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Community</h4>
            <ul>
              <li><a href="/referral">Referral Program</a></li>
              <li><a href="/airdrop">Airdrop</a></li>
              <li><a href="/ambassador">Ambassador Program</a></li>
              <li><a href="/events">Events</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} WorkLog. All rights reserved.
          </p>

          {showAuthor && authorLink && (
            <div className="author-credit">
              <p>
                Theme by{' '}
                <a
                  href={authorLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="author-link"
                >
                  <span className="author-icon">📸</span>
                  @_furkan.afsin
                </a>
              </p>
              <p className="author-tagline">
                Need a custom theme? <a href={authorLink} target="_blank" rel="noopener noreferrer">Let's talk!</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
