import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function WorkLogForm({ selectedEmployee, onWorkLogAdded }) {
  const { hasPermission, user } = useAuth()
  const [formData, setFormData] = useState({
    month: '',
    year: new Date().getFullYear(),
    days_worked: '',
    payment_amount: '',
    notes: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)
  const [employees, setEmployees] = useState([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')

  useEffect(() => {
    // Set current month
    const currentMonth = new Date().toLocaleString('tr-TR', { month: 'long' })
    setFormData(prev => ({ ...prev, month: currentMonth }))

    // Fetch employees for Data Entry users
    if (user?.role === 'Data Entry') {
      fetchEmployees()
    }
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employees')
      const data = await response.json()
      setEmployees(data.employees)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Determine employee ID based on user role
    const employeeId = user?.role === 'Data Entry' ? selectedEmployeeId : selectedEmployee?.id

    if (!employeeId) {
      setMessage({ type: 'error', text: 'Lütfen önce bir personel seçin' })
      return
    }

    if (!formData.days_worked || !formData.payment_amount) {
      setMessage({ type: 'error', text: 'Lütfen tüm gerekli alanları doldurun' })
      return
    }

    if (!hasPermission('add_worklog')) {
      setMessage({ type: 'error', text: 'Bu işlem için yetkiniz yok' })
      return
    }

    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('http://localhost:3000/api/work-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employee_id: employeeId,
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

      {/* Show employee selector for Data Entry users */}
      {user?.role === 'Data Entry' ? (
        <div className="form-group">
          <label>Personel Seç *</label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            required
          >
            <option value="">Bir personel seçin...</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} {emp.surname} - {emp.position || 'N/A'}
              </option>
            ))}
          </select>
        </div>
      ) : (
        selectedEmployee ? (
          <div className="selected-employee-info">
            <h3>{selectedEmployee.name} {selectedEmployee.surname}</h3>
            <p><strong>Pozisyon:</strong> {selectedEmployee.position || '-'}</p>
            <p><strong>Departman:</strong> {selectedEmployee.department || '-'}</p>
          </div>
        ) : (
          <div className="alert alert-error">
            Lütfen sol taraftan bir personel seçin
          </div>
        )
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
          disabled={(user?.role === 'Data Entry' ? !selectedEmployeeId : !selectedEmployee) || submitting}
        >
          {submitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  )
}

export default WorkLogForm
