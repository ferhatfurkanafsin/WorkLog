import { useState, useEffect } from 'react'
import EmployeeSearch from './components/EmployeeSearch'
import WorkLogForm from './components/WorkLogForm'
import WorkLogsList from './components/WorkLogsList'
import EmployeeManagement from './components/EmployeeManagement'
import './App.css'

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [refreshLogs, setRefreshLogs] = useState(0)
  const [activeTab, setActiveTab] = useState('puantaj') // 'puantaj' or 'employees'

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
          className={`tab-button ${activeTab === 'puantaj' ? 'active' : ''}`}
          onClick={() => setActiveTab('puantaj')}
        >
          Puantaj Takibi
        </button>
        <button
          className={`tab-button ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          Çalışan Yönetimi
        </button>
      </div>

      {activeTab === 'puantaj' && (
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

      {activeTab === 'employees' && (
        <EmployeeManagement />
      )}
    </div>
  )
}

export default App
