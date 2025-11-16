import { useState, useEffect } from 'react'

function WorkLogsList({ selectedEmployee, refresh }) {
  const [workLogs, setWorkLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ totalDays: 0, totalPayment: 0 })
  const [deleteModal, setDeleteModal] = useState({ show: false, log: null })
  const [deleting, setDeleting] = useState(false)

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

  const handleDeleteClick = (log) => {
    setDeleteModal({ show: true, log })
  }

  const handleCancelDelete = () => {
    setDeleteModal({ show: false, log: null })
  }

  const handleConfirmDelete = async () => {
    if (!deleteModal.log) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/work-logs/${deleteModal.log.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh the list
        if (selectedEmployee) {
          fetchWorkLogs()
        } else {
          fetchAllWorkLogs()
        }
        setDeleteModal({ show: false, log: null })
      } else {
        const data = await response.json()
        alert('Silme hatası: ' + (data.error || 'Bir hata oluştu'))
      }
    } catch (error) {
      alert('Bağlantı hatası: ' + error.message)
    } finally {
      setDeleting(false)
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
              <th className="action-column">İşlem</th>
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
                <td className="action-column">
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDeleteClick(log)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Kaydı Sil</h3>
            <p>
              <strong>{deleteModal.log?.name} {deleteModal.log?.surname}</strong> personeline ait{' '}
              <strong>{deleteModal.log?.month} {deleteModal.log?.year}</strong> ayı puantaj kaydını silmek istediğinizden emin misiniz?
            </p>
            <p style={{ color: '#dc3545', marginTop: '10px' }}>
              Bu işlem geri alınamaz!
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={handleCancelDelete}
                disabled={deleting}
              >
                İptal
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkLogsList
