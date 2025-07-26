import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import ActionButton from '../components/ActionButton'

const RequestLoan = () => {
  const { user } = useContext(AuthContext)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState('')
  const [loanDate, setLoanDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [observations, setObservations] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Cargar inventario disponible
    const storedItems = JSON.parse(localStorage.getItem('inventory')) || []
    const availableItems = storedItems.filter(item => item.status === 'disponible')
    setItems(availableItems)
  }, [])

  const handleCreateRequest = (e) => {
    e.preventDefault()
    
    if (!selectedItem || !loanDate || !returnDate) {
      setMessage({ text: 'Por favor completa todos los campos obligatorios', type: 'error' })
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const item = items.find(i => i.id === parseInt(selectedItem))
    if (!item) return

    const newRequest = {
      id: Date.now(),
      itemId: item.id,
      itemName: item.name,
      itemCode: item.code,
      userId: user.email,
      userName: user.name,
      loanDate,
      returnDate,
      observations,
      requestDate: new Date().toISOString(),
      status: 'Pendiente'
    }

    // Agregar a todas las solicitudes
    const allRequests = JSON.parse(localStorage.getItem('loanRequests')) || []
    allRequests.unshift(newRequest)
    localStorage.setItem('loanRequests', JSON.stringify(allRequests))

    // Limpiar formulario
    setSelectedItem('')
    setLoanDate('')
    setReturnDate('')
    setObservations('')
    setMessage({ text: 'Solicitud creada exitosamente', type: 'success' })
    setTimeout(() => setMessage(''), 3000)
  }

  // Verificar si el usuario es docente
  if (!user || user.role !== 'docente') {
    return <p>No tienes permisos para acceder a esta página.</p>
  }

  return (
    <div className="inventory-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Solicitar Préstamo</h2>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}
      
      <div className="card">
        <h3>Nueva Solicitud de Préstamo</h3>
        <form onSubmit={handleCreateRequest}>
          <div>
            <label>Artículo *</label>
            <select 
              value={selectedItem} 
              onChange={(e) => setSelectedItem(e.target.value)}
              required
            >
              <option value="">Seleccionar artículo</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.code} - {item.category}
                </option>
              ))}
            </select>
            {items.length === 0 && (
              <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                No hay artículos disponibles para préstamo en este momento.
              </p>
            )}
          </div>

          {selectedItem && (
            <div className="selected-item-info">
              <h4>Información del Artículo Seleccionado</h4>
              {(() => {
                const item = items.find(i => i.id === parseInt(selectedItem))
                return item ? (
                  <div className="item-details">
                    <p><strong>Nombre:</strong> {item.name}</p>
                    <p><strong>Código:</strong> {item.code}</p>
                    <p><strong>Categoría:</strong> {item.category}</p>
                    <p><strong>Descripción:</strong> {item.description || 'Sin descripción'}</p>
                    <p><strong>Estado:</strong> <span style={{ color: '#27ae60' }}>Disponible</span></p>
                  </div>
                ) : null
              })()}
            </div>
          )}

          <div>
            <label>Fecha de Préstamo *</label>
            <input 
              type="date" 
              value={loanDate} 
              onChange={(e) => setLoanDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <label>Fecha de Devolución *</label>
            <input 
              type="date" 
              value={returnDate} 
              onChange={(e) => setReturnDate(e.target.value)}
              min={loanDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <label>Observaciones</label>
            <textarea 
              value={observations} 
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observaciones adicionales sobre el uso del artículo (opcional)"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <ActionButton 
              type="submit"
              variant="primary"
              disabled={items.length === 0}
            >
              Crear Solicitud
            </ActionButton>
          </div>
        </form>
      </div>

      {/* Información adicional */}
      <div className="card">
        <h3>Información Importante</h3>
        <div className="info-section">
          <h4>📋 Proceso de Solicitud:</h4>
          <ol>
            <li>Completa el formulario con la información requerida</li>
            <li>Tu solicitud será enviada al coordinador para revisión</li>
            <li>Recibirás una notificación cuando sea aprobada o rechazada</li>
            <li>Si es aprobada, podrás recoger el artículo en las fechas indicadas</li>
          </ol>

          <h4>⚠️ Consideraciones:</h4>
          <ul>
            <li>Asegúrate de seleccionar las fechas correctas</li>
            <li>El artículo debe ser devuelto en la fecha indicada</li>
            <li>Cualquier daño debe ser reportado inmediatamente</li>
            <li>Las solicitudes fuera de horario pueden tomar más tiempo en procesarse</li>
          </ul>

          <h4>📞 Contacto:</h4>
          <p>Si tienes dudas sobre algún artículo o el proceso, contacta al coordinador del inventario.</p>
        </div>
      </div>
    </div>
  )
}

export default RequestLoan