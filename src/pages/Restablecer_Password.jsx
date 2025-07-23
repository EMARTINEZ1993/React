import React, { useState } from "react";

function RestablecerPassword() {
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [paso, setPaso] = useState(1); // 1: Ingresar email, 2: Ingresar código, 3: Nueva contraseña
    const [codigo, setCodigo] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [codigoGenerado, setCodigoGenerado] = useState("");

    const generarCodigo = () => {
        // Generar un código de 6 dígitos
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleEnviarEmail = (e) => {
        e.preventDefault();
        
        // Verificar si el email existe en localStorage
        const usuarios = JSON.parse(localStorage.getItem("users")) || [];
        const usuarioExiste = usuarios.some(user => user.email === email);
        
        if (usuarioExiste) {
            const codigo = generarCodigo();
            setCodigoGenerado(codigo);
            
            // En un caso real, aquí enviarías el código por email
            // Para este ejemplo, lo guardamos en localStorage
            localStorage.setItem("codigoRestablecimiento", JSON.stringify({
                email,
                codigo,
                timestamp: new Date().getTime()
            }));
            
            setPaso(2);
            setMensaje(`Hemos enviado un código a ${email}. Por favor ingrésalo a continuación.`);
        } else {
            setMensaje("El correo electrónico no está registrado.");
        }
    };

    const handleVerificarCodigo = (e) => {
        e.preventDefault();
        
        // Verificar el código
        const datosRestablecimiento = JSON.parse(localStorage.getItem("codigoRestablecimiento"));
        
        if (datosRestablecimiento && datosRestablecimiento.codigo === codigo) {
            setPaso(3);
            setMensaje("Por favor ingresa tu nueva contraseña.");
        } else {
            setMensaje("El código ingresado es incorrecto.");
        }
    };

    const handleCambiarPassword = (e) => {
        e.preventDefault();
        
        if (nuevaPassword !== confirmarPassword) {
            setMensaje("Las contraseñas no coinciden.");
            return;
        }
        
        if (nuevaPassword.length < 6) {
            setMensaje("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        
        // Actualizar la contraseña en localStorage
        const usuarios = JSON.parse(localStorage.getItem("users")) || [];
        const usuarioIndex = usuarios.findIndex(user => user.email === email);
        
        if (usuarioIndex !== -1) {
            usuarios[usuarioIndex].password = nuevaPassword;
            localStorage.setItem("users", JSON.stringify(usuarios));
            
            // Limpiar el código de restablecimiento
            localStorage.removeItem("codigoRestablecimiento");
            
            setMensaje("¡Contraseña restablecida con éxito! Ahora puedes iniciar sesión con tu nueva contraseña.");
            setPaso(4); // Paso final
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: 400, margin: "2rem auto", padding: "2rem" }}>
            <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Restablecer Contraseña</h2>
            
            {paso === 1 && (
                <form onSubmit={handleEnviarEmail}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>
                            Correo electrónico:
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "4px", border: "1px solid #ddd" }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            backgroundColor: "#3498db",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginTop: "1rem"
                        }}
                    >
                        Enviar instrucciones
                    </button>
                </form>
            )}
            
            {paso === 2 && (
                <form onSubmit={handleVerificarCodigo}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>
                            Código de verificación:
                        </label>
                        <input
                            type="text"
                            value={codigo}
                            onChange={e => setCodigo(e.target.value)}
                            required
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "4px", border: "1px solid #ddd" }}
                        />
                        <small style={{ display: "block", marginTop: "0.5rem", color: "#666" }}>
                            Ingresa el código de 6 dígitos que enviamos a {email}
                        </small>
                    </div>
                    <button 
                        type="submit" 
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            backgroundColor: "#3498db",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginTop: "1rem"
                        }}
                    >
                        Verificar código
                    </button>
                </form>
            )}
            
            {paso === 3 && (
                <form onSubmit={handleCambiarPassword}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>
                            Nueva contraseña:
                        </label>
                        <input
                            type="password"
                            value={nuevaPassword}
                            onChange={e => setNuevaPassword(e.target.value)}
                            required
                            minLength="6"
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "4px", border: "1px solid #ddd" }}
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>
                            Confirmar nueva contraseña:
                        </label>
                        <input
                            type="password"
                            value={confirmarPassword}
                            onChange={e => setConfirmarPassword(e.target.value)}
                            required
                            minLength="6"
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "4px", border: "1px solid #ddd" }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            backgroundColor: "#27ae60",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginTop: "1rem"
                        }}
                    >
                        Cambiar contraseña
                    </button>
                </form>
            )}
            
            {paso === 4 && (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                    <p style={{ color: "#27ae60", marginBottom: "1rem" }}>
                        ¡Contraseña restablecida con éxito!
                    </p>
                    <a 
                        href="/login" 
                        style={{
                            display: "inline-block",
                            padding: "0.75rem 1.5rem",
                            backgroundColor: "#3498db",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "4px"
                        }}
                    >
                        Volver al inicio de sesión
                    </a>
                </div>
            )}
            
            {mensaje && (
                <p style={{ 
                    marginTop: "1rem", 
                    padding: "0.75rem", 
                    borderRadius: "4px",
                    backgroundColor: paso === 4 ? "#e8f5e9" : "#fff3e0",
                    color: paso === 4 ? "#27ae60" : "#333",
                    borderLeft: `4px solid ${paso === 4 ? "#27ae60" : "#f39c12"}`
                }}>
                    {mensaje}
                </p>
            )}
        </div>
    );
}

export default RestablecerPassword;