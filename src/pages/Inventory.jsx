import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Modal from '../components/Modal'
import ActionButton from '../components/ActionButton'
import '../components/ActionButton.css'

const Inventory = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newItem, setNewItem] = useState({ name: '', code: '', status: 'disponible' })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const { user } = useContext(AuthContext)
  
  // Estados para los modales
  const [showAddEditModal, setShowAddEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLoanRequestModal, setShowLoanRequestModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loanRequest, setLoanRequest] = useState({
    itemId: '',
    userId: '',
    userName: '',
    userEmail: '',
    loanDate: '',
    returnDate: '',
    observations: '',
    status: 'Pendiente de entrega'
  })

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('inventory')) || []
    setItems(storedItems)
    setFilteredItems(storedItems)
    
    // Establecer fecha mínima para solicitud (1 día después)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0]
    
    // Establecer fecha mínima para devolución (5 días después de la fecha de préstamo)
    const minReturnDate = new Date()
    minReturnDate.setDate(minReturnDate.getDate() + 6) // +1 día de mañana + 5 días mínimo
    const minReturnFormatted = minReturnDate.toISOString().split('T')[0]
    
    setLoanRequest(prev => ({
      ...prev,
      loanDate: tomorrowFormatted,
      returnDate: minReturnFormatted,
      userId: user?.email || '',
      userName: user?.name || '',
      userEmail: user?.email || ''
    }))
  }, [user])

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
    setShowAddEditModal(false)
    setMessage({ text: 'Artículo agregado exitosamente', type: 'success' })
    setTimeout(() => setMessage(''), 3000)
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
    setShowAddEditModal(false)
    setMessage({ text: 'Artículo actualizado exitosamente', type: 'success' })
    setTimeout(() => setMessage(''), 3000)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setNewItem({ ...item })
    setShowAddEditModal(true)
  }

  const openAddModal = () => {
    setEditingId(null)
    setNewItem({ name: '', code: '', status: 'disponible' })
    setShowAddEditModal(true)
  }

  const confirmDelete = (item) => {
    setSelectedItem(item)
    setShowDeleteModal(true)
  }

  const handleDelete = () => {
    if (!selectedItem) return
    
    const updatedItems = items.filter(item => item.id !== selectedItem.id)
    setItems(updatedItems)
    saveToLocalStorage(updatedItems)
    setShowDeleteModal(false)
    setSelectedItem(null)
    setMessage({ text: 'Artículo eliminado exitosamente', type: 'success' })
    setTimeout(() => setMessage(''), 3000)
  }

  const handleStatusChange = (id, newStatus) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    )
    setItems(updatedItems)
    saveToLocalStorage(updatedItems)
  }
  
  // Funciones para el modal de solicitud de préstamo
  const handleLoanRequest = (item) => {
    setSelectedItem(item)
    setLoanRequest({
      ...loanRequest,
      itemId: item.id,
      itemName: item.name,
      itemCode: item.code,
      userName: user.name,
      userEmail: user.email
    })
    setShowLoanRequestModal(true)
  }
  
  const handleLoanRequestChange = (e) => {
    const { name, value } = e.target
    setLoanRequest({
      ...loanRequest,
      [name]: value
    })
    
    // Si cambia la fecha de préstamo, actualizar la fecha mínima de devolución
    if (name === 'loanDate') {
      const loanDate = new Date(value)
      const minReturnDate = new Date(loanDate)
      minReturnDate.setDate(loanDate.getDate() + 5) // 5 días mínimo después de la fecha de préstamo
      const minReturnFormatted = minReturnDate.toISOString().split('T')[0]
      
      setLoanRequest(prev => ({
        ...prev,
        returnDate: minReturnFormatted
      }))
    }
  }
  
  const submitLoanRequest = () => {
    // Validar campos requeridos
    if (!loanRequest.userName || !loanRequest.userEmail || !loanRequest.loanDate || !loanRequest.returnDate) {
      setMessage({ text: 'Por favor complete todos los campos requeridos', type: 'error' })
      return
    }

    // Validar fechas
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const loanDate = new Date(loanRequest.loanDate)
    loanDate.setHours(0, 0, 0, 0)
    
    const returnDate = new Date(loanRequest.returnDate)
    returnDate.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    const minReturnDate = new Date(loanDate)
    minReturnDate.setDate(loanDate.getDate() + 5)
    
    // Validar que la fecha de préstamo sea al menos un día después
    if (loanDate < tomorrow) {
      setMessage({ text: 'La fecha de préstamo debe ser al menos un día después de hoy', type: 'error' })
      return
    }
    
    // Validar que la duración del préstamo sea de al menos 5 días
    if (returnDate < minReturnDate) {
      setMessage({ text: 'La duración del préstamo debe ser de al menos 5 días', type: 'error' })
      return
    }
    
    // Crear nueva solicitud
    const newRequest = {
      id: Date.now(),
      ...loanRequest,
      userId: user.id,
      userName: loanRequest.userName || user.name,
      userEmail: loanRequest.userEmail || user.email,
      timestamp: new Date().toISOString(),
      status: 'Pendiente de entrega'
    }

    // Obtener solicitudes existentes o inicializar array
    const existingRequests = JSON.parse(localStorage.getItem('loanRequests')) || []
    const updatedRequests = [...existingRequests, newRequest]
    
    // Guardar en localStorage
    localStorage.setItem('loanRequests', JSON.stringify(updatedRequests))

    // Registrar en historial
    const historyEntry = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      action: 'solicitud_prestamo',
      timestamp: new Date().toISOString(),
      details: `Solicitud de préstamo para ${selectedItem.name} por ${newRequest.userName}`
    }
    
    const existingHistory = JSON.parse(localStorage.getItem('history')) || []
    localStorage.setItem('history', JSON.stringify([...existingHistory, historyEntry]))

    // Cerrar modal y mostrar mensaje
    setShowLoanRequestModal(false)
    setMessage({ text: 'Solicitud de préstamo enviada con éxito', type: 'success' })
    setLoanRequest({
      itemId: '',
      userId: '',
      userName: '',
      userEmail: '',
      loanDate: '',
      returnDate: '',
      observations: '',
      status: 'Pendiente de entrega'
    })
    setSelectedItem(null)
  }

  if (!user) {
    return <p>Debes iniciar sesión para ver el inventario.</p>
  }

  return (
    <>
      <div className="inventory-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Gestión de Inventario</h2>
          {user.role === 'coordinador' && (
            <ActionButton 
              variant="primary" 
              onClick={openAddModal}
            >
              Agregar Artículo
            </ActionButton>
          )}
        </div>

        {message && (
          <div className={message.type}>
            {message.text}
          </div>
        )}
        
        <div className="card">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="inventory-table">
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
                    <span className={`status-badge ${item.status}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {user.role === 'coordinador' ? (
                      <div className="action-buttons">
                        <ActionButton 
                          variant="secondary" 
                          size="small" 
                          onClick={() => handleEdit(item)}
                        >
                          Editar
                        </ActionButton>
                        <ActionButton 
                          variant="danger" 
                          size="small" 
                          onClick={() => confirmDelete(item)}
                        >
                          Eliminar
                        </ActionButton>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="disponible">Disponible</option>
                          <option value="prestado">Prestado</option>
                          <option value="mantenimiento">En Mantenimiento</option>
                          <option value="eliminado">Eliminado</option>
                        </select>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        {item.status === 'disponible' && (
                          <ActionButton 
                            variant="primary" 
                            size="small" 
                            onClick={() => handleLoanRequest(item)}
                          >
                            Solicitar
                          </ActionButton>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
          </div>
        </div>
      </div>
      
      {/* Modal para Agregar/Editar Artículo */}
      <Modal 
        isOpen={showAddEditModal} 
        onClose={() => setShowAddEditModal(false)}
        
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          editingId ? handleUpdateItem() : handleAddItem()
        }}>
          <div className="form-container">
            <div className="form-section">
              <h4>Información del Artículo</h4>
              
              <div className="form-group">
                <label htmlFor="item-name">Nombre del Artículo:</label>
                <input
                  type="text"
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Ej: Laptop Dell Inspiron 15"
                  required
                  
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="item-code">Código de Identificación:</label>
                  <input
                    type="text"
                    id="item-code"
                    value={newItem.code}
                    onChange={(e) => setNewItem({...newItem, code: e.target.value})}
                    placeholder="Ej: LAP-001"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="item-status">Estado del Artículo:</label>
                  <select
                    id="item-status"
                    value={newItem.status}
                    onChange={(e) => setNewItem({...newItem, status: e.target.value})}
                    required
                  >
                    <option value="disponible">Disponible</option>
                    <option value="prestado">Prestado</option>
                    <option value="mantenimiento">En Mantenimiento</option>
                    <option value="eliminado">Eliminado</option>
                  </select>
                </div>
              </div>
           
        
          
          <div className="modal-actions">
            <ActionButton 
              variant="secondary" 
              type="button"
              onClick={() => setShowAddEditModal(false)}
            >
              Cancelar
            </ActionButton>
            <ActionButton 
              variant="primary" 
              type="submit"
            >
              {editingId ? 'Actualizar Artículo' : 'Agregar Artículo'}
            </ActionButton>
          </div>
            </div>
             </div>
        </form>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        <p>¿Está seguro que desea eliminar el artículo <strong>{selectedItem?.name}</strong>?</p>
        <p style={{ color: '#d32f2f', fontSize: '0.9em' }}>Esta acción no se puede deshacer.</p>
        
        <div className="modal-actions">
          <ActionButton 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
          >
            Cancelar
          </ActionButton>
          <ActionButton 
            variant="danger" 
            onClick={handleDelete}
          >
            Eliminar
          </ActionButton>
        </div>
      </Modal>

      {/* Modal de Solicitud de Préstamo */}
      <Modal 
        isOpen={showLoanRequestModal} 
        onClose={() => setShowLoanRequestModal(false)}
        title="Solicitar Préstamo de Artículo"
      >
        {selectedItem && (
          <form onSubmit={(e) => {
            e.preventDefault()
            submitLoanRequest()
          }}>
            <div className="form-container">
              <div className="form-group">
                <label htmlFor="selected-item">Artículo Seleccionado:</label>
                <input 
                  type="text" 
                  id="selected-item"
                  value={`${selectedItem.name} (${selectedItem.code})`} 
                  disabled 
                  className="disabled-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="user-name">Nombre del Solicitante:</label>
                  <input 
                    type="text" 
                    id="user-name"
                    name="userName"
                    value={loanRequest.userName}
                    onChange={handleLoanRequestChange}
                    placeholder="Nombre completo"
                    required
                    autoFocus
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="user-email">Correo Electrónico:</label>
                  <input 
                    type="email" 
                    id="user-email"
                    name="userEmail"
                    value={loanRequest.userEmail}
                    onChange={handleLoanRequestChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="loan-date">Fecha de Préstamo:</label>
                  <input 
                    type="date" 
                    id="loan-date"
                    name="loanDate"
                    value={loanRequest.loanDate}
                    onChange={handleLoanRequestChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="return-date">Fecha de Devolución:</label>
                  <input 
                    type="date" 
                    id="return-date"
                    name="returnDate"
                    value={loanRequest.returnDate}
                    onChange={handleLoanRequestChange}
                    min={loanRequest.loanDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="observations">Observaciones:</label>
                <textarea 
                  id="observations"
                  rows={3} 
                  name="observations"
                  value={loanRequest.observations}
                  onChange={handleLoanRequestChange}
                  placeholder="Observaciones adicionales (opcional)"
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <ActionButton 
                variant="secondary" 
                type="button"
                onClick={() => setShowLoanRequestModal(false)}
              >
                Cancelar
              </ActionButton>
              <ActionButton 
                variant="primary" 
                type="submit"
              >
                Enviar Solicitud
              </ActionButton>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}

export default Inventory