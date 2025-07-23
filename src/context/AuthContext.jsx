import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState([])
  const navigate = useNavigate()

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedHistory = localStorage.getItem('loanHistory')
    
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
    
    setLoading(false)
  }, [])

  // Función para iniciar sesión
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || []
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('user', JSON.stringify(foundUser))
      return true
    }
    return false
  }

  // Función para registrar nuevo usuario con validación de correo duplicado
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || []

    // Verificar si el correo ya existe
    const userExists = users.some(u => u.email === userData.email)
    if (userExists) {
      return { success: false, message: 'El correo ya está registrado' }
    }

    // Registrar usuario
    users.push(userData)
    localStorage.setItem('users', JSON.stringify(users))
    return { success: true }
  }

  // Función para cerrar sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Función para registrar acciones en el historial
  const addToHistory = (action, item, previousStatus = null) => {
    if (!user) return

    const newEntry = {
      id: Date.now(),
      userId: user.email,
      userName: user.name,
      userRole: user.role,
      action,
      itemId: item.id,
      itemName: item.name,
      itemCode: item.code,
      date: new Date().toISOString(),
      previousStatus: previousStatus || item.status,
      newStatus: action === 'prestamo' ? 'prestado' :
                action === 'devolucion' ? 'disponible' :
                action === 'eliminado' ? 'eliminado' : item.status
    }

    const updatedHistory = [newEntry, ...history]
    setHistory(updatedHistory)
    localStorage.setItem('loanHistory', JSON.stringify(updatedHistory))
  }

  // Función para limpiar historial (solo coordinador)
  const clearHistory = () => {
    if (user?.role === 'coordinador') {
      setHistory([])
      localStorage.removeItem('loanHistory')
    }
  }

  // Función para verificar si el correo está registrado
  const isEmailRegistered = (email) => {
    const users = JSON.parse(localStorage.getItem('users')) || []
    return users.some(u => u.email === email)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, 
        login,
        register,
        logout,
        loading,
        history,
        addToHistory,
        clearHistory,
        isEmailRegistered
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}