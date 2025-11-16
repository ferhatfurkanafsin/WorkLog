import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [activeTab, setActiveTab] = useState('department');
  const [loading, setLoading] = useState(false);

  // Filter states
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  // Data states
  const [departmentSummary, setDepartmentSummary] = useState([]);
  const [companyPayroll, setCompanyPayroll] = useState([]);
  const [employeeHistory, setEmployeeHistory] = useState([]);
  const [monthComparison, setMonthComparison] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [employees, setEmployees] = useState([]);

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const currentMonth = months[new Date().getMonth()];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Fetch employees for dropdown
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'department' && selectedMonth) {
      fetchDepartmentSummary();
      fetchChartData();
    } else if (activeTab === 'payroll') {
      fetchCompanyPayroll();
    } else if (activeTab === 'employee' && selectedEmployeeId) {
      fetchEmployeeHistory();
    } else if (activeTab === 'comparison') {
      fetchMonthComparison();
    }
  }, [activeTab, selectedYear, selectedMonth, selectedEmployeeId]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchDepartmentSummary = async () => {
    if (!selectedMonth) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/monthly-summary/${selectedYear}/${selectedMonth}`);
      const data = await response.json();
      setDepartmentSummary(data.summary || []);
    } catch (error) {
      console.error('Error fetching department summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyPayroll = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/company-payroll');
      const data = await response.json();
      setCompanyPayroll(data.payroll || []);
    } catch (error) {
      console.error('Error fetching company payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeHistory = async () => {
    if (!selectedEmployeeId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/employee-history/${selectedEmployeeId}`);
      const data = await response.json();
      setEmployeeHistory(data.history || []);
    } catch (error) {
      console.error('Error fetching employee history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthComparison = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/month-comparison');
      const data = await response.json();
      setMonthComparison(data.comparison || []);
    } catch (error) {
      console.error('Error fetching month comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    if (!selectedMonth) return;
    try {
      const response = await fetch(`/api/reports/charts-data/${selectedYear}/${selectedMonth}`);
      const data = await response.json();
      setChartData(data.chartData || []);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  // Chart configurations
  const getBarChartData = () => {
    if (!chartData.length) return null;

    return {
      labels: chartData.map(d => `${d.name} ${d.surname}`),
      datasets: [
        {
          label: 'Çalışılan Günler',
          data: chartData.map(d => d.days_worked),
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getPieChartData = () => {
    if (!chartData.length) return null;

    const colors = [
      'rgba(102, 126, 234, 0.8)',
      'rgba(118, 75, 162, 0.8)',
      'rgba(237, 100, 166, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 99, 132, 0.8)',
    ];

    return {
      labels: chartData.map(d => `${d.name} ${d.surname}`),
      datasets: [
        {
          label: 'Ödeme Dağılımı',
          data: chartData.map(d => d.payment_amount),
          backgroundColor: colors.slice(0, chartData.length),
          borderColor: colors.slice(0, chartData.length).map(c => c.replace('0.8', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Export functions
  const exportToExcel = () => {
    let dataToExport = [];
    let filename = 'rapor.xlsx';

    if (activeTab === 'department') {
      dataToExport = departmentSummary.map(row => ({
        'Departman': row.department || 'Belirtilmemiş',
        'Çalışan Sayısı': row.employee_count,
        'Toplam Gün': row.total_days,
        'Toplam Ödeme': row.total_payment,
        'Ortalama Ödeme': row.avg_payment?.toFixed(2),
      }));
      filename = `departman_ozeti_${selectedMonth}_${selectedYear}.xlsx`;
    } else if (activeTab === 'payroll') {
      dataToExport = companyPayroll.map(row => ({
        'Yıl': row.year,
        'Ay': row.month,
        'Çalışan Sayısı': row.employee_count,
        'Toplam Gün': row.total_days,
        'Toplam Ödeme': row.total_payment,
        'Ortalama Ödeme': row.avg_payment?.toFixed(2),
      }));
      filename = 'sirket_bordrosu.xlsx';
    } else if (activeTab === 'employee') {
      dataToExport = employeeHistory.map(row => ({
        'Yıl': row.year,
        'Ay': row.month,
        'Çalışılan Gün': row.days_worked,
        'Ödeme': row.payment_amount,
        'Notlar': row.notes || '',
      }));
      filename = `calisan_gecmisi_${selectedEmployeeId}.xlsx`;
    } else if (activeTab === 'comparison') {
      dataToExport = monthComparison.map(row => ({
        'Yıl': row.year,
        'Ay': row.month,
        'Çalışan': `${row.name} ${row.surname}`,
        'Departman': row.department,
        'Çalışılan Gün': row.days_worked,
        'Ödeme': row.payment_amount,
      }));
      filename = 'ay_karsilastirma.xlsx';
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rapor');
    XLSX.writeFile(wb, filename);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let title = 'Rapor';
    let headers = [];
    let data = [];

    // Set font for Turkish characters
    doc.setFont('helvetica');

    if (activeTab === 'department') {
      title = `Departman Özeti - ${selectedMonth} ${selectedYear}`;
      headers = [['Departman', 'Çalışan Sayısı', 'Toplam Gün', 'Toplam Ödeme', 'Ort. Ödeme']];
      data = departmentSummary.map(row => [
        row.department || 'Belirtilmemiş',
        row.employee_count,
        row.total_days,
        `${row.total_payment?.toLocaleString('tr-TR')} TL`,
        `${row.avg_payment?.toFixed(2)} TL`,
      ]);
    } else if (activeTab === 'payroll') {
      title = 'Şirket Bordrosu';
      headers = [['Yıl', 'Ay', 'Çalışan Sayısı', 'Toplam Gün', 'Toplam Ödeme', 'Ort. Ödeme']];
      data = companyPayroll.map(row => [
        row.year,
        row.month,
        row.employee_count,
        row.total_days,
        `${row.total_payment?.toLocaleString('tr-TR')} TL`,
        `${row.avg_payment?.toFixed(2)} TL`,
      ]);
    } else if (activeTab === 'employee') {
      const emp = employees.find(e => e.id == selectedEmployeeId);
      title = `Çalışan Geçmişi - ${emp?.name} ${emp?.surname}`;
      headers = [['Yıl', 'Ay', 'Çalışılan Gün', 'Ödeme', 'Notlar']];
      data = employeeHistory.map(row => [
        row.year,
        row.month,
        row.days_worked,
        `${row.payment_amount?.toLocaleString('tr-TR')} TL`,
        row.notes || '',
      ]);
    } else if (activeTab === 'comparison') {
      title = 'Ay Karşılaştırma';
      headers = [['Yıl', 'Ay', 'Çalışan', 'Departman', 'Gün', 'Ödeme']];
      data = monthComparison.map(row => [
        row.year,
        row.month,
        `${row.name} ${row.surname}`,
        row.department,
        row.days_worked,
        `${row.payment_amount?.toLocaleString('tr-TR')} TL`,
      ]);
    }

    doc.setFontSize(16);
    doc.text(title, 14, 15);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 25,
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 9 },
      headStyles: { fillColor: [102, 126, 234] },
    });

    doc.save(`${title}.pdf`);
  };

  // Render filter controls
  const renderFilters = () => {
    if (activeTab === 'department') {
      return (
        <div className="report-filters">
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="">Ay Seçin</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      );
    } else if (activeTab === 'employee') {
      return (
        <div className="report-filters">
          <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
            <option value="">Çalışan Seçin</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} {emp.surname} - {emp.department}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  // Render content based on active tab
  const renderContent = () => {
    if (loading) {
      return <div className="loading">Yükleniyor...</div>;
    }

    if (activeTab === 'department') {
      return (
        <>
          {!selectedMonth ? (
            <div className="empty-state">Lütfen yukarıdan ay seçin</div>
          ) : departmentSummary.length === 0 ? (
            <div className="empty-state">Bu ay için veri bulunamadı</div>
          ) : (
            <>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Departman</th>
                    <th>Çalışan Sayısı</th>
                    <th>Toplam Gün</th>
                    <th>Toplam Ödeme</th>
                    <th>Ortalama Ödeme</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentSummary.map((row, index) => (
                    <tr key={index}>
                      <td>{row.department || 'Belirtilmemiş'}</td>
                      <td>{row.employee_count}</td>
                      <td>{row.total_days}</td>
                      <td>{row.total_payment?.toLocaleString('tr-TR')} TL</td>
                      <td>{row.avg_payment?.toFixed(2)} TL</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {chartData.length > 0 && (
                <div className="charts-container">
                  <div className="chart-box">
                    <h3>Çalışılan Günler (Çalışan Bazlı)</h3>
                    <div style={{ height: '300px' }}>
                      <Bar data={getBarChartData()} options={chartOptions} />
                    </div>
                  </div>
                  <div className="chart-box">
                    <h3>Ödeme Dağılımı</h3>
                    <div style={{ height: '300px' }}>
                      <Pie data={getPieChartData()} options={chartOptions} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      );
    }

    if (activeTab === 'payroll') {
      return companyPayroll.length === 0 ? (
        <div className="empty-state">Veri bulunamadı</div>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>Yıl</th>
              <th>Ay</th>
              <th>Çalışan Sayısı</th>
              <th>Toplam Gün</th>
              <th>Toplam Ödeme</th>
              <th>Ortalama Ödeme</th>
            </tr>
          </thead>
          <tbody>
            {companyPayroll.map((row, index) => (
              <tr key={index}>
                <td>{row.year}</td>
                <td>{row.month}</td>
                <td>{row.employee_count}</td>
                <td>{row.total_days}</td>
                <td>{row.total_payment?.toLocaleString('tr-TR')} TL</td>
                <td>{row.avg_payment?.toFixed(2)} TL</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === 'employee') {
      if (!selectedEmployeeId) {
        return <div className="empty-state">Lütfen yukarıdan çalışan seçin</div>;
      }

      const emp = employees.find(e => e.id == selectedEmployeeId);
      const totalDays = employeeHistory.reduce((sum, row) => sum + row.days_worked, 0);
      const totalPayment = employeeHistory.reduce((sum, row) => sum + row.payment_amount, 0);

      return employeeHistory.length === 0 ? (
        <div className="empty-state">Bu çalışan için veri bulunamadı</div>
      ) : (
        <>
          <div className="employee-info">
            <h3>{emp?.name} {emp?.surname}</h3>
            <p>Pozisyon: {emp?.position} | Departman: {emp?.department}</p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Toplam Çalışılan Gün</div>
              <div className="stat-value">{totalDays}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Toplam Ödeme</div>
              <div className="stat-value">{totalPayment.toLocaleString('tr-TR')} TL</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Ortalama Günlük</div>
              <div className="stat-value">{totalDays > 0 ? (totalPayment / totalDays).toFixed(2) : 0} TL</div>
            </div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Yıl</th>
                <th>Ay</th>
                <th>Çalışılan Gün</th>
                <th>Ödeme</th>
                <th>Notlar</th>
              </tr>
            </thead>
            <tbody>
              {employeeHistory.map((row, index) => (
                <tr key={index}>
                  <td>{row.year}</td>
                  <td>{row.month}</td>
                  <td>{row.days_worked}</td>
                  <td>{row.payment_amount?.toLocaleString('tr-TR')} TL</td>
                  <td>{row.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    }

    if (activeTab === 'comparison') {
      if (monthComparison.length === 0) {
        return <div className="empty-state">Veri bulunamadı</div>;
      }

      // Group by month and year
      const groupedData = monthComparison.reduce((acc, row) => {
        const key = `${row.year}-${row.month}`;
        if (!acc[key]) {
          acc[key] = {
            year: row.year,
            month: row.month,
            employees: [],
            totalDays: 0,
            totalPayment: 0,
          };
        }
        acc[key].employees.push(row);
        acc[key].totalDays += row.days_worked;
        acc[key].totalPayment += row.payment_amount;
        return acc;
      }, {});

      return (
        <div className="comparison-container">
          {Object.values(groupedData).map((group, index) => (
            <div key={index} className="month-group">
              <h3>{group.month} {group.year}</h3>
              <div className="month-summary">
                <span>Toplam Gün: <strong>{group.totalDays}</strong></span>
                <span>Toplam Ödeme: <strong>{group.totalPayment.toLocaleString('tr-TR')} TL</strong></span>
                <span>Çalışan Sayısı: <strong>{group.employees.length}</strong></span>
              </div>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Çalışan</th>
                    <th>Departman</th>
                    <th>Çalışılan Gün</th>
                    <th>Ödeme</th>
                  </tr>
                </thead>
                <tbody>
                  {group.employees.map((emp, empIndex) => (
                    <tr key={empIndex}>
                      <td>{emp.name} {emp.surname}</td>
                      <td>{emp.department}</td>
                      <td>{emp.days_worked}</td>
                      <td>{emp.payment_amount?.toLocaleString('tr-TR')} TL</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Raporlar ve Analizler</h2>
        <div className="export-buttons">
          <button onClick={exportToExcel} className="export-btn excel-btn">
            Excel İndir
          </button>
          <button onClick={exportToPDF} className="export-btn pdf-btn">
            PDF İndir
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'department' ? 'active' : ''}`}
          onClick={() => setActiveTab('department')}
        >
          Departman Özeti
        </button>
        <button
          className={`tab ${activeTab === 'payroll' ? 'active' : ''}`}
          onClick={() => setActiveTab('payroll')}
        >
          Şirket Bordrosu
        </button>
        <button
          className={`tab ${activeTab === 'employee' ? 'active' : ''}`}
          onClick={() => setActiveTab('employee')}
        >
          Çalışan Geçmişi
        </button>
        <button
          className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          Ay Karşılaştırma
        </button>
      </div>

      {renderFilters()}

      <div className="report-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Reports;
