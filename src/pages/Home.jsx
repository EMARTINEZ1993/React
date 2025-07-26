import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ActionButton from '../components/ActionButton';
import './Home.css';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    availableItems: 0,
    activeLoans: 0,
    pendingRequests: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // Cargar estadísticas dinámicas desde localStorage
    const loadStats = () => {
      const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
      const loans = JSON.parse(localStorage.getItem('loans')) || [];
      const loanRequests = JSON.parse(localStorage.getItem('loanRequests')) || [];
      const users = JSON.parse(localStorage.getItem('users')) || [];

      setStats({
        availableItems: inventory.filter(item => item.status === 'disponible').length,
        activeLoans: loans.filter(loan => loan.status === 'activo').length,
        pendingRequests: loanRequests.filter(request => request.status === 'pendiente').length,
        totalUsers: users.length
      });
    };

    loadStats();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };
  
  return (
    <div className="home-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Panel de Control</h1>
      </div>
      
      <div className="welcome-banner">
        <h2 className="home-title">Bienvenido al Sistema de Inventario Escolar</h2>
        <p className="home-paragraph">
          Este sistema te permite gestionar los elementos tecnológicos y pedagógicos que se encuentran dentro de la institución.
          Aquí podrás registrar préstamos, devoluciones y llevar un control claro de los recursos disponibles.
        </p>
      </div>
      
      {user && user.role === 'coordinador' && (
        <div className="home-stats">
          <div className="stat-item">
            <div className="stat-value">{stats.availableItems}</div>
            <div className="stat-label">Elementos Disponibles</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.activeLoans}</div>
            <div className="stat-label">Préstamos Activos</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.pendingRequests}</div>
            <div className="stat-label">Solicitudes Pendientes</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Usuarios Registrados</div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;
