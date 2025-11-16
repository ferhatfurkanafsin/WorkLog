# Personel Puantaj Sistemi

A comprehensive web application for managing employee time tracking (puantaj) and payroll information.

## Features

- **Employee Search**: Quickly find employees by name, surname, position, or department
- **Work Log Entry**: Record daily work hours and payment amounts for each employee
- **Statistics Dashboard**: View total working days, total payments, and average daily rates
- **Real-time Updates**: Instantly see changes after adding new records
- **Multi-language Support**: Interface in Turkish (Türkçe)
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Backend
- Node.js + Express
- SQLite database
- RESTful API

### Frontend
- React 18
- Vite (for fast development)
- Modern CSS with gradient designs

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm

### Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd WorkLog
```

2. Install all dependencies:
```bash
npm run install-all
```

Or install manually:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:

**Backend** (runs on port 3000):
```bash
npm run server
```

**Frontend** (runs on port 5173):
```bash
npm run client
```

### Access the Application

Once running, open your browser and navigate to:
```
http://localhost:5173
```

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/search?q=<term>` - Search employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Add new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Work Logs (Puantaj)
- `GET /api/work-logs` - Get all work logs
- `GET /api/work-logs/employee/:employeeId` - Get work logs for specific employee
- `GET /api/work-logs/period/:year/:month` - Get work logs for specific period
- `POST /api/work-logs` - Add new work log
- `PUT /api/work-logs/:id` - Update work log
- `DELETE /api/work-logs/:id` - Delete work log

## Database Schema

### Employees Table
- id (Primary Key)
- name
- surname
- position
- department
- phone
- email
- created_at

### Work Logs Table
- id (Primary Key)
- employee_id (Foreign Key)
- month
- year
- days_worked
- payment_amount
- notes
- created_at
- updated_at

## Usage Guide

1. **Finding an Employee**
   - Use the search box on the left to find employees by name, surname, position, or department
   - Click on an employee to select them

2. **Adding a Work Log**
   - Select an employee from the search results
   - Fill in the form on the right:
     - Select the month and year
     - Enter the number of days worked (can be decimal, e.g., 22.5)
     - Enter the payment amount in Turkish Lira
     - Add any notes (optional)
   - Click "Kaydet" (Save) to submit

3. **Viewing Records**
   - All work logs appear in the table at the bottom
   - Statistics show total days worked, total payments, and average daily rate
   - Records are organized by date and employee

## Sample Data

The application comes with 5 sample employees pre-loaded:
- Ahmet Yılmaz (Engineer - Production)
- Ayşe Demir (Accountant - Accounting)
- Mehmet Kaya (Technician - Maintenance)
- Fatma Şahin (Human Resources - HR)
- Ali Çelik (Operator - Production)

## Project Structure

```
WorkLog/
├── backend/
│   ├── server.js          # Express server
│   ├── database.js        # SQLite database setup
│   ├── package.json       # Backend dependencies
│   └── puantaj.db         # SQLite database file (auto-created)
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
├── package.json           # Root package.json
└── README.md             # This file
```

## Future Enhancements

Potential features for future versions:
- Employee management (add/edit/delete employees)
- Export to Excel/PDF
- Monthly reports
- User authentication
- Role-based access control
- Email notifications
- Multi-company support
- Overtime calculations
- Leave/vacation tracking

## License

ISC

## Support

For issues or questions, please contact the development team.
