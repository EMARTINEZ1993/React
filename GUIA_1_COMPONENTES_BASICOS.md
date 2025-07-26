# <span style="background-color: #e3f2fd; padding: 4px 8px; border-radius: 4px; color: #1976d2;">GUÍA 1</span> Sistema de Inventario Escolar
## Creación de Componentes Básicos y Configuración de Rutas

### <span style="background-color: #f3e5f5; padding: 4px 8px; border-radius: 4px; color: #7b1fa2;">OBJETIVOS</span> Objetivos de Aprendizaje
Al completar esta guía, los estudiantes serán capaces de:
- Crear la estructura básica de un proyecto React con Vite
- Implementar componentes de autenticación (Login, Register)
- Crear un dashboard principal con navegación
- Configurar rutas con React Router
- Aplicar estilos CSS modernos y responsive

---

## <span style="background-color: #fff3e0; padding: 4px 8px; border-radius: 4px; color: #f57c00;">PRERREQUISITOS</span> Prerrequisitos

### Conocimientos Necesarios
- HTML, CSS y JavaScript básico
- Conceptos básicos de React (componentes, props, state)
- Uso básico de la terminal/línea de comandos

### Herramientas Requeridas
- Node.js (versión 16 o superior)
- Editor de código (VS Code recomendado)
- Git (opcional pero recomendado)

---

## <span style="background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; color: #2e7d32;">PASO 1</span> Configuración Inicial del Proyecto

### 1.1 Crear el Proyecto
```bash
# Crear proyecto con Vite
npm create vite@latest inventario-escolar -- --template react

# Navegar al directorio
cd inventario-escolar

# Instalar dependencias
npm install

# Instalar dependencias adicionales
npm install react-router-dom bootstrap react-bootstrap @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
```

### 1.2 Estructura de Carpetas
Crear la siguiente estructura en `src/`:
```
src/
├── components/
│   ├── Layout.jsx
│   ├── Header.jsx
│   ├── NavBar.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── styles/
│   ├── Auth.css
│   ├── Home.css
│   └── Dashboard.css
├── context/
│   └── AuthContext.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## <span style="background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; color: #2e7d32;">PASO 2</span> Configuración de Estilos Globales

### 2.1 Actualizar index.css
```css
/* src/index.css */
:root {
  /* Colores principales */
  --primary-color: #2563eb;
  --primary-light: #dbeafe;
  --primary-dark: #1d4ed8;
  
  /* Colores secundarios */
  --secondary-color: #64748b;
  --success-color: #059669;
  --warning-color: #d97706;
  --danger-color: #dc2626;
  --info-color: #0891b2;
  
  /* Colores de fondo */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-dark: #1e293b;
  
  /* Colores de texto */
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-light: #94a3b8;
  
  /* Espaciado */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  
  /* Bordes */
  --border-radius: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 0.75rem;
  
  /* Sombras */
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* Transiciones */
  --transition: all 0.2s ease-in-out;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

/* Utilidades */
.text-center { text-align: center; }
.text-primary { color: var(--primary-color); }
.text-secondary { color: var(--text-secondary); }
.text-success { color: var(--success-color); }
.text-danger { color: var(--danger-color); }

.bg-primary { background-color: var(--primary-color); }
.bg-white { background-color: var(--bg-primary); }

.mb-1 { margin-bottom: var(--spacing-1); }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-3 { margin-bottom: var(--spacing-3); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-6 { margin-bottom: var(--spacing-6); }

.mt-1 { margin-top: var(--spacing-1); }
.mt-2 { margin-top: var(--spacing-2); }
.mt-3 { margin-top: var(--spacing-3); }
.mt-4 { margin-top: var(--spacing-4); }
.mt-6 { margin-top: var(--spacing-6); }

.p-2 { padding: var(--spacing-2); }
.p-3 { padding: var(--spacing-3); }
.p-4 { padding: var(--spacing-4); }
.p-6 { padding: var(--spacing-6); }

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-3);
  }
}
```

---

## <span style="background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; color: #2e7d32;">PASO 3</span> Crear Componentes de Layout

### 3.1 Header Component
```jsx
// src/components/Header.jsx
import React from 'react'

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1><span style="background-color: #e3f2fd; padding: 4px 8px; border-radius: 4px; color: #1976d2;">INVENTARIO</span> Escolar</h1>
          </div>
          
          {user && (
            <div className="user-info">
              <span className="welcome-text">
                Bienvenido, {user.name}
              </span>
              <button 
                className="logout-btn"
                onClick={onLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
```

### 3.2 NavBar Component
```jsx
// src/components/NavBar.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavBar = ({ user }) => {
  const location = useLocation()
  
  if (!user) return null

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '■' },
    { path: '/inventory', label: 'Inventario', icon: '▣' },
    { path: '/loans', label: 'Préstamos', icon: '▤' },
    { path: '/profile', label: 'Perfil', icon: '●' }
  ]

  // Agregar items específicos para coordinador
  if (user.role === 'coordinador') {
    navItems.splice(3, 0, 
      { path: '/loan-requests', label: 'Solicitudes', icon: '▦' },
      { path: '/users', label: 'Usuarios', icon: '◉' }
    )
  }

  return (
    <nav className="navbar">
      <div className="container">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
```

### 3.3 Footer Component
```jsx
// src/components/Footer.jsx
import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; 2024 Sistema de Inventario Escolar</p>
          <p>Desarrollado por <strong>Luz Eliana Martinez Ramos</strong></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
```

### 3.4 Layout Component
```jsx
// src/components/Layout.jsx
import React from 'react'
import Header from './Header'
import NavBar from './NavBar'
import Footer from './Footer'

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="app-layout">
      <Header user={user} onLogout={onLogout} />
      <NavBar user={user} />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
```

---

## <span style="background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; color: #2e7d32;">PASO 4</span> Crear Contexto de Autenticación

### 4.1 AuthContext
```jsx
// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Obtener usuarios registrados
    const users = JSON.parse(localStorage.getItem('users')) || []
    
    // Buscar usuario
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('user', JSON.stringify(foundUser))
      return { success: true }
    } else {
      return { success: false, message: 'Credenciales incorrectas' }
    }
  }

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || []
    
    // Verificar si el email ya existe
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'El email ya está registrado' }
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: userData.role || 'docente',
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    return { success: true, message: 'Usuario registrado exitosamente' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

## <span style="background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; color: #2e7d32;">PASO 5</span> Crear Páginas Principales

### 5.1 Página de Login
```jsx
// src/pages/Login.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = login(formData.email, formData.password)
      
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1><span style="background-color: #e3f2fd; padding: 4px 8px; border-radius: 4px; color: #1976d2;">INVENTARIO</span> Escolar</h1>
          <h2>Iniciar Sesión</h2>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Tu contraseña"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta? 
            <Link to="/register" className="auth-link">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Usuarios de prueba */}
        <div className="demo-users">
          <h3>Usuarios de Prueba:</h3>
          <div className="demo-user">
            <strong>Coordinador:</strong> admin@escuela.com / 12345678
          </div>
          <div className="demo-user">
            <strong>Docente:</strong> docente@escuela.com / 12345678
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
```

### 5.2 Página de Registro
```jsx
// src/pages/Register.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'docente'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
      const result = register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
      
      if (result.success) {
        alert('Usuario registrado exitosamente')
        navigate('/login')
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1><span style="background-color: #e3f2fd; padding: 4px 8px; border-radius: 4px; color: #1976d2;">INVENTARIO</span> Escolar</h1>
          <h2>Crear Cuenta</h2>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="docente">Docente</option>
              <option value="coordinador">Coordinador</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repite tu contraseña"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta? 
            <Link to="/login" className="auth-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
```

### 5.3 Página de Dashboard
```jsx
// src/pages/Dashboard.jsx
import React from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()

  // Obtener estadísticas del sistema
  const getStats = () => {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || []
    const loans = JSON.parse(localStorage.getItem('loans')) || []
    const users = JSON.parse(localStorage.getItem('users')) || []

    return {
      totalItems: inventory.length,
      availableItems: inventory.filter(item => item.status === 'disponible').length,
      activeLoans: loans.filter(loan => loan.status === 'activo').length,
      totalUsers: users.length
    }
  }

  const stats = getStats()

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bienvenido al sistema de inventario escolar</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">▣</div>
          <div className="stat-content">
            <h3>{stats.totalItems}</h3>
            <p>Total de Elementos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>{stats.availableItems}</h3>
            <p>Elementos Disponibles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">▤</div>
          <div className="stat-content">
            <h3>{stats.activeLoans}</h3>
            <p>Préstamos Activos</p>
          </div>
        </div>

        {user?.role === 'coordinador' && (
          <div className="stat-card">
            <div className="stat-icon">◉</div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Usuarios Registrados</p>
            </div>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <div className="action-card">
            <div className="action-icon">▣</div>
            <div className="action-content">
              <h3>Ver Inventario</h3>
              <p>Consulta todos los elementos disponibles</p>
            </div>
          </div>

          <div className="action-card">
            <div className="action-icon">▦</div>
            <div className="action-content">
              <h3>Solicitar Préstamo</h3>
              <p>Solicita elementos para tus clases</p>
            </div>
          </div>

          <div className="action-card">
            <div className="action-icon">▤</div>
            <div className="action-content">
              <h3>Mis Préstamos</h3>
              <p>Revisa tus préstamos activos</p>
            </div>
          </div>

          {user?.role === 'coordinador' && (
            <div className="action-card">
              <div className="action-icon">⚙</div>
              <div className="action-content">
                <h3>Gestionar Sistema</h3>
                <p>Administra inventario y usuarios</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
```

### 5.4 Página de Inicio (Home)
```jsx
// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span style="background-color: #e3f2fd; padding: 4px 8px; border-radius: 4px; color: #1976d2;">SISTEMA</span> de Inventario Escolar
          </h1>
          <p className="hero-subtitle">
            Gestiona de manera eficiente los recursos educativos de tu institución
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Registrarse
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Características Principales</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">▣</div>
              <h3>Gestión de Inventario</h3>
              <p>Controla todos los elementos educativos de manera organizada</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">▦</div>
              <h3>Solicitudes de Préstamo</h3>
              <p>Sistema fácil para solicitar y aprobar préstamos de material</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">▧</div>
              <h3>Reportes y Estadísticas</h3>
              <p>Visualiza el uso y estado de los recursos en tiempo real</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">◉</div>
              <h3>Gestión de Usuarios</h3>
              <p>Administra docentes y coordinadores con diferentes permisos</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">▨</div>
              <h3>Responsive Design</h3>
              <p>Accede desde cualquier dispositivo: móvil, tablet o desktop</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">◈</div>
              <h3>Seguro y Confiable</h3>
              <p>Sistema seguro con roles y permisos diferenciados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
```

---

## <span style="background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; color: #2e7d32;">PASO 6</span> Crear Archivos CSS

### 6.1 Estilos de Autenticación
```css
/* src/styles/Auth.css */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  padding: var(--spacing-4);
}

.auth-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-8);
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}

.auth-header h1 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: var(--spacing-2);
}

.auth-header h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.form-group label {
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input,
.form-group select {
  padding: var(--spacing-3);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.auth-button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-3);
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.auth-button:hover {
  background: var(--primary-dark);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee2e2;
  color: var(--danger-color);
  padding: var(--spacing-3);
  border-radius: var(--border-radius);
  border: 1px solid #fecaca;
  margin-bottom: var(--spacing-4);
}

.auth-footer {
  text-align: center;
  margin-top: var(--spacing-6);
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  margin-left: var(--spacing-2);
}

.auth-link:hover {
  text-decoration: underline;
}

.demo-users {
  margin-top: var(--spacing-6);
  padding: var(--spacing-4);
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  border: 1px solid #e2e8f0;
}

.demo-users h3 {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-2);
}

.demo-user {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-1);
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: var(--spacing-6);
  }
  
  .auth-header h1 {
    font-size: 1.5rem;
  }
  
  .auth-header h2 {
    font-size: 1.25rem;
  }
}
```

### 6.2 Estilos del Dashboard
```css
/* src/styles/Dashboard.css */
.dashboard-container {
  padding: var(--spacing-6) 0;
}

.dashboard-header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.dashboard-header h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

.dashboard-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.stat-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  font-size: 2.5rem;
  background: var(--primary-light);
  color: var(--primary-color);
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}

.stat-content p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.quick-actions {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow);
  border: 1px solid #e2e8f0;
}

.quick-actions h2 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-6);
  text-align: center;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
}

.action-card {
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: var(--spacing-4);
  border: 1px solid #e2e8f0;
  transition: var(--transition);
  cursor: pointer;
}

.action-card:hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.action-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-3);
}

.action-content h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

.action-content p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: var(--spacing-4) 0;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header h1 {
    font-size: 2rem;
  }
}
```

### 6.3 Estilos de la Página de Inicio
```css
/* src/styles/Home.css */
.home-container {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  padding: var(--spacing-12) 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-4);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-8);
  opacity: 0.9;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: var(--spacing-4);
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: var(--transition);
  border: 2px solid transparent;
}

.btn-primary {
  background: white;
  color: var(--primary-color);
}

.btn-primary:hover {
  background: var(--bg-secondary);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-secondary:hover {
  background: white;
  color: var(--primary-color);
}

.features-section {
  padding: var(--spacing-12) 0;
  background: var(--bg-secondary);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-8);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.feature-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  text-align: center;
  box-shadow: var(--shadow);
  border: 1px solid #e2e8f0;
  transition: var(--transition);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-4);
}

.feature-card h3 {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-3);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .feature-card {
    padding: var(--spacing-4);
  }
}
```

---

## <span style="background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; color: #2e7d32;">PASO 7</span> Configurar Rutas y App Principal

### 7.1 Actualizar App.jsx
```jsx
// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import './App.css'

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading">Cargando...</div>
  }
  
  return user ? children : <Navigate to="/login" />
}

// Componente para rutas públicas (solo accesibles sin autenticación)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading">Cargando...</div>
  }
  
  return !user ? children : <Navigate to="/dashboard" />
}

function AppContent() {
  const { user, logout } = useAuth()

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={logout}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
```

### 7.2 Actualizar App.css
```css
/* src/App.css */
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: var(--bg-primary);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4) 0;
}

.logo h1 {
  color: var(--primary-color);
  font-size: 1.5rem;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.welcome-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.logout-btn {
  background: var(--danger-color);
  color: white;
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  transition: var(--transition);
}

.logout-btn:hover {
  background: #b91c1c;
}

.navbar {
  background: var(--primary-color);
  color: white;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--spacing-2);
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  color: white;
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-size: 0.9rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
}

.nav-icon {
  font-size: 1.1rem;
}

.main-content {
  flex: 1;
  padding: var(--spacing-6) 0;
}

.footer {
  background: var(--bg-dark);
  color: white;
  padding: var(--spacing-4) 0;
  text-align: center;
  margin-top: auto;
}

.footer-content p {
  margin: 0;
  font-size: 0.9rem;
}

.footer-content p:first-child {
  margin-bottom: var(--spacing-1);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .nav-list {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: 0.8rem;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-icon {
    font-size: 1.2rem;
  }
  
  .user-info {
    flex-direction: column;
    gap: var(--spacing-2);
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: var(--spacing-4) 0;
  }
  
  .logo h1 {
    font-size: 1.2rem;
  }
}
```

---

## <span style="background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; color: #2e7d32;">PASO 8</span> Crear Datos de Prueba

### 8.1 Inicializar Datos de Prueba
Agregar al final de `src/main.jsx`:

```jsx
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Inicializar datos de prueba si no existen
const initializeTestData = () => {
  // Usuarios de prueba
  if (!localStorage.getItem('users')) {
    const testUsers = [
      {
        id: '1',
        name: 'Administrador',
        email: 'admin@escuela.com',
        password: '12345678',
        role: 'coordinador',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'María García',
        email: 'docente@escuela.com',
        password: '12345678',
        role: 'docente',
        createdAt: new Date().toISOString()
      }
    ]
    localStorage.setItem('users', JSON.stringify(testUsers))
  }

  // Inventario de prueba
  if (!localStorage.getItem('inventory')) {
    const testInventory = [
      {
        id: '1',
        name: 'Proyector Epson',
        code: 'PROJ-001',
        category: 'Tecnología',
        status: 'disponible',
        description: 'Proyector para presentaciones en aula',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Laptop HP',
        code: 'LAP-001',
        category: 'Tecnología',
        status: 'disponible',
        description: 'Laptop para uso educativo',
        createdAt: new Date().toISOString()
      }
    ]
    localStorage.setItem('inventory', JSON.stringify(testInventory))
  }

  // Inicializar arrays vacíos si no existen
  if (!localStorage.getItem('loans')) {
    localStorage.setItem('loans', JSON.stringify([]))
  }
  if (!localStorage.getItem('loanRequests')) {
    localStorage.setItem('loanRequests', JSON.stringify([]))
  }
  if (!localStorage.getItem('loanHistory')) {
    localStorage.setItem('loanHistory', JSON.stringify([]))
  }
}

// Ejecutar inicialización
initializeTestData()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## <span style="background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; color: #2e7d32;">PASO 9</span> Ejecutar y Probar

### 9.1 Comandos para Ejecutar
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:5173
```

### 9.2 Pruebas a Realizar

1. **Navegación Básica**
   - Visitar página de inicio
   - Navegar a login y registro
   - Probar navegación responsive

2. **Autenticación**
   - Registrar nuevo usuario
   - Iniciar sesión con usuarios de prueba
   - Verificar redirección al dashboard

3. **Dashboard**
   - Verificar estadísticas
   - Comprobar diferencias entre roles
   - Probar navegación entre secciones

4. **Responsive Design**
   - Probar en diferentes tamaños de pantalla
   - Verificar menú móvil
   - Comprobar legibilidad en móvil

---

## <span style="background-color: #fff8e1; padding: 4px 8px; border-radius: 4px; color: #f9a825;">EJERCICIOS</span> Ejercicios para Estudiantes

### Ejercicio 1: Personalización
- Cambiar colores del tema en las variables CSS
- Agregar nuevos iconos a las características
- Modificar textos y descripciones

### Ejercicio 2: Funcionalidad
- Agregar validación de email en tiempo real
- Implementar "Recordar contraseña"
- Agregar confirmación antes de cerrar sesión

### Ejercicio 3: Mejoras de UI
- Agregar animaciones de carga
- Implementar notificaciones toast
- Mejorar feedback visual en formularios

---

## <span style="background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; color: #2e7d32;">RESULTADOS</span> Resultados Esperados

Al completar esta guía, los estudiantes habrán creado:

<span style="background-color: #e8f5e8; padding: 2px 6px; border-radius: 3px; color: #2e7d32;">✓</span> **Estructura base del proyecto React**
<span style="background-color: #e8f5e8; padding: 2px 6px; border-radius: 3px; color: #2e7d32;">✓</span> **Sistema de autenticación funcional**
<span style="background-color: #e8f5e8; padding: 2px 6px; border-radius: 3px; color: #2e7d32;">✓</span> **Navegación con React Router**
<span style="background-color: #e8f5e8; padding: 2px 6px; border-radius: 3px; color: #2e7d32;">✓</span> **Dashboard con estadísticas básicas**
<span style="background-color: #e8f5e8; padding: 2px 6px; border-radius: 3px; color: #2e7d32;">✓</span> **Diseño responsive y moderno**
<span style="background-color: #e8f5e8; padding: 2px 6px; border-radius: 3px; color: #2e7d32;">✓</span> **Componentes reutilizables**
<span style="background-color: #e8f5e8; padding: 2px 6px; border-radius: 3px; color: #2e7d32;">✓</span> **Gestión de estado con Context API**

---

## <span style="background-color: #f3e5f5; padding: 4px 8px; border-radius: 4px; color: #7b1fa2;">RECURSOS</span> Recursos Adicionales

### Documentación Oficial
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite Guide](https://vitejs.dev/guide/)

### Herramientas de Desarrollo
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [VS Code Extensions](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

---

## <span style="background-color: #e1f5fe; padding: 4px 8px; border-radius: 4px; color: #0277bd;">AUTORA</span> Autora

**Luz Eliana Martinez Ramos**

Guía educativa desarrollada para la enseñanza del sistema de gestión de inventario escolar.

---

<span style="background-color: #e8f5e8; padding: 4px 8px; border-radius: 4px; color: #2e7d32;">¡FELICITACIONES!</span> Has completado la primera guía del sistema de inventario escolar. En la siguiente guía trabajaremos con la gestión del inventario y las funcionalidades CRUD.