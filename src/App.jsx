import { Routes, Route } from 'react-router-dom'

//Importar componentes 
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'


//Importar Paginas
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Inventory from './pages/Inventory'
import Restablecer_password  from './pages/Restablecer_Password'

import UserManagement from './pages/UserManagement'
import Profile from './pages/Profile'
import { initData } from './utils/initialData'
import History from './pages/History'

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  initData()
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path='restablecer_Password' element={<Restablecer_password />} />
        

        <Route element={<ProtectedRoute allowedRoles={['docente', 'coordinador']} />}>
          <Route path="inventory" element={<Inventory />} />
          <Route path='Profile' element={<Profile /> } />

        </Route>

        <Route element={<ProtectedRoute allowedRoles={['coordinador']} />}>
          <Route path="users" element={<UserManagement />} />
          <Route path="History" element={<History />} />
        </Route>

     

      </Route>
    </Routes>
  )
}

export default App