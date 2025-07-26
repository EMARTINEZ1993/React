import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

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
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Restablecer Contraseña</h1>
                    <p>Siga los pasos para recuperar su contraseña</p>
                </div>
                
                {mensaje && (
                    <div className={mensaje.includes('incorrecto') || mensaje.includes('no coinciden') ? 'error-message' : 'success-message'}>
                        {mensaje}
                    </div>
                )}
                
                <div className="reset-steps">
                    <div className={`reset-step ${paso >= 1 ? 'active' : ''} ${paso > 1 ? 'completed' : ''}`}>
                        <div className="reset-step-number">1</div>
                        <div className="reset-step-label">Email</div>
                    </div>
                    <div className={`reset-step ${paso >= 2 ? 'active' : ''} ${paso > 2 ? 'completed' : ''}`}>
                        <div className="reset-step-number">2</div>
                        <div className="reset-step-label">Verificación</div>
                    </div>
                    <div className={`reset-step ${paso >= 3 ? 'active' : ''} ${paso > 3 ? 'completed' : ''}`}>
                        <div className="reset-step-number">3</div>
                        <div className="reset-step-label">Nueva Contraseña</div>
                    </div>
                    <div className={`reset-step ${paso >= 4 ? 'active' : ''}`}>
                        <div className="reset-step-number">4</div>
                        <div className="reset-step-label">Completado</div>
                    </div>
                    <div className="reset-progress-bar">
                        <div className="reset-progress-fill" style={{ width: `${(paso - 1) * 33.33}%` }}></div>
                    </div>
                </div>
                
                {paso === 1 && (
                    <div className="auth-form">
                        <form onSubmit={handleEnviarEmail}>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Ingrese su correo electrónico"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="auth-button"
                            >
                                Enviar instrucciones
                            </button>
                        </form>
                    </div>
                )}
                
                {paso === 2 && (
                    <div className="auth-form">
                        <form onSubmit={handleVerificarCodigo}>
                            <div className="form-group">
                                <label>Código de Verificación</label>
                                <input
                                    type="text"
                                    value={codigo}
                                    onChange={e => setCodigo(e.target.value)}
                                    placeholder="Ingrese el código de 6 dígitos"
                                    required
                                />
                                <small>Ingresa el código de 6 dígitos que enviamos a {email}</small>
                            </div>
                            <button 
                                type="submit" 
                                className="auth-button"
                            >
                                Verificar código
                            </button>
                        </form>
                    </div>
                )}
                
                {paso === 3 && (
                    <div className="auth-form">
                        <form onSubmit={handleCambiarPassword}>
                            <div className="form-group">
                                <label>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={nuevaPassword}
                                    onChange={e => setNuevaPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    value={confirmarPassword}
                                    onChange={e => setConfirmarPassword(e.target.value)}
                                    placeholder="Repita la nueva contraseña"
                                    required
                                    minLength="6"
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="auth-button"
                            >
                                Cambiar contraseña
                            </button>
                        </form>
                    </div>
                )}
                
                {paso === 4 && (
                    <div className="success-message" style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p>¡Contraseña restablecida con éxito!</p>
                        <Link to="/login" className="auth-button" style={{ display: 'inline-block', marginTop: '15px' }}>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RestablecerPassword;