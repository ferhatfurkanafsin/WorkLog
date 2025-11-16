import { useState, useEffect } from 'react'

function EmployeeSearch({ onSelectEmployee }) {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)

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
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default EmployeeSearch
