# 💻 Ejemplos de Código - Sistema de Inventario Escolar

Este archivo contiene ejemplos de código específicos para implementar las funcionalidades principales del sistema.

## 🔐 Autenticación

### AuthContext.jsx - Implementación Completa
```jsx
import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState([])
  const navigate = useNavigate()

  // Cargar datos iniciales
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedHistory = localStorage.getItem('loanHistory')
    
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
    
    setLoading(false)
  }, [])

  // Función de login
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || []
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('user', JSON.stringify(foundUser))
      return true
    }
    return false
  }

  // Función de registro
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || []
    
    // Verificar email duplicado
    const userExists = users.some(u => u.email === userData.email)
    if (userExists) {
      return { success: false, message: 'El correo ya está registrado' }
    }

    users.push(userData)
    localStorage.setItem('users', JSON.stringify(users))
    return { success: true }
  }

  // Función de logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Agregar al historial
  const addToHistory = (action, item, previousStatus = null) => {
    if (!user) return

    const newEntry = {
      id: Date.now(),
      userId: user.email,
      userName: user.name,
      userRole: user.role,
      action,
      itemId: item.id,
      itemName: item.name,
      itemCode: item.code,
      date: new Date().toISOString(),
      previousStatus: previousStatus || item.status,
      newStatus: action === 'prestamo' ? 'prestado' :
                action === 'devolucion' ? 'disponible' :
                action === 'eliminado' ? 'eliminado' : item.status
    }

    const updatedHistory = [newEntry, ...history]
    setHistory(updatedHistory)
    localStorage.setItem('loanHistory', JSON.stringify(updatedHistory))
  }

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    loading,
    history,
    addToHistory,
    isEmailRegistered: (email) => {
      const users = JSON.parse(localStorage.getItem('users')) || []
      return users.some(u => u.email === email)
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Login.jsx - Formulario de Autenticación
```jsx
import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Auth.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isEmailRegistered } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!isEmailRegistered(email)) {
      setError('El correo no está registrado')
      return
    }
    
    if (login(email, password)) {
      navigate('/')
    } else {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Iniciar Sesión</h1>
          <p>Ingrese sus credenciales para acceder al sistema</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            Iniciar Sesión
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/register" className="auth-link">Registrarse</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
```

## 📦 Gestión de Inventario

### Inventory.jsx - CRUD de Inventario
```jsx
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import ActionButton from '../components/ActionButton'
import Modal from '../components/Modal'

const Inventory = () => {
  const { user, addToHistory } = useContext(AuthContext)
  const [inventory, setInventory] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    description: '',
    status: 'disponible'
  })

  // Cargar inventario
  useEffect(() => {
    const storedInventory = JSON.parse(localStorage.getItem('inventory')) || []
    setInventory(storedInventory)
  }, [])

  // Guardar inventario
  const saveInventory = (newInventory) => {
    setInventory(newInventory)
    localStorage.setItem('inventory', JSON.stringify(newInventory))
  }

  // Agregar/Editar item
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingItem) {
      // Editar item existente
      const updatedInventory = inventory.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : item
      )
      saveInventory(updatedInventory)
      addToHistory('edicion', { ...editingItem, ...formData })
    } else {
      // Agregar nuevo item
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      }
      const updatedInventory = [...inventory, newItem]
      saveInventory(updatedInventory)
      addToHistory('creacion', newItem)
    }
    
    resetForm()
  }

  // Eliminar item
  const handleDelete = (item) => {
    if (window.confirm(`¿Está seguro de eliminar "${item.name}"?`)) {
      const updatedInventory = inventory.map(i =>
        i.id === item.id ? { ...i, status: 'eliminado' } : i
      )
      saveInventory(updatedInventory)
      addToHistory('eliminado', item)
    }
  }

  // Cambiar estado
  const handleStatusChange = (item, newStatus) => {
    const previousStatus = item.status
    const updatedInventory = inventory.map(i =>
      i.id === item.id ? { ...i, status: newStatus } : i
    )
    saveInventory(updatedInventory)
    addToHistory('cambio_estado', { ...item, status: newStatus }, previousStatus)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      category: '',
      description: '',
      status: 'disponible'
    })
    setEditingItem(null)
    setShowModal(false)
  }

  const openEditModal = (item) => {
    setFormData({
      name: item.name,
      code: item.code,
      category: item.category,
      description: item.description,
      status: item.status
    })
    setEditingItem(item)
    setShowModal(true)
  }

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Gestión de Inventario</h1>
        {user?.role === 'coordinador' && (
          <ActionButton
            onClick={() => setShowModal(true)}
            variant="primary"
          >
            Agregar Elemento
          </ActionButton>
        )}
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Descripción</th>
              {user?.role === 'coordinador' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {inventory
              .filter(item => item.status !== 'eliminado')
              .map(item => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    {user?.role === 'coordinador' ? (
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item, e.target.value)}
                        className="status-select"
                      >
                        <option value="disponible">Disponible</option>
                        <option value="prestado">Prestado</option>
                        <option value="en_mantenimiento">En Mantenimiento</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${item.status}`}>
                        {item.status === 'disponible' ? 'Disponible' :
                         item.status === 'prestado' ? 'Prestado' :
                         item.status === 'en_mantenimiento' ? 'En Mantenimiento' : item.status}
                      </span>
                    )}
                  </td>
                  <td>{item.description}</td>
                  {user?.role === 'coordinador' && (
                    <td>
                      <div className="action-buttons">
                        <ActionButton
                          onClick={() => openEditModal(item)}
                          variant="primary"
                          size="small"
                        >
                          Editar
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDelete(item)}
                          variant="danger"
                          size="small"
                        >
                          Eliminar
                        </ActionButton>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar/editar */}
      <Modal
        show={showModal}
        onClose={resetForm}
        title={editingItem ? 'Editar Elemento' : 'Agregar Elemento'}
      >
        <form onSubmit={handleSubmit} className="inventory-form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Código</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              <option value="">Seleccionar categoría</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Mobiliario">Mobiliario</option>
              <option value="Material Didáctico">Material Didáctico</option>
              <option value="Deportes">Deportes</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
          </div>
          
          <div className="modal-actions">
            <ActionButton type="button" onClick={resetForm} variant="secondary">
              Cancelar
            </ActionButton>
            <ActionButton type="submit" variant="primary">
              {editingItem ? 'Actualizar' : 'Agregar'}
            </ActionButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Inventory
```

## 📋 Sistema de Solicitudes

### RequestLoan.jsx - Solicitar Préstamo
```jsx
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import ActionButton from '../components/ActionButton'

const RequestLoan = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [inventory, setInventory] = useState([])
  const [formData, setFormData] = useState({
    itemId: '',
    startDate: '',
    endDate: '',
    purpose: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const storedInventory = JSON.parse(localStorage.getItem('inventory')) || []
    const availableItems = storedInventory.filter(item => item.status === 'disponible')
    setInventory(availableItems)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones
    if (new Date(formData.startDate) < new Date()) {
      setError('La fecha de inicio no puede ser anterior a hoy')
      return
    }
    
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio')
      return
    }

    // Crear solicitud
    const selectedItem = inventory.find(item => item.id === formData.itemId)
    const newRequest = {
      id: Date.now().toString(),
      userId: user.email,
      userName: user.name,
      itemId: formData.itemId,
      itemName: selectedItem.name,
      itemCode: selectedItem.code,
      requestDate: new Date().toISOString(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      purpose: formData.purpose,
      status: 'pendiente'
    }

    // Guardar solicitud
    const loanRequests = JSON.parse(localStorage.getItem('loanRequests')) || []
    loanRequests.push(newRequest)
    localStorage.setItem('loanRequests', JSON.stringify(loanRequests))

    alert('Solicitud enviada exitosamente')
    navigate('/my-loan-requests')
  }

  return (
    <div className="request-loan-container">
      <h1>Solicitar Préstamo</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label>Elemento a solicitar</label>
          <select
            value={formData.itemId}
            onChange={(e) => setFormData({...formData, itemId: e.target.value})}
            required
          >
            <option value="">Seleccionar elemento</option>
            {inventory.map(item => (
              <option key={item.id} value={item.id}>
                {item.code} - {item.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Fecha de inicio</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Fecha de fin</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              min={formData.startDate}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Propósito del préstamo</label>
          <textarea
            value={formData.purpose}
            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            placeholder="Describa para qué necesita el elemento"
            rows="4"
            required
          />
        </div>
        
        <div className="form-actions">
          <ActionButton
            type="button"
            onClick={() => navigate('/inventory')}
            variant="secondary"
          >
            Cancelar
          </ActionButton>
          <ActionButton type="submit" variant="primary">
            Enviar Solicitud
          </ActionButton>
        </div>
      </form>
    </div>
  )
}

export default RequestLoan
```

## 📄 Generación de PDF

### PDF Generator - Comprobantes
```jsx
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const generateLoanReceipt = (loanData) => {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text('COMPROBANTE DE PRÉSTAMO', 20, 30)
  
  // Línea separadora
  doc.setLineWidth(0.5)
  doc.line(20, 35, 190, 35)
  
  // Información del préstamo
  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)
  
  const loanInfo = [
    ['Código del Elemento:', loanData.itemCode],
    ['Nombre del Elemento:', loanData.itemName],
    ['Solicitante:', loanData.userName],
    ['Fecha de Préstamo:', new Date(loanData.startDate).toLocaleDateString('es-ES')],
    ['Fecha de Devolución:', new Date(loanData.endDate).toLocaleDateString('es-ES')],
    ['Propósito:', loanData.purpose],
    ['Estado:', loanData.status],
    ['Aprobado por:', loanData.approvedBy || 'N/A']
  ]
  
  // Tabla con información
  doc.autoTable({
    startY: 45,
    body: loanInfo,
    theme: 'plain',
    styles: {
      fontSize: 11,
      cellPadding: 3
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 120 }
    }
  })
  
  // Footer
  const finalY = doc.lastAutoTable.finalY + 20
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Generado el: ' + new Date().toLocaleString('es-ES'), 20, finalY)
  doc.text('Sistema de Inventario Escolar', 20, finalY + 10)
  
  // Descargar
  doc.save(`comprobante-${loanData.itemCode}-${Date.now()}.pdf`)
}

export const generateInventoryReport = (inventory) => {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(18)
  doc.text('REPORTE DE INVENTARIO', 20, 30)
  
  // Estadísticas
  const stats = {
    total: inventory.length,
    disponible: inventory.filter(i => i.status === 'disponible').length,
    prestado: inventory.filter(i => i.status === 'prestado').length,
    mantenimiento: inventory.filter(i => i.status === 'en_mantenimiento').length
  }
  
  doc.setFontSize(12)
  doc.text(`Total de elementos: ${stats.total}`, 20, 50)
  doc.text(`Disponibles: ${stats.disponible}`, 20, 60)
  doc.text(`Prestados: ${stats.prestado}`, 20, 70)
  doc.text(`En mantenimiento: ${stats.mantenimiento}`, 20, 80)
  
  // Tabla de inventario
  const tableData = inventory.map(item => [
    item.code,
    item.name,
    item.category,
    item.status,
    item.description
  ])
  
  doc.autoTable({
    startY: 90,
    head: [['Código', 'Nombre', 'Categoría', 'Estado', 'Descripción']],
    body: tableData,
    theme: 'striped',
    styles: {
      fontSize: 9,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 50 }
    }
  })
  
  doc.save(`inventario-${new Date().toISOString().split('T')[0]}.pdf`)
}
```

## 🎨 Componentes Reutilizables

### ActionButton.jsx - Botón Personalizado
```jsx
import React from 'react'
import './ActionButton.css'

const ActionButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const baseClass = 'action-btn'
  const variantClass = `action-btn-${variant}`
  const sizeClass = `action-btn-${size}`
  const disabledClass = disabled ? 'action-btn-disabled' : ''
  
  const buttonClass = [
    baseClass,
    variantClass,
    sizeClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default ActionButton
```

### Modal.jsx - Modal Reutilizable
```jsx
import React, { useEffect } from 'react'
import './Modal.css'

const Modal = ({ show, onClose, title, children, size = 'medium' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (show) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
```

## 🔧 Utilidades

### Utils.js - Funciones Auxiliares
```javascript
// Generar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Formatear fecha
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Calcular días entre fechas
export const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000
  const firstDate = new Date(date1)
  const secondDate = new Date(date2)
  
  return Math.round(Math.abs((firstDate - secondDate) / oneDay))
}

// Verificar si una fecha está vencida
export const isOverdue = (endDate) => {
  return new Date(endDate) < new Date()
}

// Obtener estadísticas del sistema
export const getSystemStats = () => {
  const inventory = JSON.parse(localStorage.getItem('inventory')) || []
  const loans = JSON.parse(localStorage.getItem('loans')) || []
  const loanRequests = JSON.parse(localStorage.getItem('loanRequests')) || []
  const users = JSON.parse(localStorage.getItem('users')) || []
  
  return {
    totalItems: inventory.filter(i => i.status !== 'eliminado').length,
    availableItems: inventory.filter(i => i.status === 'disponible').length,
    loanedItems: inventory.filter(i => i.status === 'prestado').length,
    maintenanceItems: inventory.filter(i => i.status === 'en_mantenimiento').length,
    activeLoans: loans.filter(l => l.status === 'activo').length,
    overdueLoans: loans.filter(l => l.status === 'activo' && isOverdue(l.endDate)).length,
    pendingRequests: loanRequests.filter(r => r.status === 'pendiente').length,
    totalUsers: users.length,
    coordinators: users.filter(u => u.role === 'coordinador').length,
    teachers: users.filter(u => u.role === 'docente').length
  }
}

// Limpiar datos de localStorage
export const clearAllData = () => {
  const keys = ['users', 'inventory', 'loans', 'loanRequests', 'loanHistory', 'user']
  keys.forEach(key => localStorage.removeItem(key))
}

// Exportar datos para backup
export const exportData = () => {
  const data = {
    users: JSON.parse(localStorage.getItem('users')) || [],
    inventory: JSON.parse(localStorage.getItem('inventory')) || [],
    loans: JSON.parse(localStorage.getItem('loans')) || [],
    loanRequests: JSON.parse(localStorage.getItem('loanRequests')) || [],
    loanHistory: JSON.parse(localStorage.getItem('loanHistory')) || [],
    exportDate: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `backup-inventario-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  
  URL.revokeObjectURL(url)
}

// Importar datos desde backup
export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // Validar estructura de datos
        const requiredKeys = ['users', 'inventory', 'loans', 'loanRequests', 'loanHistory']
        const hasAllKeys = requiredKeys.every(key => data.hasOwnProperty(key))
        
        if (!hasAllKeys) {
          reject(new Error('Archivo de backup inválido'))
          return
        }
        
        // Restaurar datos
        Object.keys(data).forEach(key => {
          if (key !== 'exportDate') {
            localStorage.setItem(key, JSON.stringify(data[key]))
          }
        })
        
        resolve(data)
      } catch (error) {
        reject(new Error('Error al procesar el archivo'))
      }
    }
    
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsText(file)
  })
}
```

Estos ejemplos de código proporcionan una base sólida para implementar todas las funcionalidades del sistema de inventario escolar. Cada componente está diseñado para ser reutilizable y fácil de mantener.