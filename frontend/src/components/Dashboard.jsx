import { useState, useEffect } from 'react';

function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard">
        <div className="error">Veriler yüklenirken bir hata oluştu.</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => onNavigate('add-timesheet')}>
            <span className="btn-icon">+</span>
            Puantaj Ekle
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('reports')}>
            <span className="btn-icon">📊</span>
            Raporları Görüntüle
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon employee-icon">👥</div>
          <div className="stat-info">
            <div className="stat-label">Toplam Çalışan</div>
            <div className="stat-value">{stats.totalEmployees}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon payroll-icon">💰</div>
          <div className="stat-info">
            <div className="stat-label">Aylık Toplam Maaş</div>
            <div className="stat-value">{formatCurrency(stats.currentMonth.totalPayroll)}</div>
            <div className="stat-meta">
              {stats.currentMonth.employeeCount} çalışan
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon days-icon">📅</div>
          <div className="stat-info">
            <div className="stat-label">Ortalama Çalışılan Gün</div>
            <div className="stat-value">{stats.currentMonth.avgWorkedDays.toFixed(1)}</div>
            <div className="stat-meta">Bu ay</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Month-over-Month Chart */}
        <div className="dashboard-card chart-card">
          <h2>Aylık Karşılaştırma</h2>
          <div className="chart-container">
            <div className="bar-chart">
              {stats.monthComparison.map((month, index) => {
                const maxPayroll = Math.max(...stats.monthComparison.map(m => m.totalPayroll));
                const heightPercentage = maxPayroll > 0 ? (month.totalPayroll / maxPayroll) * 100 : 0;

                return (
                  <div key={index} className="bar-item">
                    <div className="bar-wrapper">
                      <div
                        className="bar"
                        style={{ height: `${heightPercentage}%` }}
                        title={formatCurrency(month.totalPayroll)}
                      >
                        <span className="bar-value">{formatCurrency(month.totalPayroll)}</span>
                      </div>
                    </div>
                    <div className="bar-label">{month.month.substring(0, 3)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top 5 Employees */}
        <div className="dashboard-card">
          <h2>En Çok Çalışan 5 Personel</h2>
          {stats.topEmployees.length > 0 ? (
            <div className="top-employees-list">
              {stats.topEmployees.map((employee, index) => (
                <div key={employee.id} className="top-employee-item">
                  <div className="rank">{index + 1}</div>
                  <div className="employee-info">
                    <div className="employee-name">{employee.name} {employee.surname}</div>
                    <div className="employee-position">{employee.position}</div>
                  </div>
                  <div className="employee-stats">
                    <div className="days-badge">{employee.days_worked} gün</div>
                    <div className="payment-amount">{formatCurrency(employee.payment_amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Bu ay için henüz veri yok</div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card activity-card">
          <h2>Son Aktiviteler</h2>
          {stats.recentActivity.length > 0 ? (
            <div className="activity-list">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <div className="activity-title">
                      <strong>{activity.name} {activity.surname}</strong>
                      <span className="activity-position"> - {activity.position}</span>
                    </div>
                    <div className="activity-details">
                      {activity.month} {activity.year} - {activity.days_worked} gün - {formatCurrency(activity.payment_amount)}
                    </div>
                    <div className="activity-time">{formatDate(activity.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Henüz aktivite yok</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
