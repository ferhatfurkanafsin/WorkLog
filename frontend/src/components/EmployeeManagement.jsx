import { useState, useEffect } from 'react';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    hireDate: '',
    department: '',
    phone: '',
    baseSalary: '',
    isActive: true
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  // Load employees from localStorage on mount
  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  // Save employees to localStorage whenever the list changes
  useEffect(() => {
    if (employees.length > 0 || localStorage.getItem('employees')) {
      localStorage.setItem('employees', JSON.stringify(employees));
    }
  }, [employees]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.position) {
      setMessage({ text: 'Ad ve pozisyon alanları zorunludur!', type: 'error' });
      return;
    }

    if (editingId) {
      // Update existing employee
      setEmployees(prev => prev.map(emp =>
        emp.id === editingId ? { ...formData, id: editingId } : emp
      ));
      setMessage({ text: 'Çalışan başarıyla güncellendi!', type: 'success' });
    } else {
      // Add new employee
      const newEmployee = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setEmployees(prev => [...prev, newEmployee]);
      setMessage({ text: 'Çalışan başarıyla eklendi!', type: 'success' });
    }

    // Reset form
    resetForm();
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      hireDate: '',
      department: '',
      phone: '',
      baseSalary: '',
      isActive: true
    });
    setEditingId(null);
    setIsFormVisible(false);
  };

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      position: employee.position,
      hireDate: employee.hireDate,
      department: employee.department,
      phone: employee.phone,
      baseSalary: employee.baseSalary,
      isActive: employee.isActive
    });
    setEditingId(employee.id);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu çalışanı silmek istediğinizden emin misiniz?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      setMessage({ text: 'Çalışan silindi!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const toggleActive = (id) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === id ? { ...emp, isActive: !emp.isActive } : emp
    ));
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.department && emp.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <div className="employee-management">
      <div className="management-header">
        <h2>Çalışan Yönetimi</h2>
        <button
          className="btn-add-employee"
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            if (!isFormVisible) resetForm();
          }}
        >
          {isFormVisible ? 'İptal' : '+ Yeni Çalışan Ekle'}
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {isFormVisible && (
        <div className="employee-form-container">
          <h3>{editingId ? 'Çalışan Düzenle' : 'Yeni Çalışan Ekle'}</h3>
          <form onSubmit={handleSubmit} className="employee-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Ad Soyad *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Örn: Ahmet Yılmaz"
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Pozisyon *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  placeholder="Örn: Yazılım Geliştirici"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Departman</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Örn: Yazılım"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hireDate">İşe Başlama Tarihi</label>
                <input
                  type="date"
                  id="hireDate"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Telefon</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Örn: 0555 123 45 67"
                />
              </div>

              <div className="form-group">
                <label htmlFor="baseSalary">2025 Yılı Revize Maaşı (₺)</label>
                <input
                  type="number"
                  id="baseSalary"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleInputChange}
                  placeholder="Örn: 25000"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <span>Aktif Çalışan</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Güncelle' : 'Kaydet'}
              </button>
              <button type="button" onClick={resetForm} className="btn-cancel">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="employee-search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Çalışan ara (ad, pozisyon veya departmana göre)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="employee-count">
          Toplam {filteredEmployees.length} çalışan bulundu
        </div>
      </div>

      <div className="employees-list">
        {filteredEmployees.length === 0 ? (
          <div className="no-employees">
            {searchTerm ? 'Arama kriterlerine uygun çalışan bulunamadı.' : 'Henüz çalışan eklenmemiş.'}
          </div>
        ) : (
          <div className="employees-grid">
            {filteredEmployees.map(employee => (
              <div
                key={employee.id}
                className={`employee-card ${!employee.isActive ? 'inactive' : ''}`}
              >
                <div className="employee-header">
                  <div>
                    <h3>{employee.name}</h3>
                    <p className="employee-position">{employee.position}</p>
                  </div>
                  <div className="status-badge">
                    <span className={`badge ${employee.isActive ? 'active' : 'inactive'}`}>
                      {employee.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                </div>

                <div className="employee-details">
                  {employee.department && (
                    <div className="detail-item">
                      <span className="detail-label">Departman:</span>
                      <span className="detail-value">{employee.department}</span>
                    </div>
                  )}

                  {employee.hireDate && (
                    <div className="detail-item">
                      <span className="detail-label">İşe Başlama:</span>
                      <span className="detail-value">{formatDate(employee.hireDate)}</span>
                    </div>
                  )}

                  {employee.phone && (
                    <div className="detail-item">
                      <span className="detail-label">Telefon:</span>
                      <span className="detail-value">{employee.phone}</span>
                    </div>
                  )}

                  {employee.baseSalary && (
                    <div className="detail-item salary">
                      <span className="detail-label">2025 Revize Maaşı:</span>
                      <span className="detail-value">{formatCurrency(employee.baseSalary)}</span>
                    </div>
                  )}
                </div>

                <div className="employee-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(employee)}
                  >
                    Düzenle
                  </button>
                  <button
                    className={`btn-toggle ${employee.isActive ? 'deactivate' : 'activate'}`}
                    onClick={() => toggleActive(employee.id)}
                  >
                    {employee.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
