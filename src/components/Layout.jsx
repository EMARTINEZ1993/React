
import { Outlet } from 'react-router-dom'


import Footer from '../components/Footer'
import Header from '../components/Header'
import NavBar from '../components/NavBar' 



import '../App.css'

const Layout = () => {


  return (
    <div className="layout">
    
      <Header />
        <NavBar />

      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout