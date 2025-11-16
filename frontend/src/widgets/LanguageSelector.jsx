import { useState, useEffect } from 'react';
import './LanguageSelector.css';

/**
 * LanguageSelector Widget Component
 * Multi-language support selector
 *
 * Props:
 * - position: 'header' | 'footer' | 'inline' (default: 'header')
 * - style: 'dropdown' | 'flags' | 'minimal' (default: 'dropdown')
 * - onLanguageChange: Callback when language changes
 */
function LanguageSelector({
  position = 'header',
  style = 'dropdown',
  onLanguageChange = () => {}
}) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  // Supported languages with flags
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLang);
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('language', langCode);
    setIsOpen(false);

    // Update HTML lang attribute
    document.documentElement.lang = langCode;

    // Call callback
    onLanguageChange(langCode);

    // Reload page to apply translations
    // In production, you'd use a proper i18n library
    window.location.reload();
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  if (style === 'flags') {
    return (
      <div className={`language-selector flags ${position}`}>
        <div className="language-flags">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`flag-button ${currentLanguage === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
              title={lang.name}
            >
              {lang.flag}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (style === 'minimal') {
    return (
      <div className={`language-selector minimal ${position}`}>
        <button
          className="minimal-language-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {getCurrentLanguage().code.toUpperCase()}
        </button>
        {isOpen && (
          <div className="language-dropdown">
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default: dropdown style
  return (
    <div className={`language-selector dropdown ${position}`}>
      <button
        className="language-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="current-language-flag">{getCurrentLanguage().flag}</span>
        <span className="current-language-name">{getCurrentLanguage().name}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
              {currentLanguage === lang.code && (
                <span className="check-icon">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
