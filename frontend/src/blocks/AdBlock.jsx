import { useState, useEffect } from 'react';
import './AdBlock.css';

/**
 * AdBlock Component
 * Display ads from Google AdSense or custom sponsor ads
 *
 * Props:
 * - position: Position identifier (e.g., 'header', 'sidebar', 'footer')
 * - adType: 'google' | 'sponsor' | 'custom'
 * - adCode: HTML code for Google AdSense or custom ad
 * - width: Ad width (default: '100%')
 * - height: Ad height (default: '250px')
 * - editable: Show edit interface (default: false)
 */
function AdBlock({
  position = 'sidebar',
  adType = 'google',
  adCode = '',
  width = '100%',
  height = '250px',
  editable = false
}) {
  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [customCode, setCustomCode] = useState(adCode);

  useEffect(() => {
    if (!editable) {
      fetchAdData();
    } else {
      setLoading(false);
    }
  }, [position]);

  const fetchAdData = async () => {
    try {
      const response = await fetch(`/api/ads/${position}`);
      if (response.ok) {
        const data = await response.json();
        setAdData(data);
        setCustomCode(data.ad_code || '');
      }
    } catch (error) {
      console.error('Error fetching ad data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          position,
          ad_type: adType,
          ad_code: customCode,
        }),
      });

      if (response.ok) {
        alert('Ad saved successfully!');
        setIsEditing(false);
        fetchAdData();
      }
    } catch (error) {
      console.error('Error saving ad:', error);
      alert('Failed to save ad');
    }
  };

  if (loading) {
    return <div className="ad-block-loading">Loading ad...</div>;
  }

  if (editable && isEditing) {
    return (
      <div className="ad-block-editor">
        <h3>Edit Ad Block - {position}</h3>
        <div className="form-group">
          <label>Ad Type</label>
          <select
            value={adType}
            onChange={(e) => setAdType(e.target.value)}
            className="ad-type-select"
          >
            <option value="google">Google AdSense</option>
            <option value="sponsor">Sponsor Ad</option>
            <option value="custom">Custom HTML</option>
          </select>
        </div>
        <div className="form-group">
          <label>Ad Code</label>
          <textarea
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="Paste your ad code here (Google AdSense, custom HTML, etc.)"
            rows={10}
            className="ad-code-textarea"
          />
        </div>
        <button onClick={handleSave} className="btn-save">Save Ad</button>
        <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
      </div>
    );
  }

  const currentAdCode = adData?.ad_code || customCode;

  return (
    <div className={`ad-block ad-${position}`} style={{ width, minHeight: height }}>
      {currentAdCode ? (
        <div
          className="ad-content"
          dangerouslySetInnerHTML={{ __html: currentAdCode }}
        />
      ) : (
        <div className="ad-placeholder">
          <div className="ad-placeholder-content">
            <span className="ad-label">Advertisement</span>
            <p>Ad space available</p>
            {editable && (
              <button onClick={() => setIsEditing(true)} className="btn-setup-ad">
                Setup Ad
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdBlock;
