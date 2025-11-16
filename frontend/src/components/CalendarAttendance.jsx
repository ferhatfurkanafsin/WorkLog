import { useState, useEffect } from 'react'
import './CalendarAttendance.css'

const ATTENDANCE_TYPES = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LEAVE: 'leave',
  NONE: null
}

const ATTENDANCE_SYMBOLS = {
  present: '✓',
  absent: 'X',
  leave: 'L'
}

function CalendarAttendance() {
  const [employees, setEmployees] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees()
  }, [])

  // Load attendance data from localStorage when month/year changes
  useEffect(() => {
    loadAttendanceFromStorage()
  }, [selectedMonth, selectedYear])

  // Save attendance to localStorage whenever it changes
  useEffect(() => {
    saveAttendanceToStorage()
  }, [attendance])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const data = await response.json()
      setEmployees(data.employees || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching employees:', error)
      setLoading(false)
    }
  }

  const getStorageKey = () => {
    return `attendance_${selectedYear}_${selectedMonth}`
  }

  const loadAttendanceFromStorage = () => {
    const key = getStorageKey()
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        setAttendance(JSON.parse(stored))
      } catch (error) {
        console.error('Error parsing attendance data:', error)
        setAttendance({})
      }
    } else {
      setAttendance({})
    }
  }

  const saveAttendanceToStorage = () => {
    const key = getStorageKey()
    localStorage.setItem(key, JSON.stringify(attendance))
  }

  const getDaysInMonth = () => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate()
  }

  const getMonthName = () => {
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ]
    return months[selectedMonth]
  }

  const handleAttendanceClick = (employeeId, day) => {
    const key = `${employeeId}_${day}`
    const currentStatus = attendance[key]

    // Cycle through: none -> present -> absent -> leave -> none
    let newStatus
    if (!currentStatus) {
      newStatus = ATTENDANCE_TYPES.PRESENT
    } else if (currentStatus === ATTENDANCE_TYPES.PRESENT) {
      newStatus = ATTENDANCE_TYPES.ABSENT
    } else if (currentStatus === ATTENDANCE_TYPES.ABSENT) {
      newStatus = ATTENDANCE_TYPES.LEAVE
    } else {
      newStatus = ATTENDANCE_TYPES.NONE
    }

    setAttendance(prev => {
      const updated = { ...prev }
      if (newStatus === ATTENDANCE_TYPES.NONE) {
        delete updated[key]
      } else {
        updated[key] = newStatus
      }
      return updated
    })
  }

  const getAttendanceStatus = (employeeId, day) => {
    const key = `${employeeId}_${day}`
    return attendance[key] || ATTENDANCE_TYPES.NONE
  }

  const calculateWorkedDays = (employeeId) => {
    const daysInMonth = getDaysInMonth()
    let workedDays = 0

    for (let day = 1; day <= daysInMonth; day++) {
      const status = getAttendanceStatus(employeeId, day)
      if (status === ATTENDANCE_TYPES.PRESENT) {
        workedDays++
      }
    }

    return workedDays
  }

  const renderDayHeaders = () => {
    const daysInMonth = getDaysInMonth()
    const headers = []

    for (let day = 1; day <= daysInMonth; day++) {
      headers.push(
        <div key={day} className="day-header">
          {day}
        </div>
      )
    }

    return headers
  }

  const renderEmployeeRow = (employee) => {
    const daysInMonth = getDaysInMonth()
    const cells = []

    for (let day = 1; day <= daysInMonth; day++) {
      const status = getAttendanceStatus(employee.id, day)
      cells.push(
        <div
          key={`${employee.id}_${day}`}
          className={`attendance-cell ${status || ''}`}
          onClick={() => handleAttendanceClick(employee.id, day)}
          title={`${employee.name} ${employee.surname} - ${day} ${getMonthName()} - Click to mark attendance`}
        >
          {status && ATTENDANCE_SYMBOLS[status]}
        </div>
      )
    }

    return cells
  }

  if (loading) {
    return (
      <div className="calendar-attendance">
        <div className="loading">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="calendar-attendance">
      <div className="calendar-header">
        <h2>Aylık Devam Cetveli</h2>

        <div className="month-year-selector">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="month-select"
          >
            <option value="0">Ocak</option>
            <option value="1">Şubat</option>
            <option value="2">Mart</option>
            <option value="3">Nisan</option>
            <option value="4">Mayıs</option>
            <option value="5">Haziran</option>
            <option value="6">Temmuz</option>
            <option value="7">Ağustos</option>
            <option value="8">Eylül</option>
            <option value="9">Ekim</option>
            <option value="10">Kasım</option>
            <option value="11">Aralık</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="year-select"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-symbol present">✓</span>
            <span>Present</span>
          </div>
          <div className="legend-item">
            <span className="legend-symbol absent">X</span>
            <span>Absent</span>
          </div>
          <div className="legend-item">
            <span className="legend-symbol leave">L</span>
            <span>Leave</span>
          </div>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="no-data">Personel bulunamadı</div>
      ) : (
        <div className="calendar-grid-container">
          <div className="calendar-grid">
            {/* Header row with day numbers */}
            <div className="grid-header">
              <div className="employee-name-header">Personel / Gün</div>
              {renderDayHeaders()}
              <div className="total-header">Toplam</div>
            </div>

            {/* Employee rows */}
            {employees.map(employee => (
              <div key={employee.id} className="employee-row">
                <div className="employee-name">
                  {employee.name} {employee.surname}
                  <span className="employee-position">{employee.position}</span>
                </div>
                {renderEmployeeRow(employee)}
                <div className="total-days">
                  {calculateWorkedDays(employee.id)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarAttendance
