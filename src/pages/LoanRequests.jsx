import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import Modal from '../components/Modal'
import ActionButton from '../components/ActionButton'

const LoanRequests = () => {
  const { user, addToHistory } = useContext(AuthContext)
  const [loanRequests, setLoanRequests] = useState([])
  const [items, setItems] = useState([])
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('pendientes')

  useEffect(() => {
    // Cargar solicitudes de préstamo
    const storedRequests = JSON.parse(localStorage.getItem('loanRequests')) || []
    setLoanRequests(storedRequests)
    
    // Cargar inventario
    const storedItems = JSON.parse(localStorage.getItem('inventory')) || []
    setItems(storedItems)
  }, [])

  const handleApprove = (requestId) => {
    const request = loanRequests.find(req => req.id === requestId)
    if (!request) return
    
    setSelectedRequest(request)
    setShowApproveModal(true)
  }

  const confirmApprove = () => {
    if (!selectedRequest) return

    // Actualizar estado de la solicitud
    const updatedRequests = loanRequests.map(req => 
      req.id === selectedRequest.id ? { ...req, status: 'Aprobado' } : req
    )

    // Guardar cambios
    setLoanRequests(updatedRequests)
    localStorage.setItem('loanRequests', JSON.stringify(updatedRequests))

    setShowApproveModal(false)
    setSelectedRequest(null)
    setMessage({ text: 'Solicitud aprobada exitosamente', type: 'success' })
    setTimeout(() => setMessage(''), 3000)

    // Generar comprobante
    generatePDF({ ...selectedRequest, status: 'Aprobado' })
  }

  const handleReject = (requestId) => {
    const request = loanRequests.find(req => req.id === requestId)
    if (!request) return
    
    setSelectedRequest(request)
    setShowRejectModal(true)
  }

  const confirmReject = () => {
    if (!selectedRequest) return

    // Actualizar estado de la solicitud
    const updatedRequests = loanRequests.map(req => 
      req.id === selectedRequest.id ? { ...req, status: 'Rechazado' } : req
    )

    // Guardar cambios
    setLoanRequests(updatedRequests)
    localStorage.setItem('loanRequests', JSON.stringify(updatedRequests))
    
    setShowRejectModal(false)
    setSelectedRequest(null)
    setMessage({ text: 'Solicitud rechazada', type: 'success' })
    setTimeout(() => setMessage(''), 3000)
  }

  const handleStatusChange = (requestId, newStatus) => {
    // Buscar la solicitud
    const request = loanRequests.find(req => req.id === requestId)
    if (!request) return

    // Actualizar estado de la solicitud
    const updatedRequests = loanRequests.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    )

    // Si el estado es "Entregado", actualizar el estado del artículo a "prestado"
    if (newStatus === 'Entregado') {
      const updatedItems = items.map(item => 
        item.id === request.itemId ? { ...item, status: 'prestado' } : item
      )
      setItems(updatedItems)
      localStorage.setItem('inventory', JSON.stringify(updatedItems))

      // Registrar en historial
      const selectedItem = items.find(item => item.id === request.itemId)
      if (selectedItem) {
        addToHistory('prestamo', selectedItem)
      }

      // Agregar a préstamos activos
      const loans = JSON.parse(localStorage.getItem('loans')) || []
      const newLoan = {
        id: Date.now(),
        itemId: request.itemId,
        itemName: request.itemName,
        itemCode: request.itemCode,
        userId: request.userId,
        userName: request.userName,
        observations: request.observations,
        loanDate: request.loanDate,
        returnDate: request.returnDate,
        status: 'prestado',
        createdBy: user.email
      }
      loans.unshift(newLoan)
      localStorage.setItem('loans', JSON.stringify(loans))
    }

    // Guardar cambios
    setLoanRequests(updatedRequests)
    localStorage.setItem('loanRequests', JSON.stringify(updatedRequests))
  }

  const generatePDF = (request) => {
    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(20)
    doc.text('Comprobante de Solicitud de Préstamo', 105, 20, { align: 'center' })
    
    // Información de la solicitud
    doc.setFontSize(12)
    doc.text(`Fecha de solicitud: ${new Date(request.requestDate).toLocaleDateString()}`, 20, 40)
    doc.text(`ID de Solicitud: ${request.id}`, 20, 50)
    doc.text(`Estado: ${request.status}`, 20, 60)
    
    // Información del artículo
    doc.text('Información del Artículo:', 20, 80)
    doc.text(`Nombre: ${request.itemName}`, 30, 90)
    doc.text(`Código: ${request.itemCode}`, 30, 100)
    
    // Información del usuario
    doc.text('Información del Usuario:', 20, 120)
    doc.text(`Nombre: ${request.userName}`, 30, 130)
    doc.text(`Email: ${request.userId}`, 30, 140)
    
    // Fechas
    doc.text(`Fecha de préstamo: ${new Date(request.loanDate).toLocaleDateString()}`, 20, 160)
    doc.text(`Fecha de devolución prevista: ${new Date(request.returnDate).toLocaleDateString()}`, 20, 170)
    
    // Observaciones
    if (request.observations) {
      doc.text('Observaciones:', 20, 190)
      doc.text(request.observations, 30, 200)
    }
    
    // Firmas
    doc.text('Firma del Responsable: ___________________', 20, 230)
    doc.text('Firma del Usuario: ___________________', 20, 250)
    
    // Guardar PDF
    doc.save(`comprobante_solicitud_${request.id}.pdf`)
  }

  // Funciones auxiliares para filtrar solicitudes
  const getFilteredRequests = () => {
    switch (activeTab) {
      case 'pendientes':
        return loanRequests.filter(req => req.status === 'Pendiente de entrega')
      case 'aprobadas':
        return loanRequests.filter(req => req.status === 'Aprobado')
      case 'finalizadas':
        return loanRequests.filter(req => req.status === 'Rechazado' || req.status === 'Entregado')
      default:
        return []
    }
  }

  const getTabCounts = () => {
    return {
      pendientes: loanRequests.filter(req => req.status === 'Pendiente de entrega').length,
      aprobadas: loanRequests.filter(req => req.status === 'Aprobado').length,
      finalizadas: loanRequests.filter(req => req.status === 'Rechazado' || req.status === 'Entregado').length
    }
  }

  const renderTableContent = () => {
    const filteredRequests = getFilteredRequests()
    
    if (filteredRequests.length === 0) {
      const emptyMessages = {
        pendientes: 'No hay solicitudes pendientes.',
        aprobadas: 'No hay solicitudes aprobadas.',
        finalizadas: 'No hay solicitudes finalizadas.'
      }
      
      return (
        <tr>
          <td colSpan="7" className="text-center">{emptyMessages[activeTab]}</td>
        </tr>
      )
    }

    return filteredRequests.map(request => (
      <tr key={request.id}>
        <td>{new Date(request.requestDate).toLocaleDateString()}</td>
        <td>{request.itemName} ({request.itemCode})</td>
        <td>{request.userName}</td>
        <td>{new Date(request.loanDate).toLocaleDateString()}</td>
        <td>{new Date(request.returnDate).toLocaleDateString()}</td>
        <td>
          {activeTab === 'pendientes' && (
            <span className="status-badge pendiente">{request.status}</span>
          )}
          {activeTab === 'aprobadas' && (
            <select
              value={request.status}
              onChange={(e) => handleStatusChange(request.id, e.target.value)}
              className="status-select"
            >
              <option value="Aprobado">Aprobado</option>
              <option value="Entregado">Entregado</option>
            </select>
          )}
          {activeTab === 'finalizadas' && (
            <span className={`status-badge ${request.status.toLowerCase()}`}>
              {request.status}
            </span>
          )}
        </td>
        <td>
           <div className="action-buttons">
             {activeTab === 'pendientes' && (
               <>
                 <ActionButton 
                   variant="success" 
                   size="small"
                   onClick={() => handleApprove(request.id)}
                 >
                   Aprobar
                 </ActionButton>
                 <ActionButton 
                   variant="danger" 
                   size="small"
                   onClick={() => handleReject(request.id)}
                 >
                   Rechazar
                 </ActionButton>
               </>
             )}
             {(activeTab === 'aprobadas' || activeTab === 'finalizadas') && (
               <ActionButton 
                 variant="secondary" 
                 size="small"
                 onClick={() => generatePDF(request)}
               >
                 Comprobante
               </ActionButton>
             )}
           </div>
         </td>
      </tr>
    ))
  }

  // Verificar si el usuario es coordinador
  if (!user || user.role !== 'coordinador') {
    return <p>No tienes permisos para acceder a esta página.</p>
  }

  const tabCounts = getTabCounts()

  return (
    <div className="inventory-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Solicitudes de Préstamo</h2>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Sistema de pestañas */}
      <div className="tabs-container">
        <div className="tabs-nav">
          <button
            className={`tab-button ${activeTab === 'pendientes' ? 'active' : ''}`}
            onClick={() => setActiveTab('pendientes')}
          >
            <span className="tab-title">Solicitudes Pendientes</span>
            {tabCounts.pendientes > 0 && (
              <span className="tab-count">{tabCounts.pendientes}</span>
            )}
          </button>
          <button
            className={`tab-button ${activeTab === 'aprobadas' ? 'active' : ''}`}
            onClick={() => setActiveTab('aprobadas')}
          >
            <span className="tab-title">Solicitudes Aprobadas</span>
            {tabCounts.aprobadas > 0 && (
              <span className="tab-count">{tabCounts.aprobadas}</span>
            )}
          </button>
          <button
            className={`tab-button ${activeTab === 'finalizadas' ? 'active' : ''}`}
            onClick={() => setActiveTab('finalizadas')}
          >
            <span className="tab-title">Solicitudes Finalizadas</span>
            {tabCounts.finalizadas > 0 && (
              <span className="tab-count">{tabCounts.finalizadas}</span>
            )}
          </button>
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="tab-content">
          <div className="card">
            <div className="compact-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Fecha Solicitud</th>
                    <th>Artículo</th>
                    <th>Usuario</th>
                    <th>Fecha Préstamo</th>
                    <th>Fecha Devolución</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableContent()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para confirmar aprobación */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Confirmar Aprobación"
      >
        {selectedRequest && (
          <div>
            <p>¿Estás seguro de que deseas aprobar la siguiente solicitud?</p>
            <div className="loan-details">
              <p><strong>Artículo:</strong> {selectedRequest.itemName} ({selectedRequest.itemCode})</p>
              <p><strong>Usuario:</strong> {selectedRequest.userName}</p>
              <p><strong>Fecha de préstamo:</strong> {new Date(selectedRequest.loanDate).toLocaleDateString()}</p>
              <p><strong>Fecha de devolución:</strong> {new Date(selectedRequest.returnDate).toLocaleDateString()}</p>
            </div>
            <div className="modal-actions">
              <ActionButton 
                variant="secondary" 
                onClick={() => setShowApproveModal(false)}
              >
                Cancelar
              </ActionButton>
              <ActionButton 
                variant="primary" 
                onClick={confirmApprove}
              >
                Aprobar Solicitud
              </ActionButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para confirmar rechazo */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Confirmar Rechazo"
      >
        {selectedRequest && (
          <div>
            <p>¿Estás seguro de que deseas rechazar la siguiente solicitud?</p>
            <div className="loan-details">
              <p><strong>Artículo:</strong> {selectedRequest.itemName} ({selectedRequest.itemCode})</p>
              <p><strong>Usuario:</strong> {selectedRequest.userName}</p>
              <p><strong>Fecha de préstamo:</strong> {new Date(selectedRequest.loanDate).toLocaleDateString()}</p>
            </div>
            <div className="modal-actions">
              <ActionButton 
                variant="secondary" 
                onClick={() => setShowRejectModal(false)}
              >
                Cancelar
              </ActionButton>
              <ActionButton 
                variant="danger" 
                onClick={confirmReject}
              >
                Rechazar Solicitud
              </ActionButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default LoanRequests