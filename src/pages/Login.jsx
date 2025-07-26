import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Auth.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isEmailRegistered } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isEmailRegistered(email)) {
      setError('El correo no está registrado')
      return
    }
    if (login(email, password)) {
      navigate('/')
    } else {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Iniciar Sesión</h1>
          <p>Ingrese sus credenciales para acceder al sistema</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              autoComplete="username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              autoComplete="current-password"
              required
            />
          </div>
          
          <button type="submit" className="auth-button">Iniciar Sesión</button>
        </form>
        
        <div className="auth-links">
          <Link to="/register" className="auth-link">Registrarse</Link>
          <Link to="/restablecer-password" className="auth-link">¿Olvidó su contraseña?</Link>
        </div>
      </div>
    </div>
  )
}

export default Login