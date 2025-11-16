import { useState, useEffect } from 'react'

function WorkLogForm({ selectedEmployee, onWorkLogAdded }) {
  const [formData, setFormData] = useState({
    month: '',
    year: new Date().getFullYear(),
    days_worked: '',
    avans: '',
    kalan_avans: '',
    icra_odeme: '',
    bankaya_odenecek: '',
    elden_verilecek: '',
    notes: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)
  const [calculations, setCalculations] = useState({
    hakedis_ucret: 0,
    total_deductions: 0,
    net_payment: 0,
    showAdvanceWarning: false
  })

  useEffect(() => {
    // Set current month
    const currentMonth = new Date().toLocaleString('tr-TR', { month: 'long' })
    setFormData(prev => ({ ...prev, month: currentMonth }))
  }, [])

  // Real-time calculation effect
  useEffect(() => {
    if (selectedEmployee && selectedEmployee.monthly_salary && formData.days_worked) {
      const monthlySalary = parseFloat(selectedEmployee.monthly_salary) || 0
      const daysWorked = parseFloat(formData.days_worked) || 0
      const avans = parseFloat(formData.avans) || 0
      const icraOdeme = parseFloat(formData.icra_odeme) || 0
      const bankPayment = parseFloat(formData.bankaya_odenecek) || 0
      const cashPayment = parseFloat(formData.elden_verilecek) || 0

      // Calculate Hakediş Ücret (Earned Amount)
      const hakedisUcret = (monthlySalary / 30) * daysWorked

      // Calculate total deductions
      const totalDeductions = avans + icraOdeme

      // Calculate net payment after deductions
      const netPayment = hakedisUcret - totalDeductions

      // Check if advance exceeds earned amount
      const showAdvanceWarning = avans > hakedisUcret

      setCalculations({
        hakedis_ucret: hakedisUcret,
        total_deductions: totalDeductions,
        net_payment: netPayment,
        showAdvanceWarning: showAdvanceWarning
      })
    } else {
      setCalculations({
        hakedis_ucret: 0,
        total_deductions: 0,
        net_payment: 0,
        showAdvanceWarning: false
      })
    }
  }, [selectedEmployee, formData.days_worked, formData.avans, formData.icra_odeme, formData.bankaya_odenecek, formData.elden_verilecek])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Auto-distribute net payment between bank and cash
  const handleDistributePayment = () => {
    const netPayment = calculations.net_payment
    if (netPayment > 0) {
      setFormData(prev => ({
        ...prev,
        bankaya_odenecek: netPayment.toFixed(2),
        elden_verilecek: '0'
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedEmployee) {
      setMessage({ type: 'error', text: 'Lütfen önce bir personel seçin' })
      return
    }

    if (!selectedEmployee.monthly_salary || selectedEmployee.monthly_salary === 0) {
      setMessage({ type: 'error', text: 'Lütfen önce personelin aylık maaşını belirleyin' })
      return
    }

    if (!formData.days_worked) {
      setMessage({ type: 'error', text: 'Lütfen çalışılan gün sayısını girin' })
      return
    }

    // Validate that bank + cash = net payment
    const bankPayment = parseFloat(formData.bankaya_odenecek) || 0
    const cashPayment = parseFloat(formData.elden_verilecek) || 0
    const totalPayment = bankPayment + cashPayment

    if (Math.abs(totalPayment - calculations.net_payment) > 0.01) {
      setMessage({
        type: 'error',
        text: `Banka ve nakit ödemelerin toplamı net tutara eşit olmalı (${calculations.net_payment.toFixed(2)} TL)`
      })
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
          month: formData.month,
          year: formData.year,
          days_worked: parseFloat(formData.days_worked),
          payment_amount: calculations.net_payment,
          hakedis_ucret: calculations.hakedis_ucret,
          avans: parseFloat(formData.avans) || 0,
          kalan_avans: parseFloat(formData.kalan_avans) || 0,
          icra_odeme: parseFloat(formData.icra_odeme) || 0,
          bankaya_odenecek: parseFloat(formData.bankaya_odenecek) || 0,
          elden_verilecek: parseFloat(formData.elden_verilecek) || 0,
          notes: formData.notes
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Puantaj kaydı başarıyla eklendi!' })
        setFormData({
          month: formData.month,
          year: formData.year,
          days_worked: '',
          avans: '',
          kalan_avans: '',
          icra_odeme: '',
          bankaya_odenecek: '',
          elden_verilecek: '',
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
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
          <p><strong>Aylık Maaş:</strong> {formatCurrency(selectedEmployee.monthly_salary || 0)}</p>
          {(!selectedEmployee.monthly_salary || selectedEmployee.monthly_salary === 0) && (
            <div className="alert alert-error" style={{ marginTop: '10px' }}>
              ⚠️ Bu personelin aylık maaşı belirtilmemiş!
            </div>
          )}
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
        <div className="form-row">
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

        {/* Calculation Display */}
        {selectedEmployee && selectedEmployee.monthly_salary > 0 && formData.days_worked && (
          <div className="calculation-summary">
            <h3>Hesaplamalar</h3>
            <div className="calc-item">
              <span>Hakediş Ücret (Günlük Ücret × Gün):</span>
              <strong>{formatCurrency(calculations.hakedis_ucret)}</strong>
            </div>
            <div className="calc-formula">
              ({formatCurrency(selectedEmployee.monthly_salary)} ÷ 30) × {formData.days_worked} gün
            </div>
          </div>
        )}

        {/* Advance Warning */}
        {calculations.showAdvanceWarning && (
          <div className="alert alert-error" style={{ marginTop: '15px' }}>
            ⚠️ <strong>Dikkat!</strong> Avans tutarı hakediş ücreti aşıyor!
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Avans (TL)</label>
            <input
              type="number"
              name="avans"
              value={formData.avans}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>İcra Ödeme (TL)</label>
            <input
              type="number"
              name="icra_odeme"
              value={formData.icra_odeme}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Kalan Avans (TL)</label>
          <input
            type="number"
            name="kalan_avans"
            value={formData.kalan_avans}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
          />
          <small>Önceki aydan kalan avans bakiyesi</small>
        </div>

        {/* Net Payment Display */}
        {calculations.net_payment > 0 && (
          <div className="calculation-summary" style={{ marginTop: '20px' }}>
            <h3>Ödenecek Tutar</h3>
            <div className="calc-item">
              <span>Hakediş Ücret:</span>
              <span>{formatCurrency(calculations.hakedis_ucret)}</span>
            </div>
            <div className="calc-item">
              <span>Avans:</span>
              <span>- {formatCurrency(parseFloat(formData.avans) || 0)}</span>
            </div>
            <div className="calc-item">
              <span>İcra Ödeme:</span>
              <span>- {formatCurrency(parseFloat(formData.icra_odeme) || 0)}</span>
            </div>
            <div className="calc-item calc-total">
              <span><strong>Net Ödenecek:</strong></span>
              <strong>{formatCurrency(calculations.net_payment)}</strong>
            </div>
            <button
              type="button"
              onClick={handleDistributePayment}
              className="btn btn-secondary"
              style={{ marginTop: '10px', width: '100%' }}
            >
              Net Tutarı Banka Ödemesine Aktar
            </button>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Bankaya Ödenecek (TL)</label>
            <input
              type="number"
              name="bankaya_odenecek"
              value={formData.bankaya_odenecek}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Elden Verilecek (TL)</label>
            <input
              type="number"
              name="elden_verilecek"
              value={formData.elden_verilecek}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notlar</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Ek bilgiler..."
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedEmployee || submitting || !selectedEmployee.monthly_salary}
        >
          {submitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  )
}

export default WorkLogForm
