import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || ''

const emptyForm = {
  employeeId: '',
  fullName: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  salary: '',
  hireDate: ''
}

export default function App() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function request(path, options = {}) {
    const response = await fetch(`${API}/api/employees${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.message || data.error || 'Có lỗi xảy ra')
    return data
  }

  async function loadEmployees(keyword = search) {
    setLoading(true)
    setError('')
    try {
      const data = await request(`?search=${encodeURIComponent(keyword)}`)
      setEmployees(Array.isArray(data) ? data : data.employees || [])
    } catch (err) {
      setError(`Không tải được nhân viên: ${err.message}. Kiểm tra API backend.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees('')
  }, [])

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
    setNotice('')
  }

  function openEdit(employee) {
    setEditing(employee)
    setForm({
      employeeId: employee.employeeId || '',
      fullName: employee.fullName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department || '',
      position: employee.position || '',
      salary: employee.salary ?? '',
      hireDate: employee.hireDate ? String(employee.hireDate).slice(0, 10) : ''
    })
    setShowForm(true)
    setNotice('')
  }

  async function saveEmployee(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    try {
      const payload = {
        ...form,
        salary: form.salary === '' ? undefined : Number(form.salary)
      }
      if (editing) {
        await request(`/${encodeURIComponent(editing._id || editing.employeeId)}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        })
        setNotice('Cập nhật nhân viên thành công!')
      } else {
        await request('', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
        setNotice('Thêm nhân viên thành công!')
      }
      setShowForm(false)
      setForm(emptyForm)
      await loadEmployees()
    } catch (err) {
      setError(`Không lưu được: ${err.message}`)
    }
  }

  async function deleteEmployee(employee) {
    const name = employee.fullName || employee.employeeId
    if (!window.confirm(`Bạn có chắc muốn xóa nhân viên "${name}"?`)) return
    setError('')
    setNotice('')
    try {
      await request(`/${encodeURIComponent(employee._id || employee.employeeId)}`, {
        method: 'DELETE'
      })
      setNotice('Đã xóa nhân viên.')
      await loadEmployees()
    } catch (err) {
      setError(`Không xóa được: ${err.message}`)
    }
  }

  const money = value =>
    value == null || value === '' ? '—' :
    Number(value).toLocaleString('vi-VN') + ' ₫'

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon">N</span><span>Nhân Sự<span className="brand-sub">HR MANAGEMENT</span></span></div>
        <div className="side-label">MENU CHÍNH</div>
        <div className="nav-item active"><span>▦</span> Tổng quan nhân sự</div>
        <div className="nav-item"><span>♙</span> Nhân viên</div>
        <div className="nav-item"><span>▤</span> Phòng ban</div>
        <div className="side-bottom"><div className="avatar">AD</div><div><strong>Quản trị viên</strong><small>Hệ thống HR</small></div></div>
      </aside>

      <main className="main">
        <header className="topbar"><div><span className="breadcrumb">Trang chủ</span><span className="slash">/</span> Nhân viên</div><div className="top-right"><span className="status-dot"></span> Hệ thống trực tuyến</div></header>
        <section className="content">
          <div className="page-heading"><div><div className="eyebrow">QUẢN LÝ NGUỒN NHÂN LỰC</div><h1>Danh sách nhân viên</h1><p>Quản lý thông tin và hồ sơ nhân sự của doanh nghiệp.</p></div><button className="primary-btn" onClick={openAdd}>＋ Thêm nhân viên</button></div>

          <div className="stats">
            <div className="stat-card"><div className="stat-top"><span>Tổng nhân viên</span><span className="stat-icon blue">♙</span></div><div className="stat-number">{employees.length}</div><div className="stat-note">Nhân viên trong danh sách</div></div>
            <div className="stat-card"><div className="stat-top"><span>Phòng ban</span><span className="stat-icon purple">▦</span></div><div className="stat-number">{new Set(employees.map(e => e.department).filter(Boolean)).size}</div><div className="stat-note">Phòng ban có nhân sự</div></div>
            <div className="stat-card"><div className="stat-top"><span>Đang hiển thị</span><span className="stat-icon green">✓</span></div><div className="stat-number">{employees.length}</div><div className="stat-note">Hồ sơ đã tải từ hệ thống</div></div>
          </div>

          {notice && <div className="alert success">{notice}<button onClick={() => setNotice('')}>×</button></div>}
          {error && <div className="alert error">{error}</div>}

          <section className="table-card">
            <div className="table-heading"><div><h2>Hồ sơ nhân sự</h2><p>Danh sách dữ liệu nhân viên trong hệ thống</p></div><span className="count-pill">{employees.length} nhân viên</span></div>
            <form className="search-bar" onSubmit={e => { e.preventDefault(); loadEmployees(search) }}>
              <span className="search-icon">⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo mã, họ tên, email hoặc phòng ban..." /><button type="submit" className="search-btn">Tìm kiếm</button><button type="button" className="reset-btn" onClick={() => { setSearch(''); loadEmployees('') }}>Đặt lại</button>
            </form>
            <div className="table-wrap"><table><thead><tr><th>MÃ NV</th><th>NHÂN VIÊN</th><th>PHÒNG BAN</th><th>CHỨC VỤ</th><th>EMAIL</th><th>LƯƠNG</th><th>THAO TÁC</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="7" className="empty">Đang tải dữ liệu...</td></tr> :
                employees.length === 0 ? <tr><td colSpan="7" className="empty">Không tìm thấy nhân viên nào.</td></tr> :
                employees.map((employee, index) => <tr key={employee._id || employee.employeeId || index}>
                  <td><span className="employee-code">{employee.employeeId || '—'}</span></td>
                  <td><div className="person"><div className={`person-avatar avatar-${index % 5}`}>{(employee.fullName || '?').trim().split(/\s+/).slice(-1)[0].charAt(0).toUpperCase()}</div><div><strong>{employee.fullName || 'Chưa cập nhật'}</strong><small>{employee.phone || 'Chưa có số điện thoại'}</small></div></div></td>
                  <td><span className="department">{employee.department || 'Chưa phân công'}</span></td><td>{employee.position || '—'}</td><td className="email">{employee.email || '—'}</td><td>{money(employee.salary)}</td>
                  <td><div className="actions"><button title="Sửa" className="edit-btn" onClick={() => openEdit(employee)}>Sửa</button><button title="Xóa" className="delete-btn" onClick={() => deleteEmployee(employee)}>Xóa</button></div></td>
                </tr>)}
              </tbody></table></div>
            <div className="table-footer">Đang hiển thị <strong>{employees.length}</strong> hồ sơ nhân viên <button onClick={() => loadEmployees()}>↻ Làm mới</button></div>
          </section>

          {showForm && <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}><section className="modal"><div className="modal-heading"><div><h2>{editing ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h2><p>Nhập thông tin hồ sơ nhân viên bên dưới.</p></div><button className="close-btn" onClick={() => setShowForm(false)}>×</button></div>
            <form onSubmit={saveEmployee}><div className="form-grid">
              <label>Mã nhân viên *<input required value={form.employeeId} onChange={e => setForm({...form, employeeId:e.target.value})} disabled={Boolean(editing)} placeholder="VD: NV004" /></label>
              <label>Họ và tên *<input required value={form.fullName} onChange={e => setForm({...form, fullName:e.target.value})} placeholder="Nguyễn Văn A" /></label>
              <label>Email *<input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="email@congty.com" /></label>
              <label>Số điện thoại<input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="09xxxxxxxx" /></label>
              <label>Phòng ban<input value={form.department} onChange={e => setForm({...form, department:e.target.value})} placeholder="Công nghệ thông tin" /></label>
              <label>Chức vụ<input value={form.position} onChange={e => setForm({...form, position:e.target.value})} placeholder="Nhân viên" /></label>
              <label>Lương (VNĐ)<input type="number" min="0" value={form.salary} onChange={e => setForm({...form, salary:e.target.value})} placeholder="10000000" /></label>
              <label>Ngày vào làm<input type="date" value={form.hireDate} onChange={e => setForm({...form, hireDate:e.target.value})} /></label>
            </div><div className="modal-actions"><button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Hủy</button><button type="submit" className="primary-btn">{editing ? 'Lưu thay đổi' : '＋ Thêm nhân viên'}</button></div></form>
          </section></div>}
          <footer>© 2026 HR Management System <span>•</span> Quản lý nhân sự thông minh</footer>
        </section>
      </main>
    </div>
  )
}
