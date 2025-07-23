import { useState, useEffect } from 'react'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editedUser, setEditedUser] = useState({ name: '', email: '', role: 'docente' })

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || []
    setUsers(storedUsers)
  }, [])

  const handleEdit = (user) => {
    setEditingId(user.email)
    setEditedUser({ ...user })
  }

  const handleUpdate = () => {
    const updatedUsers = users.map(user =>
      user.email === editingId ? editedUser : user
    )
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setEditingId(null)
  }

  const handleDelete = (email) => {
    const updatedUsers = users.filter(user => user.email !== email)
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  return (
    <div className="user-management">
      <h2>Gestión de Usuarios</h2>
      
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
              {editingId === user.email ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    />
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={editedUser.role}
                      onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                    >
                      <option value="docente">Docente</option>
                      <option value="coordinador">Coordinador</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={handleUpdate}>Guardar</button>
                    <button onClick={() => setEditingId(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Editar</button>
                    <button onClick={() => handleDelete(user.email)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagement