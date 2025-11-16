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

  // Helper function to get days in a month
  const getDaysInMonth = (monthName, year) => {
    const months = {
      'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
      'Temmuz': 6, 'Ağustos': 7, 'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11
    }
    const monthIndex = months[monthName]
    return new Date(year, monthIndex + 1, 0).getDate()
  }

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

    // Validation 1: Check if employee is selected
    if (!selectedEmployee) {
      setMessage({ type: 'error', text: 'HATA: Lütfen önce bir personel seçin!' })
      return
    }

    // Validation 2: Check if required fields are filled
    if (!formData.days_worked || !formData.payment_amount) {
      setMessage({ type: 'error', text: 'HATA: Lütfen tüm gerekli alanları doldurun!' })
      return
    }

    // Validation 3: Validate payment amount (no negative numbers)
    const paymentAmount = parseFloat(formData.payment_amount)
    if (paymentAmount < 0) {
      setMessage({ type: 'error', text: 'HATA: Ödeme tutarı negatif olamaz!' })
      return
    }

    // Validation 4: Validate days worked (must be positive)
    const daysWorked = parseFloat(formData.days_worked)
    if (daysWorked < 0) {
      setMessage({ type: 'error', text: 'HATA: Çalışılan gün sayısı negatif olamaz!' })
      return
    }

    // Validation 5: Validate days worked against days in month
    const daysInMonth = getDaysInMonth(formData.month, formData.year)
    if (daysWorked > daysInMonth) {
      setMessage({
        type: 'error',
        text: `HATA: ${formData.month} ${formData.year} ayında ${daysInMonth} gün bulunmaktadır. Çalışılan gün sayısı ${daysInMonth} günden fazla olamaz!`
      })
      return
    }

    // Validation 6: Check for duplicate entries
    try {
      const checkResponse = await fetch(
        `/api/work-logs/check-duplicate?employee_id=${selectedEmployee.id}&month=${formData.month}&year=${formData.year}`
      )
      const checkData = await checkResponse.json()

      if (checkData.exists) {
        setMessage({
          type: 'error',
          text: `HATA: Bu personel için ${formData.month} ${formData.year} ayına ait kayıt zaten mevcut!`
        })
        return
      }
    } catch (error) {
      console.error('Error checking duplicate:', error)
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
        setMessage({ type: 'error', text: 'HATA: ' + (data.error || 'Bir hata oluştu') })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'HATA: Bağlantı hatası - ' + error.message })
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
