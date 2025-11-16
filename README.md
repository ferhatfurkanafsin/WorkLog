# WorkLog - Crypto Token Platform with Building Blocks Theme

A comprehensive web platform featuring a modular theme system with reusable building blocks for crypto/blockchain projects. Includes employee time tracking, TON wallet integration, airdrop system, referral program, blog, and multi-language support.

## 🚀 Quick Start

```bash
# Install all dependencies
npm run install-all

# Run development server (backend + frontend)
npm run dev

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## ✨ Features Overview

### 🎨 Building Blocks Theme System
- **Drag & Drop Ready**: Modular components you can easily integrate
- **Fully Customizable**: Edit props, styles, and content
- **Production Ready**: Optimized and tested components

### 🔗 TON Blockchain Integration
- **Wallet Connection**: Support for TonKeeper, TonHub, and other TON wallets
- **Mainnet & Testnet**: Switch between networks easily
- **Airdrop System**: Automatic token distribution to new users

### 💰 Crypto Features
- **Airdrop System**: Give tokens to new signups automatically
- **Referral Program**: Users earn rewards when friends purchase
- **Multi-Auth**: Google, Facebook, and email authentication
- **Wallet Integration**: Connect and manage TON wallets

### 🌍 Multi-Language Support
Supports 12+ languages out of the box:
- English, Turkish, Spanish, French, German
- Chinese, Japanese, Arabic, Russian
- Portuguese, Italian, Korean

### 📝 Content Management
- **Blog System**: Built-in blogging with categories and tags
- **SEO Optimized**: Meta tags, view tracking, and slug-based URLs
- **Dynamic Content**: Easy to add new blog posts via API

### 💼 Original Features
- **Employee Management**: Search and manage employees
- **Work Log Tracking**: Record working days and payments
- **Statistics Dashboard**: View totals and averages
- **Responsive Design**: Works on all devices

## 📦 Available Building Blocks

### 1. **VideoEmbed** - Video embedding block
- Supports YouTube, Vimeo, and direct video links
- Auto-play and title options
- Responsive player with 16:9 aspect ratio

### 2. **NewsletterPopup** - Email collection popup
- Customizable delay and messaging
- Session-based display control
- Email validation and API integration

### 3. **SocialMediaFollow** - Social media links
- Multiple layouts: horizontal, vertical
- Multiple styles: filled, outlined, minimal
- Customizable sizes and colors
- Instagram link: [@_furkan.afsin](https://www.instagram.com/_furkan.afsin/)

### 4. **WalletConnect** - TON wallet connection
- Support for TonKeeper and TonHub
- Balance display
- Mainnet/Testnet switching
- Fixed or inline positioning

### 5. **AdBlock** - Advertisement placement
- Google AdSense support
- Custom sponsor ads
- Multiple positions: header, sidebar, footer
- Editable ad codes

### 6. **CustomButton** - Configurable buttons
- Multiple styles: primary, secondary, outline, ghost
- Icon support (FontAwesome)
- Link assignment
- Custom click handlers

### 7. **LanguageSelector** - Multi-language widget
- 12+ languages supported
- Multiple display styles
- Automatic language persistence

### 8. **Footer** - Site footer with author credit
- Social media links
- Navigation columns
- Author credit with Instagram link
- Customizable sections

## 📄 Available Pages

### 1. **AuthSignup** - User registration page
- Email/password signup
- Google OAuth (ready for integration)
- Facebook OAuth (ready for integration)
- Referral code support
- Automatic airdrop eligibility

### 2. **BlogList** - Blog listing page
- Grid layout with search
- Category filtering
- View count tracking
- Featured images

### 3. **ReferralDashboard** - Referral management
- Personal referral link
- Statistics dashboard
- Social sharing buttons
- Referral history table
- Earnings tracker

### 4. **DemoPage** - Complete demonstration
- Shows all blocks in action
- Example layouts and integrations
- Best practices implementation

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express** - Server framework
- **SQLite3** - Database (development)
- **CORS** - Cross-origin support
- **Body Parser** - Request parsing

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Modern CSS** - Gradient designs & animations
- **FontAwesome** - Icon library (ready)

### Database Schema
- **users** - Authentication and profiles
- **newsletter_signups** - Email subscriptions
- **blog_posts** - Blog content
- **airdrops** - Token distributions
- **referrals** - Referral tracking
- **social_media_links** - Social profiles
- **ad_blocks** - Advertisement placements
- **site_settings** - Global configuration
- **employees** & **work_logs** - Time tracking

## 📚 Documentation

For complete documentation on all blocks, widgets, and features, see:
- **[BLOCKS_DOCUMENTATION.md](./BLOCKS_DOCUMENTATION.md)** - Comprehensive guide for all components

## 🎯 Usage Examples

### Import and Use Blocks

```jsx
// Import blocks
import {
  VideoEmbed,
  NewsletterPopup,
  WalletConnect,
  CustomButton
} from './blocks';

// Import widgets
import { LanguageSelector } from './widgets';

function MyPage() {
  return (
    <div>
      {/* Wallet Connection */}
      <WalletConnect position="fixed-top" network="mainnet" />

      {/* Language Selector */}
      <LanguageSelector style="dropdown" />

      {/* Video */}
      <VideoEmbed videoUrl="https://youtube.com/..." />

      {/* Call-to-Action Button */}
      <CustomButton
        text="Sign Up & Get 100 TON"
        link="/signup"
        style="primary"
        size="large"
      />

      {/* Newsletter Popup */}
      <NewsletterPopup delay={5000} />
    </div>
  );
}
```

### Add a Blog Post

```javascript
fetch('/api/blog/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Getting Started with TON',
    slug: 'getting-started-with-ton',
    content: 'Full article content...',
    excerpt: 'Brief summary...',
    category: 'Tutorial',
    status: 'published',
    lang: 'en'
  })
});
```

## 🔌 API Endpoints

### New Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration with airdrop

#### Newsletter
- `POST /api/newsletter/subscribe` - Email subscription

#### Social Media
- `GET /api/social-media` - Get all social links

#### Blog
- `GET /api/blog/posts` - Get published posts
- `POST /api/blog/posts` - Create new post
- `GET /api/blog/post/:slug` - Get single post

#### Ads
- `GET /api/ads/:position` - Get ad by position
- `POST /api/ads` - Create/update ad

#### Referrals
- `GET /api/referrals/user/:userId` - Get referral stats

#### Airdrops
- `GET /api/airdrops/user/:userId` - Get user airdrops
- `POST /api/airdrops/claim/:userId` - Claim airdrop

#### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings/:key` - Update setting

### Original Endpoints (Employee Management)
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add employee
- `GET /api/work-logs` - Get work logs
- `POST /api/work-logs` - Add work log

See full API documentation in [BLOCKS_DOCUMENTATION.md](./BLOCKS_DOCUMENTATION.md).

## 📂 Project Structure

```
WorkLog/
├── backend/
│   ├── server.js              # Express server with all APIs
│   ├── database.js            # SQLite setup with all tables
│   └── puantaj.db            # Database file (auto-created)
│
├── frontend/
│   └── src/
│       ├── blocks/           # Building Blocks
│       │   ├── VideoEmbed.jsx
│       │   ├── NewsletterPopup.jsx
│       │   ├── SocialMediaFollow.jsx
│       │   ├── WalletConnect.jsx
│       │   ├── AdBlock.jsx
│       │   ├── CustomButton.jsx
│       │   └── index.js      # Export all blocks
│       │
│       ├── widgets/          # Reusable Widgets
│       │   ├── LanguageSelector.jsx
│       │   ├── Footer.jsx
│       │   └── index.js      # Export all widgets
│       │
│       ├── pages/            # Full Pages
│       │   ├── AuthSignup.jsx
│       │   ├── BlogList.jsx
│       │   ├── ReferralDashboard.jsx
│       │   ├── DemoPage.jsx
│       │   └── index.js      # Export all pages
│       │
│       ├── components/       # Original Components
│       │   ├── EmployeeSearch.jsx
│       │   ├── WorkLogForm.jsx
│       │   └── WorkLogsList.jsx
│       │
│       └── App.jsx           # Main app
│
├── BLOCKS_DOCUMENTATION.md   # Complete documentation
├── README.md                 # This file
└── package.json
```

## 🎨 Customization

### Change Brand Colors

Edit CSS files to match your brand:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Update to your colors */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Configure Settings

Update via database or API:

```javascript
// Change referral percentage
PUT /api/settings/referral_percentage
{ "value": "10" }  // 10% commission

// Change airdrop amount
PUT /api/settings/airdrop_amount
{ "value": "200" }  // 200 TON
```

### Add Social Media Links

```javascript
POST /api/social-media
{
  "platform": "Twitter",
  "url": "https://twitter.com/yourhandle",
  "icon_class": "fab fa-twitter",
  "display_order": 1
}
```

## 🚀 Production Deployment

### Important: Before Going Live

1. **Security**
   - Implement JWT authentication
   - Add bcrypt for password hashing
   - Use environment variables for secrets

2. **Integrations**
   - Set up Google OAuth credentials
   - Set up Facebook OAuth credentials
   - Integrate TonConnect SDK for real wallet connections

3. **Database**
   - Migrate from SQLite to PostgreSQL/MySQL
   - Set up database backups

4. **Email Service**
   - Integrate SendGrid, Mailgun, or similar
   - Set up transactional emails

5. **Monitoring**
   - Add error tracking (Sentry)
   - Set up analytics (Google Analytics)
   - Monitor uptime

## 👨‍💻 Author

**Theme by Furkan Afsin**
- Instagram: [@_furkan.afsin](https://www.instagram.com/_furkan.afsin/)
- Available for custom theme development
- Need a custom crypto/blockchain website? Let's talk!

The theme system and all building blocks were created to help developers quickly build professional crypto platforms. If you need custom features or a unique design, feel free to reach out!

## 📝 License

ISC

## 🤝 Support & Contributions

For issues, questions, or feature requests:
1. Check [BLOCKS_DOCUMENTATION.md](./BLOCKS_DOCUMENTATION.md) for detailed guides
2. Review the DemoPage.jsx for usage examples
3. Contact via Instagram: [@_furkan.afsin](https://www.instagram.com/_furkan.afsin/)

## 🙏 Acknowledgments

- TON Blockchain community
- React and Vite teams
- FontAwesome for icons
- All open-source contributors

---

Made with ❤️ for the crypto community
