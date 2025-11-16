import { useState } from 'react'
import * as XLSX from 'xlsx'
import dbManager from '../utils/indexedDB'

function DataManagement() {
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [restoreType, setRestoreType] = useState(null) // 'database' or 'excel'

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 5000)
  }

  // Excel Export
  const handleExcelExport = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/export/excel')

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `puantaj-export-${Date.now()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showMessage('Excel dosyası başarıyla indirildi', 'success')
    } catch (error) {
      console.error('Export error:', error)
      showMessage('Excel dışa aktarma hatası: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Excel Import
  const handleExcelImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setLoading(true)
      const arrayBuffer = await file.arrayBuffer()

      const response = await fetch('/api/import/excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: arrayBuffer
      })

      const result = await response.json()

      if (response.ok) {
        showMessage(
          `İçe aktarma tamamlandı: ${result.importedEmployees} personel, ${result.importedWorkLogs} puantaj kaydı`,
          'success'
        )
        // Refresh the page after successful import
        setTimeout(() => window.location.reload(), 2000)
      } else {
        showMessage('İçe aktarma hatası: ' + result.error, 'error')
      }
    } catch (error) {
      console.error('Import error:', error)
      showMessage('Excel içe aktarma hatası: ' + error.message, 'error')
    } finally {
      setLoading(false)
      event.target.value = '' // Reset file input
    }
  }

  // Database Backup
  const handleDatabaseBackup = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/backup/database')

      if (!response.ok) {
        throw new Error('Backup failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `puantaj-backup-${Date.now()}.db`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showMessage('Veritabanı yedeği başarıyla indirildi', 'success')
    } catch (error) {
      console.error('Backup error:', error)
      showMessage('Veritabanı yedekleme hatası: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Database Restore
  const handleDatabaseRestore = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setRestoreType('database')
    setShowRestoreConfirm(true)
    event.target.value = '' // Reset file input
  }

  const confirmDatabaseRestore = async () => {
    if (!selectedFile) return

    try {
      setLoading(true)
      setShowRestoreConfirm(false)

      const arrayBuffer = await selectedFile.arrayBuffer()

      const response = await fetch('/api/restore/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: arrayBuffer
      })

      const result = await response.json()

      if (response.ok) {
        showMessage('Veritabanı başarıyla geri yüklendi. Sayfa yenileniyor...', 'success')
        setTimeout(() => window.location.reload(), 2000)
      } else {
        showMessage('Geri yükleme hatası: ' + result.error, 'error')
      }
    } catch (error) {
      console.error('Restore error:', error)
      showMessage('Veritabanı geri yükleme hatası: ' + error.message, 'error')
    } finally {
      setLoading(false)
      setSelectedFile(null)
    }
  }

  // IndexedDB Export
  const handleIndexedDBExport = async () => {
    try {
      setLoading(true)
      const exportData = await dbManager.exportData()

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `indexeddb-export-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showMessage('IndexedDB verileri başarıyla dışa aktarıldı', 'success')
    } catch (error) {
      console.error('IndexedDB export error:', error)
      showMessage('IndexedDB dışa aktarma hatası: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // IndexedDB Import
  const handleIndexedDBImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setLoading(true)
      const text = await file.text()
      const data = JSON.parse(text)

      await dbManager.importData(data)

      showMessage('IndexedDB verileri başarıyla içe aktarıldı', 'success')
      setTimeout(() => window.location.reload(), 2000)
    } catch (error) {
      console.error('IndexedDB import error:', error)
      showMessage('IndexedDB içe aktarma hatası: ' + error.message, 'error')
    } finally {
      setLoading(false)
      event.target.value = '' // Reset file input
    }
  }

  // Clear IndexedDB
  const handleClearIndexedDB = async () => {
    try {
      setLoading(true)
      await dbManager.clearAll()
      showMessage('IndexedDB önbelleği temizlendi', 'success')
    } catch (error) {
      console.error('Clear IndexedDB error:', error)
      showMessage('IndexedDB temizleme hatası: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Clear All Data
  const handleClearAllData = async () => {
    try {
      setLoading(true)
      setShowClearConfirm(false)

      const response = await fetch('/api/data/clear-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirm: 'DELETE_ALL_DATA' })
      })

      const result = await response.json()

      if (response.ok) {
        // Also clear IndexedDB
        await dbManager.clearAll()

        showMessage('Tüm veriler başarıyla silindi. Sayfa yenileniyor...', 'success')
        setTimeout(() => window.location.reload(), 2000)
      } else {
        showMessage('Veri silme hatası: ' + result.error, 'error')
      }
    } catch (error) {
      console.error('Clear all error:', error)
      showMessage('Veri silme hatası: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card data-management">
      <h2>Veri Yönetimi</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Excel Export/Import */}
      <div className="management-section">
        <h3>📊 Excel İşlemleri</h3>
        <div className="button-group">
          <button
            onClick={handleExcelExport}
            disabled={loading}
            className="btn btn-primary"
          >
            📥 Excel Dışa Aktar
          </button>

          <label className="btn btn-secondary" disabled={loading}>
            📤 Excel İçe Aktar
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelImport}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <p className="section-description">
          Tüm personel ve puantaj verilerini Excel formatında dışa aktarın veya içe aktarın.
        </p>
      </div>

      {/* Database Backup/Restore */}
      <div className="management-section">
        <h3>💾 Veritabanı Yedekleme</h3>
        <div className="button-group">
          <button
            onClick={handleDatabaseBackup}
            disabled={loading}
            className="btn btn-primary"
          >
            💾 Veritabanı Yedeğini Al
          </button>

          <label className="btn btn-warning" disabled={loading}>
            🔄 Veritabanını Geri Yükle
            <input
              type="file"
              accept=".db"
              onChange={handleDatabaseRestore}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <p className="section-description">
          Tüm veritabanını yedekleyin veya önceki bir yedekten geri yükleyin.
        </p>
      </div>

      {/* IndexedDB Operations */}
      <div className="management-section">
        <h3>🗄️ Önbellek Yönetimi (IndexedDB)</h3>
        <div className="button-group">
          <button
            onClick={handleIndexedDBExport}
            disabled={loading}
            className="btn btn-secondary"
          >
            💾 Önbelleği Dışa Aktar
          </button>

          <label className="btn btn-secondary" disabled={loading}>
            📥 Önbelleği İçe Aktar
            <input
              type="file"
              accept=".json"
              onChange={handleIndexedDBImport}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </label>

          <button
            onClick={handleClearIndexedDB}
            disabled={loading}
            className="btn btn-warning"
          >
            🗑️ Önbelleği Temizle
          </button>
        </div>
        <p className="section-description">
          Tarayıcı önbelleğindeki verileri yönetin (çevrimdışı erişim için).
        </p>
      </div>

      {/* Clear All Data */}
      <div className="management-section danger-zone">
        <h3>⚠️ Tehlikeli İşlemler</h3>
        <button
          onClick={() => setShowClearConfirm(true)}
          disabled={loading}
          className="btn btn-danger"
        >
          🗑️ Tüm Verileri Sil
        </button>
        <p className="section-description">
          Dikkat! Bu işlem tüm personel ve puantaj verilerini kalıcı olarak siler.
        </p>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚠️ Onay Gerekiyor</h3>
            <p>
              Tüm verileri silmek üzeresiniz. Bu işlem geri alınamaz!
              <br />
              <strong>Tüm personel ve puantaj kayıtları silinecek.</strong>
            </p>
            <div className="modal-buttons">
              <button
                onClick={handleClearAllData}
                className="btn btn-danger"
                disabled={loading}
              >
                Evet, Tüm Verileri Sil
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn btn-secondary"
                disabled={loading}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚠️ Onay Gerekiyor</h3>
            <p>
              Veritabanını geri yüklemek üzeresiniz. Bu işlem:
              <br />
              • Mevcut tüm verilerin yerine geçecek
              <br />
              • Mevcut veriler otomatik olarak yedeklenecek
              <br />
              <strong>Devam etmek istiyor musunuz?</strong>
            </p>
            <div className="modal-buttons">
              <button
                onClick={confirmDatabaseRestore}
                className="btn btn-warning"
                disabled={loading}
              >
                Evet, Geri Yükle
              </button>
              <button
                onClick={() => {
                  setShowRestoreConfirm(false)
                  setSelectedFile(null)
                }}
                className="btn btn-secondary"
                disabled={loading}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">İşleniyor...</div>
        </div>
      )}
    </div>
  )
}

export default DataManagement
