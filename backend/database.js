const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'puantaj.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Employees table
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      position TEXT,
      department TEXT,
      phone TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Work logs (puantaj) table
  db.run(`
    CREATE TABLE IF NOT EXISTS work_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      month TEXT NOT NULL,
      year INTEGER NOT NULL,
      days_worked REAL NOT NULL,
      payment_amount REAL NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )
  `);

  // Users table for authentication
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      name TEXT,
      auth_provider TEXT DEFAULT 'email',
      google_id TEXT,
      facebook_id TEXT,
      ton_wallet_address TEXT,
      referral_code TEXT UNIQUE,
      referred_by INTEGER,
      airdrop_eligible INTEGER DEFAULT 1,
      airdrop_claimed INTEGER DEFAULT 0,
      total_referral_earnings REAL DEFAULT 0,
      language_preference TEXT DEFAULT 'en',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      FOREIGN KEY (referred_by) REFERENCES users (id)
    )
  `);

  // Newsletter signups table
  db.run(`
    CREATE TABLE IF NOT EXISTS newsletter_signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      subscribed INTEGER DEFAULT 1,
      source TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Blog posts table
  db.run(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      author TEXT,
      featured_image TEXT,
      category TEXT,
      tags TEXT,
      status TEXT DEFAULT 'draft',
      views INTEGER DEFAULT 0,
      lang TEXT DEFAULT 'en',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME
    )
  `);

  // Airdrops table
  db.run(`
    CREATE TABLE IF NOT EXISTS airdrops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      token_type TEXT DEFAULT 'TON',
      status TEXT DEFAULT 'pending',
      transaction_hash TEXT,
      claimed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Referrals table
  db.run(`
    CREATE TABLE IF NOT EXISTS referrals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referrer_id INTEGER NOT NULL,
      referred_user_id INTEGER NOT NULL,
      reward_amount REAL DEFAULT 0,
      reward_percentage REAL DEFAULT 5.0,
      total_purchases REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (referrer_id) REFERENCES users (id),
      FOREIGN KEY (referred_user_id) REFERENCES users (id)
    )
  `);

  // Transactions table (for tracking swaps and purchases)
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      transaction_type TEXT NOT NULL,
      amount REAL NOT NULL,
      token_type TEXT DEFAULT 'TON',
      wallet_address TEXT,
      transaction_hash TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Ad blocks configuration table
  db.run(`
    CREATE TABLE IF NOT EXISTS ad_blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      block_name TEXT NOT NULL,
      ad_type TEXT DEFAULT 'google',
      ad_code TEXT,
      position TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Social media links table
  db.run(`
    CREATE TABLE IF NOT EXISTS social_media_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      icon_class TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Site settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT,
      setting_type TEXT DEFAULT 'text',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert some sample employees for testing
  db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
    if (row.count === 0) {
      const sampleEmployees = [
        { name: 'Ahmet', surname: 'Yılmaz', position: 'Mühendis', department: 'Üretim', phone: '0532-111-2233', email: 'ahmet@example.com' },
        { name: 'Ayşe', surname: 'Demir', position: 'Muhasebeci', department: 'Muhasebe', phone: '0533-222-3344', email: 'ayse@example.com' },
        { name: 'Mehmet', surname: 'Kaya', position: 'Teknisyen', department: 'Bakım', phone: '0534-333-4455', email: 'mehmet@example.com' },
        { name: 'Fatma', surname: 'Şahin', position: 'İnsan Kaynakları', department: 'İK', phone: '0535-444-5566', email: 'fatma@example.com' },
        { name: 'Ali', surname: 'Çelik', position: 'Operatör', department: 'Üretim', phone: '0536-555-6677', email: 'ali@example.com' }
      ];

      const stmt = db.prepare("INSERT INTO employees (name, surname, position, department, phone, email) VALUES (?, ?, ?, ?, ?, ?)");
      sampleEmployees.forEach(emp => {
        stmt.run(emp.name, emp.surname, emp.position, emp.department, emp.phone, emp.email);
      });
      stmt.finalize();
      console.log('Sample employees added to database');
    }
  });

  // Insert default social media links
  db.get("SELECT COUNT(*) as count FROM social_media_links", (err, row) => {
    if (row.count === 0) {
      const socialLinks = [
        { platform: 'Instagram', url: 'https://www.instagram.com/_furkan.afsin/', icon_class: 'fab fa-instagram', display_order: 1 },
        { platform: 'Twitter', url: '#', icon_class: 'fab fa-twitter', display_order: 2 },
        { platform: 'Telegram', url: '#', icon_class: 'fab fa-telegram', display_order: 3 },
        { platform: 'Discord', url: '#', icon_class: 'fab fa-discord', display_order: 4 }
      ];

      const stmt = db.prepare("INSERT INTO social_media_links (platform, url, icon_class, display_order) VALUES (?, ?, ?, ?)");
      socialLinks.forEach(link => {
        stmt.run(link.platform, link.url, link.icon_class, link.display_order);
      });
      stmt.finalize();
      console.log('Default social media links added to database');
    }
  });

  // Insert default site settings
  db.get("SELECT COUNT(*) as count FROM site_settings", (err, row) => {
    if (row.count === 0) {
      const settings = [
        { setting_key: 'site_name', setting_value: 'WorkLog', setting_type: 'text' },
        { setting_key: 'site_description', setting_value: 'Your crypto token platform', setting_type: 'text' },
        { setting_key: 'default_language', setting_value: 'en', setting_type: 'text' },
        { setting_key: 'available_languages', setting_value: 'en,tr,es,fr,de,zh,ja,ar', setting_type: 'text' },
        { setting_key: 'referral_percentage', setting_value: '5', setting_type: 'number' },
        { setting_key: 'airdrop_amount', setting_value: '100', setting_type: 'number' },
        { setting_key: 'enable_newsletter_popup', setting_value: 'true', setting_type: 'boolean' },
        { setting_key: 'ton_network', setting_value: 'mainnet', setting_type: 'text' },
        { setting_key: 'author_instagram', setting_value: 'https://www.instagram.com/_furkan.afsin/', setting_type: 'text' }
      ];

      const stmt = db.prepare("INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES (?, ?, ?)");
      settings.forEach(setting => {
        stmt.run(setting.setting_key, setting.setting_value, setting.setting_type);
      });
      stmt.finalize();
      console.log('Default site settings added to database');
    }
  });
});

module.exports = db;
