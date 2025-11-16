const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes

// Get all employees
app.get('/api/employees', (req, res) => {
  db.all("SELECT * FROM employees ORDER BY surname, name", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ employees: rows });
  });
});

// Search employees
app.get('/api/employees/search', (req, res) => {
  const searchTerm = req.query.q || '';
  const query = `
    SELECT * FROM employees
    WHERE name LIKE ? OR surname LIKE ? OR position LIKE ? OR department LIKE ?
    ORDER BY surname, name
  `;
  const searchPattern = `%${searchTerm}%`;

  db.all(query, [searchPattern, searchPattern, searchPattern, searchPattern], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ employees: rows });
  });
});

// Get single employee
app.get('/api/employees/:id', (req, res) => {
  db.get("SELECT * FROM employees WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json({ employee: row });
  });
});

// Add new employee
app.post('/api/employees', (req, res) => {
  const { name, surname, position, department, phone, email } = req.body;

  if (!name || !surname) {
    res.status(400).json({ error: 'Name and surname are required' });
    return;
  }

  const query = `INSERT INTO employees (name, surname, position, department, phone, email) VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(query, [name, surname, position, department, phone, email], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Employee added successfully' });
  });
});

// Update employee
app.put('/api/employees/:id', (req, res) => {
  const { name, surname, position, department, phone, email } = req.body;

  const query = `
    UPDATE employees
    SET name = ?, surname = ?, position = ?, department = ?, phone = ?, email = ?
    WHERE id = ?
  `;

  db.run(query, [name, surname, position, department, phone, email, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json({ message: 'Employee updated successfully' });
  });
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  db.run("DELETE FROM employees WHERE id = ?", [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json({ message: 'Employee deleted successfully' });
  });
});

// Get work logs for an employee
app.get('/api/work-logs/employee/:employeeId', (req, res) => {
  const query = `
    SELECT wl.*, e.name, e.surname
    FROM work_logs wl
    JOIN employees e ON wl.employee_id = e.id
    WHERE wl.employee_id = ?
    ORDER BY wl.year DESC, wl.month DESC
  `;

  db.all(query, [req.params.employeeId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ workLogs: rows });
  });
});

// Get all work logs
app.get('/api/work-logs', (req, res) => {
  const query = `
    SELECT wl.*, e.name, e.surname
    FROM work_logs wl
    JOIN employees e ON wl.employee_id = e.id
    ORDER BY wl.year DESC, wl.month DESC, e.surname, e.name
  `;

  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ workLogs: rows });
  });
});

// Add work log entry
app.post('/api/work-logs', (req, res) => {
  const { employee_id, month, year, days_worked, payment_amount, notes } = req.body;

  if (!employee_id || !month || !year || !days_worked || !payment_amount) {
    res.status(400).json({ error: 'Employee ID, month, year, days worked, and payment amount are required' });
    return;
  }

  const query = `
    INSERT INTO work_logs (employee_id, month, year, days_worked, payment_amount, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [employee_id, month, year, days_worked, payment_amount, notes], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Work log added successfully' });
  });
});

// Update work log entry
app.put('/api/work-logs/:id', (req, res) => {
  const { month, year, days_worked, payment_amount, notes } = req.body;

  const query = `
    UPDATE work_logs
    SET month = ?, year = ?, days_worked = ?, payment_amount = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [month, year, days_worked, payment_amount, notes, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Work log not found' });
      return;
    }
    res.json({ message: 'Work log updated successfully' });
  });
});

// Delete work log entry
app.delete('/api/work-logs/:id', (req, res) => {
  db.run("DELETE FROM work_logs WHERE id = ?", [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Work log not found' });
      return;
    }
    res.json({ message: 'Work log deleted successfully' });
  });
});

// Get work logs by month and year
app.get('/api/work-logs/period/:year/:month', (req, res) => {
  const query = `
    SELECT wl.*, e.name, e.surname, e.position, e.department
    FROM work_logs wl
    JOIN employees e ON wl.employee_id = e.id
    WHERE wl.year = ? AND wl.month = ?
    ORDER BY e.surname, e.name
  `;

  db.all(query, [req.params.year, req.params.month], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ workLogs: rows });
  });
});

// ============================================
// NEW API ENDPOINTS FOR BLOCKS & FEATURES
// ============================================

// Authentication - Signup
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, referralCode, authProvider } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  // Generate unique referral code for new user
  const newReferralCode = 'REF' + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Check if referred by someone
  let referredBy = null;
  if (referralCode) {
    db.get("SELECT id FROM users WHERE referral_code = ?", [referralCode], (err, row) => {
      if (row) {
        referredBy = row.id;
      }
    });
  }

  const query = `
    INSERT INTO users (name, email, password_hash, auth_provider, referral_code, referred_by, airdrop_eligible)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `;

  db.run(query, [name, email, password || null, authProvider || 'email', newReferralCode, referredBy], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }

    const userId = this.lastID;

    // Create airdrop entry
    db.run("INSERT INTO airdrops (user_id, amount, token_type) VALUES (?, 100, 'TON')", [userId]);

    // If referred by someone, create referral entry
    if (referredBy) {
      db.run("INSERT INTO referrals (referrer_id, referred_user_id) VALUES (?, ?)", [referredBy, userId]);
    }

    res.json({
      id: userId,
      message: 'User created successfully',
      referralCode: newReferralCode,
      airdropEligible: true
    });
  });
});

// Newsletter - Subscribe
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email, name, source } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const query = `INSERT INTO newsletter_signups (email, name, source) VALUES (?, ?, ?)`;

  db.run(query, [email, name, source || 'website'], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Email already subscribed' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    res.json({ message: 'Successfully subscribed to newsletter' });
  });
});

// Social Media Links - Get all
app.get('/api/social-media', (req, res) => {
  db.all("SELECT * FROM social_media_links WHERE is_active = 1 ORDER BY display_order", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Social Media Links - Add/Update
app.post('/api/social-media', (req, res) => {
  const { platform, url, icon_class, display_order } = req.body;

  const query = `INSERT INTO social_media_links (platform, url, icon_class, display_order) VALUES (?, ?, ?, ?)`;

  db.run(query, [platform, url, icon_class, display_order || 0], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Social media link added' });
  });
});

// Blog Posts - Get all published
app.get('/api/blog/posts', (req, res) => {
  const lang = req.query.lang || 'en';

  db.all("SELECT * FROM blog_posts WHERE status = 'published' AND lang = ? ORDER BY published_at DESC", [lang], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Blog Posts - Get single post by slug
app.get('/api/blog/post/:slug', (req, res) => {
  db.get("SELECT * FROM blog_posts WHERE slug = ?", [req.params.slug], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Increment view count
    db.run("UPDATE blog_posts SET views = views + 1 WHERE id = ?", [row.id]);

    res.json(row);
  });
});

// Blog Posts - Create new post
app.post('/api/blog/posts', (req, res) => {
  const { title, slug, content, excerpt, author, featured_image, category, tags, status, lang } = req.body;

  if (!title || !slug || !content) {
    res.status(400).json({ error: 'Title, slug, and content are required' });
    return;
  }

  const query = `
    INSERT INTO blog_posts (title, slug, content, excerpt, author, featured_image, category, tags, status, lang, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `;

  db.run(query, [title, slug, content, excerpt, author, featured_image, category, tags, status || 'draft', lang || 'en'], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Blog post created' });
  });
});

// Ad Blocks - Get ad by position
app.get('/api/ads/:position', (req, res) => {
  db.get("SELECT * FROM ad_blocks WHERE position = ? AND is_active = 1", [req.params.position], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Ad block not found' });
      return;
    }
    res.json(row);
  });
});

// Ad Blocks - Create/Update ad
app.post('/api/ads', (req, res) => {
  const { block_name, ad_type, ad_code, position } = req.body;

  const query = `
    INSERT INTO ad_blocks (block_name, ad_type, ad_code, position)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [block_name || position, ad_type, ad_code, position], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Ad block created' });
  });
});

// Referrals - Get user referral data
app.get('/api/referrals/user/:userId', (req, res) => {
  const userId = req.params.userId;

  // Get user's referral code and stats
  db.get("SELECT referral_code, total_referral_earnings FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get referrals
    const query = `
      SELECT r.*, u.name as userName, u.email as userEmail, u.created_at as createdAt
      FROM referrals r
      JOIN users u ON r.referred_user_id = u.id
      WHERE r.referrer_id = ?
      ORDER BY r.created_at DESC
    `;

    db.all(query, [userId], (err, referrals) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Calculate stats
      const totalReferrals = referrals.length;
      const activeReferrals = referrals.filter(r => r.status === 'active').length;
      const totalEarnings = user.total_referral_earnings || 0;

      // Get setting for reward percentage
      db.get("SELECT setting_value FROM site_settings WHERE setting_key = 'referral_percentage'", (err, setting) => {
        const rewardPercentage = setting ? parseFloat(setting.setting_value) : 5;

        res.json({
          referralCode: user.referral_code,
          totalReferrals,
          activeReferrals,
          totalEarnings,
          pendingRewards: 0, // Calculate based on pending transactions
          rewardPercentage,
          referrals: referrals.map(r => ({
            id: r.id,
            userName: r.userName,
            createdAt: r.createdAt,
            totalPurchases: r.total_purchases || 0,
            rewardAmount: r.reward_amount || 0,
            status: r.status
          }))
        });
      });
    });
  });
});

// Airdrops - Get user airdrops
app.get('/api/airdrops/user/:userId', (req, res) => {
  db.all("SELECT * FROM airdrops WHERE user_id = ? ORDER BY created_at DESC", [req.params.userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Airdrops - Claim airdrop
app.post('/api/airdrops/claim/:userId', (req, res) => {
  const userId = req.params.userId;
  const { walletAddress } = req.body;

  // Check if user is eligible
  db.get("SELECT airdrop_eligible, airdrop_claimed FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    if (!user.airdrop_eligible || user.airdrop_claimed) {
      res.status(400).json({ error: 'Not eligible for airdrop or already claimed' });
      return;
    }

    // Update airdrop status
    db.run("UPDATE airdrops SET status = 'claimed', claimed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND status = 'pending'", [userId]);
    db.run("UPDATE users SET airdrop_claimed = 1, ton_wallet_address = ? WHERE id = ?", [walletAddress, userId]);

    res.json({ message: 'Airdrop claimed successfully' });
  });
});

// Site Settings - Get all settings
app.get('/api/settings', (req, res) => {
  db.all("SELECT * FROM site_settings", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  });
});

// Site Settings - Update setting
app.put('/api/settings/:key', (req, res) => {
  const { value } = req.body;

  const query = `
    INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
    ON CONFLICT(setting_key) DO UPDATE SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
  `;

  db.run(query, [req.params.key, value, value], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Setting updated successfully' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Puantaj API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
