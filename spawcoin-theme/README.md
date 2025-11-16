# Spawcoin WordPress Theme

A modern, responsive WordPress theme designed specifically for cryptocurrency and memecoin projects. Built for the Spawcoin memecoin project with features including blog section, social media integration, roadmap showcase, YouTube video gallery, customer testimonials, and team member profiles.

## Theme Information

- **Theme Name:** Spawcoin
- **Author:** ferhat furkan afsin
- **Author Website:** https://spawcoin.com
- **Version:** 1.0.0
- **License:** GNU General Public License v2 or later

## Features

### Core Features
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Modern cryptocurrency/memecoin aesthetic
- ✅ Custom homepage with hero section
- ✅ Blog functionality with archive and single post templates
- ✅ Social media integration
- ✅ SEO-friendly structure
- ✅ Fast loading and optimized performance
- ✅ Cross-browser compatible

### Custom Sections
1. **Hero Section** - Eye-catching landing area with customizable title, subtitle, and CTA buttons
2. **Roadmap** - Visual timeline to showcase project milestones and future plans
3. **Team Members** - Showcase founders and team with photos, roles, and social links
4. **Testimonials** - Display customer reviews and ratings
5. **YouTube Videos** - Embed and showcase YouTube channel videos
6. **Social Media** - Prominent social media links section
7. **Blog** - Standard WordPress blog with modern card-based layout

### Custom Post Types
The theme includes 4 custom post types:

1. **Team Members** (`team_member`)
   - Featured image for profile photo
   - Role/Position field
   - Biography (editor)
   - Social media links (Twitter, LinkedIn, Telegram)

2. **Testimonials** (`testimonial`)
   - Customer name (title)
   - Testimonial content (editor)
   - Company/Position
   - Rating (1-5 stars)
   - Customer photo (featured image)

3. **Roadmap Items** (`roadmap`)
   - Milestone title
   - Description (editor)
   - Phase (e.g., Q1 2024, Phase 1)
   - Order number
   - Status (Completed, In Progress, Upcoming)

4. **YouTube Videos** (`youtube_video`)
   - Video title
   - Description
   - YouTube Video ID

## Installation

### Method 1: WordPress Admin Panel
1. Download the `spawcoin-theme` folder
2. Compress it into a ZIP file
3. In WordPress admin, go to Appearance → Themes → Add New
4. Click "Upload Theme" and select the ZIP file
5. Click "Install Now" and then "Activate"

### Method 2: FTP/File Manager
1. Upload the `spawcoin-theme` folder to `/wp-content/themes/`
2. In WordPress admin, go to Appearance → Themes
3. Find "Spawcoin" and click "Activate"

## Setup Guide

### 1. Basic Configuration

#### Set Homepage
1. Create a new page called "Home"
2. Go to Settings → Reading
3. Set "Your homepage displays" to "A static page"
4. Select "Home" as the homepage

#### Set Blog Page
1. Create a new page called "Blog"
2. Go to Settings → Reading
3. Select "Blog" as the posts page

#### Configure Menus
1. Go to Appearance → Menus
2. Create a menu and add your pages
3. Assign it to "Primary Menu" location

### 2. Customizer Settings

Go to Appearance → Customize to configure:

#### Hero Section
- **Hero Title:** Main headline (default: "Welcome to Spawcoin")
- **Hero Subtitle:** Subheading text
- **Hero Button Text:** CTA button text
- **Hero Button URL:** CTA button link

#### Social Media Links
- Twitter URL
- Telegram URL
- Discord URL
- Instagram URL
- YouTube Channel URL

#### Site Identity
- Upload a logo
- Set site title and tagline
- Upload a site icon (favicon)

### 3. Adding Content

#### Add Team Members
1. In WordPress admin, go to Team Members → Add New
2. Enter the team member's name as the title
3. Add their biography in the content editor
4. Set a featured image (profile photo)
5. Fill in custom fields:
   - Role/Position (e.g., "Founder & CEO")
   - Twitter URL
   - LinkedIn URL
   - Telegram URL
6. Publish

#### Add Testimonials
1. Go to Testimonials → Add New
2. Enter customer name as the title
3. Add testimonial text in the content editor
4. Set featured image (customer photo)
5. Fill in custom fields:
   - Company/Position
   - Rating (1-5 stars)
6. Publish

#### Add Roadmap Items
1. Go to Roadmap Items → Add New
2. Enter milestone title
3. Add description in the content editor
4. Fill in custom fields:
   - Phase (e.g., "Q1 2024")
   - Order (numerical order for display)
   - Status (Completed, In Progress, or Upcoming)
5. Publish

#### Add YouTube Videos
1. Go to YouTube Videos → Add New
2. Enter video title
3. Add description in the content editor
4. In the YouTube Video ID field, enter just the video ID
   - Example: For `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Enter only: `dQw4w9WgXcQ`
5. Publish

#### Write Blog Posts
1. Go to Posts → Add New
2. Write your blog post
3. Set a featured image (recommended size: 800x600px)
4. Add categories and tags
5. Publish

### 4. Widget Areas

The theme includes 4 widget areas:
- **Blog Sidebar** - Appears on blog pages
- **Footer Widget 1** - First footer column
- **Footer Widget 2** - Second footer column
- **Footer Widget 3** - Third footer column

Configure widgets at Appearance → Widgets

## Theme Structure

```
spawcoin-theme/
├── style.css                 # Main stylesheet with theme metadata
├── functions.php             # Theme functionality and setup
├── header.php                # Header template
├── footer.php                # Footer template
├── front-page.php            # Homepage template
├── index.php                 # Blog archive template (fallback)
├── single.php                # Single blog post template
├── page.php                  # Static page template
├── archive.php               # Archive pages template
├── 404.php                   # 404 error page
├── searchform.php            # Search form template
├── comments.php              # Comments template
├── js/
│   └── main.js               # JavaScript functionality
└── README.md                 # This file
```

## Customization

### Colors
The theme uses CSS custom properties (variables) for easy color customization. Edit `style.css` lines 22-43 to change colors:

```css
:root {
    --primary-color: #FFD700;        /* Gold color */
    --secondary-color: #1a1a2e;      /* Dark blue */
    --accent-color: #16213e;         /* Darker blue */
    /* ... more color variables */
}
```

### Fonts
The theme uses:
- **Poppins** for body text
- **Montserrat** for headings

To change fonts, edit the Google Fonts link in `functions.php` (line 38)

### Layout
Maximum content width is set to 1200px. To change:
- Edit `.container` in `style.css` (line 128)
- For wider layout, edit `.container-wide` (line 133)

## JavaScript Features

The theme includes several JavaScript enhancements:

- **Mobile Menu Toggle** - Responsive hamburger menu
- **Smooth Scrolling** - Smooth anchor link scrolling
- **Header Scroll Effects** - Header changes on scroll
- **Scroll Animations** - Fade-in animations on scroll
- **Back to Top Button** - Appears after scrolling down
- **Parallax Effects** - Subtle parallax on hero section
- **Lazy Loading** - Optimized image loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Minified and optimized CSS
- Efficient JavaScript with event delegation
- Lazy loading for images
- Optimized database queries
- Responsive images with multiple sizes
- Fast loading fonts

## Recommended Plugins

While the theme works standalone, these plugins enhance functionality:

- **Yoast SEO** or **Rank Math** - SEO optimization
- **Contact Form 7** - Contact forms
- **WP Rocket** or **W3 Total Cache** - Caching
- **Smush** or **ShortPixel** - Image optimization
- **Wordfence** - Security
- **UpdraftPlus** - Backups

## Support & Documentation

For questions or issues:
1. Check this README file
2. Review the WordPress Codex: https://codex.wordpress.org/
3. Contact: spawcoin.com

## Changelog

### Version 1.0.0 - 2024
- Initial release
- Homepage with hero section
- Custom post types (Team, Testimonials, Roadmap, Videos)
- Blog functionality
- Social media integration
- Responsive design
- Mobile menu
- Scroll animations

## Credits

- **Theme Author:** ferhat furkan afsin
- **Fonts:** Google Fonts (Poppins, Montserrat)
- **Icons:** Font Awesome 6.4.0
- **Framework:** WordPress

## License

This theme is licensed under the GNU General Public License v2 or later.
http://www.gnu.org/licenses/gpl-2.0.html

---

**Built with ❤️ for the Spawcoin community**
