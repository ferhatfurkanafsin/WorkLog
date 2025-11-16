import { useState, useEffect, useRef } from 'react'

function WorkLogsList({ selectedEmployee, refresh }) {
  const [workLogs, setWorkLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ totalDays: 0, totalPayment: 0 })
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const tableRef = useRef(null)

  useEffect(() => {
    if (selectedEmployee) {
      fetchWorkLogs()
    } else {
      fetchAllWorkLogs()
    }
  }, [selectedEmployee, refresh])

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

  // Swipe gesture handlers
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      // Swipe left - could navigate to next month/period
      console.log('Swiped left - next period')
    }
    if (isRightSwipe) {
      // Swipe right - could navigate to previous month/period
      console.log('Swiped right - previous period')
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
    <div
      className="card work-logs-section"
      ref={tableRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <h2>
        {selectedEmployee
          ? `${selectedEmployee.name} ${selectedEmployee.surname} - Puantaj Kayıtları`
          : 'Tüm Puantaj Kayıtları'
        }
      </h2>

      {workLogs.length > 0 && (
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

      {workLogs.length === 0 ? (
        <div className="no-data">
          {selectedEmployee
            ? 'Bu personel için henüz puantaj kaydı bulunmuyor'
            : 'Henüz puantaj kaydı bulunmuyor'
          }
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="work-logs-table">
            <thead>
              <tr>
                {!selectedEmployee && <th>Personel</th>}
                <th>Ay</th>
                <th>Yıl</th>
                <th>Çalışılan Gün</th>
                <th>Ödeme Tutarı</th>
                <th>Notlar</th>
                <th>Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {workLogs.map(log => (
                <tr key={log.id}>
                  {!selectedEmployee && (
                    <td><strong>{log.name} {log.surname}</strong></td>
                  )}
                  <td>{log.month}</td>
                  <td>{log.year}</td>
                  <td>{log.days_worked}</td>
                  <td>{formatCurrency(log.payment_amount)}</td>
                  <td>{log.notes || '-'}</td>
                  <td>{new Date(log.created_at).toLocaleDateString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default WorkLogsList
