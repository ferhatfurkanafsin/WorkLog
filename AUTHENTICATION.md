# Authentication System Documentation

## Overview

This document describes the user authentication and authorization system implemented in the WorkLog application.

## Features

### 1. User Authentication
- Secure login page with username and password
- Password hashing using SHA-256
- Session management with auto-logout after 30 minutes of inactivity
- Session data stored securely in localStorage using XOR encryption

### 2. User Roles

The system supports three user roles with different permissions:

#### Admin
- **Full access** to all features
- Can add/edit/delete employees
- Can view all records
- Can generate reports
- Can add/edit/delete timesheet records

#### Manager
- Can view all records
- Can generate reports
- Can add/edit timesheet records
- **Cannot** manage employees

#### Data Entry
- Can **only** add timesheet records
- Limited view of the application
- Cannot view employee details or reports

### 3. Role-Based Access Control (RBAC)

Permissions are defined in `/frontend/src/utils/auth.js`:

```javascript
{
  'Admin': [
    'add_employee', 'edit_employee', 'delete_employee',
    'view_all_records', 'generate_reports',
    'add_worklog', 'edit_worklog', 'delete_worklog'
  ],
  'Manager': [
    'view_all_records', 'generate_reports',
    'add_worklog', 'edit_worklog'
  ],
  'Data Entry': ['add_worklog']
}
```

## Default Users

For testing purposes, the system comes with three pre-configured users:

| Username   | Password    | Role        |
|-----------|-------------|-------------|
| admin     | admin123    | Admin       |
| manager   | manager123  | Manager     |
| dataentry | data123     | Data Entry  |

## Implementation Details

### Backend

#### Database Schema

**users table:**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  full_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### API Endpoints

- `POST /api/auth/login` - Authenticate user and create session
  - Request: `{ username, password }`
  - Response: `{ success, user, sessionToken }`

- `GET /api/auth/me` - Validate session and get current user
  - Query: `?userId=<id>`
  - Response: `{ user }`

### Frontend

#### File Structure

```
frontend/src/
├── context/
│   └── AuthContext.jsx        # Authentication state management
├── utils/
│   └── auth.js                # Auth utilities and encryption
├── components/
│   ├── Login.jsx              # Login page
│   ├── Login.css              # Login page styles
│   ├── Dashboard.jsx          # Main dashboard with role-based UI
│   ├── Dashboard.css          # Dashboard styles
│   ├── EmployeeSearch.jsx     # Employee search (Admin/Manager only)
│   ├── WorkLogForm.jsx        # Work log entry form (all roles)
│   └── WorkLogsList.jsx       # Work logs display (Admin/Manager only)
└── App.jsx                    # Main app with auth routing
```

#### Key Components

**AuthContext**: Provides authentication state and methods throughout the app
- `user` - Current logged-in user
- `login(username, password)` - Login function
- `logout(message)` - Logout function
- `hasPermission(permission)` - Check if user has specific permission
- `isAuthenticated` - Boolean indicating if user is logged in

**Login Component**: Handles user authentication with username and password

**Dashboard Component**: Main application interface with role-based content visibility

### Session Management

#### Auto-Logout

The system automatically logs out users after 30 minutes of inactivity. Activity is tracked through:
- Mouse movements
- Keyboard input
- Scrolling
- Touch events

#### Session Storage

Sessions are stored in localStorage with the following structure:
```javascript
{
  user: { id, username, role, fullName },
  sessionToken: "...",
  timestamp: 1234567890
}
```

The session data is encrypted using XOR encryption before storage.

## Security Features

1. **Password Hashing**: Passwords are hashed using SHA-256 on the server
2. **Session Encryption**: Session data is encrypted in localStorage
3. **Session Expiration**: Automatic logout after 30 minutes
4. **Activity Tracking**: Session timeout resets with user activity
5. **Role-Based Permissions**: Enforced both on frontend and should be enforced on backend

## Usage

### For Users

1. Navigate to the application
2. You'll be presented with the login page
3. Enter your username and password
4. Based on your role, you'll see different features:
   - **Admin**: Full employee search, work log management, and reports
   - **Manager**: Employee search, work log viewing, and limited editing
   - **Data Entry**: Simple form to add timesheet entries

### For Developers

#### Checking Permissions

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { hasPermission, user } = useAuth();

  return (
    <div>
      {hasPermission('add_employee') && (
        <button>Add Employee</button>
      )}

      {user.role === 'Admin' && (
        <AdminPanel />
      )}
    </div>
  );
}
```

#### Protecting Routes/Components

Components are automatically protected based on the `isAuthenticated` state in `App.jsx`. Additional permission checks should be added within components.

## Future Improvements

1. **Backend Session Management**: Implement proper session tokens stored in database
2. **JWT Tokens**: Use JWT for stateless authentication
3. **Password Reset**: Add password reset functionality
4. **2FA**: Add two-factor authentication
5. **Audit Logging**: Track user actions for security
6. **API Authorization**: Add middleware to protect API endpoints based on user roles
7. **Rate Limiting**: Prevent brute-force login attempts
8. **HTTPS**: Ensure all communication is encrypted in production

## Troubleshooting

### Session Expired Message
- This appears after 30 minutes of inactivity
- Simply log in again to continue

### Cannot Access Feature
- Check your user role
- Verify that your role has the required permission
- Contact your administrator if you need different access

### Login Issues
- Verify username and password are correct
- Check that the backend server is running
- Check browser console for errors
