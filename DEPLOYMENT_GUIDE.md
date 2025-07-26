# 🚀 Guía de Deployment y Scripts - Sistema de Inventario Escolar

Esta guía contiene instrucciones detalladas para el deployment y scripts útiles para el desarrollo y mantenimiento del sistema.

## 📦 Preparación para Producción

### 1. Optimización del Build

#### Configuración de Vite (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Configuración de build para producción
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          bootstrap: ['bootstrap', 'react-bootstrap'],
          utils: ['jspdf', 'jspdf-autotable']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Configuración de desarrollo
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  // Alias para imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@context': resolve(__dirname, 'src/context'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  }
})
```

#### Variables de Entorno (.env.production)
```bash
# Configuración de producción
VITE_APP_NAME=Sistema de Inventario Escolar
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production

# URLs de la aplicación
VITE_APP_BASE_URL=https://tu-dominio.com
VITE_APP_API_URL=https://api.tu-dominio.com

# Configuración de analytics (opcional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Configuración de error tracking (opcional)
VITE_SENTRY_DSN=your_sentry_dsn_here
```

### 2. Scripts de Package.json

```json
{
  "name": "sistema-inventario-escolar",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,css,md}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "build:analyze": "vite build --mode analyze",
    "clean": "rm -rf dist node_modules/.vite",
    "deploy:netlify": "npm run build && netlify deploy --prod --dir=dist",
    "deploy:vercel": "npm run build && vercel --prod",
    "deploy:github": "npm run build && gh-pages -d dist",
    "backup:data": "node scripts/backup-data.js",
    "restore:data": "node scripts/restore-data.js",
    "generate:icons": "node scripts/generate-icons.js",
    "optimize:images": "node scripts/optimize-images.js"
  }
}
```

## 🌐 Deployment en Diferentes Plataformas

### 1. Netlify

#### netlify.toml
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_APP_ENVIRONMENT = "production"

[context.deploy-preview.environment]
  VITE_APP_ENVIRONMENT = "preview"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Script de Deploy para Netlify
```bash
#!/bin/bash
# deploy-netlify.sh

echo "🚀 Iniciando deployment en Netlify..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Ejecutar linting
echo "🔍 Ejecutando linting..."
npm run lint

# Ejecutar tests
echo "🧪 Ejecutando tests..."
npm run test

# Construir aplicación
echo "🏗️ Construyendo aplicación..."
npm run build

# Deploy a Netlify
echo "🌐 Desplegando en Netlify..."
netlify deploy --prod --dir=dist

echo "✅ Deployment completado!"
```

### 2. Vercel

#### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_APP_ENVIRONMENT": "production"
  },
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. GitHub Pages

#### Script de Deploy para GitHub Pages
```bash
#!/bin/bash
# deploy-github.sh

echo "🚀 Iniciando deployment en GitHub Pages..."

# Construir aplicación
npm run build

# Configurar git para GitHub Pages
cd dist
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git push -f origin main:gh-pages

echo "✅ Deployment en GitHub Pages completado!"
```

#### GitHub Actions Workflow (.github/workflows/deploy.yml)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linting
      run: npm run lint
      
    - name: Run tests
      run: npm run test
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔧 Scripts Útiles

### 1. Script de Backup de Datos (scripts/backup-data.js)
```javascript
const fs = require('fs')
const path = require('path')

const backupData = () => {
  console.log('📦 Iniciando backup de datos...')
  
  // Simular datos de localStorage para backup
  const sampleData = {
    users: [
      {
        id: '1',
        name: 'Administrador',
        email: 'admin@escuela.edu',
        role: 'coordinador',
        password: 'admin123'
      }
    ],
    inventory: [],
    loans: [],
    loanRequests: [],
    loanHistory: [],
    backupDate: new Date().toISOString()
  }
  
  const backupDir = path.join(__dirname, '..', 'backups')
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
  
  const filename = `backup-${new Date().toISOString().split('T')[0]}.json`
  const filepath = path.join(backupDir, filename)
  
  fs.writeFileSync(filepath, JSON.stringify(sampleData, null, 2))
  
  console.log(`✅ Backup creado: ${filepath}`)
}

backupData()
```

### 2. Script de Optimización de Imágenes (scripts/optimize-images.js)
```javascript
const fs = require('fs')
const path = require('path')

const optimizeImages = () => {
  console.log('🖼️ Optimizando imágenes...')
  
  const publicDir = path.join(__dirname, '..', 'public')
  const imagesDir = path.join(publicDir, 'images')
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }
  
  // Crear iconos SVG optimizados
  const icons = {
    'inventory.svg': `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    `,
    'loans.svg': `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    `,
    'users.svg': `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-2.99 4v7h2v7h4zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10.5s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 2h-2C3.34 8 2 9.34 2 11.5V22h2v-7h2v7h2v-10.5C8 9.34 6.66 8 5.5 8z"/>
      </svg>
    `
  }
  
  Object.entries(icons).forEach(([filename, content]) => {
    const filepath = path.join(imagesDir, filename)
    fs.writeFileSync(filepath, content.trim())
    console.log(`✅ Icono creado: ${filename}`)
  })
  
  console.log('✅ Optimización de imágenes completada!')
}

optimizeImages()
```

### 3. Script de Generación de Manifest (scripts/generate-manifest.js)
```javascript
const fs = require('fs')
const path = require('path')

const generateManifest = () => {
  console.log('📱 Generando manifest.json...')
  
  const manifest = {
    name: 'Sistema de Inventario Escolar',
    short_name: 'Inventario',
    description: 'Sistema de gestión de inventario para instituciones educativas',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/images/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/images/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    categories: ['education', 'productivity', 'utilities'],
    lang: 'es',
    dir: 'ltr'
  }
  
  const publicDir = path.join(__dirname, '..', 'public')
  const manifestPath = path.join(publicDir, 'manifest.json')
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  
  console.log('✅ Manifest.json generado!')
}

generateManifest()
```

## 🔒 Configuración de Seguridad

### 1. Content Security Policy (CSP)
```html
<!-- En index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

### 2. Configuración de Headers de Seguridad
```javascript
// Para Express.js (si usas backend)
const helmet = require('helmet')

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))
```

## 📊 Monitoreo y Analytics

### 1. Configuración de Google Analytics
```javascript
// src/utils/analytics.js
export const initGA = () => {
  if (import.meta.env.VITE_GOOGLE_ANALYTICS_ID) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GOOGLE_ANALYTICS_ID}`
    document.head.appendChild(script)
    
    window.dataLayer = window.dataLayer || []
    function gtag(){dataLayer.push(arguments)}
    gtag('js', new Date())
    gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID)
  }
}

export const trackEvent = (action, category, label, value) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}
```

### 2. Error Tracking con Sentry
```javascript
// src/utils/errorTracking.js
import * as Sentry from '@sentry/react'

export const initSentry = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_APP_ENVIRONMENT,
      tracesSampleRate: 1.0,
    })
  }
}

export const logError = (error, context = {}) => {
  console.error(error)
  if (window.Sentry) {
    Sentry.captureException(error, { extra: context })
  }
}
```

## 🧪 Testing

### 1. Configuración de Vitest (vitest.config.js)
```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}'
      ]
    }
  }
})
```

### 2. Setup de Testing (src/test/setup.js)
```javascript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock
```

## 📈 Performance

### 1. Lazy Loading de Componentes
```javascript
// src/App.jsx
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const Inventory = lazy(() => import('./pages/Inventory'))
const Loans = lazy(() => import('./pages/Loans'))

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/loans" element={<Loans />} />
      </Routes>
    </Suspense>
  )
}
```

### 2. Service Worker para Cache
```javascript
// public/sw.js
const CACHE_NAME = 'inventario-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
      })
  )
})
```

Esta guía proporciona todo lo necesario para deployar y mantener el sistema de inventario escolar en producción de manera profesional y segura.

## 👩‍💻 Autora

**Luz Eliana Martinez Ramos**

Guía de despliegue desarrollada para el sistema de gestión de inventario escolar.