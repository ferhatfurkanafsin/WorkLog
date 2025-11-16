import { useState, useEffect } from 'react'

function WorkLogsList({ selectedEmployee, refresh }) {
  const [workLogs, setWorkLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalDays: 0,
    totalHakedis: 0,
    totalAvans: 0,
    totalIcraOdeme: 0,
    totalNetPayment: 0,
    totalBankPayment: 0,
    totalCashPayment: 0
  })

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
    const totalDays = logs.reduce((sum, log) => sum + parseFloat(log.days_worked || 0), 0)
    const totalHakedis = logs.reduce((sum, log) => sum + parseFloat(log.hakedis_ucret || 0), 0)
    const totalAvans = logs.reduce((sum, log) => sum + parseFloat(log.avans || 0), 0)
    const totalIcraOdeme = logs.reduce((sum, log) => sum + parseFloat(log.icra_odeme || 0), 0)
    const totalNetPayment = logs.reduce((sum, log) => sum + parseFloat(log.payment_amount || 0), 0)
    const totalBankPayment = logs.reduce((sum, log) => sum + parseFloat(log.bankaya_odenecek || 0), 0)
    const totalCashPayment = logs.reduce((sum, log) => sum + parseFloat(log.elden_verilecek || 0), 0)

    setStats({
      totalDays,
      totalHakedis,
      totalAvans,
      totalIcraOdeme,
      totalNetPayment,
      totalBankPayment,
      totalCashPayment
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
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
            <h4>Toplam Hakediş</h4>
            <p>{formatCurrency(stats.totalHakedis)}</p>
          </div>
          <div className="stat-card">
            <h4>Toplam Avans</h4>
            <p className="text-warning">{formatCurrency(stats.totalAvans)}</p>
          </div>
          <div className="stat-card">
            <h4>Toplam İcra Ödeme</h4>
            <p className="text-warning">{formatCurrency(stats.totalIcraOdeme)}</p>
          </div>
          <div className="stat-card highlight">
            <h4>Toplam Net Ödeme</h4>
            <p>{formatCurrency(stats.totalNetPayment)}</p>
          </div>
          <div className="stat-card">
            <h4>Banka Ödemeleri</h4>
            <p>{formatCurrency(stats.totalBankPayment)}</p>
          </div>
          <div className="stat-card">
            <h4>Nakit Ödemeler</h4>
            <p>{formatCurrency(stats.totalCashPayment)}</p>
          </div>
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
        <div className="table-container">
          <table className="work-logs-table">
            <thead>
              <tr>
                {!selectedEmployee && <th>Personel</th>}
                <th>Ay</th>
                <th>Yıl</th>
                <th>Çalışılan Gün</th>
                <th>Hakediş Ücret</th>
                <th>Avans</th>
                <th>İcra Ödeme</th>
                <th>Net Ödeme</th>
                <th>Banka</th>
                <th>Nakit</th>
                <th>Kalan Avans</th>
                <th>Notlar</th>
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
                  <td className="amount">{formatCurrency(log.hakedis_ucret || 0)}</td>
                  <td className="amount text-warning">{formatCurrency(log.avans || 0)}</td>
                  <td className="amount text-warning">{formatCurrency(log.icra_odeme || 0)}</td>
                  <td className="amount highlight">{formatCurrency(log.payment_amount || 0)}</td>
                  <td className="amount">{formatCurrency(log.bankaya_odenecek || 0)}</td>
                  <td className="amount">{formatCurrency(log.elden_verilecek || 0)}</td>
                  <td className="amount">{formatCurrency(log.kalan_avans || 0)}</td>
                  <td className="notes">{log.notes || '-'}</td>
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
