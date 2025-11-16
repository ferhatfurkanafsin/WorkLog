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

  // Add new columns to employees table if they don't exist
  db.run(`ALTER TABLE employees ADD COLUMN monthly_salary REAL DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding monthly_salary column:', err);
    }
  });

  // Add new calculation columns to work_logs table if they don't exist
  const newColumns = [
    'hakedis_ucret REAL DEFAULT 0',           // Earned Amount
    'avans REAL DEFAULT 0',                   // Advance
    'kalan_avans REAL DEFAULT 0',             // Remaining Advance
    'icra_odeme REAL DEFAULT 0',              // Legal Deduction
    'bankaya_odenecek REAL DEFAULT 0',        // Bank Payment
    'elden_verilecek REAL DEFAULT 0'          // Cash Payment
  ];

  newColumns.forEach(column => {
    db.run(`ALTER TABLE work_logs ADD COLUMN ${column}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Error adding column ${column}:`, err);
      }
    });
  });

  // Insert some sample employees for testing
  db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
    if (row.count === 0) {
      const sampleEmployees = [
        { name: 'Ahmet', surname: 'Yılmaz', position: 'Mühendis', department: 'Üretim', phone: '0532-111-2233', email: 'ahmet@example.com', monthly_salary: 45000 },
        { name: 'Ayşe', surname: 'Demir', position: 'Muhasebeci', department: 'Muhasebe', phone: '0533-222-3344', email: 'ayse@example.com', monthly_salary: 38000 },
        { name: 'Mehmet', surname: 'Kaya', position: 'Teknisyen', department: 'Bakım', phone: '0534-333-4455', email: 'mehmet@example.com', monthly_salary: 32000 },
        { name: 'Fatma', surname: 'Şahin', position: 'İnsan Kaynakları', department: 'İK', phone: '0535-444-5566', email: 'fatma@example.com', monthly_salary: 40000 },
        { name: 'Ali', surname: 'Çelik', position: 'Operatör', department: 'Üretim', phone: '0536-555-6677', email: 'ali@example.com', monthly_salary: 28000 }
      ];

      const stmt = db.prepare("INSERT INTO employees (name, surname, position, department, phone, email, monthly_salary) VALUES (?, ?, ?, ?, ?, ?, ?)");
      sampleEmployees.forEach(emp => {
        stmt.run(emp.name, emp.surname, emp.position, emp.department, emp.phone, emp.email, emp.monthly_salary);
      });
      stmt.finalize();
      console.log('Sample employees added to database');
    }
  });
});

module.exports = db;
