import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome, 
  faBoxes, 
  faUsers, 
  faClipboardList, 
  faHandHoldingHeart, 
  faFileAlt, 
  faHistory, 
  faUser, 
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons'

const NavBar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="sidebar-nav">
      <Link to="/" className={isActive('/home')}>
        <FontAwesomeIcon icon={faHome} /> Inicio
      </Link>
      
      {user && (
        <>
          {/* Opciones para docentes */}
          {user.role === 'docente' && (
            <>
              <Link to="/request-loan" className={isActive('/request-loan')}>
                <FontAwesomeIcon icon={faPlusCircle} /> Solicitar Préstamo
              </Link>
              <Link to="/my-loan-requests" className={isActive('/my-loan-requests')}>
                <FontAwesomeIcon icon={faFileAlt} /> Mis Solicitudes
              </Link>
            </>
          )}

          {/* Opciones para coordinadores */}
          {user.role === 'coordinador' && (
            <>
              {/* 1. Gestión de Inventario - Base del sistema */}
              <Link to="/inventory" className={isActive('/inventory')}>
                <FontAwesomeIcon icon={faBoxes} /> Inventario
              </Link>
              
              {/* 2. Gestión de Usuarios - Configuración del sistema */}
              <Link to="/users" className={isActive('/users')}>
                <FontAwesomeIcon icon={faUsers} /> Usuarios
              </Link>
              
              {/* 3. Solicitudes de Préstamo - Proceso inicial */}
              <Link to="/loan-requests" className={isActive('/loan-requests')}>
                <FontAwesomeIcon icon={faFileAlt} /> Solicitudes
              </Link>
              
              {/* 4. Gestión de Préstamos - Proceso activo */}
              <Link to="/loans" className={isActive('/loans')}>
                <FontAwesomeIcon icon={faHandHoldingHeart} /> Préstamos
              </Link>
              
              {/* 5. Historial - Seguimiento y auditoría */}
              <Link to="/History" className={isActive('/History')}>
                <FontAwesomeIcon icon={faHistory} /> Historial
              </Link>
            </>
          )}
          
          {/* Perfil del usuario */}
          <Link to="/profile" className={isActive('/profile')}>
            <FontAwesomeIcon icon={faUser} /> {user.name}
          </Link>
          
          <button onClick={handleLogout} className="logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesión
          </button>
        </>
      )}
      {!user && (
        <>
          <Link to="/login" className={isActive('/login')}>
            <FontAwesomeIcon icon={faSignInAlt} /> Iniciar sesión
          </Link>
          <Link to="/register" className={isActive('/register')}>
            <FontAwesomeIcon icon={faUserPlus} /> Registrarse
          </Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
