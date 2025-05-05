import { EquipoService } from "../../services/equipoService.js";
import { tokenValidator } from "../../utils/shared/tokenValidator";
import { isAdmin } from "../../utils/shared/roleValidator";
import { showError, showSuccess } from '../../utils/shared/notifications';

class CrearEquipo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.equipoService = new EquipoService();
    }

    async connectedCallback() {
        // Verificar permisos antes de mostrar el formulario
        try {
            // Probar conexión con el backend primero
            const connectionTest = await this.equipoService.testConnection();
            if (!connectionTest.success) {
                showError(`Error de conexión: ${connectionTest.message}`);
                console.error('🔌 Error de conexión al backend:', connectionTest);
                this.renderError('No se pudo conectar con el servidor. Por favor, verifica que el backend esté funcionando correctamente.');
                return;
            }
            
            console.log('✅ Conexión con el backend verificada');
            
            const isAdminUser = await isAdmin();
            if (!isAdminUser) {
                showError('No tienes permisos para crear equipos');
                setTimeout(() => {
                    window.location.href = '/src/modules/teams/teamView.html';
                }, 2000);
                return;
            }
            
            this.render();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            showError('Error al verificar permisos: ' + error.message);
            this.renderError('Error al cargar el componente. Por favor, intenta de nuevo más tarde.');
        }
    }

    renderError(message) {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 2rem;
                }
                
                .error-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                
                .error-title {
                    color: #ef4444;
                    margin-bottom: 1rem;
                }
                
                .error-message {
                    color: #374151;
                    margin-bottom: 2rem;
                }
                
                .back-button {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 5px;
                    font-size: 1rem;
                    cursor: pointer;
                    background-color: #2563eb;
                    color: white;
                    transition: background-color 0.3s;
                }
                
                .back-button:hover {
                    background-color: #1d4ed8;
                }
            </style>
            <div class="error-container">
                <h2 class="error-title">Ha ocurrido un error</h2>
                <p class="error-message">${message}</p>
                <button class="back-button" id="back-button">Volver</button>
            </div>
        `;
        
        const backButton = this.shadowRoot.querySelector('#back-button');
        backButton.addEventListener('click', () => {
            window.location.href = '/src/modules/teams/teamView.html';
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 2rem;
                }

                .form-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #1e3a8a;
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #374151;
                    font-weight: 500;
                }

                input, textarea, select {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 5px;
                    font-size: 1rem;
                }

                input:focus, textarea:focus, select:focus {
                    outline: none;
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }

                .button-group {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    margin-top: 2rem;
                }

                button {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 5px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                button[type="submit"] {
                    background-color: #2563eb;
                    color: white;
                }

                button[type="submit"]:hover {
                    background-color: #1d4ed8;
                }

                button[type="button"] {
                    background-color: #ef4444;
                    color: white;
                }

                button[type="button"]:hover {
                    background-color: #dc2626;
                }

                .error {
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }
                
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
            <div class="form-container">
                <h1>Crear Nuevo Equipo</h1>
                <form id="form-equipo">
                    <div class="form-group">
                        <label for="nombre">Nombre del Equipo</label>
                        <input type="text" id="nombre" name="nombre" required>
                    </div>

                    <div class="form-group">
                        <label for="pais">País</label>
                        <input type="text" id="pais" name="pais" required>
                    </div>

                    <div class="form-group">
                        <label for="motor">Unidad de Potencia</label>
                        <input type="text" id="motor" name="motor" required>
                    </div>

                    <div class="form-group">
                        <label for="director">Director de Equipo</label>
                        <input type="text" id="director" name="director" required>
                    </div>

                    <div class="form-group">
                        <label for="fecha_fundacion">Fecha de Fundación</label>
                        <input type="date" id="fecha_fundacion" name="fecha_fundacion" required>
                    </div>

                    <div class="form-group">
                        <label for="imagen">URL de la Imagen</label>
                        <input type="url" id="imagen" name="imagen" required>
                    </div>

                    <div class="form-group">
                        <label for="campeonatos">Campeonatos Mundiales</label>
                        <input type="number" id="campeonatos" name="campeonatos" min="0" required>
                    </div>

                    <div class="form-group">
                        <label for="victorias">Victorias</label>
                        <input type="number" id="victorias" name="victorias" min="0" required>
                    </div>

                    <div class="button-group">
                        <button type="button" id="cancelar">Cancelar</button>
                        <button type="submit">Crear Equipo</button>
                    </div>
                </form>
            </div>
            <div id="loading" class="loading-overlay" style="display: none;">
                <div class="loading-spinner"></div>
            </div>
        `;
    }

    setupEventListeners() {
        const form = this.shadowRoot.querySelector('#form-equipo');
        const cancelButton = this.shadowRoot.querySelector('#cancelar');
        const loadingOverlay = this.shadowRoot.querySelector('#loading');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Mostrar loading
            loadingOverlay.style.display = 'flex';

            // Verificar si hay token antes de continuar
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
            if (!token) {
                showError('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
                loadingOverlay.style.display = 'none';
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 2000);
                return;
            }

            const equipoData = {
                nombre: form.nombre.value,
                pais: form.pais.value,
                motor: form.motor.value,
                director: form.director.value,
                fecha_fundacion: form.fecha_fundacion.value,
                imagen: form.imagen.value,
                campeonatos: parseInt(form.campeonatos.value),
                victorias: parseInt(form.victorias.value)
            };

            try {
                console.log('Enviando datos del equipo:', equipoData);
                
                // Verificar y formatear correctamente el token
                const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
                console.log('Token formateado correctamente:', formattedToken.substring(0, 20) + '...');
                
                // Guardar el token formateado para asegurar que esté disponible correctamente
                localStorage.setItem('token', formattedToken);
                
                // Si el token está en formato JWT, verificar su estructura
                if (token.includes('.')) {
                    const [header, payload, signature] = token.split('.');
                    console.log('Estructura token JWT:', {
                        tieneHeader: !!header, 
                        tienePayload: !!payload, 
                        tieneFirma: !!signature
                    });
                    
                    // Intentar decodificar el payload para verificar información básica
                    try {
                        const decodedPayload = JSON.parse(atob(payload));
                        const now = Math.floor(Date.now() / 1000);
                        
                        console.log('Info token:', {
                            exp: decodedPayload.exp ? new Date(decodedPayload.exp * 1000).toISOString() : 'No disponible',
                            expirado: decodedPayload.exp ? now > decodedPayload.exp : 'No verificable'
                        });
                        
                        // Si el token está expirado, informar y redirigir a login
                        if (decodedPayload.exp && now > decodedPayload.exp) {
                            showError('El token de autenticación ha expirado. Por favor, inicia sesión nuevamente.');
                            loadingOverlay.style.display = 'none';
                            localStorage.removeItem('token');
                            localStorage.removeItem('auth_token');
                            setTimeout(() => {
                                window.location.href = '/login.html';
                            }, 2000);
                            return;
                        }
                    } catch (tokenError) {
                        console.warn('No se pudo decodificar el payload del token:', tokenError);
                    }
                }
                
                // Probar conexión con el backend primero
                const connectionTest = await this.equipoService.testConnection();
                console.log('Resultado test conexión:', connectionTest);
                
                if (!connectionTest.success) {
                    throw new Error(`Error de conexión con el backend: ${connectionTest.message}`);
                }
                
                // Si la conexión fue exitosa pero no autenticada, mostrar advertencia
                if (connectionTest.success && connectionTest.authenticated === false) {
                    console.warn('⚠️ La conexión fue exitosa pero no autenticada. Puede haber problemas con el token.');
                }
                
                const resultado = await this.equipoService.createEquipo(equipoData);
                
                console.log('Resultado de creación:', resultado);
                showSuccess('Equipo creado exitosamente');
                
                // Redirigir después de un breve retraso
                setTimeout(() => {
                    window.location.href = '/src/modules/teams/teamView.html';
                }, 1500);
            } catch (error) {
                console.error('Error al crear el equipo:', error);
                
                // Verificar si es un error de autorización
                if (error.message && (
                    error.message.includes('No autorizado') || 
                    error.message.includes('Unauthorized') || 
                    error.message.includes('401') ||
                    error.message.includes('token')
                )) {
                    showError('Error de autorización. Por favor, inicia sesión nuevamente.');
                    
                    // Limpiar token posiblemente inválido y redirigir a login
                    localStorage.removeItem('token');
                    localStorage.removeItem('auth_token');
                    
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 2000);
                } else if (error.message && error.message.includes('Error de red')) {
                    showError('No se pudo conectar con el servidor. Por favor, verifica que el backend esté funcionando correctamente.');
                } else {
                    showError('Error al crear el equipo: ' + error.message);
                }
            } finally {
                // Ocultar loading
                loadingOverlay.style.display = 'none';
            }
        });

        cancelButton.addEventListener('click', () => {
            window.location.href = '/src/modules/teams/teamView.html';
        });
    }
}

customElements.define('crear-equipo', CrearEquipo); 