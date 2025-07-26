import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Modal from '../components/Modal';
import ActionButton from '../components/ActionButton';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  const [form, setForm] = useState({ nombre: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  
  // Alias para mantener compatibilidad con el nuevo diseño
  const handleChange = handleFormChange;

  // La función handlePasswordChange se define más abajo

  const handleProfileSubmit = (e) => {
    if (e) e.preventDefault();

    const updatedUser = { ...user, nombre: form.nombre };
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === user.email ? updatedUser : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMessage({ text: "Perfil actualizado correctamente", type: "success" });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value
    })
  }

  const handlePasswordSubmit = () => {
    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'Las contraseñas no coinciden', type: 'error' })
      return
    }
    
    // Validar longitud mínima
    if (passwordData.newPassword.length < 8) {
      setMessage({ text: 'La contraseña debe tener al menos 8 caracteres', type: 'error' })
      return
    }
    
    // Validar contraseña actual
    if (passwordData.currentPassword !== user.password) {
      setMessage({ text: 'La contraseña actual es incorrecta', type: 'error' })
      return
    }
    
    // Actualizar contraseña en localStorage
    const users = JSON.parse(localStorage.getItem('users')) || []
    const updatedUsers = users.map(u => {
      if (u.email === user.email) {
        return { ...u, password: passwordData.newPassword }
      }
      return u
    })
    
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    localStorage.setItem('user', JSON.stringify({ ...user, password: passwordData.newPassword }))
    
    // Mostrar mensaje de éxito
    setMessage({ text: 'Contraseña actualizada con éxito. Cerrando sesión...', type: 'success' })
    
    // Limpiar formulario
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    // Cerrar modal
    setShowPasswordModal(false)
    
    // Cerrar sesión después de un tiempo
    setTimeout(() => {
      logout()
    }, 3000)
  };

  return (
    <div className="container mt-4">
      <h2 className="page-title">Perfil de Usuario</h2>
      
      {message && (
        <div className={typeof message === 'object' ? message.type : (message.includes("✅") ? "success" : "error")}>
          {typeof message === 'object' ? message.text : message}
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-header">
          <h3>Información Personal</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleFormChange}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={form.email}
                disabled
                placeholder="tu.email@ejemplo.com"
              />
            </div>
            <ActionButton type="primary" onClick={handleProfileSubmit}>
              Actualizar Información
            </ActionButton>
          </form>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Seguridad</h3>
          <ActionButton 
            type="secondary" 
            onClick={() => setShowPasswordModal(true)}
          >
            Cambiar Contraseña
          </ActionButton>
        </div>
      </div>

      {/* Modal para cambiar contraseña */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Cambiar Contraseña"
        footer={
          <>
            <ActionButton type="secondary" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </ActionButton>
            <ActionButton type="danger" onClick={handlePasswordSubmit}>
              Cambiar Contraseña
            </ActionButton>
          </>
        }
      >
        <div className="form-group mb-3">
          <label htmlFor="currentPassword" className="form-label">Contraseña Actual</label>
          <input
            type="password"
            className="form-control"
            id="currentPassword"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Ingresa tu contraseña actual"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="Ingresa tu nueva contraseña"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirma tu nueva contraseña"
            required
          />
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
