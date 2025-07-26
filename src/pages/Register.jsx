import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Auth.css'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('docente')
  const [error, setError] = useState('')
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    const userData = { name, email, password, role }
    const result = register(userData)

    if (result.success) {
      alert('Registro exitoso')
      navigate('/login')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Registro de Usuario</h1>
          <p>Complete el formulario para crear una nueva cuenta</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese su nombre completo"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
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
              placeholder="Mínimo 8 caracteres"
              required
            />
            {password.length > 0 && password.length < 8 && (
              <div className="password-hint">La contraseña debe tener al menos 8 caracteres</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="docente">Docente</option>
              <option value="coordinador">Coordinador</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={password.length < 8}
          >
            Registrarse
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/login" className="auth-link">¿Ya tiene una cuenta? Inicie sesión</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
