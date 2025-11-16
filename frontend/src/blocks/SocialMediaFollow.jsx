import { useState, useEffect } from 'react';
import './SocialMediaFollow.css';

/**
 * SocialMediaFollow Block Component
 * Displays social media links with icons
 *
 * Props:
 * - title: Section title (default: 'Follow Us')
 * - layout: 'horizontal' or 'vertical' (default: 'horizontal')
 * - size: 'small', 'medium', or 'large' (default: 'medium')
 * - style: 'filled', 'outlined', or 'minimal' (default: 'filled')
 */
function SocialMediaFollow({
  title = 'Follow Us',
  layout = 'horizontal',
  size = 'medium',
  style = 'filled'
}) {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await fetch('/api/social-media');
      const data = await response.json();
      setSocialLinks(data.filter(link => link.is_active));
    } catch (error) {
      console.error('Error fetching social media links:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="social-media-loading">Loading...</div>;
  }

  return (
    <div className={`social-media-follow ${layout} ${size} ${style}`}>
      {title && <h3 className="social-media-title">{title}</h3>}
      <div className="social-media-links">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`social-link ${link.platform.toLowerCase()}`}
            title={`Follow us on ${link.platform}`}
          >
            <i className={link.icon_class}></i>
            <span className="social-platform-name">{link.platform}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default SocialMediaFollow;
