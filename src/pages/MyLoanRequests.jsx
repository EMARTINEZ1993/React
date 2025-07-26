import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const MyLoanRequests = () => {
  const { user } = useContext(AuthContext)
  const [myRequests, setMyRequests] = useState([])

  useEffect(() => {
    // Cargar mis solicitudes de préstamo
    const storedRequests = JSON.parse(localStorage.getItem('loanRequests')) || []
    const userRequests = storedRequests.filter(req => req.userId === user.email)
    setMyRequests(userRequests)
  }, [user.email])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return '#f39c12'
      case 'Aprobado': return '#27ae60'
      case 'Rechazado': return '#e74c3c'
      case 'Entregado': return '#3498db'
      case 'Devuelto': return '#95a5a6'
      default: return '#95a5a6'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'Pendiente': return 'Pendiente'
      case 'Aprobado': return 'Aprobado'
      case 'Rechazado': return 'Rechazado'
      case 'Entregado': return 'Entregado'
      case 'Devuelto': return 'Devuelto'
      default: return status
    }
  }

  // Verificar si el usuario es docente
  if (!user || user.role !== 'docente') {
    return <p>No tienes permisos para acceder a esta página.</p>
  }

  return (
    <div className="my-loan-requests-container">
      {/* Header compacto */}
      <div className="compact-header">
        <h2 className="page-title">Mis Solicitudes de Préstamo</h2>
        
        {/* Estadísticas compactas */}
        {myRequests.length > 0 && (
          <div className="compact-stats">
            <div className="compact-stat-item">
              <span className="compact-stat-number">{myRequests.length}</span>
              <span className="compact-stat-label">Total</span>
            </div>
            <div className="compact-stat-item">
              <span className="compact-stat-number">{myRequests.filter(r => r.status === 'Pendiente').length}</span>
              <span className="compact-stat-label">Pendientes</span>
            </div>
            <div className="compact-stat-item">
              <span className="compact-stat-number">{myRequests.filter(r => r.status === 'Aprobado').length}</span>
              <span className="compact-stat-label">Aprobadas</span>
            </div>
            <div className="compact-stat-item">
              <span className="compact-stat-number">{myRequests.filter(r => r.status === 'Entregado').length}</span>
              <span className="compact-stat-label">En Préstamo</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Tabla de solicitudes */}
      <div className="compact-card">
        {myRequests.length === 0 ? (
          <div className="compact-empty-state">
            <p><strong>No tienes solicitudes de préstamo</strong></p>
            <p>Puedes crear una nueva solicitud desde "Solicitar Préstamo"</p>
          </div>
        ) : (
          <div className="compact-table-container">
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Fecha Solicitud</th>
                  <th>Artículo</th>
                  <th>Código</th>
                  <th>Fecha Préstamo</th>
                  <th>Fecha Devolución</th>
                  <th>Estado</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map(request => (
                  <tr key={request.id}>
                    <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                    <td className="item-name">{request.itemName}</td>
                    <td className="item-code">{request.itemCode}</td>
                    <td>{new Date(request.loanDate).toLocaleDateString()}</td>
                    <td>{new Date(request.returnDate).toLocaleDateString()}</td>
                    <td>
                      <span 
                        className="compact-status-badge" 
                        style={{ backgroundColor: getStatusColor(request.status) }}
                      >
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="observations">{request.observations || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyLoanRequests