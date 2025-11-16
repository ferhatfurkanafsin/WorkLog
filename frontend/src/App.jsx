import { useState, useEffect } from 'react'
import EmployeeSearch from './components/EmployeeSearch'
import WorkLogForm from './components/WorkLogForm'
import WorkLogsList from './components/WorkLogsList'
import './App.css'

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [refreshLogs, setRefreshLogs] = useState(0)
  const [activeSection, setActiveSection] = useState('search')
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false)
  const [isFormCollapsed, setIsFormCollapsed] = useState(false)
  const [isLogsCollapsed, setIsLogsCollapsed] = useState(false)

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee)
    // On mobile, switch to form section after selecting employee
    if (window.innerWidth <= 768) {
      setActiveSection('form')
    }
  }

  const handleWorkLogAdded = () => {
    setRefreshLogs(prev => prev + 1)
    // On mobile, switch to logs section after adding work log
    if (window.innerWidth <= 768) {
      setActiveSection('logs')
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Personel Puantaj Sistemi</h1>
        <p>Çalışan iş günü ve ödeme takip sistemi</p>
      </header>

      <div className="main-content">
        <div className={`section-wrapper ${activeSection === 'search' ? 'active' : ''}`}>
          <div className="section-header" onClick={() => setIsSearchCollapsed(!isSearchCollapsed)}>
            <h2 className="section-title">Personel Ara</h2>
            <button className="collapse-btn" aria-label="Toggle section">
              {isSearchCollapsed ? '▼' : '▲'}
            </button>
          </div>
          {!isSearchCollapsed && (
            <EmployeeSearch onSelectEmployee={handleEmployeeSelect} />
          )}
        </div>

        <div className={`section-wrapper ${activeSection === 'form' ? 'active' : ''}`}>
          <div className="section-header" onClick={() => setIsFormCollapsed(!isFormCollapsed)}>
            <h2 className="section-title">Puantaj Kaydı</h2>
            <button className="collapse-btn" aria-label="Toggle section">
              {isFormCollapsed ? '▼' : '▲'}
            </button>
          </div>
          {!isFormCollapsed && (
            <WorkLogForm
              selectedEmployee={selectedEmployee}
              onWorkLogAdded={handleWorkLogAdded}
            />
          )}
        </div>
      </div>

      <div className={`section-wrapper logs-section ${activeSection === 'logs' ? 'active' : ''}`}>
        <div className="section-header" onClick={() => setIsLogsCollapsed(!isLogsCollapsed)}>
          <h2 className="section-title">Kayıtlar</h2>
          <button className="collapse-btn" aria-label="Toggle section">
            {isLogsCollapsed ? '▼' : '▲'}
          </button>
        </div>
        {!isLogsCollapsed && (
          <WorkLogsList
            selectedEmployee={selectedEmployee}
            refresh={refreshLogs}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <button
          className={`nav-item ${activeSection === 'search' ? 'active' : ''}`}
          onClick={() => setActiveSection('search')}
        >
          <span className="nav-icon">🔍</span>
          <span className="nav-label">Ara</span>
        </button>
        <button
          className={`nav-item ${activeSection === 'form' ? 'active' : ''}`}
          onClick={() => setActiveSection('form')}
        >
          <span className="nav-icon">✏️</span>
          <span className="nav-label">Kayıt</span>
        </button>
        <button
          className={`nav-item ${activeSection === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveSection('logs')}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-label">Liste</span>
        </button>
      </nav>
    </div>
  )
}

export default App
