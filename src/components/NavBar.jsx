import { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderUserLinks = () => (
    <>
      <li className="nav-item">
        <NavLink className="nav-link" to="/inventory">Inventario</NavLink>
      </li>
      {user?.role === 'coordinador' && (
        <>
        <li className="nav-item">
          <NavLink className="nav-link" to="/users">Usuarios</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/History">Prestamos</NavLink>
        </li>
        </>
      )}
      <li className="nav-item">
        <NavLink className="nav-link" to="/profile">
          {user?.name || 'Perfil'}
        </NavLink>
      </li>
      <li className="nav-item">
        <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </li>
    </>
  );

  const renderGuestLinks = () => (
    <>
      <li className="nav-item">
        <NavLink className="nav-link" to="/login">Iniciar sesión</NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/register">Registrarse</NavLink>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand" to="/">Inicio</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {user ? renderUserLinks() : renderGuestLinks()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
