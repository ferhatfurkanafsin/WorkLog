import { useState } from 'react';
import './CustomButton.css';

/**
 * CustomButton Block Component
 * Highly customizable button with link assignment
 *
 * Props:
 * - text: Button text
 * - link: URL to navigate to
 * - style: 'primary' | 'secondary' | 'outline' | 'ghost' (default: 'primary')
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - icon: Icon class name (optional)
 * - openInNewTab: Boolean (default: false)
 * - editable: Show edit interface (default: false)
 * - onClick: Custom click handler (optional)
 */
function CustomButton({
  text = 'Click Me',
  link = '#',
  style = 'primary',
  size = 'medium',
  icon = '',
  openInNewTab = false,
  editable = false,
  onClick = null
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [buttonText, setButtonText] = useState(text);
  const [buttonLink, setButtonLink] = useState(link);
  const [buttonStyle, setButtonStyle] = useState(style);
  const [buttonSize, setButtonSize] = useState(size);
  const [buttonIcon, setButtonIcon] = useState(icon);
  const [newTab, setNewTab] = useState(openInNewTab);

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real implementation, you might want to save to backend
  };

  if (editable && isEditing) {
    return (
      <div className="custom-button-editor">
        <h3>Edit Button</h3>

        <div className="form-group">
          <label>Button Text</label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            placeholder="Enter button text"
            className="button-text-input"
          />
        </div>

        <div className="form-group">
          <label>Link URL</label>
          <input
            type="text"
            value={buttonLink}
            onChange={(e) => setButtonLink(e.target.value)}
            placeholder="https://example.com"
            className="button-link-input"
          />
        </div>

        <div className="form-group">
          <label>Icon Class (Optional)</label>
          <input
            type="text"
            value={buttonIcon}
            onChange={(e) => setButtonIcon(e.target.value)}
            placeholder="e.g., fas fa-arrow-right"
            className="button-icon-input"
          />
        </div>

        <div className="form-group">
          <label>Style</label>
          <select
            value={buttonStyle}
            onChange={(e) => setButtonStyle(e.target.value)}
            className="button-style-select"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
          </select>
        </div>

        <div className="form-group">
          <label>Size</label>
          <select
            value={buttonSize}
            onChange={(e) => setButtonSize(e.target.value)}
            className="button-size-select"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={newTab}
              onChange={(e) => setNewTab(e.target.checked)}
            />
            Open in new tab
          </label>
        </div>

        <button onClick={handleSave} className="btn-save">Save Button</button>
        <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
      </div>
    );
  }

  const ButtonContent = () => (
    <>
      {buttonIcon && <i className={`${buttonIcon} button-icon`}></i>}
      <span>{buttonText}</span>
    </>
  );

  return (
    <div className="custom-button-wrapper">
      {buttonLink !== '#' && !onClick ? (
        <a
          href={buttonLink}
          className={`custom-button ${buttonStyle} ${buttonSize}`}
          target={newTab ? '_blank' : '_self'}
          rel={newTab ? 'noopener noreferrer' : undefined}
        >
          <ButtonContent />
        </a>
      ) : (
        <button
          onClick={handleClick}
          className={`custom-button ${buttonStyle} ${buttonSize}`}
        >
          <ButtonContent />
        </button>
      )}

      {editable && !isEditing && (
        <button onClick={() => setIsEditing(true)} className="btn-edit-button">
          Edit
        </button>
      )}
    </div>
  );
}

export default CustomButton;
