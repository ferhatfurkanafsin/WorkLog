import { useState, useEffect } from 'react'

function WorkLogsList({ selectedEmployee, refresh }) {
  const [workLogs, setWorkLogs] = useState([])
  const [filteredWorkLogs, setFilteredWorkLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ totalDays: 0, totalPayment: 0 })
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [notificationMessage, setNotificationMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (selectedEmployee) {
      fetchWorkLogs()
    } else {
      fetchAllWorkLogs()
    }
  }, [selectedEmployee, refresh])

  useEffect(() => {
    applyFilter()
  }, [workLogs, paymentFilter])

  const applyFilter = () => {
    let filtered = [...workLogs]

    if (paymentFilter === 'paid') {
      filtered = filtered.filter(log => log.is_paid === 1)
    } else if (paymentFilter === 'unpaid') {
      filtered = filtered.filter(log => log.is_paid === 0 || !log.is_paid)
    }

    setFilteredWorkLogs(filtered)
    calculateStats(filtered)
  }

  const fetchWorkLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/work-logs/employee/${selectedEmployee.id}`)
      const data = await response.json()
      setWorkLogs(data.workLogs)
      calculateStats(data.workLogs)
    } catch (error) {
      console.error('Error fetching work logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllWorkLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/work-logs')
      const data = await response.json()
      setWorkLogs(data.workLogs)
      calculateStats(data.workLogs)
    } catch (error) {
      console.error('Error fetching work logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (logs) => {
    const totalDays = logs.reduce((sum, log) => sum + parseFloat(log.days_worked), 0)
    const totalPayment = logs.reduce((sum, log) => sum + parseFloat(log.payment_amount), 0)
    setStats({ totalDays, totalPayment })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const sendNotification = async (log, type) => {
    try {
      const response = await fetch(`/api/work-logs/${log.id}/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notificationType: type,
          employee: {
            name: log.name,
            surname: log.surname,
            email: selectedEmployee?.email || 'not-provided@example.com',
            phone: selectedEmployee?.phone || 'Not provided'
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        setNotificationMessage({
          type: 'success',
          text: data.message
        })
        setTimeout(() => setNotificationMessage({ type: '', text: '' }), 5000)
      } else {
        setNotificationMessage({
          type: 'error',
          text: data.error || 'Bildirim gönderilemedi'
        })
      }
    } catch (error) {
      setNotificationMessage({
        type: 'error',
        text: 'Bağlantı hatası: ' + error.message
      })
    }
  }

  if (loading) {
    return (
      <div className="card work-logs-section">
        <h2>Puantaj Kayıtları</h2>
        <div className="loading">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="card work-logs-section">
      <div className="work-logs-header">
        <h2>
          {selectedEmployee
            ? `${selectedEmployee.name} ${selectedEmployee.surname} - Puantaj Kayıtları`
            : 'Tüm Puantaj Kayıtları'
          }
        </h2>

        <div className="payment-filter">
          <label>Ödeme Durumu: </label>
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
            <option value="all">Tümü</option>
            <option value="paid">Ödenenler</option>
            <option value="unpaid">Ödenmeyenler</option>
          </select>
        </div>
      </div>

      {notificationMessage.text && (
        <div className={`alert alert-${notificationMessage.type}`}>
          {notificationMessage.text}
        </div>
      )}

      {filteredWorkLogs.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Toplam Çalışılan Gün</h4>
            <p>{stats.totalDays.toFixed(1)}</p>
          </div>
          <div className="stat-card">
            <h4>Toplam Ödeme</h4>
            <p>{formatCurrency(stats.totalPayment)}</p>
          </div>
          {stats.totalDays > 0 && (
            <div className="stat-card">
              <h4>Ortalama Günlük Ücret</h4>
              <p>{formatCurrency(stats.totalPayment / stats.totalDays)}</p>
            </div>
          )}
        </div>
      )}

      {filteredWorkLogs.length === 0 ? (
        <div className="no-data">
          {paymentFilter === 'all'
            ? (selectedEmployee
              ? 'Bu personel için henüz puantaj kaydı bulunmuyor'
              : 'Henüz puantaj kaydı bulunmuyor')
            : `${paymentFilter === 'paid' ? 'Ödenmiş' : 'Ödenmemiş'} kayıt bulunmuyor`
          }
        </div>
      ) : (
        <table className="work-logs-table">
          <thead>
            <tr>
              {!selectedEmployee && <th>Personel</th>}
              <th>Ay</th>
              <th>Yıl</th>
              <th>Çalışılan Gün</th>
              <th>Ödeme Tutarı</th>
              <th>Ödeme Durumu</th>
              <th>Ödeme Tarihi</th>
              <th>Ödeme Yöntemi</th>
              <th>Notlar</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkLogs.map(log => (
              <tr key={log.id} className={log.is_paid ? 'row-paid' : 'row-unpaid'}>
                {!selectedEmployee && (
                  <td><strong>{log.name} {log.surname}</strong></td>
                )}
                <td>{log.month}</td>
                <td>{log.year}</td>
                <td>{log.days_worked}</td>
                <td>{formatCurrency(log.payment_amount)}</td>
                <td>
                  <span className={`payment-badge ${log.is_paid ? 'badge-paid' : 'badge-unpaid'}`}>
                    {log.is_paid ? '✓ Ödendi' : '✗ Ödenmedi'}
                  </span>
                </td>
                <td>
                  {log.payment_date
                    ? new Date(log.payment_date).toLocaleDateString('tr-TR')
                    : '-'
                  }
                </td>
                <td>{log.payment_method || '-'}</td>
                <td>{log.notes || '-'}</td>
                <td>
                  {log.is_paid && (
                    <div className="notification-buttons">
                      <button
                        className="btn-small btn-email"
                        onClick={() => sendNotification(log, 'email')}
                        title="E-posta gönder"
                      >
                        📧 E-posta
                      </button>
                      <button
                        className="btn-small btn-sms"
                        onClick={() => sendNotification(log, 'sms')}
                        title="SMS gönder"
                      >
                        📱 SMS
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default WorkLogsList
