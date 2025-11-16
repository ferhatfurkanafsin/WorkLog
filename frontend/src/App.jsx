import { useState, useEffect } from 'react'
import EmployeeSearch from './components/EmployeeSearch'
import WorkLogForm from './components/WorkLogForm'
import WorkLogsList from './components/WorkLogsList'
import Reports from './components/Reports'
import './App.css'

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [refreshLogs, setRefreshLogs] = useState(0)

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

      <Reports />
    </div>
  )
}

export default App
