# My Custom Theme

A fully customizable WordPress theme with a built-in drag-and-drop page builder. **No third-party plugins required!**

## Features

- **Native Page Builder**: Drag-and-drop interface for building pages without any plugins
- **13+ Pre-built Blocks**: Text, Image, Video, Gallery, Button, Hero, Testimonial, Pricing Table, Icon Box, Features, Custom HTML, Map, and Newsletter
- **Custom Block Creator**: Create your own blocks with HTML, CSS, and JavaScript
- **Block Library**: Save and reuse custom blocks across pages
- **Theme Customizer**: Customize colors, fonts, spacing, and more from the WordPress Customizer
- **Fully Responsive**: Mobile-first design that works on all devices
- **SEO Optimized**: Clean, semantic HTML5 markup
- **Accessibility Ready**: WCAG 2.1 compliant
- **Translation Ready**: Fully compatible with WPML and other translation plugins
- **WordPress.org Ready**: Follows all WordPress coding standards

## Installation

### Method 1: Upload via WordPress Admin

1. Download the theme folder `my-custom-theme`
2. Compress it into a ZIP file: `my-custom-theme.zip`
3. In WordPress admin, go to **Appearance > Themes > Add New**
4. Click **Upload Theme** and select the ZIP file
5. Click **Install Now** and then **Activate**

### Method 2: Manual Installation

1. Download the theme folder `my-custom-theme`
2. Upload it to `/wp-content/themes/` directory on your server
3. In WordPress admin, go to **Appearance > Themes**
4. Find "My Custom Theme" and click **Activate**

### Method 3: Local Development

1. Copy the `my-custom-theme` folder to your local WordPress installation's themes directory
2. Activate the theme from WordPress admin

## Quick Start Guide

### Creating Your First Page with Page Builder

1. **Create a New Page**
   - Go to **Pages > Add New** in WordPress admin
   - Enter your page title

2. **Open the Page Builder**
   - Scroll down to the **Page Builder** meta box
   - Click the **Add Block** button

3. **Add Blocks**
   - Choose from 13+ available block types
   - Click on any block to add it to your page
   - Blocks will appear in the blocks container

4. **Edit Block Settings**
   - Click the **Edit** (✏️) button on any block
   - Modify the block settings in the form that appears
   - Click **Save Settings** to apply changes

5. **Reorder Blocks**
   - Drag blocks using the handle (☰) to reorder them
   - Blocks will save in the order you arrange them

6. **Publish Your Page**
   - Click **Save Layout** to save your blocks
   - Click **Publish** or **Update** to make your page live

## Available Blocks

### Content Blocks

#### Text Block
- Rich text editor for paragraphs, headings, lists
- Alignment options (left, center, right)
- Supports HTML formatting

#### Button Block
- Customizable button text and URL
- Three styles: Primary, Secondary, Outline
- Option to open in new tab

#### Testimonial Block
- Display customer testimonials
- Author name and role
- Styled quote formatting

#### Pricing Table
- Multiple pricing plans side-by-side
- Feature lists for each plan
- Highlight featured plans
- Call-to-action buttons

#### Icon Box
- Grid of icon-based features
- Customizable icons (emoji or text)
- Title and description for each item

#### Feature List
- List of features with icons
- Great for showcasing product features
- Flexible layout

#### Newsletter Block
- Email signup form
- Customizable title and description
- Action URL for form submission

### Media Blocks

#### Image Block
- Upload or select images from media library
- Alt text and caption support
- Rounded corner option

#### Video Block
- Supports YouTube, Vimeo, and self-hosted videos
- Responsive 16:9 aspect ratio
- Automatically converts video URLs to embeds

#### Gallery Block
- Multiple images in a grid
- Choose 2, 3, or 4 columns
- Lightbox functionality on frontend
- Hover effects

#### Map Block
- Embed Google Maps or other map services
- Customizable height
- Responsive iframe embed

### Layout Blocks

#### Hero Block
- Large header section with title and subtitle
- Call-to-action button
- Gradient background
- Perfect for page headers

### Advanced Blocks

#### Custom HTML Block
- Insert custom HTML code
- Add custom CSS (scoped to the block)
- Add custom JavaScript (safely sandboxed)
- Perfect for advanced users

## Custom Block Creator

Create your own reusable blocks with custom HTML, CSS, and JavaScript.

### Creating a Custom Block

1. **Add a Custom HTML Block** to your page
2. **Click Edit** and enter your custom code:
   - **HTML**: Your block's structure
   - **CSS**: Styles for your block (automatically scoped)
   - **JS**: Interactive functionality (safely sandboxed)
3. **Save Settings** and preview your block
4. Your custom block is now saved and can be reused

### Custom Block Library

All custom blocks you create are automatically saved to your **Block Library** and can be:
- Reused across multiple pages
- Edited or deleted at any time
- Shared between pages

## Theme Customization

Access theme-wide settings from **Appearance > Customize > Theme Settings**:

### Color Settings
- **Primary Color**: Main brand color (default: #2563eb)
- **Secondary Color**: Secondary accent color (default: #64748b)
- **Text Color**: Main text color (default: #1e293b)
- **Background Color**: Page background (default: #ffffff)

### Typography Settings
- **Font Family**: Choose from System, Serif, Sans Serif, or Monospace
- **Base Font Size**: Set the root font size (12-24px)

### Layout Settings
- **Border Radius**: Global border radius for elements (0-50px)
- **Container Width**: Maximum content width (960-1920px)

### Footer Settings
- **Footer Text**: Customize footer copyright text

All customizer settings support **live preview** - see changes instantly!

## Menu Management

1. Go to **Appearance > Menus**
2. Create a new menu or edit an existing one
3. Assign the menu to **Primary Menu** or **Footer Menu** location
4. Add pages, posts, custom links, or categories

## Widget Areas

The theme includes two widget areas:

1. **Sidebar**: Right sidebar for blog posts and pages
2. **Footer Widget Area**: Displays in the footer section

Access widgets from **Appearance > Widgets**

## Template Hierarchy

The theme includes these template files:

- `index.php` - Main template (blog/archive)
- `page.php` - Page template (supports page builder)
- `single.php` - Single post template
- `header.php` - Site header
- `footer.php` - Site footer
- `style.css` - Main stylesheet

## Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

All blocks are fully responsive and adapt to different screen sizes.

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

## Performance

The theme is optimized for performance:

- Minimal CSS and JavaScript
- No jQuery dependency on frontend (uses vanilla JS)
- Lazy loading for images
- Optimized database queries
- No external dependencies

## Security

- All user inputs are sanitized
- Nonce verification for AJAX requests
- Capability checks for admin functions
- XSS protection
- SQL injection prevention
- Custom HTML blocks are safely sandboxed

## Developer Documentation

### Hooks and Filters

The theme provides several hooks for developers:

```php
// Modify available blocks
add_filter('mct_available_blocks', 'my_custom_blocks');

// Add custom block template
add_action('mct_render_block_template', 'my_block_template', 10, 2);

// Modify theme settings
add_filter('mct_theme_settings', 'my_theme_settings');
```

### Adding Custom Blocks Programmatically

```php
// In your functions.php or custom plugin
function add_custom_block_type($blocks) {
    $blocks['my_block'] = array(
        'name' => __('My Custom Block', 'textdomain'),
        'icon' => '🎨',
        'category' => 'custom',
        'defaults' => array(
            'title' => 'Default Title',
        ),
    );
    return $blocks;
}
add_filter('mct_available_blocks', 'add_custom_block_type');

// Create template file: inc/blocks/block-my_block.php
```

### File Structure

```
my-custom-theme/
├── assets/
│   ├── css/
│   │   ├── admin-builder.css
│   │   └── blocks.css
│   ├── js/
│   │   ├── admin-builder.js
│   │   ├── frontend.js
│   │   └── customizer-preview.js
│   └── images/
├── inc/
│   ├── blocks/
│   │   ├── block-renderer.php
│   │   ├── block-text.php
│   │   ├── block-image.php
│   │   ├── block-video.php
│   │   ├── block-gallery.php
│   │   ├── block-button.php
│   │   ├── block-hero.php
│   │   ├── block-testimonial.php
│   │   ├── block-pricing.php
│   │   ├── block-iconbox.php
│   │   ├── block-features.php
│   │   ├── block-custom_html.php
│   │   ├── block-map.php
│   │   └── block-newsletter.php
│   ├── admin/
│   │   ├── meta-boxes.php
│   │   └── customizer.php
│   ├── page-builder.php
│   └── rest-api.php
├── templates/
├── functions.php
├── style.css
├── header.php
├── footer.php
├── index.php
├── page.php
├── single.php
├── screenshot.png
└── README.md
```

## Troubleshooting

### Page Builder Not Showing

- Make sure you're editing a **Page** (not a Post)
- Check that the theme is activated
- Clear browser cache and hard refresh

### Blocks Not Saving

- Verify you clicked "Save Layout" before publishing
- Check browser console for JavaScript errors
- Ensure you have proper user permissions

### Images Not Uploading

- Check file size limits in `php.ini`
- Verify upload directory permissions
- Try a different image format

### Drag and Drop Not Working

- Ensure jQuery UI is loaded (WordPress default)
- Check for JavaScript conflicts with other plugins
- Try disabling other plugins temporarily

## Frequently Asked Questions

**Q: Can I use this theme with page builders like Elementor?**
A: Yes, but it's not necessary. This theme has its own built-in page builder.

**Q: Is this theme compatible with WooCommerce?**
A: The theme is compatible with WooCommerce, but dedicated WooCommerce styling would need to be added.

**Q: Can I use this theme for commercial projects?**
A: Yes, this theme is GPL licensed and can be used for any purpose.

**Q: How do I create a custom block template?**
A: Create a new PHP file in `inc/blocks/` named `block-{type}.php` and add your block type to the `mct_get_available_blocks()` function.

**Q: Can I export my page layouts?**
A: The blocks are stored as post meta in JSON format and can be exported via WordPress's export tools.

## Changelog

### Version 1.0
- Initial release
- 13+ pre-built blocks
- Drag-and-drop page builder
- Custom block creator
- Theme customizer integration
- Fully responsive design
- Accessibility ready

## Support

For support, please:
1. Check this documentation first
2. Search for similar issues
3. Contact the theme developer

## Credits

- Built with WordPress standards
- Icons: Unicode Emoji
- Fonts: System font stack for optimal performance
- Inspired by modern page builders

## License

This theme is licensed under the GPLv2 or later.
http://www.gnu.org/licenses/gpl-2.0.html

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Theme Version**: 1.0
**Requires WordPress**: 5.8+
**Tested up to**: 6.4
**Requires PHP**: 7.4+

**Happy building! 🚀**
