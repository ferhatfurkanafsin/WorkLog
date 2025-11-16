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
      is_paid INTEGER DEFAULT 0,
      payment_date TEXT,
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )
  `);

  // Add payment tracking columns if they don't exist (for existing databases)
  db.run(`ALTER TABLE work_logs ADD COLUMN is_paid INTEGER DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding is_paid column:', err.message);
    }
  });

  db.run(`ALTER TABLE work_logs ADD COLUMN payment_date TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding payment_date column:', err.message);
    }
  });

  db.run(`ALTER TABLE work_logs ADD COLUMN payment_method TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding payment_method column:', err.message);
    }
  });

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
});

module.exports = db;
