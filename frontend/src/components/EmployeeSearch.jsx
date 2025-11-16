import { useState, useEffect } from 'react'
import dbManager from '../utils/indexedDB'

function EmployeeSearch({ onSelectEmployee }) {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Initialize IndexedDB
    dbManager.init().catch(console.error)
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
      setLoading(true)
      const response = await fetch('/api/employees')
      const data = await response.json()
      setEmployees(data.employees)
      setIsOffline(false)

      // Cache employees in IndexedDB
      await dbManager.syncEmployees(data.employees)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching employees:', error)

      // Try to load from IndexedDB cache
      try {
        const cachedEmployees = await dbManager.getAll('employees')
        if (cachedEmployees.length > 0) {
          setEmployees(cachedEmployees)
          setIsOffline(true)
        }
      } catch (dbError) {
        console.error('Error loading from cache:', dbError)
      }
      setLoading(false)
    }
  }

  const searchEmployees = async () => {
    try {
      const response = await fetch(`/api/employees/search?q=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      setEmployees(data.employees)
      setIsOffline(false)
    } catch (error) {
      console.error('Error searching employees:', error)

      // Search in IndexedDB cache
      try {
        const results = await dbManager.searchEmployees(searchTerm)
        setEmployees(results)
        setIsOffline(true)
      } catch (dbError) {
        console.error('Error searching cache:', dbError)
      }
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
      <h2>
        Personel Ara
        {isOffline && <span className="offline-badge"> (Çevrimdışı)</span>}
      </h2>
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
