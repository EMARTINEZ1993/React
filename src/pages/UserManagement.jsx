import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Modal from '../components/Modal'
import ActionButton from '../components/ActionButton'

const UserManagement = () => {
  const { register } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editedUser, setEditedUser] = useState({ name: '', email: '', role: 'docente' })
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'docente' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || []
    setUsers(storedUsers)
  }, [])

  const handleEdit = (user) => {
    setEditedUser({ ...user })
    setShowEditModal(true)
    setError('')
  }

  const handleUpdate = () => {
    const updatedUsers = users.map(user =>
      user.email === editedUser.email ? editedUser : user
    )
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setShowEditModal(false)
    setMessage({ text: 'Usuario actualizado exitosamente', type: 'success' })
    setTimeout(() => setMessage(''), 3000)
  }

  const handleDeleteConfirm = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleDelete = () => {
    const updatedUsers = users.filter(user => user.email !== userToDelete.email)
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setShowDeleteModal(false)
    setUserToDelete(null)
    setMessage({ text: 'Usuario eliminado exitosamente', type: 'success' })
    setTimeout(() => setMessage(''), 3000)
  }

  const handleNewUserChange = (e) => {
    const { name, value } = e.target
    setNewUser({ ...newUser, [name]: value })
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')

    // Validar contraseña
    if (newUser.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    // Registrar usuario
    const result = register(newUser)
    
    if (result.success) {
      // Actualizar lista de usuarios
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      
      // Limpiar formulario y cerrar modal
      setNewUser({ name: '', email: '', password: '', role: 'docente' })
      setError('')
      setShowRegisterModal(false)
      setMessage({ text: 'Usuario registrado exitosamente', type: 'success' })
      setTimeout(() => setMessage(''), 3000)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="user-management">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Gestión de Usuarios</h2>
        <ActionButton 
          variant="primary" 
          onClick={() => setShowRegisterModal(true)}
        >
          Registrar Nuevo Usuario
        </ActionButton>
      </div>

      {message && (
        <div className={message.type}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h3>Usuarios Registrados</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-${user.role}`}>
                      {user.role === 'coordinador' ? 'Coordinador' : 'Docente'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <ActionButton 
                        variant="secondary" 
                        size="small"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </ActionButton>
                      <ActionButton 
                        variant="danger" 
                        size="small"
                        onClick={() => handleDeleteConfirm(user)}
                      >
                        Eliminar
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Registro */}
      <Modal 
        isOpen={showRegisterModal} 
        onClose={() => {
          setShowRegisterModal(false)
          setError('')
          setNewUser({ name: '', email: '', password: '', role: 'docente' })
        }}
        title=""
      >
        <form onSubmit={handleRegister}>
          {error && <div className="alert alert-error">{error}</div>}
          
          <div className="form-container">
            {/* Información Personal */}
            <div className="form-section">
              <h4>Registrar Nuevo Usuario</h4>
              <div className="form-group">

                <label htmlFor="user-name">Nombre Completo:</label>
                <input
                  type="text"
                  id="user-name"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  placeholder="Ej: Juan Pérez García"
                  required
                  
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="user-email">Correo Electrónico:</label>
                <input
                  type="email"
                  id="user-email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="user-password">Contraseña:</label>
                  <input
                    type="password"
                    id="user-password"
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="user-role">Rol del Usuario:</label>
                  <select
                    id="user-role"
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserChange}
                    required
                  >
                    <option value="docente">Docente</option>
                    <option value="coordinador">Coordinador</option>
                  </select>
                </div>
              </div>

          
          <div className="modal-actions">
            <ActionButton 
              variant="secondary"
              type="button"
              onClick={() => {
                setShowRegisterModal(false)
                setError('')
                setNewUser({ name: '', email: '', password: '', role: 'docente' })
              }}
            >
              Cancelar
            </ActionButton>
            <ActionButton 
              type="submit" 
              variant="primary"
            >
              Registrar Usuario
            </ActionButton>
          </div>
                      </div>
          </div>
        </form>
      </Modal>

      {/* Modal de Edición */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false)
          setError('')
        }}
        title="Editar Usuario"
      >
        <div className="form-container">
          {/* Información Personal */}
          <div className="form-section">
            <h4>Información Personal</h4>
            <div className="form-group">
              <label htmlFor="edit-name">Nombre Completo:</label>
              <input
                type="text"
                id="edit-name"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                placeholder="Ingrese el nombre completo"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-email">Correo Electrónico:</label>
              <input
                type="email"
                id="edit-email"
                value={editedUser.email}
                disabled
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <small className="form-help" style={{ color: '#666' }}>
                El email no se puede modificar
              </small>
            </div>
          </div>

          {/* Permisos y Configuración */}
          <div className="form-section">
            <h4>Permisos y Configuración</h4>
            <div className="form-group">
              <label htmlFor="edit-role">Rol del Usuario:</label>
              <select
                id="edit-role"
                value={editedUser.role}
                onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                required
              >
                <option value="docente">Docente</option>
                <option value="coordinador">Coordinador</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <ActionButton 
            variant="secondary"
            type="button"
            onClick={() => {
              setShowEditModal(false)
              setError('')
            }}
          >
            Cancelar
          </ActionButton>
          <ActionButton 
            variant="primary"
            type="button"
            onClick={handleUpdate}
          >
            Guardar Cambios
          </ActionButton>
        </div>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => {
          setShowDeleteModal(false)
          setUserToDelete(null)
        }}
        title="Confirmar Eliminación"
      >
        <div className="detail-container">
          <div className="detail-content">
            <div className="detail-section">
              <p>
                ¿Está seguro de que desea eliminar al usuario <strong>{userToDelete?.name}</strong>?
              </p>
              <p style={{ color: '#d32f2f', fontSize: '0.9em', marginTop: '12px' }}>
                <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <ActionButton 
            variant="secondary"
            type="button"
            onClick={() => {
              setShowDeleteModal(false)
              setUserToDelete(null)
            }}
          >
            Cancelar
          </ActionButton>
          <ActionButton 
            variant="danger"
            type="button"
            onClick={handleDelete}
          >
            Eliminar Usuario
          </ActionButton>
        </div>
      </Modal>
    </div>
  )
}

export default UserManagement