# 🎨 Guía de Estilos CSS - Sistema de Inventario Escolar

Este archivo contiene todos los estilos CSS necesarios para crear la interfaz del sistema.

## 📁 Estructura de Archivos CSS

```
src/
├── styles/
│   ├── index.css          # Estilos globales
│   ├── Auth.css           # Estilos de autenticación
│   ├── Home.css           # Estilos del dashboard
│   ├── Inventory.css      # Estilos del inventario
│   ├── LoanRequests.css   # Estilos de solicitudes
│   ├── Loans.css          # Estilos de préstamos
│   ├── History.css        # Estilos del historial
│   └── components/
│       ├── ActionButton.css
│       ├── Modal.css
│       ├── Navbar.css
│       └── Table.css
```

## 🌐 Estilos Globales (index.css)

```css
/* Reset y configuración base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Colores principales */
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-light: #dbeafe;
  
  --secondary-color: #64748b;
  --secondary-hover: #475569;
  --secondary-light: #f1f5f9;
  
  --success-color: #059669;
  --success-hover: #047857;
  --success-light: #d1fae5;
  
  --warning-color: #d97706;
  --warning-hover: #b45309;
  --warning-light: #fef3c7;
  
  --danger-color: #dc2626;
  --danger-hover: #b91c1c;
  --danger-light: #fee2e2;
  
  --info-color: #0891b2;
  --info-hover: #0e7490;
  --info-light: #cffafe;
  
  /* Colores neutros */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Tipografía */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
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
  --spacing-16: 4rem;
  
  /* Bordes */
  --border-radius-sm: 0.25rem;
  --border-radius: 0.375rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;
  --border-radius-xl: 1rem;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Transiciones */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--gray-800);
  background-color: var(--gray-50);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Contenedor principal */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--spacing-6);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Utilidades de texto */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }
.text-3xl { font-size: var(--font-size-3xl); }

.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

/* Utilidades de color */
.text-primary { color: var(--primary-color); }
.text-secondary { color: var(--secondary-color); }
.text-success { color: var(--success-color); }
.text-warning { color: var(--warning-color); }
.text-danger { color: var(--danger-color); }
.text-info { color: var(--info-color); }

/* Utilidades de espaciado */
.m-0 { margin: 0; }
.m-1 { margin: var(--spacing-1); }
.m-2 { margin: var(--spacing-2); }
.m-3 { margin: var(--spacing-3); }
.m-4 { margin: var(--spacing-4); }
.m-5 { margin: var(--spacing-5); }
.m-6 { margin: var(--spacing-6); }

.p-0 { padding: 0; }
.p-1 { padding: var(--spacing-1); }
.p-2 { padding: var(--spacing-2); }
.p-3 { padding: var(--spacing-3); }
.p-4 { padding: var(--spacing-4); }
.p-5 { padding: var(--spacing-5); }
.p-6 { padding: var(--spacing-6); }

/* Utilidades de flexbox */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-start { justify-content: flex-start; }
.justify-end { justify-content: flex-end; }

/* Utilidades de grid */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.gap-1 { gap: var(--spacing-1); }
.gap-2 { gap: var(--spacing-2); }
.gap-3 { gap: var(--spacing-3); }
.gap-4 { gap: var(--spacing-4); }
.gap-6 { gap: var(--spacing-6); }

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-4);
  }
  
  .grid-cols-2 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .grid-cols-3 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .grid-cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 480px) {
  .grid-cols-4 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
}
```

## 🔐 Estilos de Autenticación (Auth.css)

```css
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--info-color) 100%);
  padding: var(--spacing-4);
}

.auth-card {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-8);
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}

.auth-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-2);
}

.auth-header p {
  color: var(--gray-600);
  font-size: var(--font-size-sm);
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
  color: var(--gray-700);
  font-size: var(--font-size-sm);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: var(--spacing-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  transition: var(--transition-fast);
  background-color: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.form-group input::placeholder {
  color: var(--gray-400);
}

.auth-button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
  margin-top: var(--spacing-2);
}

.auth-button:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.auth-button:active {
  transform: translateY(0);
}

.auth-links {
  text-align: center;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-fast);
}

.auth-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.error-message {
  background: var(--danger-light);
  color: var(--danger-color);
  padding: var(--spacing-3);
  border-radius: var(--border-radius);
  border: 1px solid var(--danger-color);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-4);
}

.success-message {
  background: var(--success-light);
  color: var(--success-color);
  padding: var(--spacing-3);
  border-radius: var(--border-radius);
  border: 1px solid var(--success-color);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-4);
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: var(--spacing-6);
    margin: var(--spacing-4);
  }
  
  .auth-header h1 {
    font-size: var(--font-size-2xl);
  }
}
```

## 🏠 Estilos del Dashboard (Home.css)

```css
.home-container {
  padding: var(--spacing-6);
}

.home-header {
  margin-bottom: var(--spacing-8);
}

.home-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-2);
}

.home-subtitle {
  color: var(--gray-600);
  font-size: var(--font-size-lg);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.stat-card {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-200);
  transition: var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-color);
}

.stat-card.success::before {
  background: var(--success-color);
}

.stat-card.warning::before {
  background: var(--warning-color);
}

.stat-card.danger::before {
  background: var(--danger-color);
}

.stat-card.info::before {
  background: var(--info-color);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
}

.stat-title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  color: var(--primary-color);
  font-size: var(--font-size-lg);
}

.stat-icon.success {
  background: var(--success-light);
  color: var(--success-color);
}

.stat-icon.warning {
  background: var(--warning-light);
  color: var(--warning-color);
}

.stat-icon.danger {
  background: var(--danger-light);
  color: var(--danger-color);
}

.stat-icon.info {
  background: var(--info-light);
  color: var(--info-color);
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--spacing-1);
}

.stat-description {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
}

.quick-actions {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-200);
}

.quick-actions-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--spacing-4);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
}

.action-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-4);
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--gray-700);
  transition: var(--transition-fast);
  background: var(--gray-50);
}

.action-item:hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.action-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius);
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-3);
  font-size: var(--font-size-sm);
}

.action-content h3 {
  font-size: var(--font-size-base);
  font-weight: 500;
  margin-bottom: var(--spacing-1);
}

.action-content p {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
}

/* Responsive */
@media (max-width: 768px) {
  .home-container {
    padding: var(--spacing-4);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .home-title {
    font-size: var(--font-size-2xl);
  }
}
```

## 📦 Estilos del Inventario (Inventory.css)

```css
.inventory-container {
  padding: var(--spacing-6);
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.inventory-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
}

.inventory-filters {
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.filter-group label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-700);
}

.filter-group select,
.filter-group input {
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  min-width: 150px;
}

.inventory-table-container {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-200);
  overflow: hidden;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
}

.inventory-table th {
  background: var(--gray-50);
  padding: var(--spacing-4);
  text-align: left;
  font-weight: 600;
  color: var(--gray-700);
  border-bottom: 1px solid var(--gray-200);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.inventory-table td {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--gray-100);
  color: var(--gray-800);
  font-size: var(--font-size-sm);
}

.inventory-table tr:hover {
  background: var(--gray-50);
}

.inventory-table tr:last-child td {
  border-bottom: none;
}

.status-badge {
  display: inline-block;
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--border-radius-xl);
  font-size: var(--font-size-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.disponible {
  background: var(--success-light);
  color: var(--success-color);
}

.status-badge.prestado {
  background: var(--warning-light);
  color: var(--warning-color);
}

.status-badge.en_mantenimiento {
  background: var(--info-light);
  color: var(--info-color);
}

.status-badge.eliminado {
  background: var(--danger-light);
  color: var(--danger-color);
}

.status-select {
  padding: var(--spacing-1) var(--spacing-2);
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: var(--font-size-xs);
  background: white;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.inventory-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-12);
  color: var(--gray-500);
}

.empty-state-icon {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-4);
  color: var(--gray-300);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-2);
  color: var(--gray-700);
}

.empty-state p {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-4);
}

/* Responsive */
@media (max-width: 768px) {
  .inventory-container {
    padding: var(--spacing-4);
  }
  
  .inventory-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .inventory-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group select,
  .filter-group input {
    min-width: auto;
  }
  
  .inventory-table-container {
    overflow-x: auto;
  }
  
  .inventory-table {
    min-width: 600px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
```

## 🔘 Componente ActionButton (ActionButton.css)

```css
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-fast);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.action-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.action-btn:disabled,
.action-btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Tamaños */
.action-btn-small {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-xs);
  gap: var(--spacing-1);
}

.action-btn-medium {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
  gap: var(--spacing-2);
}

.action-btn-large {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
  gap: var(--spacing-2);
}

/* Variantes */
.action-btn-primary {
  background: var(--primary-color);
  color: white;
}

.action-btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.action-btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.action-btn-secondary:hover {
  background: var(--gray-200);
  border-color: var(--gray-400);
}

.action-btn-success {
  background: var(--success-color);
  color: white;
}

.action-btn-success:hover {
  background: var(--success-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.action-btn-warning {
  background: var(--warning-color);
  color: white;
}

.action-btn-warning:hover {
  background: var(--warning-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.action-btn-danger {
  background: var(--danger-color);
  color: white;
}

.action-btn-danger:hover {
  background: var(--danger-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.action-btn-info {
  background: var(--info-color);
  color: white;
}

.action-btn-info:hover {
  background: var(--info-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.action-btn-outline-primary {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.action-btn-outline-primary:hover {
  background: var(--primary-color);
  color: white;
}

.action-btn-outline-secondary {
  background: transparent;
  color: var(--gray-600);
  border: 1px solid var(--gray-300);
}

.action-btn-outline-secondary:hover {
  background: var(--gray-600);
  color: white;
}

.action-btn-ghost {
  background: transparent;
  color: var(--gray-600);
  border: none;
}

.action-btn-ghost:hover {
  background: var(--gray-100);
  color: var(--gray-800);
}

/* Efectos de carga */
.action-btn-loading {
  position: relative;
  color: transparent;
}

.action-btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .action-btn-large {
    padding: var(--spacing-2) var(--spacing-4);
    font-size: var(--font-size-sm);
  }
  
  .action-btn-medium {
    padding: var(--spacing-1) var(--spacing-3);
    font-size: var(--font-size-xs);
  }
}
```

## 🪟 Componente Modal (Modal.css)

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-4);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-small {
  max-width: 400px;
}

.modal-medium {
  max-width: 600px;
}

.modal-large {
  max-width: 800px;
}

.modal-extra-large {
  max-width: 1200px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--gray-200);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--gray-400);
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--border-radius);
  transition: var(--transition-fast);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: var(--gray-100);
  color: var(--gray-600);
}

.modal-body {
  padding: var(--spacing-6);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-2);
  }
  
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-large,
  .modal-extra-large {
    max-width: 100%;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: var(--spacing-4);
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: var(--spacing-3);
  }
  
  .modal-body {
    padding: var(--spacing-3);
  }
  
  .modal-footer {
    padding: var(--spacing-3);
  }
  
  .modal-title {
    font-size: var(--font-size-lg);
  }
}
```

Esta guía de estilos CSS proporciona una base sólida y profesional para el sistema de inventario escolar, con un diseño moderno, responsive y accesible.