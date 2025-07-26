import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import '../App.css'

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Contenido principal sin sidebar */}
      <div className="auth-main-content">
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}

export default AuthLayout