import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import Modal from '../components/Modal'
import ActionButton from '../components/ActionButton'

const Loans = () => {
  const { user, addToHistory } = useContext(AuthContext)
  const [items, setItems] = useState([])
  const [users, setUsers] = useState([])
  const [availableItems, setAvailableItems] = useState([])
  const [loans, setLoans] = useState([])
  const [newLoan, setNewLoan] = useState({
    itemId: '',
    userId: '',
    observations: '',
    loanDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    status: 'prestado'
  })
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [loanToReturn, setLoanToReturn] = useState(null)
  const [message, setMessage] = useState('')

  // Cargar datos iniciales
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('inventory')) || []
    const storedUsers = JSON.parse(localStorage.getItem('users')) || []
    const storedLoans = JSON.parse(localStorage.getItem('loans')) || []
    
    setItems(storedItems)
    setUsers(storedUsers.filter(u => u.role === 'docente'))
    setLoans(storedLoans)
    
    // Filtrar solo los elementos disponibles
    setAvailableItems(storedItems.filter(item => item.status === 'disponible'))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewLoan({ ...newLoan, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newLoan.itemId || !newLoan.userId) {
      setMessage({ text: 'Por favor selecciona un artículo y un usuario', type: 'error' })
      setTimeout(() => setMessage(''), 3000)
      return
    }

    // Crear nuevo préstamo
    const loanId = Date.now()
    const selectedItem = items.find(item => item.id.toString() === newLoan.itemId)
    const selectedUser = users.find(user => user.email === newLoan.userId)
    
    const loan = {
      id: loanId,
      itemId: parseInt(newLoan.itemId),
      itemName: selectedItem.name,
      itemCode: selectedItem.code,
      userId: newLoan.userId,
      userName: selectedUser.name,
      observations: newLoan.observations,
      loanDate: newLoan.loanDate,
      returnDate: newLoan.returnDate,
      status: 'prestado',
      createdBy: user.email
    }

    // Actualizar estado del artículo a prestado
    const updatedItems = items.map(item => 
      item.id.toString() === newLoan.itemId 
        ? { ...item, status: 'prestado' } 
        : item
    )

    // Guardar cambios
    const updatedLoans = [loan, ...loans]
    setLoans(updatedLoans)
    setItems(updatedItems)
    setAvailableItems(updatedItems.filter(item => item.status === 'disponible'))
    
    localStorage.setItem('loans', JSON.stringify(updatedLoans))
    localStorage.setItem('inventory', JSON.stringify(updatedItems))
    
    // Registrar en historial
    addToHistory('prestamo', selectedItem)
    
    // Limpiar formulario y cerrar modal
    setNewLoan({
      itemId: '',
      userId: '',
      observations: '',
      loanDate: new Date().toISOString().split('T')[0],
      returnDate: '',
      status: 'prestado'
    })
    setShowLoanModal(false)
    setMessage({ text: 'Préstamo registrado exitosamente', type: 'success' })
    setTimeout(() => setMessage(''), 3000)

    // Generar comprobante
    generatePDF(loan)
  }

  const handleReturn = (loanId) => {
    const loan = loans.find(loan => loan.id === loanId)
    if (!loan) return
    
    setLoanToReturn(loan)
    setShowReturnModal(true)
  }

  const confirmReturn = () => {
    if (!loanToReturn) return

    // Actualizar estado del préstamo
    const updatedLoans = loans.map(l => 
      l.id === loanToReturn.id ? { ...l, status: 'devuelto', returnDate: new Date().toISOString().split('T')[0] } : l
    )

    // Actualizar estado del artículo
    const updatedItems = items.map(item => 
      item.id === loanToReturn.itemId ? { ...item, status: 'disponible' } : item
    )

    // Guardar cambios
    setLoans(updatedLoans)
    setItems(updatedItems)
    setAvailableItems(updatedItems.filter(item => item.status === 'disponible'))
    
    localStorage.setItem('loans', JSON.stringify(updatedLoans))
    localStorage.setItem('inventory', JSON.stringify(updatedItems))
    
    // Registrar en historial
    const returnedItem = items.find(item => item.id === loanToReturn.itemId)
    addToHistory('devolucion', returnedItem)
    
    setShowReturnModal(false)
    setLoanToReturn(null)
    setMessage({ text: 'Artículo devuelto exitosamente', type: 'success' })
    setTimeout(() => setMessage(''), 3000)
  }

  const generatePDF = (loan) => {
    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(20)
    doc.text('Comprobante de Préstamo', 105, 20, { align: 'center' })
    
    // Información del préstamo
    doc.setFontSize(12)
    doc.text(`Fecha: ${new Date(loan.loanDate).toLocaleDateString()}`, 20, 40)
    doc.text(`ID de Préstamo: ${loan.id}`, 20, 50)
    
    // Información del artículo
    doc.text('Información del Artículo:', 20, 70)
    doc.text(`Nombre: ${loan.itemName}`, 30, 80)
    doc.text(`Código: ${loan.itemCode}`, 30, 90)
    
    // Información del usuario
    doc.text('Información del Usuario:', 20, 110)
    doc.text(`Nombre: ${loan.userName}`, 30, 120)
    doc.text(`Email: ${loan.userId}`, 30, 130)
    
    // Observaciones
    if (loan.observations) {
      doc.text('Observaciones:', 20, 150)
      doc.text(loan.observations, 30, 160)
    }
    
    // Fecha de devolución prevista
    if (loan.returnDate) {
      doc.text(`Fecha de devolución prevista: ${new Date(loan.returnDate).toLocaleDateString()}`, 20, 180)
    }
    
    // Firmas
    doc.text('Firma del Responsable: ___________________', 20, 210)
    doc.text('Firma del Usuario: ___________________', 20, 230)
    
    // Guardar PDF
    doc.save(`comprobante_prestamo_${loan.id}.pdf`)
  }

  return (
    <div className="inventory-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Gestión de Préstamos</h2>
        <ActionButton 
          variant="primary" 
          onClick={() => setShowLoanModal(true)}
        >
          Nuevo Préstamo
        </ActionButton>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}
      
      <div className="card">
        <h3>Préstamos Activos</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Artículo</th>
                <th>Usuario</th>
                <th>Devolución Prevista</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loans.filter(loan => loan.status === 'prestado').length === 0 ? (
                <tr>
                  <td colSpan="5">No hay préstamos activos.</td>
                </tr>
              ) : (
                loans
                  .filter(loan => loan.status === 'prestado')
                  .map(loan => (
                    <tr key={loan.id}>
                      <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                      <td>{loan.itemName} ({loan.itemCode})</td>
                      <td>{loan.userName}</td>
                      <td>
                        {loan.returnDate 
                          ? new Date(loan.returnDate).toLocaleDateString() 
                          : 'No especificada'}
                      </td>
                      <td>
                        <ActionButton 
                          variant="secondary" 
                          onClick={() => generatePDF(loan)}
                        >
                          Comprobante
                        </ActionButton>
                        <ActionButton 
                          variant="primary" 
                          onClick={() => handleReturn(loan.id)}
                        >
                          Devolver
                        </ActionButton>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para nuevo préstamo */}
      <Modal
        isOpen={showLoanModal}
        onClose={() => setShowLoanModal(false)}
        title=""
      >
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            <div className="form-section">
              <h4>Registrar Nuevo Préstamo</h4>
              
              <div className="form-group">
                <label htmlFor="itemId">Artículo a prestar:</label>
                <select
                  id="itemId"
                  name="itemId"
                  value={newLoan.itemId}
                  onChange={handleInputChange}
                  required
                  
                >
                  <option value="">Selecciona un artículo disponible</option>
                  {availableItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - {item.code}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="userId">Usuario solicitante:</label>
                <select
                  id="userId"
                  name="userId"
                  value={newLoan.userId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un usuario</option>
                  {users.map(user => (
                    <option key={user.email} value={user.email}>
                      {user.name} - {user.email}
                    </option>
                  ))}
                </select>
              </div>

              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="loanDate">Fecha de préstamo:</label>
                  <input
                    type="date"
                    id="loanDate"
                    name="loanDate"
                    value={newLoan.loanDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="returnDate">Fecha de devolución prevista:</label>
                  <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    value={newLoan.returnDate}
                    onChange={handleInputChange}
                    placeholder="Opcional"
                    min={newLoan.loanDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
     
              
              <div className="form-group">
                <label htmlFor="observations">Notas o comentarios:</label>
                <textarea
                  id="observations"
                  name="observations"
                  value={newLoan.observations}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Ingresa cualquier observación relevante sobre el préstamo (opcional)"
                ></textarea>
              </div>

          <div className="modal-actions">
            <ActionButton 
              variant="secondary" 
              type="button"
              onClick={() => setShowLoanModal(false)}
            >
              Cancelar
            </ActionButton>
            <ActionButton 
              variant="primary" 
              type="submit"
            >
              Registrar Préstamo
            </ActionButton>
          </div>
                      </div>
          </div>
          
        </form>
      </Modal>

      {/* Modal para confirmar devolución */}
      <Modal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        title="Confirmar Devolución"
      >
        {loanToReturn && (
          <div>
            <p>¿Estás seguro de que deseas marcar como devuelto el siguiente préstamo?</p>
            <div className="loan-details">
              <p><strong>Artículo:</strong> {loanToReturn.itemName} ({loanToReturn.itemCode})</p>
              <p><strong>Usuario:</strong> {loanToReturn.userName}</p>
              <p><strong>Fecha de préstamo:</strong> {new Date(loanToReturn.loanDate).toLocaleDateString()}</p>
            </div>
            <div className="modal-actions">
              <ActionButton 
                variant="secondary" 
                onClick={() => setShowReturnModal(false)}
              >
                Cancelar
              </ActionButton>
              <ActionButton 
                variant="primary" 
                onClick={confirmReturn}
              >
                Confirmar Devolución
              </ActionButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Loans