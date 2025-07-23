import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  const [form, setForm] = useState({ nombre: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [message, setMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name: form.nombre };
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === user.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMessage("✅ Perfil actualizado correctamente");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwordForm.current !== user.password) {
      return setMessage("❌ La contraseña actual no es correcta");
    }

    if (passwordForm.new !== passwordForm.confirm) {
      return setMessage("❌ Las nuevas contraseñas no coinciden");
    }

    const updatedUser = { ...user, password: passwordForm.new };
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === user.email ? updatedUser : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMessage("✅ Contraseña actualizada. Por seguridad, vuelve a iniciar sesión.");

    // Cierre de sesión tras 2 segundos
    setTimeout(() => {
      logout();
    }, 2000);
  };

  return (
<div className="inventory-container">
          <h2>Perfil de Usuario</h2>

      <form onSubmit={handleProfileSubmit} style={{ marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleFormChange}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            style={{ width: "100%", padding: "0.5rem", backgroundColor: "#eee" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Actualizar Perfil
        </button>
      </form>

      <div>
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          style={{
            background: "none",
            border: "none",
            color: "#007BFF",
            cursor: "pointer",
            marginBottom: "1rem",
            textDecoration: "underline"
          }}
        >
          {showPasswordForm ? "Ocultar cambio de contraseña" : "Cambiar contraseña"}
        </button>

        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} style={{ borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <label>Contraseña actual:</label>
              <input
                type="password"
                name="current"
                value={passwordForm.current}
                onChange={handlePasswordChange}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>Nueva contraseña:</label>
              <input
                type="password"
                name="new"
                value={passwordForm.new}
                onChange={handlePasswordChange}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>Confirmar nueva contraseña:</label>
              <input
                type="password"
                name="confirm"
                value={passwordForm.confirm}
                onChange={handlePasswordChange}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <button type="submit" style={{ padding: "0.5rem 1rem" }}>
              Cambiar Contraseña
            </button>
          </form>
        )}
      </div>

      {message && (
        <div style={{ marginTop: "1rem", color: message.includes("✅") ? "green" : "red" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Profile;
