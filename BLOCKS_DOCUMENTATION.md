# Building Blocks & Widgets Documentation

## 📦 Overview

This theme system includes a comprehensive set of reusable building blocks and widgets that can be easily integrated into your website. All components are designed to work seamlessly with the TON blockchain network and include multi-language support.

---

## 🎨 Available Blocks

### 1. VideoEmbed Block
**Purpose**: Embed videos from YouTube, Vimeo, or direct links

**Location**: `/frontend/src/blocks/VideoEmbed.jsx`

**Props**:
```javascript
{
  videoUrl: 'https://youtube.com/watch?v=...', // Video URL
  title: 'Video Title',                        // Optional title
  autoplay: false,                             // Auto-play video
  editable: false                              // Show edit interface
}
```

**Usage Example**:
```jsx
import VideoEmbed from './blocks/VideoEmbed';

<VideoEmbed
  videoUrl="https://youtube.com/watch?v=dQw4w9WgXcQ"
  title="Welcome Video"
/>
```

---

### 2. NewsletterPopup Block
**Purpose**: Collect email addresses with a popup

**Location**: `/frontend/src/blocks/NewsletterPopup.jsx`

**Props**:
```javascript
{
  delay: 5000,                                 // Delay before showing (ms)
  title: 'Stay Updated!',                      // Popup title
  message: 'Subscribe to our newsletter...',   // Popup message
  showOnce: true                               // Show only once per session
}
```

**Usage Example**:
```jsx
import NewsletterPopup from './blocks/NewsletterPopup';

<NewsletterPopup
  delay={3000}
  title="Don't Miss Out!"
  message="Get crypto updates delivered to your inbox"
/>
```

---

### 3. SocialMediaFollow Block
**Purpose**: Display social media links with icons

**Location**: `/frontend/src/blocks/SocialMediaFollow.jsx`

**Props**:
```javascript
{
  title: 'Follow Us',                          // Section title
  layout: 'horizontal',                        // 'horizontal' | 'vertical'
  size: 'medium',                              // 'small' | 'medium' | 'large'
  style: 'filled'                              // 'filled' | 'outlined' | 'minimal'
}
```

**Usage Example**:
```jsx
import SocialMediaFollow from './blocks/SocialMediaFollow';

<SocialMediaFollow
  title="Join Our Community"
  layout="horizontal"
  size="large"
  style="filled"
/>
```

**Note**: Social links are managed via the database (`social_media_links` table). Instagram link is pre-configured to: https://www.instagram.com/_furkan.afsin/

---

### 4. WalletConnect Block
**Purpose**: Connect TON network wallets (TonKeeper, TonHub, etc.)

**Location**: `/frontend/src/blocks/WalletConnect.jsx`

**Props**:
```javascript
{
  position: 'fixed-top',                       // 'fixed-top' | 'inline'
  network: 'mainnet',                          // 'mainnet' | 'testnet'
  onConnect: (walletData) => {},               // Callback on connect
  onDisconnect: () => {}                       // Callback on disconnect
}
```

**Usage Example**:
```jsx
import WalletConnect from './blocks/WalletConnect';

<WalletConnect
  position="fixed-top"
  network="mainnet"
  onConnect={(wallet) => console.log('Wallet connected:', wallet)}
/>
```

**Integration Notes**:
- Supports TonKeeper and TonHub wallets
- For production, integrate with TonConnect SDK
- Placeholder implementation provided for development

---

### 5. AdBlock Component
**Purpose**: Display Google AdSense or custom sponsor ads

**Location**: `/frontend/src/blocks/AdBlock.jsx`

**Props**:
```javascript
{
  position: 'sidebar',                         // Position identifier
  adType: 'google',                            // 'google' | 'sponsor' | 'custom'
  adCode: '',                                  // HTML ad code
  width: '100%',                               // Ad width
  height: '250px',                             // Ad height
  editable: false                              // Show edit interface
}
```

**Usage Example**:
```jsx
import AdBlock from './blocks/AdBlock';

// Google AdSense
<AdBlock
  position="header"
  adType="google"
  adCode="<!-- Google AdSense code here -->"
  width="728px"
  height="90px"
/>

// Custom Sponsor Ad
<AdBlock
  position="sidebar"
  adType="sponsor"
  adCode="<a href='...'><img src='...' /></a>"
/>
```

**Ad Positions**:
- `header` - Top banner (728x90)
- `sidebar` - Side column (300x250)
- `footer` - Bottom banner (728x90)
- `banner` - Full-width banner

---

### 6. CustomButton Block
**Purpose**: Highly customizable button with link assignment

**Location**: `/frontend/src/blocks/CustomButton.jsx`

**Props**:
```javascript
{
  text: 'Click Me',                            // Button text
  link: '#',                                   // URL to navigate to
  style: 'primary',                            // 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'medium',                              // 'small' | 'medium' | 'large'
  icon: '',                                    // Icon class name (FontAwesome)
  openInNewTab: false,                         // Open in new tab
  editable: false,                             // Show edit interface
  onClick: () => {}                            // Custom click handler
}
```

**Usage Example**:
```jsx
import CustomButton from './blocks/CustomButton';

<CustomButton
  text="Buy Tokens Now"
  link="/swap"
  style="primary"
  size="large"
  icon="fas fa-coins"
/>

<CustomButton
  text="Learn More"
  link="/about"
  style="outline"
  size="medium"
/>
```

---

## 📄 Pages

### 1. AuthSignup Page
**Purpose**: Multi-authentication signup with airdrop and referral

**Location**: `/frontend/src/pages/AuthSignup.jsx`

**Features**:
- Email/Password signup
- Google OAuth (ready for integration)
- Facebook OAuth (ready for integration)
- Referral code support
- Automatic airdrop eligibility
- Terms & conditions acceptance

**Props**:
```javascript
{
  onSignupSuccess: (userData) => {},           // Callback after signup
  referralCode: ''                             // Pre-filled referral code
}
```

**Usage Example**:
```jsx
import AuthSignup from './pages/AuthSignup';

// Get referral code from URL
const urlParams = new URLSearchParams(window.location.search);
const refCode = urlParams.get('ref');

<AuthSignup
  referralCode={refCode}
  onSignupSuccess={(user) => {
    console.log('User signed up:', user);
    // Redirect to dashboard
  }}
/>
```

---

### 2. BlogList Page
**Purpose**: Display blog posts with search and filtering

**Location**: `/frontend/src/pages/BlogList.jsx`

**Features**:
- Grid layout of blog posts
- Search functionality
- Category filtering
- View count tracking
- Multi-language support

**Props**:
```javascript
{
  showAddButton: false,                        // Show "Add Post" button
  onPostClick: (post) => {}                    // Callback when post clicked
}
```

**Usage Example**:
```jsx
import BlogList from './pages/BlogList';

<BlogList
  showAddButton={isAdmin}
  onPostClick={(post) => {
    window.location.href = `/blog/${post.slug}`;
  }}
/>
```

**Adding New Blog Posts**:
```javascript
// POST to /api/blog/posts
const newPost = {
  title: 'Getting Started with TON',
  slug: 'getting-started-with-ton',
  content: 'Full article content here...',
  excerpt: 'Brief summary...',
  author: 'Admin',
  featured_image: '/images/blog/ton.jpg',
  category: 'Tutorial',
  tags: 'crypto,ton,tutorial',
  status: 'published',
  lang: 'en'
};

fetch('/api/blog/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newPost)
});
```

---

### 3. ReferralDashboard Page
**Purpose**: Manage referrals and track earnings

**Location**: `/frontend/src/pages/ReferralDashboard.jsx`

**Features**:
- Personal referral link generation
- Referral statistics dashboard
- Social media sharing buttons
- Referral history table
- Automatic reward calculation (5% default)

**Props**:
```javascript
{
  userId: 1                                    // Current user's ID
}
```

**Usage Example**:
```jsx
import ReferralDashboard from './pages/ReferralDashboard';

<ReferralDashboard userId={currentUser.id} />
```

**How Referral System Works**:
1. User gets unique referral code (e.g., `REF12AB34CD`)
2. Shares link: `yoursite.com/signup?ref=REF12AB34CD`
3. Friend signs up using the link
4. Original user earns % from friend's purchases
5. Rewards automatically added to account

---

## 🎛️ Widgets

### 1. LanguageSelector Widget
**Purpose**: Multi-language site navigation

**Location**: `/frontend/src/widgets/LanguageSelector.jsx`

**Supported Languages**:
- English (en) 🇬🇧
- Türkçe (tr) 🇹🇷
- Español (es) 🇪🇸
- Français (fr) 🇫🇷
- Deutsch (de) 🇩🇪
- 中文 (zh) 🇨🇳
- 日本語 (ja) 🇯🇵
- العربية (ar) 🇸🇦
- Русский (ru) 🇷🇺
- Português (pt) 🇵🇹
- Italiano (it) 🇮🇹
- 한국어 (ko) 🇰🇷

**Props**:
```javascript
{
  position: 'header',                          // 'header' | 'footer' | 'inline'
  style: 'dropdown',                           // 'dropdown' | 'flags' | 'minimal'
  onLanguageChange: (langCode) => {}           // Callback on language change
}
```

**Usage Example**:
```jsx
import LanguageSelector from './widgets/LanguageSelector';

// In header
<LanguageSelector
  position="header"
  style="dropdown"
  onLanguageChange={(lang) => console.log('Language changed to:', lang)}
/>

// Flags style
<LanguageSelector
  style="flags"
/>
```

---

## 🗄️ Database Schema

### Key Tables

**users** - User accounts and authentication
```sql
- id, email, password_hash, name
- auth_provider (email/google/facebook)
- ton_wallet_address
- referral_code, referred_by
- airdrop_eligible, airdrop_claimed
- total_referral_earnings
- language_preference
```

**newsletter_signups** - Email subscriptions
```sql
- id, email, name
- subscribed, source
- created_at
```

**blog_posts** - Blog content
```sql
- id, title, slug, content, excerpt
- author, featured_image
- category, tags, status
- views, lang
- created_at, published_at
```

**airdrops** - Token airdrops
```sql
- id, user_id, amount, token_type
- status, transaction_hash
- claimed_at, created_at
```

**referrals** - Referral tracking
```sql
- id, referrer_id, referred_user_id
- reward_amount, reward_percentage
- total_purchases, status
```

**social_media_links** - Social media URLs
```sql
- id, platform, url, icon_class
- display_order, is_active
```

**ad_blocks** - Advertisement placements
```sql
- id, block_name, ad_type, ad_code
- position, is_active
```

**site_settings** - Global settings
```sql
- id, setting_key, setting_value, setting_type
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Start Development Server
```bash
npm run dev
```

This starts both backend (port 3000) and frontend (port 5173).

### 3. Import Blocks in Your Component
```jsx
import VideoEmbed from './blocks/VideoEmbed';
import NewsletterPopup from './blocks/NewsletterPopup';
import SocialMediaFollow from './blocks/SocialMediaFollow';
import WalletConnect from './blocks/WalletConnect';
import AdBlock from './blocks/AdBlock';
import CustomButton from './blocks/CustomButton';
import LanguageSelector from './widgets/LanguageSelector';
```

### 4. Create a Page with Multiple Blocks
```jsx
function LandingPage() {
  return (
    <div>
      <WalletConnect position="fixed-top" />
      <LanguageSelector position="header" style="dropdown" />

      <VideoEmbed
        videoUrl="https://youtube.com/watch?v=..."
        title="Welcome to Our Platform"
      />

      <SocialMediaFollow
        title="Join Our Community"
        layout="horizontal"
      />

      <CustomButton
        text="Sign Up & Get Airdrop"
        link="/signup"
        style="primary"
        size="large"
      />

      <AdBlock position="sidebar" />

      <NewsletterPopup delay={5000} />
    </div>
  );
}
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

### Social Media
- `GET /api/social-media` - Get all social links
- `POST /api/social-media` - Add new social link

### Blog
- `GET /api/blog/posts` - Get all published posts
- `GET /api/blog/post/:slug` - Get single post
- `POST /api/blog/posts` - Create new post

### Ads
- `GET /api/ads/:position` - Get ad by position
- `POST /api/ads` - Create/update ad

### Referrals
- `GET /api/referrals/user/:userId` - Get user referral data

### Airdrops
- `GET /api/airdrops/user/:userId` - Get user airdrops
- `POST /api/airdrops/claim/:userId` - Claim airdrop

### Settings
- `GET /api/settings` - Get all site settings
- `PUT /api/settings/:key` - Update setting

---

## 💡 Tips & Best Practices

### 1. Customizing Styles
All components have corresponding CSS files. Modify them to match your brand:
```css
/* Change primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### 2. Adding More Languages
Edit `/frontend/src/widgets/LanguageSelector.jsx`:
```javascript
const languages = [
  // Add your language
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];
```

### 3. Configuring Referral Percentage
Update via API or database:
```javascript
fetch('/api/settings/referral_percentage', {
  method: 'PUT',
  body: JSON.stringify({ value: '10' }) // 10% commission
});
```

### 4. TON Wallet Integration
For production, integrate TonConnect SDK:
```javascript
// Install
npm install @tonconnect/ui-react

// Use in WalletConnect.jsx
import { TonConnectButton } from '@tonconnect/ui-react';
```

### 5. Adding Font Awesome Icons
Include in `/frontend/index.html`:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

---

## 📞 Support & Resources

### Author
- **Instagram**: [@_furkan.afsin](https://www.instagram.com/_furkan.afsin/)
- Available for custom theme development

### Useful Links
- [TON Documentation](https://ton.org/docs)
- [TonConnect SDK](https://github.com/ton-connect)
- [React Documentation](https://react.dev)

---

## ⚠️ Important Notes

1. **Security**: In production, implement proper authentication with JWT tokens
2. **Google/Facebook OAuth**: Requires API credentials from respective platforms
3. **TON Wallet**: Current implementation is a placeholder - integrate TonConnect for production
4. **Database**: SQLite is used for development. Consider PostgreSQL/MySQL for production
5. **Email Sending**: Implement actual email service (SendGrid, Mailgun) for newsletter
6. **Password Hashing**: Add bcrypt for password hashing in production

---

## 🎯 Next Steps

1. **Integrate TonConnect SDK** for real wallet connections
2. **Set up OAuth** with Google and Facebook
3. **Implement i18n** for proper multi-language support
4. **Add payment gateway** for token purchases
5. **Set up email service** for notifications
6. **Deploy to production** (Vercel, Netlify, or your server)

---

Made with ❤️ by [Furkan Afsin](https://www.instagram.com/_furkan.afsin/)
