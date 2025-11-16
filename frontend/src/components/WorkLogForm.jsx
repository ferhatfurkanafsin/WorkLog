import { useState, useEffect } from 'react'

function WorkLogForm({ selectedEmployee, onWorkLogAdded }) {
  const [formData, setFormData] = useState({
    month: '',
    year: new Date().getFullYear(),
    days_worked: '',
    payment_amount: '',
    notes: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Set current month
    const currentMonth = new Date().toLocaleString('tr-TR', { month: 'long' })
    setFormData(prev => ({ ...prev, month: currentMonth }))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedEmployee) {
      setMessage({ type: 'error', text: 'Lütfen önce bir personel seçin' })
      return
    }

    if (!formData.days_worked || !formData.payment_amount) {
      setMessage({ type: 'error', text: 'Lütfen tüm gerekli alanları doldurun' })
      return
    }

    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/work-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employee_id: selectedEmployee.id,
          ...formData
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Puantaj kaydı başarıyla eklendi!' })
        setFormData({
          month: formData.month,
          year: formData.year,
          days_worked: '',
          payment_amount: '',
          notes: ''
        })
        onWorkLogAdded()
      } else {
        setMessage({ type: 'error', text: data.error || 'Bir hata oluştu' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası: ' + error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="card">
      <h2>Puantaj Kaydı Ekle</h2>

      {selectedEmployee ? (
        <div className="selected-employee-info">
          <h3>{selectedEmployee.name} {selectedEmployee.surname}</h3>
          <p><strong>Pozisyon:</strong> {selectedEmployee.position || '-'}</p>
          <p><strong>Departman:</strong> {selectedEmployee.department || '-'}</p>
        </div>
      ) : (
        <div className="alert alert-error">
          Lütfen sol taraftan bir personel seçin
        </div>
      )}

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ay *</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Yıl *</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Çalışılan Gün Sayısı *</label>
          <input
            type="number"
            name="days_worked"
            value={formData.days_worked}
            onChange={handleChange}
            step="0.5"
            min="0"
            max="31"
            placeholder="Örn: 22 veya 22.5"
            required
          />
        </div>

        <div className="form-group">
          <label>Ödeme Tutarı (TL) *</label>
          <input
            type="number"
            name="payment_amount"
            value={formData.payment_amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="Örn: 15000.00"
            required
          />
        </div>

        <div className="form-group">
          <label>Notlar</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Ek bilgiler..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedEmployee || submitting}
        >
          {submitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  )
}

export default WorkLogForm
