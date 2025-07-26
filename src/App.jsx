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
import Loans from './pages/Loans'
import LoanRequests from './pages/LoanRequests'
import MyLoanRequests from './pages/MyLoanRequests'
import RequestLoan from './pages/RequestLoan'

import UserManagement from './pages/UserManagement'
import Profile from './pages/Profile'
import History from './pages/History'

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
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

        <Route element={<ProtectedRoute allowedRoles={['docente']} />}>
          <Route path="request-loan" element={<RequestLoan />} />
          <Route path="my-loan-requests" element={<MyLoanRequests />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['coordinador']} />}>
          <Route path="users" element={<UserManagement />} />
          <Route path="History" element={<History />} />
          <Route path="loans" element={<Loans />} />
          <Route path="loan-requests" element={<LoanRequests />} />
        </Route>

     

      </Route>
    </Routes>
  )
}

export default App