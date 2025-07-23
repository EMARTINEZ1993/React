import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

const History = () => {
  const { user, history } = useContext(AuthContext)
  const [userHistory, setUserHistory] = useState([])

  useEffect(() => {
    if (user.role === 'coordinador') {
      setUserHistory(history)
    } else {
      setUserHistory(history.filter(entry => entry.userId === user.email))
    }
  }, [history, user])

  return (
    <div className="history-container">
      <h3>Historial de Préstamos</h3>
      <table className="table table-striped table-bordered">

        <thead>
          <tr>
            <th>Fecha</th>
            <th>Elemento</th>
            <th>Acción</th>
            {user.role === 'coordinador' && <th>Usuario</th>}
          </tr>
        </thead>
        <tbody>
          {userHistory.map(entry => (
            <tr key={entry.id}>
              <td>{new Date(entry.date).toLocaleString()}</td>
              <td>{entry.itemName}</td>
              <td>
                {entry.action === 'prestamo' ? 'Préstamo' : 
                 entry.action === 'devolucion' ? 'Devolución' : 
                 'Actualización'}
              </td>
              {user.role === 'coordinador' && <td>{entry.userId}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default History