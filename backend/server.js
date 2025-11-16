const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

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

// Export data to Excel
app.get('/api/export/excel', (req, res) => {
  const employeesQuery = "SELECT * FROM employees ORDER BY surname, name";
  const workLogsQuery = `
    SELECT wl.*, e.name, e.surname, e.position, e.department
    FROM work_logs wl
    JOIN employees e ON wl.employee_id = e.id
    ORDER BY wl.year DESC, wl.month DESC, e.surname, e.name
  `;

  db.all(employeesQuery, (err, employees) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    db.all(workLogsQuery, (err, workLogs) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      try {
        // Create workbook
        const wb = XLSX.utils.book_new();

        // Add employees sheet
        const employeesWs = XLSX.utils.json_to_sheet(employees);
        XLSX.utils.book_append_sheet(wb, employeesWs, 'Personel');

        // Add work logs sheet
        const workLogsWs = XLSX.utils.json_to_sheet(workLogs);
        XLSX.utils.book_append_sheet(wb, workLogsWs, 'Puantaj Kayıtları');

        // Generate Excel file
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Set headers for download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=puantaj-export-${Date.now()}.xlsx`);
        res.send(buffer);
      } catch (error) {
        res.status(500).json({ error: 'Error generating Excel file: ' + error.message });
      }
    });
  });
});

// Import data from Excel
app.post('/api/import/excel', bodyParser.raw({ type: 'application/octet-stream', limit: '50mb' }), (req, res) => {
  try {
    // Parse Excel file from request body
    const workbook = XLSX.read(req.body, { type: 'buffer' });

    let importedEmployees = 0;
    let importedWorkLogs = 0;
    const errors = [];

    // Import employees if sheet exists
    if (workbook.SheetNames.includes('Personel')) {
      const employeesSheet = workbook.Sheets['Personel'];
      const employees = XLSX.utils.sheet_to_json(employeesSheet);

      employees.forEach((emp, index) => {
        if (emp.name && emp.surname) {
          const query = `INSERT OR REPLACE INTO employees (id, name, surname, position, department, phone, email)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`;
          db.run(query, [emp.id || null, emp.name, emp.surname, emp.position || '', emp.department || '', emp.phone || '', emp.email || ''], (err) => {
            if (err) {
              errors.push(`Employee row ${index + 2}: ${err.message}`);
            } else {
              importedEmployees++;
            }
          });
        }
      });
    }

    // Import work logs if sheet exists
    if (workbook.SheetNames.includes('Puantaj Kayıtları')) {
      const workLogsSheet = workbook.Sheets['Puantaj Kayıtları'];
      const workLogs = XLSX.utils.sheet_to_json(workLogsSheet);

      workLogs.forEach((log, index) => {
        if (log.employee_id && log.month && log.year && log.days_worked && log.payment_amount) {
          const query = `INSERT OR REPLACE INTO work_logs (id, employee_id, month, year, days_worked, payment_amount, notes)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`;
          db.run(query, [log.id || null, log.employee_id, log.month, log.year, log.days_worked, log.payment_amount, log.notes || ''], (err) => {
            if (err) {
              errors.push(`Work log row ${index + 2}: ${err.message}`);
            } else {
              importedWorkLogs++;
            }
          });
        }
      });
    }

    // Wait a bit for all inserts to complete
    setTimeout(() => {
      res.json({
        message: 'Import completed',
        importedEmployees,
        importedWorkLogs,
        errors: errors.length > 0 ? errors : null
      });
    }, 1000);
  } catch (error) {
    res.status(500).json({ error: 'Error importing Excel file: ' + error.message });
  }
});

// Backup database
app.get('/api/backup/database', (req, res) => {
  try {
    const dbPath = path.join(__dirname, 'puantaj.db');
    const backupFileName = `puantaj-backup-${Date.now()}.db`;

    // Read the database file
    const dbFile = fs.readFileSync(dbPath);

    // Set headers for download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${backupFileName}`);
    res.send(dbFile);
  } catch (error) {
    res.status(500).json({ error: 'Error creating backup: ' + error.message });
  }
});

// Restore database
app.post('/api/restore/database', bodyParser.raw({ type: 'application/octet-stream', limit: '50mb' }), (req, res) => {
  try {
    const dbPath = path.join(__dirname, 'puantaj.db');
    const backupPath = path.join(__dirname, `puantaj-backup-${Date.now()}.db`);

    // Create a backup of current database before restoring
    fs.copyFileSync(dbPath, backupPath);

    // Close existing database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      }

      // Write the uploaded file as the new database
      fs.writeFileSync(dbPath, req.body);

      // Reopen the database
      const sqlite3 = require('sqlite3').verbose();
      const newDb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          // If restore fails, restore the backup
          fs.copyFileSync(backupPath, dbPath);
          res.status(500).json({ error: 'Database restore failed: ' + err.message });
        } else {
          res.json({
            message: 'Database restored successfully',
            backupCreated: backupPath
          });

          // Note: Server should be restarted after restore
          console.log('Database restored. Please restart the server.');
        }
      });

      // Update the db reference
      Object.assign(db, newDb);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error restoring database: ' + error.message });
  }
});

// Clear all data
app.delete('/api/data/clear-all', (req, res) => {
  const { confirm } = req.body;

  if (confirm !== 'DELETE_ALL_DATA') {
    res.status(400).json({ error: 'Confirmation required. Send { confirm: "DELETE_ALL_DATA" }' });
    return;
  }

  // Delete all work logs first (foreign key constraint)
  db.run("DELETE FROM work_logs", (err) => {
    if (err) {
      res.status(500).json({ error: 'Error clearing work logs: ' + err.message });
      return;
    }

    // Then delete all employees
    db.run("DELETE FROM employees", (err) => {
      if (err) {
        res.status(500).json({ error: 'Error clearing employees: ' + err.message });
        return;
      }

      res.json({ message: 'All data cleared successfully' });
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
