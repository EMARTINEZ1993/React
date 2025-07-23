// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Importar el CSS externo



function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenida al Sistema de Inventario Escolar</h1>

      <p className="home-paragraph">
        Este sistema te permite gestionar los elementos tecnológicos y pedagógicos que se encuentran dentro de la institución.
        Aquí podrás registrar préstamos, devoluciones y llevar un control claro de los recursos disponibles.
      </p>

      <div className="card-container">
        <div className="home-card">
          <h3>📦 Registrar Elementos</h3>
          <p>Agrega nuevos elementos al inventario como computadores, proyectores, cables, etc.</p>
          <Link to="/inventario" className="home-button">Ir al Inventario</Link>
        </div>

        <div className="home-card">
          <h3>👩‍🏫 Consultar Préstamos</h3>
          <p>Consulta los elementos que han sido prestados a los docentes.</p>
          <Link to="/prestamos" className="home-button">Ver Préstamos</Link>
        </div>

        <div className="home-card">
          <h3>🔒 Acceder al Sistema</h3>
          <p>Inicia sesión como Coordinador o Docente para realizar gestiones.</p>
          <Link to="/login" className="home-button">Iniciar Sesión</Link>
        </div>
      </div>


    </div>
  );
}

export default Home;
