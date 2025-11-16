// IndexedDB utility for offline data storage and caching
const DB_NAME = 'PuantajDB';
const DB_VERSION = 1;
const STORES = {
  EMPLOYEES: 'employees',
  WORK_LOGS: 'workLogs',
  SETTINGS: 'settings'
};

class IndexedDBManager {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize IndexedDB database
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create employees store
        if (!db.objectStoreNames.contains(STORES.EMPLOYEES)) {
          const employeeStore = db.createObjectStore(STORES.EMPLOYEES, { keyPath: 'id' });
          employeeStore.createIndex('name', 'name', { unique: false });
          employeeStore.createIndex('surname', 'surname', { unique: false });
          employeeStore.createIndex('department', 'department', { unique: false });
        }

        // Create work logs store
        if (!db.objectStoreNames.contains(STORES.WORK_LOGS)) {
          const workLogStore = db.createObjectStore(STORES.WORK_LOGS, { keyPath: 'id' });
          workLogStore.createIndex('employee_id', 'employee_id', { unique: false });
          workLogStore.createIndex('year', 'year', { unique: false });
          workLogStore.createIndex('month', 'month', { unique: false });
          workLogStore.createIndex('year_month', ['year', 'month'], { unique: false });
        }

        // Create settings store
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }

        console.log('IndexedDB object stores created');
      };
    });
  }

  /**
   * Add or update a record in a store
   */
  async put(storeName, data) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add multiple records to a store
   */
  async putBulk(storeName, dataArray) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      let completed = 0;
      const errors = [];

      dataArray.forEach((data, index) => {
        const request = store.put(data);

        request.onsuccess = () => {
          completed++;
          if (completed === dataArray.length) {
            resolve({ success: completed, errors: errors.length });
          }
        };

        request.onerror = () => {
          errors.push({ index, error: request.error });
          completed++;
          if (completed === dataArray.length) {
            resolve({ success: completed - errors.length, errors: errors.length });
          }
        };
      });

      if (dataArray.length === 0) {
        resolve({ success: 0, errors: 0 });
      }
    });
  }

  /**
   * Get a record by key
   */
  async get(storeName, key) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all records from a store
   */
  async getAll(storeName) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Query records by index
   */
  async getByIndex(storeName, indexName, value) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a record
   */
  async delete(storeName, key) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all records from a store
   */
  async clear(storeName) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all data from all stores
   */
  async clearAll() {
    if (!this.db) await this.init();

    const promises = Object.values(STORES).map(storeName => this.clear(storeName));
    return Promise.all(promises);
  }

  /**
   * Get database statistics
   */
  async getStats() {
    if (!this.db) await this.init();

    const stats = {};

    for (const storeName of Object.values(STORES)) {
      const count = await new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.count();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      stats[storeName] = count;
    }

    return stats;
  }

  /**
   * Export all data from IndexedDB
   */
  async exportData() {
    if (!this.db) await this.init();

    const data = {};

    for (const storeName of Object.values(STORES)) {
      data[storeName] = await this.getAll(storeName);
    }

    return {
      version: DB_VERSION,
      timestamp: new Date().toISOString(),
      data
    };
  }

  /**
   * Import data into IndexedDB
   */
  async importData(exportedData) {
    if (!this.db) await this.init();

    const results = {};

    for (const [storeName, records] of Object.entries(exportedData.data)) {
      if (Object.values(STORES).includes(storeName)) {
        results[storeName] = await this.putBulk(storeName, records);
      }
    }

    return results;
  }

  /**
   * Sync employees from API to IndexedDB
   */
  async syncEmployees(employees) {
    await this.clear(STORES.EMPLOYEES);
    return await this.putBulk(STORES.EMPLOYEES, employees);
  }

  /**
   * Sync work logs from API to IndexedDB
   */
  async syncWorkLogs(workLogs) {
    await this.clear(STORES.WORK_LOGS);
    return await this.putBulk(STORES.WORK_LOGS, workLogs);
  }

  /**
   * Search employees
   */
  async searchEmployees(searchTerm) {
    const employees = await this.getAll(STORES.EMPLOYEES);

    if (!searchTerm) return employees;

    const term = searchTerm.toLowerCase();
    return employees.filter(emp =>
      emp.name?.toLowerCase().includes(term) ||
      emp.surname?.toLowerCase().includes(term) ||
      emp.position?.toLowerCase().includes(term) ||
      emp.department?.toLowerCase().includes(term)
    );
  }

  /**
   * Get work logs for an employee
   */
  async getEmployeeWorkLogs(employeeId) {
    return await this.getByIndex(STORES.WORK_LOGS, 'employee_id', employeeId);
  }

  /**
   * Save user settings
   */
  async saveSetting(key, value) {
    return await this.put(STORES.SETTINGS, { key, value, updated: new Date().toISOString() });
  }

  /**
   * Get user setting
   */
  async getSetting(key) {
    const setting = await this.get(STORES.SETTINGS, key);
    return setting ? setting.value : null;
  }
}

// Create singleton instance
const dbManager = new IndexedDBManager();

export { dbManager, STORES };
export default dbManager;
