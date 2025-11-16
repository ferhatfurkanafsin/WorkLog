# Installation Guide - My Custom Theme

Complete step-by-step installation instructions for My Custom Theme.

## System Requirements

Before installing, ensure your WordPress installation meets these requirements:

- **WordPress Version**: 5.8 or higher
- **PHP Version**: 7.4 or higher
- **MySQL Version**: 5.6 or higher (or MariaDB 10.1+)
- **HTTPS**: Recommended for production sites

## Installation Methods

### Method 1: WordPress Admin Upload (Recommended)

This is the easiest method for most users.

#### Step 1: Prepare the Theme File

1. Locate the `my-custom-theme` folder on your computer
2. **Compress the folder into a ZIP file**:
   - **Windows**: Right-click folder → Send to → Compressed (zipped) folder
   - **Mac**: Right-click folder → Compress "my-custom-theme"
   - **Linux**: `zip -r my-custom-theme.zip my-custom-theme/`

3. Ensure the ZIP file is named `my-custom-theme.zip`

#### Step 2: Upload to WordPress

1. Log in to your WordPress admin dashboard
2. Navigate to **Appearance → Themes**
3. Click the **Add New** button at the top
4. Click the **Upload Theme** button
5. Click **Choose File** and select `my-custom-theme.zip`
6. Click **Install Now**
7. Wait for the upload and installation to complete
8. Click **Activate** to activate the theme

✅ **Installation complete!** Your site is now using My Custom Theme.

---

### Method 2: FTP/SFTP Upload

For users with FTP access to their server.

#### Step 1: Connect to Your Server

1. Open your FTP client (FileZilla, Cyberduck, etc.)
2. Connect to your web server using your FTP credentials:
   - Host: `ftp.yoursite.com` or your server IP
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: Usually 21 (FTP) or 22 (SFTP)

#### Step 2: Navigate to Themes Directory

1. In your FTP client, navigate to:
   ```
   /wp-content/themes/
   ```

2. This is where WordPress stores all themes

#### Step 3: Upload the Theme

1. Locate the **unzipped** `my-custom-theme` folder on your computer
2. Upload the entire folder to `/wp-content/themes/`
3. Wait for all files to upload (may take a few minutes)

#### Step 4: Activate the Theme

1. Go to your WordPress admin dashboard
2. Navigate to **Appearance → Themes**
3. Find "My Custom Theme"
4. Click **Activate**

✅ **Installation complete!**

---

### Method 3: Local Development

For developers working on localhost.

#### Step 1: Locate WordPress Installation

1. Find your local WordPress installation directory:
   - **XAMPP**: `C:\xampp\htdocs\your-site\`
   - **MAMP**: `/Applications/MAMP/htdocs/your-site/`
   - **Local by Flywheel**: `~/Local Sites/your-site/app/public/`
   - **Docker**: Your configured volume path

#### Step 2: Copy Theme Files

1. Navigate to the themes directory:
   ```
   /wp-content/themes/
   ```

2. Copy the `my-custom-theme` folder here:
   ```
   /wp-content/themes/my-custom-theme/
   ```

#### Step 3: Activate the Theme

1. Open your local WordPress site in a browser
2. Log in to the admin dashboard
3. Go to **Appearance → Themes**
4. Find and activate "My Custom Theme"

✅ **Installation complete!**

---

## Post-Installation Setup

After installing the theme, follow these steps to set it up:

### 1. Configure Permalinks

For the theme to work optimally:

1. Go to **Settings → Permalinks**
2. Select **Post name** (recommended)
3. Click **Save Changes**

### 2. Create Navigation Menus

1. Go to **Appearance → Menus**
2. Click **Create a new menu**
3. Name it (e.g., "Main Menu")
4. Add pages/links to your menu
5. Under **Menu Settings**, check **Primary Menu**
6. Click **Save Menu**

### 3. Customize Theme Settings

1. Go to **Appearance → Customize**
2. Open **Theme Settings**
3. Customize colors, fonts, and layout options
4. Click **Publish** to save changes

### 4. Create Your First Page Builder Page

1. Go to **Pages → Add New**
2. Enter a page title (e.g., "Home")
3. Scroll down to the **Page Builder** section
4. Click **Add Block** to start building
5. Add and configure blocks
6. Click **Save Layout**
7. Click **Publish**

### 5. Set Homepage (Optional)

To make your page builder page the homepage:

1. Go to **Settings → Reading**
2. Select **A static page** under "Your homepage displays"
3. Choose your page builder page from the dropdown
4. Click **Save Changes**

---

## Verification

Verify the theme is installed correctly:

### Check Theme Activation

1. Go to **Appearance → Themes**
2. "My Custom Theme" should show as "Active"

### Check Page Builder

1. Create or edit a Page
2. You should see a **Page Builder** meta box below the editor
3. Clicking **Add Block** should open the block library

### Check Frontend

1. Visit your site's homepage
2. The theme should display with the default styling
3. Navigation menu should appear in the header

---

## Troubleshooting Installation

### Issue: "The package could not be installed"

**Possible causes:**
- File size exceeds upload limit
- Incorrect ZIP structure

**Solutions:**

1. **Increase upload limit** (add to `wp-config.php`):
   ```php
   @ini_set('upload_max_size', '64M');
   @ini_set('post_max_size', '64M');
   @ini_set('max_execution_time', '300');
   ```

2. **Check ZIP structure**: The ZIP should contain the `my-custom-theme` folder, not individual files

3. **Use FTP method instead**: Upload via FTP if the upload method fails

### Issue: "Theme is missing style.css stylesheet"

**Solution:**
- Ensure `style.css` is in the root of the theme folder
- Re-download the theme files
- Check file permissions (should be 644)

### Issue: "Page Builder not showing"

**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure you're editing a **Page**, not a Post
- Deactivate other plugins temporarily to check for conflicts
- Check browser console for JavaScript errors

### Issue: "Broken theme styling"

**Solution:**
- Clear all caches (browser, WordPress, CDN)
- Re-save permalinks (**Settings → Permalinks → Save**)
- Check that all theme files uploaded correctly
- Verify file permissions (folders: 755, files: 644)

### Issue: "Cannot modify header information - headers already sent"

**Solution:**
- Check for spaces/blank lines before `<?php` in theme files
- Ensure files are saved in UTF-8 without BOM encoding
- Look for echo statements before WordPress functions

---

## File Permissions

Correct file permissions for security:

```
Folders: 755 (drwxr-xr-x)
Files:   644 (-rw-r--r--)
```

Set permissions via FTP or command line:

```bash
find /path/to/my-custom-theme -type d -exec chmod 755 {} \;
find /path/to/my-custom-theme -type f -exec chmod 644 {} \;
```

---

## Updating the Theme

When a new version is available:

### Method 1: Replace via FTP
1. Download the new version
2. Backup your current theme (if customized)
3. Upload new files via FTP, replacing old ones

### Method 2: Delete and Reinstall
1. **Important**: Export your page builder pages first
2. Deactivate and delete the old theme
3. Install the new version using any installation method above

**Note**: Page builder content is stored in the database (post meta) and won't be lost when updating the theme.

---

## Uninstalling the Theme

To completely remove the theme:

1. **Activate another theme first**:
   - Go to **Appearance → Themes**
   - Activate a different theme (e.g., Twenty Twenty-Four)

2. **Delete the theme**:
   - Find "My Custom Theme"
   - Click **Theme Details**
   - Click **Delete** in the bottom right
   - Confirm deletion

3. **Optional - Remove theme data**:
   - Page builder data is stored as post meta
   - To remove, delete the pages created with the page builder
   - Custom blocks library will be removed automatically

---

## Migration from Another Theme

If you're switching from another theme:

1. **Backup your site** (database and files)
2. **Install and activate** My Custom Theme
3. **Recreate pages** using the page builder
4. **Update menus** and widgets
5. **Test thoroughly** before going live
6. **Set up 301 redirects** if URL structure changed

---

## Getting Help

If you encounter issues during installation:

1. **Check this guide** for common issues
2. **Check README.md** for additional documentation
3. **Review WordPress error logs**: `/wp-content/debug.log`
4. **Enable WordPress debugging** (add to `wp-config.php`):
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```

---

## Next Steps

After successful installation:

1. ✅ Read the **README.md** for full documentation
2. ✅ Watch tutorial videos (if available)
3. ✅ Explore all available blocks
4. ✅ Customize theme settings to match your brand
5. ✅ Build your first page!

---

**Installation complete! Happy building! 🎉**
