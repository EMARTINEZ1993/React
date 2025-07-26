
import { Outlet, useLocation } from 'react-router-dom'
import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import '../App.css'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useContext(AuthContext)
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Páginas donde no se debe mostrar el sidebar
  const authPages = ['/login', '/register', '/restablecer_Password']
  const isAuthPage = authPages.includes(location.pathname)
  const showSidebar = user || !isAuthPage

  // Si es una página de auth y no hay usuario, usar layout simple
  if (isAuthPage && !user) {
    return (
      <div className="auth-layout">
        <div className="auth-main-content">
          <Outlet />
        </div>
      </div>
    )
  }

  return (
    <div className="layout">
      {/* Botón de menú para móviles */}
      {showSidebar && (
        <button 
          className="menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}
      
      {/* Barra lateral */}
      {showSidebar && (
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <img 
              src="https://images.vexels.com/media/users/3/224136/isolated/preview/3254497f70189b201e55780274dc1035-logotipo-de-persona-abstracta-azul.png" 
              alt="Logo Inventario" 
              className="sidebar-logo"
            />
          </div>
          <NavBar />
          <div className="sidebar-footer">
            <p>© {new Date().getFullYear()}</p>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className={`main-content ${!showSidebar ? 'no-sidebar' : ''}`}>
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}

export default Layout