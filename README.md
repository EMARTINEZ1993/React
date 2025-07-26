# 📚 Sistema de Inventario Escolar

Un sistema completo de gestión de inventario para instituciones educativas, desarrollado con React + Vite. Permite gestionar préstamos de equipos tecnológicos y pedagógicos de manera eficiente.

## 🎯 Características Principales

- **👥 Gestión de Usuarios**: Registro y autenticación con roles (Docente/Coordinador)
- **📦 Inventario**: Control completo de elementos disponibles, prestados y en mantenimiento
- **📋 Solicitudes de Préstamo**: Sistema de solicitudes con aprobación/rechazo
- **📊 Dashboard**: Estadísticas en tiempo real para coordinadores
- **📄 Reportes PDF**: Generación automática de comprobantes de préstamo
- **📱 Responsive**: Diseño adaptable a dispositivos móviles
- **💾 Persistencia Local**: Datos almacenados en localStorage

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19.1.0 + Vite 7.0.4
- **Routing**: React Router DOM 7.7.0
- **Estilos**: CSS personalizado + Bootstrap 5.3.7
- **Iconos**: FontAwesome
- **PDF**: jsPDF + jsPDF-AutoTable
- **Persistencia**: localStorage

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

## 🚀 Instalación y Configuración

### Paso 1: Crear el Proyecto Base

```bash
# Crear nuevo proyecto con Vite
npm create vite@latest sistema-inventario -- --template react

# Navegar al directorio del proyecto
cd sistema-inventario

# Instalar dependencias base
npm install
```

### Paso 2: Instalar Dependencias Adicionales

```bash
# Dependencias principales
npm install react-router-dom@^7.7.0
npm install bootstrap@^5.3.7 react-bootstrap@^2.10.10
npm install @fortawesome/fontawesome-svg-core@^7.0.0
npm install @fortawesome/free-solid-svg-icons@^7.0.0
npm install @fortawesome/react-fontawesome@^0.2.3
npm install jspdf@^3.0.1 jspdf-autotable@^5.0.2
```

### Paso 3: Estructura de Carpetas

Crear la siguiente estructura de carpetas en `src/`:

```
src/
├── components/          # Componentes reutilizables
│   ├── ActionButton.jsx
│   ├── ActionButton.css
│   ├── AuthLayout.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Layout.jsx
│   ├── Modal.jsx
│   ├── Modal.css
│   ├── NavBar.jsx
│   └── ProtectedRoute.jsx
├── context/             # Contextos de React
│   └── AuthContext.jsx
├── pages/               # Páginas principales
│   ├── History.jsx
│   ├── Home.jsx
│   ├── Home.css
│   ├── Inventory.jsx
│   ├── LoanRequests.jsx
│   ├── Loans.jsx
│   ├── Login.jsx
│   ├── MyLoanRequests.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   ├── RequestLoan.jsx
│   ├── Restablecer_Password.jsx
│   └── UserManagement.jsx
├── styles/              # Estilos globales
│   └── Auth.css
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## 🏗️ Desarrollo Paso a Paso

### 1. Configuración del Router

En `App.jsx`, configurar React Router con las rutas principales:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import AuthLayout from './components/AuthLayout'
// ... importar páginas
```

### 2. Context de Autenticación

Crear `AuthContext.jsx` para manejar:
- Estado de usuario autenticado
- Funciones de login/logout/register
- Persistencia en localStorage
- Historial de acciones

### 3. Componentes de Layout

- **Layout.jsx**: Layout principal con navegación
- **AuthLayout.jsx**: Layout para páginas de autenticación
- **ProtectedRoute.jsx**: Protección de rutas por roles

### 4. Páginas Principales

#### Autenticación
- **Login.jsx**: Formulario de inicio de sesión
- **Register.jsx**: Registro de nuevos usuarios
- **Restablecer_Password.jsx**: Recuperación de contraseña

#### Dashboard y Gestión
- **Home.jsx**: Panel principal con estadísticas
- **Inventory.jsx**: Gestión de inventario
- **LoanRequests.jsx**: Solicitudes de préstamo (coordinador)
- **Loans.jsx**: Préstamos activos
- **MyLoanRequests.jsx**: Mis solicitudes (docente)

### 5. Funcionalidades Clave

#### Sistema de Roles
```javascript
// Dos tipos de usuario
const roles = {
  docente: 'docente',      // Puede solicitar préstamos
  coordinador: 'coordinador' // Puede gestionar todo el sistema
}
```

#### Estados de Inventario
```javascript
const estados = {
  disponible: 'disponible',
  prestado: 'prestado',
  mantenimiento: 'en_mantenimiento',
  eliminado: 'eliminado'
}
```

#### Estados de Solicitudes
```javascript
const estadosSolicitud = {
  pendiente: 'pendiente',
  aprobado: 'aprobado',
  entregado: 'entregado',
  rechazado: 'rechazado'
}
```

## 🎨 Estilos y UI

### CSS Principal (App.css)
- Variables CSS para colores consistentes
- Estilos para componentes principales
- Sistema de grid responsive
- Animaciones y transiciones

### Componentes Estilizados
- **ActionButton**: Botones con variantes (primary, danger, success)
- **Modal**: Modales reutilizables
- **Status Badges**: Indicadores de estado con colores

## 📊 Gestión de Datos

### localStorage Structure
```javascript
// Estructura de datos en localStorage
{
  users: [],           // Usuarios registrados
  inventory: [],       // Elementos del inventario
  loans: [],          // Préstamos activos
  loanRequests: [],   // Solicitudes de préstamo
  loanHistory: [],    // Historial de acciones
  user: {}           // Usuario actual autenticado
}
```

### Ejemplo de Elemento de Inventario
```javascript
{
  id: 'unique-id',
  name: 'Proyector Epson',
  code: 'PROJ-001',
  category: 'Tecnología',
  status: 'disponible',
  description: 'Proyector para aulas',
  createdAt: '2024-01-01T00:00:00.000Z'
}
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Vista previa de build

# Calidad de código
npm run lint         # Ejecuta ESLint
```

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
# Abre http://localhost:5173
```

### Producción
```bash
npm run build
# Los archivos se generan en dist/
```

### Despliegue en Vercel
1. Conectar repositorio a Vercel
2. Configurar build command: `npm run build`
3. Configurar output directory: `dist`

## 👥 Roles y Permisos

### Docente
- ✅ Solicitar préstamos
- ✅ Ver mis solicitudes
- ✅ Ver inventario disponible
- ✅ Actualizar perfil

### Coordinador
- ✅ Todas las funciones de docente
- ✅ Gestionar inventario (CRUD)
- ✅ Aprobar/rechazar solicitudes
- ✅ Ver estadísticas del sistema
- ✅ Gestionar usuarios
- ✅ Generar reportes PDF

## 🔒 Seguridad

- Validación de formularios en frontend
- Protección de rutas por roles
- Sanitización de datos de entrada
- No exposición de credenciales

## 📱 Responsive Design

- Diseño mobile-first
- Breakpoints para tablet y desktop
- Navegación adaptable
- Tablas responsivas con scroll horizontal

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de dependencias**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Puerto ocupado**
   ```bash
   npm run dev -- --port 3001
   ```

3. **Datos corruptos en localStorage**
   - Abrir DevTools → Application → Local Storage
   - Eliminar datos del dominio

## 📈 Futuras Mejoras

- [ ] Backend con base de datos real
- [ ] Autenticación JWT
- [ ] Notificaciones push
- [ ] Exportación a Excel
- [ ] Sistema de reservas
- [ ] Integración con calendario
- [ ] API REST
- [ ] Tests unitarios

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado para gestión de inventario escolar.

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al desarrollador.
