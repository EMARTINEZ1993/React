import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import Modal from '../components/Modal'
import ActionButton from '../components/ActionButton'
import '../components/ActionButton.css'

const History = () => {
  const { user, history } = useContext(AuthContext)
  const [userHistory, setUserHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredHistory, setFilteredHistory] = useState([])
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    if (user.role === 'coordinador') {
      setUserHistory(history)
    } else {
      setUserHistory(history.filter(entry => entry.userId === user.email))
    }
  }, [history, user])

  useEffect(() => {
    const filtered = userHistory.filter(entry => 
      entry.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredHistory(filtered)
  }, [searchTerm, userHistory])

  const handleViewDetail = (entry) => {
    setSelectedEntry(entry)
    setShowDetailModal(true)
  }

  const getActionLabel = (action) => {
    switch(action) {
      case 'prestamo': return 'Préstamo'
      case 'devolucion': return 'Devolución'
      default: return 'Actualización'
    }
  }

  const getActionClass = (action) => {
    switch(action) {
      case 'prestamo': return 'status-prestado'
      case 'devolucion': return 'status-disponible'
      default: return ''
    }
  }

  return (
    <div className="history-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Historial de Préstamos</h2>
        <div className="dashboard-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por elemento, usuario o acción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Elemento</th>
              <th>Acción</th>
              {user.role === 'coordinador' && <th>Usuario</th>}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={user.role === 'coordinador' ? 5 : 4} className="text-center">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay registros en el historial'}
                </td>
              </tr>
            ) : (
              filteredHistory.map(entry => (
                <tr key={entry.id}>
                  <td>{new Date(entry.date).toLocaleString()}</td>
                  <td>{entry.itemName}</td>
                  <td>
                    <span className={getActionClass(entry.action)}>
                      {getActionLabel(entry.action)}
                    </span>
                  </td>
                  {user.role === 'Préstamocoordinador' && <td>{entry.userId}</td>}
                  <td>
                    <div className="action-buttons-container">
                      <ActionButton 
                        variant="secondary" 
                        onClick={() => handleViewDetail(entry)}
                      >
                        Ver Detalles
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title=" "
      >
        {selectedEntry && (
          <div className="detail-container">
                <h4>Detalles del Registro de Préstamo</h4>
            <div className="detail-content" style={{ margin: '20px 0' }}>
              <div className="detail-info">
                <div className="detail-row">
                  <span className="detail-label">Fecha y Hora:</span>
                  <span className="detail-value">{new Date(selectedEntry.date).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tipo de Acción:</span>
                  <span className={`detail-value badge ${getActionClass(selectedEntry.action)}`}>
                    {getActionLabel(selectedEntry.action)}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Nombre del Artículo:</span>
                  <span className="detail-value">{selectedEntry.itemName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Código de Identificación:</span>
                  <span className="detail-value">{selectedEntry.itemCode || 'No especificado'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Usuario Responsable:</span>
                  <span className="detail-value">{selectedEntry.userId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Rol del Usuario:</span>
                  <span className="detail-value">{selectedEntry.userRole || 'No especificado'}</span>
                </div>
                
                {selectedEntry.observations && (
                  <>
                    <h5 className="detail-subtitle">Observaciones</h5>
                    <div className="detail-row">
                      <span className="detail-value observations">{selectedEntry.observations}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <ActionButton 
                variant="secondary"
                type="button"
                onClick={() => setShowDetailModal(false)}
              >
                Cerrar
              </ActionButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default History