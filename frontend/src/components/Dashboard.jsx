import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import EmployeeSearch from './EmployeeSearch';
import WorkLogForm from './WorkLogForm';
import WorkLogsList from './WorkLogsList';
import './Dashboard.css';

function Dashboard() {
  const { user, logout, hasPermission } = useAuth();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [refreshLogs, setRefreshLogs] = useState(0);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleWorkLogAdded = () => {
    setRefreshLogs(prev => prev + 1);
  };

  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      logout();
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Personel Puantaj Sistemi</h1>
            <p>Çalışan iş günü ve ödeme takip sistemi</p>
          </div>
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user.fullName}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Employee Search - Only for Admin and Manager */}
        {hasPermission('view_all_records') && (
          <EmployeeSearch onSelectEmployee={handleEmployeeSelect} />
        )}

        {/* Work Log Form - All roles can access but with different permissions */}
        <WorkLogForm
          selectedEmployee={selectedEmployee}
          onWorkLogAdded={handleWorkLogAdded}
        />

        {/* Work Logs List - Only for Admin and Manager */}
        {hasPermission('view_all_records') && (
          <WorkLogsList
            selectedEmployee={selectedEmployee}
            refresh={refreshLogs}
          />
        )}

        {/* Info message for Data Entry users */}
        {user.role === 'Data Entry' && (
          <div className="info-box">
            <h3>Bilgilendirme</h3>
            <p>
              Veri girişi kullanıcısı olarak sadece puantaj kaydı ekleyebilirsiniz.
              Detaylı raporlar ve çalışan yönetimi için yöneticinizle iletişime geçin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
