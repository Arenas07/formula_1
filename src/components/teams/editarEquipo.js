import { EquipoService } from "../../services/equipoService.js";
import { tokenValidator } from "../../utils/shared/tokenValidator";
import { isAdmin } from "../../utils/shared/roleValidator";
import { showError, showSuccess } from '../../utils/shared/notifications';

class EditarEquipo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.equipoId = null;
        this.equipoData = null;
        this.equipoService = new EquipoService();
    }

    async connectedCallback() {
        try {
            // Obtener el ID del equipo a editar desde la URL
            const urlParams = new URLSearchParams(window.location.search);
            this.equipoId = urlParams.get('id');
            
            if (!this.equipoId) {
                showError('No se ha especificado un ID de equipo');
                this.renderError('No se ha especificado un ID de equipo válido');
                return;
            }
            
            // Probar conexión con el backend primero
            const connectionTest = await this.equipoService.testConnection();
            if (!connectionTest.success) {
                showError(`Error de conexión: ${connectionTest.message}`);
                console.error('🔌 Error de conexión al backend:', connectionTest);
                this.renderError('No se pudo conectar con el servidor. Por favor, verifica que el backend esté funcionando correctamente.');
                return;
            }
            
            console.log('✅ Conexión con el backend verificada');
            
            // Verificar permisos de administrador
            const isAdminUser = await isAdmin();
            if (!isAdminUser) {
                showError('No tienes permisos para editar equipos');
                setTimeout(() => {
                    window.location.href = '/src/modules/teams/teamView.html';
                }, 2000);
                return;
            }
            
            // Cargar datos del equipo
            this.renderLoading();
            
            try {
                this.equipoData = await this.equipoService.getEquipoById(this.equipoId);
                console.log('Datos del equipo cargados:', this.equipoData);
                
                if (!this.equipoData) {
                    throw new Error('No se encontró el equipo con el ID especificado');
                }
                
                this.render();
                this.setupEventListeners();
            } catch (error) {
                console.error('Error al cargar datos del equipo:', error);
                showError('Error al cargar datos del equipo: ' + error.message);
                this.renderError('No se pudo cargar la información del equipo. Por favor, intenta de nuevo más tarde.');
            }
        } catch (error) {
            console.error('Error general:', error);
            showError('Error: ' + error.message);
            this.renderError('Ha ocurrido un error al inicializar el componente');
        }
    }
    
    renderLoading() {
        this.shadowRoot.innerHTML = `
            <style>
                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 300px;
                }
                
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top-color: #2563eb;
                    animation: spin 1s ease-in-out infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
            <div class="loading-container">
                <div class="loading-spinner"></div>
            </div>
        `;
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

                .loading {
                    text-align: center;
                    padding: 2rem;
                    color: #666;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-left-color: #3730a3;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
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
            </style>
            <div class="form-container">
                <h1>Editar Equipo</h1>
                ${this.equipoData ? `
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
                            <button type="submit">Guardar Cambios</button>
                        </div>
                    </form>
                ` : `
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Cargando datos del equipo...</p>
                    </div>
                `}
            </div>
            <div id="loading" class="loading-overlay" style="display: none;">
                <div class="loading-spinner"></div>
            </div>
        `;
    }

    updateFormValues() {
        if (!this.equipoData) return;

        const form = this.shadowRoot.querySelector('#form-equipo');
        if (!form) return;

        // Actualizar los valores del formulario con los datos del equipo
        form.nombre.value = this.equipoData.nombre || '';
        form.pais.value = this.equipoData.pais || '';
        form.motor.value = this.equipoData.motor || '';
        form.director.value = this.equipoData.director || '';
        
        // Formatear fecha si es necesario
        if (this.equipoData.fecha_fundacion) {
            let fechaFormateada = this.equipoData.fecha_fundacion;
            // Si es un número (solo el año), convertirlo a formato YYYY-MM-DD
            if (typeof fechaFormateada === 'number') {
                fechaFormateada = `${fechaFormateada}-01-01`;
            } 
            // Si es un string pero no está en formato YYYY-MM-DD
            else if (typeof fechaFormateada === 'string' && !fechaFormateada.match(/^\d{4}-\d{2}-\d{2}$/)) {
                try {
                    // Intentar como fecha
                    const fecha = new Date(fechaFormateada);
                    if (!isNaN(fecha.getTime())) {
                        fechaFormateada = fecha.toISOString().split('T')[0];
                    } else {
                        // Intentar como año solo
                        const año = parseInt(fechaFormateada);
                        if (!isNaN(año)) {
                            fechaFormateada = `${año}-01-01`;
                        }
                    }
                } catch (e) {
                    console.warn('Error al formatear fecha:', e);
                    // Si falla, al menos asegurar que sea una fecha válida
                    fechaFormateada = new Date().toISOString().split('T')[0];
                }
            }
            form.fecha_fundacion.value = fechaFormateada;
        }
        
        form.imagen.value = this.equipoData.imagen || '';
        form.campeonatos.value = this.equipoData.campeonatos || 0;
        form.victorias.value = this.equipoData.victorias || 0;
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
                console.log('Enviando datos actualizados del equipo:', equipoData);
                console.log('Token actual:', token ? `${token.substring(0, 15)}...` : 'No hay token');
                
                // Probar conexión con el backend primero
                const connectionTest = await this.equipoService.testConnection();
                if (!connectionTest.success) {
                    throw new Error(`Error de conexión con el backend: ${connectionTest.message}`);
                }
                
                const resultado = await this.equipoService.updateEquipo(this.equipoId, equipoData);
                
                console.log('Resultado de actualización:', resultado);
                showSuccess('Equipo actualizado exitosamente');
                
                // Redirigir después de un breve retraso
                setTimeout(() => {
                    window.location.href = '/src/modules/teams/teamView.html';
                }, 1500);
            } catch (error) {
                console.error('Error al actualizar el equipo:', error);
                
                // Verificar si es un error de autorización
                if (error.message && (error.message.includes('No autorizado') || error.message.includes('401'))) {
                    showError('Error de autorización. Por favor, inicia sesión nuevamente.');
                    setTimeout(() => {
                        // Limpiar token posiblemente inválido
                        localStorage.removeItem('token');
                        window.location.href = '/login.html';
                    }, 2000);
                } else if (error.message && error.message.includes('Error de red')) {
                    showError('No se pudo conectar con el servidor. Por favor, verifica que el backend esté funcionando correctamente.');
                } else {
                    showError('Error al actualizar el equipo: ' + error.message);
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

customElements.define('editar-equipo', EditarEquipo); 