import { useState, useEffect } from 'react';
import './NewsletterPopup.css';

/**
 * NewsletterPopup Block Component
 * Shows a popup to collect email addresses for newsletter
 *
 * Props:
 * - delay: Delay before showing popup in milliseconds (default: 5000)
 * - title: Popup title
 * - message: Popup message
 * - showOnce: Show only once per session (default: true)
 */
function NewsletterPopup({
  delay = 5000,
  title = 'Stay Updated!',
  message = 'Subscribe to our newsletter for the latest updates and exclusive offers.',
  showOnce = true
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasShown = sessionStorage.getItem('newsletter_popup_shown');

    if (showOnce && hasShown) {
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
      if (showOnce) {
        sessionStorage.setItem('newsletter_popup_shown', 'true');
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, showOnce]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, source: 'popup' }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you for subscribing!');
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="newsletter-popup-overlay">
      <div className="newsletter-popup">
        <button className="newsletter-popup-close" onClick={handleClose}>
          ×
        </button>

        <div className="newsletter-popup-content">
          <h2>{title}</h2>
          <p>{message}</p>

          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="newsletter-input"
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
            </div>

            <button
              type="submit"
              className="newsletter-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </form>

          {submitMessage && (
            <div className={`newsletter-message ${submitStatus}`}>
              {submitMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsletterPopup;
