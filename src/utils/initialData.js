export const initData = () => {
  if (!localStorage.getItem('users')) {
    const initialUsers = [
      { name: 'Admin', email: 'admin@escuela.com', password: 'admin123', role: 'coordinador' },
      { name: 'Profesor', email: 'profesor@escuela.com', password: 'profesor123', role: 'docente' }
    ]
    localStorage.setItem('users', JSON.stringify(initialUsers))
  }
  
  if (!localStorage.getItem('inventory')) {
    const initialInventory = [
      { id: 1, name: 'Proyector', code: 'PROY-001', status: 'disponible' },
      { id: 2, name: 'Computadora', code: 'COMP-001', status: 'disponible' },
      { id: 3, name: 'Pizarra Digital', code: 'PIZ-001', status: 'mantenimiento' }
    ]
    localStorage.setItem('inventory', JSON.stringify(initialInventory))
  }
}