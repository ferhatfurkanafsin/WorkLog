const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to hash passwords
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Authentication Routes

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const hashedPassword = hashPassword(password);

  db.get(
    "SELECT id, username, role, full_name FROM users WHERE username = ? AND password = ?",
    [username, hashedPassword],
    (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (!user) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      // Generate a simple session token
      const sessionToken = crypto.randomBytes(32).toString('hex');

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          fullName: user.full_name
        },
        sessionToken
      });
    }
  );
});

// Get current user (session validation)
app.get('/api/auth/me', (req, res) => {
  // In a real application, you would validate the session token from headers
  // For this simple implementation, we'll accept a userId in query params
  const userId = req.query.userId;

  if (!userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  db.get(
    "SELECT id, username, role, full_name FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          fullName: user.full_name
        }
      });
    }
  );
});

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Puantaj API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
