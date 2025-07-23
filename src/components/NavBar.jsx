// Importar logo como componente

import { Link } from 'react-router-dom';
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'


const NavBar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <nav>
          <Link to="/">Inicio</Link>
          {user && (
            <>
              <Link to="/inventory">Inventario</Link>
              {user.role === 'coordinador' && (
                <Link to="/users">Usuarios</Link>
             
              )}
              <Link to="/profile">{user.name}</Link>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/register">Registrarse</Link>
            </>
          )}
        </nav>
  );
};

export default NavBar;
