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

// Dashboard statistics
app.get('/api/dashboard/stats', (req, res) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

  // Get month name in Turkish
  const monthNames = {
    1: 'Ocak', 2: 'Şubat', 3: 'Mart', 4: 'Nisan', 5: 'Mayıs', 6: 'Haziran',
    7: 'Temmuz', 8: 'Ağustos', 9: 'Eylül', 10: 'Ekim', 11: 'Kasım', 12: 'Aralık'
  };
  const currentMonthName = monthNames[currentMonth];

  const stats = {};

  // 1. Total employees count
  db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.totalEmployees = row.count;

    // 2. Current month stats (payroll and average worked days)
    const currentMonthQuery = `
      SELECT
        COALESCE(SUM(payment_amount), 0) as totalPayroll,
        COALESCE(AVG(days_worked), 0) as avgWorkedDays,
        COUNT(*) as employeeCount
      FROM work_logs
      WHERE year = ? AND month = ?
    `;

    db.get(currentMonthQuery, [currentYear, currentMonthName], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.currentMonth = {
        totalPayroll: row.totalPayroll,
        avgWorkedDays: row.avgWorkedDays,
        employeeCount: row.employeeCount
      };

      // 3. Recent activity (last 5 entries)
      const recentActivityQuery = `
        SELECT wl.*, e.name, e.surname, e.position
        FROM work_logs wl
        JOIN employees e ON wl.employee_id = e.id
        ORDER BY wl.created_at DESC
        LIMIT 5
      `;

      db.all(recentActivityQuery, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        stats.recentActivity = rows;

        // 4. Month-over-month comparison (last 6 months)
        const monthComparison = [];
        let monthsProcessed = 0;

        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentYear, currentMonth - 1 - i, 1);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const monthName = monthNames[month];

          const monthQuery = `
            SELECT
              COALESCE(SUM(payment_amount), 0) as totalPayroll,
              COALESCE(AVG(days_worked), 0) as avgDays,
              COUNT(*) as count
            FROM work_logs
            WHERE year = ? AND month = ?
          `;

          db.get(monthQuery, [year, monthName], (err, row) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }

            monthComparison.push({
              year: year,
              month: monthName,
              monthNumber: month,
              totalPayroll: row.totalPayroll,
              avgDays: row.avgDays,
              count: row.count
            });

            monthsProcessed++;

            if (monthsProcessed === 6) {
              // Sort by year and month
              monthComparison.sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                return a.monthNumber - b.monthNumber;
              });
              stats.monthComparison = monthComparison;

              // 5. Top 5 employees by worked days (current month)
              const topEmployeesQuery = `
                SELECT
                  e.id,
                  e.name,
                  e.surname,
                  e.position,
                  e.department,
                  wl.days_worked,
                  wl.payment_amount
                FROM work_logs wl
                JOIN employees e ON wl.employee_id = e.id
                WHERE wl.year = ? AND wl.month = ?
                ORDER BY wl.days_worked DESC
                LIMIT 5
              `;

              db.all(topEmployeesQuery, [currentYear, currentMonthName], (err, rows) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return;
                }
                stats.topEmployees = rows;

                // Return all stats
                res.json({ stats });
              });
            }
          });
        }
      });
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Puantaj API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
