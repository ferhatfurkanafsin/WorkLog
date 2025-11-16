import { useState, useEffect } from 'react'

function EmployeeSearch({ onSelectEmployee }) {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingSalaryId, setEditingSalaryId] = useState(null)
  const [tempSalary, setTempSalary] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      searchEmployees()
    } else {
      fetchEmployees()
    }
  }, [searchTerm])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const data = await response.json()
      setEmployees(data.employees)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching employees:', error)
      setLoading(false)
    }
  }

  const searchEmployees = async () => {
    try {
      const response = await fetch(`/api/employees/search?q=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      setEmployees(data.employees)
    } catch (error) {
      console.error('Error searching employees:', error)
    }
  }

  const handleEmployeeClick = (employee) => {
    setSelectedId(employee.id)
    onSelectEmployee(employee)
  }

  const handleEditSalary = (e, employeeId, currentSalary) => {
    e.stopPropagation() // Prevent employee selection
    setEditingSalaryId(employeeId)
    setTempSalary(currentSalary || '')
  }

  const handleSaveSalary = async (e, employee) => {
    e.stopPropagation()

    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...employee,
          monthly_salary: parseFloat(tempSalary) || 0
        })
      })

      if (response.ok) {
        // Update local state
        setEmployees(employees.map(emp =>
          emp.id === employee.id
            ? { ...emp, monthly_salary: parseFloat(tempSalary) || 0 }
            : emp
        ))

        // If this employee is selected, update the parent component
        if (selectedId === employee.id) {
          onSelectEmployee({ ...employee, monthly_salary: parseFloat(tempSalary) || 0 })
        }

        setEditingSalaryId(null)
        setTempSalary('')
      } else {
        alert('Maaş güncellenirken hata oluştu')
      }
    } catch (error) {
      console.error('Error updating salary:', error)
      alert('Bağlantı hatası')
    }
  }

  const handleCancelEdit = (e) => {
    e.stopPropagation()
    setEditingSalaryId(null)
    setTempSalary('')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="card">
        <h2>Personel Ara</h2>
        <div className="loading">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Personel Ara</h2>
      <input
        type="text"
        className="search-box"
        placeholder="İsim, soyisim, pozisyon veya departman ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="employee-list">
        {employees.length === 0 ? (
          <div className="no-data">Personel bulunamadı</div>
        ) : (
          employees.map(employee => (
            <div
              key={employee.id}
              className={`employee-item ${selectedId === employee.id ? 'selected' : ''}`}
              onClick={() => handleEmployeeClick(employee)}
            >
              <h3>{employee.name} {employee.surname}</h3>
              <p><strong>Pozisyon:</strong> {employee.position || '-'}</p>
              <p><strong>Departman:</strong> {employee.department || '-'}</p>
              {employee.phone && <p><strong>Tel:</strong> {employee.phone}</p>}

              <div className="salary-section">
                {editingSalaryId === employee.id ? (
                  <div className="salary-edit" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="number"
                      value={tempSalary}
                      onChange={(e) => setTempSalary(e.target.value)}
                      placeholder="Aylık maaş"
                      step="0.01"
                      min="0"
                      className="salary-input"
                      autoFocus
                    />
                    <button
                      className="btn-save-salary"
                      onClick={(e) => handleSaveSalary(e, employee)}
                    >
                      ✓
                    </button>
                    <button
                      className="btn-cancel-salary"
                      onClick={handleCancelEdit}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p>
                    <strong>Aylık Maaş:</strong>{' '}
                    {employee.monthly_salary
                      ? formatCurrency(employee.monthly_salary)
                      : <span className="text-muted">Belirtilmemiş</span>
                    }
                    <button
                      className="btn-edit-salary"
                      onClick={(e) => handleEditSalary(e, employee.id, employee.monthly_salary)}
                      title="Maaşı düzenle"
                    >
                      ✎
                    </button>
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default EmployeeSearch
