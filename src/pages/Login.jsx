import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

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
      navigate('/inventory')
    } else {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div className="auth-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-login">Ingresar</button>
        <p id='Regis'>¿No tienes una cuenta? <a href="/Register">Regístrate</a></p>
        {error === 'Credenciales incorrectas' && (
          <p className="forgot-password">
            ¿Olvidaste tu contraseña? <a href="/restablecer_password">Restablécela aquí</a>
          </p>

        )}
      </form>
    </div>
  )
}

export default Login