// Authentication utilities for secure storage and session management

const SESSION_KEY = 'worklog_session';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

// Encrypt data before storing (simple XOR encryption for demonstration)
const encrypt = (data) => {
  const key = 'worklog-secret-key-2024';
  return btoa(
    JSON.stringify(data)
      .split('')
      .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
      .join('')
  );
};

// Decrypt data from storage
const decrypt = (encryptedData) => {
  try {
    const key = 'worklog-secret-key-2024';
    const decrypted = atob(encryptedData)
      .split('')
      .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
      .join('');
    return JSON.parse(decrypted);
  } catch (error) {
    return null;
  }
};

// Save session to localStorage
export const saveSession = (user, sessionToken) => {
  const sessionData = {
    user,
    sessionToken,
    timestamp: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, encrypt(sessionData));
};

// Get session from localStorage
export const getSession = () => {
  const encryptedSession = localStorage.getItem(SESSION_KEY);
  if (!encryptedSession) return null;

  const sessionData = decrypt(encryptedSession);
  if (!sessionData) return null;

  // Check if session has expired
  const currentTime = Date.now();
  if (currentTime - sessionData.timestamp > SESSION_TIMEOUT) {
    clearSession();
    return null;
  }

  return sessionData;
};

// Update session timestamp (keep alive)
export const updateSessionTimestamp = () => {
  const session = getSession();
  if (session) {
    session.timestamp = Date.now();
    localStorage.setItem(SESSION_KEY, encrypt(session));
  }
};

// Clear session from localStorage
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

// Check if session is valid
export const isSessionValid = () => {
  const session = getSession();
  return session !== null;
};

// Get current user from session
export const getCurrentUser = () => {
  const session = getSession();
  return session ? session.user : null;
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user ? user.role === role : false;
};

// Check if user has permission (role-based)
export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!user) return false;

  const permissions = {
    'Admin': ['add_employee', 'edit_employee', 'delete_employee', 'view_all_records', 'generate_reports', 'add_worklog', 'edit_worklog', 'delete_worklog'],
    'Manager': ['view_all_records', 'generate_reports', 'add_worklog', 'edit_worklog'],
    'Data Entry': ['add_worklog']
  };

  return permissions[user.role]?.includes(permission) || false;
};

// Get user's role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};
