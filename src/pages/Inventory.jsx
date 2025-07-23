import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Inventory = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newItem, setNewItem] = useState({ name: '', code: '', status: 'disponible' })
  const [editingId, setEditingId] = useState(null)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('inventory')) || []
    setItems(storedItems)
    setFilteredItems(storedItems)
  }, [])

  useEffect(() => {
    const results = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredItems(results)
  }, [searchTerm, items])

  const saveToLocalStorage = (data) => {
    localStorage.setItem('inventory', JSON.stringify(data))
  }

  const handleAddItem = () => {
    if (!newItem.name || !newItem.code) return
    
    const updatedItems = [...items, { ...newItem, id: Date.now() }]
    setItems(updatedItems)
    saveToLocalStorage(updatedItems)
    setNewItem({ name: '', code: '', status: 'disponible' })
  }

  const handleUpdateItem = () => {
    if (!newItem.name || !newItem.code) return
    
    const updatedItems = items.map(item =>
      item.id === editingId ? { ...newItem, id: editingId } : item
    )
    setItems(updatedItems)
    saveToLocalStorage(updatedItems)
    setEditingId(null)
    setNewItem({ name: '', code: '', status: 'disponible' })
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setNewItem({ ...item })
  }

  const handleDelete = (id) => {
    const updatedItems = items.filter(item => item.id !== id)
    setItems(updatedItems)
    saveToLocalStorage(updatedItems)
  }

  const handleStatusChange = (id, newStatus) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    )
    setItems(updatedItems)
    saveToLocalStorage(updatedItems)
  }

  if (!user) {
    return <p>Debes iniciar sesión para ver el inventario.</p>
  }

  return (
    <div className="inventory-container">
      <h2>Gestión de Inventario</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {user.role === 'coordinador' && (
        <div className="item-form">
          <h3>{editingId ? 'Editar Elemento' : 'Agregar Nuevo Elemento'}</h3>
          <input
            type="text"
            placeholder="Nombre"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Código"
            value={newItem.code}
            onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
          />
          <select
            value={newItem.status}
            onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
          >
            <option value="disponible">Disponible</option>
            <option value="prestado">Prestado</option>
            <option value="mantenimiento">En mantenimiento</option>
          </select>
          {editingId ? (
            <button onClick={handleUpdateItem}>Actualizar</button>
          ) : (
            <button onClick={handleAddItem}>Agregar</button>
          )}
          {editingId && (
            <button onClick={() => {
              setEditingId(null)
              setNewItem({ name: '', code: '', status: 'disponible' })
            }}>Cancelar</button>
          )}
        </div>
      )}

      <div className="items-list">
        <h3>Elementos del Inventario</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Código</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="4">No hay elementos en el inventario.</td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.code}</td>
                  <td>
                    {user.role === 'coordinador' ? (
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="prestado">Prestado</option>
                        <option value="mantenimiento">En mantenimiento</option>
                      </select>
                    ) : (
                      <span className={`status-${item.status}`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {user.role === 'coordinador' && (
                      <>
                        <button onClick={() => handleEdit(item)}>Editar</button>
                        <button onClick={() => handleDelete(item.id)}>Eliminar</button>
                      </>
                    )}
                    {user.role === 'docente' && item.status === 'disponible' && (
                      <button onClick={() => handleStatusChange(item.id, 'prestado')}>
                        Prestar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Inventory