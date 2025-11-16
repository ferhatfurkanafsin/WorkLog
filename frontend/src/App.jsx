import { useState } from 'react'
import EmployeeSearch from './components/EmployeeSearch'
import WorkLogForm from './components/WorkLogForm'
import WorkLogsList from './components/WorkLogsList'
import CalendarAttendance from './components/CalendarAttendance'
import './App.css'

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [refreshLogs, setRefreshLogs] = useState(0)
  const [activeTab, setActiveTab] = useState('attendance') // 'attendance' or 'worklog'

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee)
  }

  const handleWorkLogAdded = () => {
    setRefreshLogs(prev => prev + 1)
  }

  return (
    <div className="container">
      <header>
        <h1>Personel Puantaj Sistemi</h1>
        <p>Çalışan iş günü ve ödeme takip sistemi</p>
      </header>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Aylık Devam Cetveli
        </button>
        <button
          className={`tab-button ${activeTab === 'worklog' ? 'active' : ''}`}
          onClick={() => setActiveTab('worklog')}
        >
          İş Günü Takibi
        </button>
      </div>

      {activeTab === 'attendance' ? (
        <CalendarAttendance />
      ) : (
        <>
          <div className="main-content">
            <EmployeeSearch onSelectEmployee={handleEmployeeSelect} />
            <WorkLogForm
              selectedEmployee={selectedEmployee}
              onWorkLogAdded={handleWorkLogAdded}
            />
          </div>

          <WorkLogsList
            selectedEmployee={selectedEmployee}
            refresh={refreshLogs}
          />
        </>
      )}
    </div>
  )
}

export default App
