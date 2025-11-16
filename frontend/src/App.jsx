import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import EmployeeSearch from './components/EmployeeSearch'
import WorkLogForm from './components/WorkLogForm'
import WorkLogsList from './components/WorkLogsList'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [refreshLogs, setRefreshLogs] = useState(0)

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee)
  }

  const handleWorkLogAdded = () => {
    setRefreshLogs(prev => prev + 1)
  }

  const handleNavigate = (view) => {
    setCurrentView(view)
  }

  return (
    <div className="container">
      <header>
        <h1>Personel Puantaj Sistemi</h1>
        <p>Çalışan iş günü ve ödeme takip sistemi</p>
        <nav className="main-nav">
          <button
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn ${currentView === 'add-timesheet' ? 'active' : ''}`}
            onClick={() => setCurrentView('add-timesheet')}
          >
            Puantaj Ekle
          </button>
          <button
            className={`nav-btn ${currentView === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentView('reports')}
          >
            Raporlar
          </button>
        </nav>
      </header>

      {currentView === 'dashboard' && (
        <Dashboard onNavigate={handleNavigate} />
      )}

      {(currentView === 'add-timesheet' || currentView === 'reports') && (
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
