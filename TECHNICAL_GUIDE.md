# 🔧 Guía de Desarrollo Técnico - Sistema de Inventario Escolar

Esta guía proporciona detalles técnicos específicos para desarrolladores que quieran entender o contribuir al proyecto.

## 📁 Arquitectura del Proyecto

### Patrón de Diseño
- **Arquitectura**: Component-based con Context API
- **Estado Global**: React Context para autenticación
- **Estado Local**: useState y useEffect hooks
- **Persistencia**: localStorage para datos del cliente

### Flujo de Datos
```
localStorage ↔ AuthContext ↔ Components ↔ UI
```

## 🧩 Componentes Principales

### 1. AuthContext.jsx
**Propósito**: Gestión global de autenticación y estado de usuario

```javascript
// Funciones principales
const AuthContext = {
  user,              // Usuario actual
  login(),           // Iniciar sesión
  logout(),          // Cerrar sesión
  register(),        // Registrar usuario
  addToHistory(),    // Agregar al historial
  clearHistory(),    // Limpiar historial
  isEmailRegistered() // Verificar email
}
```

**Estados manejados**:
- `user`: Objeto del usuario autenticado
- `loading`: Estado de carga inicial
- `history`: Historial de acciones del sistema

### 2. Layout.jsx
**Propósito**: Layout principal con navegación

```javascript
// Estructura
<div className="app-layout">
  <Header />
  <NavBar />
  <main className="main-content">
    <Outlet /> {/* Contenido de las páginas */}
  </main>
  <Footer />
</div>
```

### 3. ProtectedRoute.jsx
**Propósito**: Protección de rutas basada en roles

```javascript
// Lógica de protección
if (!user) return <Navigate to="/login" />
if (requiredRole && user.role !== requiredRole) {
  return <div>No tienes permisos</div>
}
return children
```

### 4. ActionButton.jsx
**Propósito**: Botón reutilizable con variantes

```javascript
// Variantes disponibles
const variants = {
  primary: 'action-btn-primary',
  danger: 'action-btn-danger',
  success: 'action-btn-success',
  warning: 'action-btn-warning'
}

// Tamaños disponibles
const sizes = {
  small: 'action-btn-small',
  medium: 'action-btn-medium',
  large: 'action-btn-large'
}
```

## 📊 Gestión de Estado

### localStorage Schema

#### Users
```javascript
[
  {
    name: "string",
    email: "string",
    password: "string", // En producción usar hash
    role: "docente" | "coordinador"
  }
]
```

#### Inventory
```javascript
[
  {
    id: "string",
    name: "string",
    code: "string",
    category: "string",
    status: "disponible" | "prestado" | "en_mantenimiento" | "eliminado",
    description: "string",
    createdAt: "ISO string"
  }
]
```

#### Loan Requests
```javascript
[
  {
    id: "string",
    userId: "string",
    userName: "string",
    itemId: "string",
    itemName: "string",
    itemCode: "string",
    requestDate: "ISO string",
    startDate: "ISO string",
    endDate: "ISO string",
    purpose: "string",
    status: "pendiente" | "aprobado" | "rechazado" | "entregado",
    approvedBy: "string",
    approvedDate: "ISO string",
    rejectionReason: "string"
  }
]
```

#### Loans
```javascript
[
  {
    id: "string",
    userId: "string",
    userName: "string",
    itemId: "string",
    itemName: "string",
    itemCode: "string",
    startDate: "ISO string",
    endDate: "ISO string",
    status: "activo" | "devuelto" | "vencido",
    purpose: "string",
    approvedBy: "string"
  }
]
```

## 🎨 Sistema de Estilos

### Variables CSS (App.css)
```css
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
  
  --border-radius: 8px;
  --box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  --transition: all 0.3s ease;
}
```

### Clases Utilitarias
```css
/* Espaciado */
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }

/* Flexbox */
.d-flex { display: flex; }
.justify-content-between { justify-content: space-between; }
.align-items-center { align-items: center; }

/* Responsive */
@media (max-width: 768px) {
  .mobile-stack { flex-direction: column; }
}
```

### Status Badges
```css
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  min-width: 100px;
}

.status-badge.disponible {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.prestado {
  background-color: #cce7ff;
  color: #004085;
}
```

## 🔄 Flujos de Trabajo

### Flujo de Autenticación
1. Usuario ingresa credenciales en Login.jsx
2. AuthContext.login() valida contra localStorage
3. Si es válido, setUser() y navigate('/')
4. ProtectedRoute verifica autenticación en rutas protegidas

### Flujo de Solicitud de Préstamo
1. Docente selecciona item en RequestLoan.jsx
2. Completa formulario con fechas y propósito
3. Se crea objeto loanRequest y se guarda en localStorage
4. Coordinador ve solicitud en LoanRequests.jsx
5. Coordinador aprueba/rechaza
6. Si se aprueba, se crea loan y se actualiza inventory status

### Flujo de Generación PDF
1. Usuario hace clic en "Comprobante"
2. Se ejecuta generatePDF() con datos del préstamo
3. jsPDF crea documento con:
   - Header con logo/título
   - Tabla con detalles del préstamo
   - Footer con fecha de generación
4. Se descarga automáticamente

## 🛠️ Funciones Utilitarias

### Generación de IDs
```javascript
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```

### Formateo de Fechas
```javascript
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
```

### Validación de Email
```javascript
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
@media (min-width: 576px) { /* Small devices */ }
@media (min-width: 768px) { /* Medium devices */ }
@media (min-width: 992px) { /* Large devices */ }
@media (min-width: 1200px) { /* Extra large devices */ }
```

### Estrategias Responsive
- **Navegación**: Hamburger menu en móvil
- **Tablas**: Scroll horizontal en pantallas pequeñas
- **Formularios**: Stack vertical en móvil
- **Modales**: Fullscreen en móvil

## 🔍 Debugging y Testing

### Console Logs Útiles
```javascript
// Ver estado de localStorage
console.log('Users:', JSON.parse(localStorage.getItem('users')));
console.log('Inventory:', JSON.parse(localStorage.getItem('inventory')));

// Ver usuario actual
console.log('Current user:', JSON.parse(localStorage.getItem('user')));
```

### Limpiar Datos de Desarrollo
```javascript
// En consola del navegador
localStorage.clear();
location.reload();
```

### Datos de Prueba
```javascript
// Crear usuario coordinador de prueba
const testCoordinator = {
  name: "Admin Test",
  email: "admin@test.com",
  password: "12345678",
  role: "coordinador"
};

const users = JSON.parse(localStorage.getItem('users')) || [];
users.push(testCoordinator);
localStorage.setItem('users', JSON.stringify(users));
```

## 🚀 Optimizaciones

### Performance
- Lazy loading de componentes con React.lazy()
- Memoización con React.memo() para componentes pesados
- useCallback() para funciones que se pasan como props
- useMemo() para cálculos costosos

### Bundle Size
- Tree shaking automático con Vite
- Importaciones específicas: `import { useState } from 'react'`
- Análisis de bundle con `npm run build -- --analyze`

## 🔧 Configuración de Desarrollo

### ESLint Rules
```javascript
// eslint.config.js
export default [
  {
    rules: {
      'react/prop-types': 'off',
      'no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
]
```

### Vite Config
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 📈 Métricas y Monitoreo

### Estadísticas del Sistema
```javascript
const getSystemStats = () => {
  const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
  const loans = JSON.parse(localStorage.getItem('loans')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  return {
    totalItems: inventory.length,
    availableItems: inventory.filter(i => i.status === 'disponible').length,
    activeLoans: loans.filter(l => l.status === 'activo').length,
    totalUsers: users.length,
    coordinators: users.filter(u => u.role === 'coordinador').length
  };
}
```

## 🔒 Consideraciones de Seguridad

### Frontend Security
- Validación de inputs en todos los formularios
- Sanitización de datos antes de mostrar
- No almacenar contraseñas en texto plano (usar hash en producción)
- Validación de roles antes de mostrar contenido sensible

### Recomendaciones para Producción
- Implementar backend con autenticación JWT
- Usar HTTPS en producción
- Implementar rate limiting
- Validación del lado del servidor
- Logs de auditoría

---

Esta guía técnica complementa el README principal y proporciona la información necesaria para desarrolladores que trabajen en el proyecto.