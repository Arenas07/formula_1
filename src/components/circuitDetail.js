import { circuitsService } from '../services/circuits.service.js';
import { AuthService } from '../services/login.service.js';

class CircuitDetail extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.circuitsService = new circuitsService();
        this.authService = new AuthService();
        this.circuit = null;
    }

    connectedCallback() {
        this.render();
        this.loadCircuit();
    }

    async loadCircuit() {
        try {
            // Obtener el ID del circuito de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const circuitId = urlParams.get('id');
            
            if (!circuitId) {
                this.showError('No se especificó un ID de circuito');
                return;
            }
            
            this.showLoading();
            const circuit = await this.circuitsService.getCircuitoById(circuitId);
            
            if (!circuit) {
                this.showError('No se encontró el circuito');
                return;
            }
            
            this.circuit = circuit;
            this.renderCircuitDetails();
        } catch (error) {
            console.error('Error al cargar el circuito:', error);
            this.showError('Error al cargar los detalles del circuito');
        }
    }

    showLoading() {
        const container = this.shadowRoot.querySelector('.circuit-container');
        if (container) {
            container.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Cargando detalles del circuito...</p>
                </div>
            `;
        }
    }

    showError(message) {
        const container = this.shadowRoot.querySelector('.circuit-container');
        if (container) {
            container.innerHTML = `
                <div class="error">
                    <i class='bx bx-error-circle'></i>
                    <p>${message}</p>
                    <div class="error-actions">
                        <button id="back-btn" class="btn secondary">Volver a la lista</button>
                        <button id="retry-btn" class="btn primary">Reintentar</button>
                    </div>
                </div>
            `;
            this.shadowRoot.querySelector('#back-btn').addEventListener('click', () => {
                window.location.href = '/src/modules/circuits/circuitsView.html';
            });
            this.shadowRoot.querySelector('#retry-btn').addEventListener('click', () => this.loadCircuit());
        }
    }

    renderCircuitDetails() {
        if (!this.circuit) return;
        
        const container = this.shadowRoot.querySelector('.circuit-container');
        if (!container) return;
        
        const isAdmin = this.authService.isAdmin();
        
        container.innerHTML = `
            <div class="circuit-actions">
                <button id="back-btn" class="btn secondary">
                    <i class='bx bx-arrow-back'></i> Volver
                </button>
                ${isAdmin ? `
                    <div class="admin-actions">
                        <button id="edit-btn" class="btn primary">
                            <i class='bx bx-edit'></i> Editar
                        </button>
                        <button id="delete-btn" class="btn danger">
                            <i class='bx bx-trash'></i> Eliminar
                        </button>
                    </div>
                ` : ''}
            </div>
            
            <div class="circuit-header">
                <h1>${this.circuit.nombre || 'Circuito sin nombre'}</h1>
                <div class="circuit-location">
                    <i class='bx bx-map'></i>
                    <span>${this.circuit.ciudad || ''}, ${this.circuit.pais || ''}</span>
                </div>
                <div class="circuit-tags">
                    <span class="tag continent">${this.circuit.continente || 'Sin continente'}</span>
                    <span class="tag difficulty">${this.circuit.caracteristicas_tecnicas?.dificultad || 'Dificultad Media'}</span>
                </div>
            </div>
            
            <div class="circuit-image-container">
                <img src="${this.circuit.imagen || '/src/design/icons/default-circuit.jpg'}" 
                     alt="${this.circuit.nombre}" 
                     onerror="this.src='/src/design/icons/default-circuit.jpg'">
            </div>
            
            <div class="circuit-content">
                <div class="circuit-description">
                    <h2>Descripción</h2>
                    <p>${this.circuit.descripcion || 'No hay descripción disponible para este circuito.'}</p>
                </div>
                
                <div class="circuit-specs">
                    <h2>Características</h2>
                    <div class="specs-grid">
                        <div class="spec-item">
                            <div class="spec-icon"><i class='bx bx-ruler'></i></div>
                            <div class="spec-info">
                                <h3>Longitud</h3>
                                <p>${this.circuit.longitud_km ? `${this.circuit.longitud_km} km` : 'No disponible'}</p>
                            </div>
                        </div>
                        
                        <div class="spec-item">
                            <div class="spec-icon"><i class='bx bx-shape-circle'></i></div>
                            <div class="spec-info">
                                <h3>Curvas</h3>
                                <p>${this.circuit.curvas?.total || 'No disponible'}</p>
                            </div>
                        </div>
                        
                        <div class="spec-item">
                            <div class="spec-icon"><i class='bx bx-refresh'></i></div>
                            <div class="spec-info">
                                <h3>Vueltas</h3>
                                <p>${this.circuit.vueltas_carrera || 'No disponible'}</p>
                            </div>
                        </div>
                        
                        <div class="spec-item">
                            <div class="spec-icon"><i class='bx bx-calendar'></i></div>
                            <div class="spec-info">
                                <h3>Primer GP</h3>
                                <p>${this.circuit.primer_gp || 'No disponible'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Configurar event listeners
        this.shadowRoot.querySelector('#back-btn').addEventListener('click', () => {
            window.location.href = '/src/modules/circuits/circuitsView.html';
        });
        
        if (isAdmin) {
            this.shadowRoot.querySelector('#edit-btn').addEventListener('click', () => {
                window.location.href = `/src/modules/circuits/adminCircuits.html?edit=${this.circuit.id}`;
            });
            
            this.shadowRoot.querySelector('#delete-btn').addEventListener('click', () => this.deleteCircuit());
        }
    }
    
    async deleteCircuit() {
        if (!this.circuit || !this.circuit.id) return;
        
        this.showDeleteConfirmation();
    }
    
    showDeleteConfirmation() {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'delete-confirmation-modal';
        modalContainer.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Confirmar eliminación</h3>
                    <button class="close-btn"><i class='bx bx-x'></i></button>
                </div>
                <div class="modal-body">
                    <i class='bx bx-error-circle warning-icon'></i>
                    <p>¿Estás seguro de que deseas eliminar el circuito "${this.circuit.nombre}"?</p>
                    <p class="warning-text">Esta acción no se puede deshacer.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn secondary" id="cancel-delete">Cancelar</button>
                    <button class="btn danger" id="confirm-delete">Eliminar</button>
                </div>
            </div>
        `;

        this.shadowRoot.appendChild(modalContainer);

        // Añadir estilos al shadow DOM
        const style = document.createElement('style');
        style.textContent = `
            .delete-confirmation-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .modal-content {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid #eee;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #333;
            }
            
            .modal-header .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #777;
                display: flex;
            }
            
            .modal-body {
                padding: 1.5rem;
                text-align: center;
                color: #555;
            }
            
            .warning-icon {
                font-size: 3rem;
                color: #ff9800;
                margin-bottom: 1rem;
            }
            
            .warning-text {
                color: #F44336;
                font-size: 0.9rem;
                margin-top: 0.5rem;
            }
            
            .modal-footer {
                padding: 1rem 1.5rem;
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                border-top: 1px solid #eee;
            }
        `;
        this.shadowRoot.appendChild(style);

        // Configurar event listeners
        modalContainer.querySelector('#cancel-delete').addEventListener('click', () => {
            this.shadowRoot.removeChild(modalContainer);
            this.shadowRoot.removeChild(style);
        });

        modalContainer.querySelector('.close-btn').addEventListener('click', () => {
            this.shadowRoot.removeChild(modalContainer);
            this.shadowRoot.removeChild(style);
        });

        modalContainer.querySelector('#confirm-delete').addEventListener('click', async () => {
            try {
                modalContainer.querySelector('#confirm-delete').textContent = 'Eliminando...';
                modalContainer.querySelector('#confirm-delete').disabled = true;
                
                await this.circuitsService.deleteCircuito(this.circuit.id);
                
                // Mostrar mensaje de éxito y redirigir
                const successMessage = document.createElement('div');
                successMessage.className = 'delete-success-message';
                successMessage.innerHTML = `
                    <div class="success-content">
                        <i class='bx bx-check-circle success-icon'></i>
                        <p>Circuito eliminado con éxito</p>
                        <p class="redirect-text">Redirigiendo a la lista de circuitos...</p>
                    </div>
                `;
                
                // Añadir estilos adicionales para el mensaje de éxito
                const successStyle = document.createElement('style');
                successStyle.textContent = `
                    .delete-success-message {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1001;
                    }
                    
                    .success-content {
                        background-color: white;
                        border-radius: 8px;
                        padding: 2rem;
                        text-align: center;
                        max-width: 400px;
                    }
                    
                    .success-icon {
                        font-size: 4rem;
                        color: #4CAF50;
                        margin-bottom: 1rem;
                    }
                    
                    .redirect-text {
                        margin-top: 1rem;
                        font-size: 0.9rem;
                        color: #777;
                    }
                `;
                
                // Eliminar el modal de confirmación
                this.shadowRoot.removeChild(modalContainer);
                this.shadowRoot.removeChild(style);
                
                // Mostrar el mensaje de éxito
                this.shadowRoot.appendChild(successMessage);
                this.shadowRoot.appendChild(successStyle);
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = '/src/modules/circuits/circuitsView.html';
                }, 2000);
                
            } catch (error) {
                console.error('Error al eliminar el circuito:', error);
                
                modalContainer.querySelector('.modal-body').innerHTML = `
                    <i class='bx bx-error-circle warning-icon' style="color: #F44336;"></i>
                    <p>Error al eliminar el circuito:</p>
                    <p class="warning-text">${error.message}</p>
                `;
                
                modalContainer.querySelector('#confirm-delete').textContent = 'Reintentar';
                modalContainer.querySelector('#confirm-delete').disabled = false;
            }
        });

        // Cerrar al hacer clic fuera del modal
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                this.shadowRoot.removeChild(modalContainer);
                this.shadowRoot.removeChild(style);
            }
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Roboto', 'Segoe UI', sans-serif;
                    --primary-color: #e10600;
                    --secondary-color: #1E1E1E;
                    --text-light: #FFFFFF;
                    --text-dark: #333333;
                    --background-light: #F5F5F5;
                    --border-radius: 8px;
                    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    --transition: all 0.3s ease;
                }
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                
                .detail-container {
                    max-width: 1200px;
                    margin: 8rem auto 3rem;
                    padding: 0 1.5rem;
                }
                
                .circuit-container {
                    background-color: #ffffff;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    overflow: hidden;
                }
                
                .circuit-actions {
                    display: flex;
                    justify-content: space-between;
                    padding: 1.5rem;
                    background-color: var(--background-light);
                }
                
                .admin-actions {
                    display: flex;
                    gap: 1rem;
                }
                
                .btn {
                    padding: 0.6rem 1.2rem;
                    border: none;
                    border-radius: var(--border-radius);
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: var(--transition);
                }
                
                .btn.primary {
                    background-color: var(--primary-color);
                    color: var(--text-light);
                }
                
                .btn.primary:hover {
                    background-color: #c80000;
                }
                
                .btn.secondary {
                    background-color: #e0e0e0;
                    color: var(--text-dark);
                }
                
                .btn.secondary:hover {
                    background-color: #d0d0d0;
                }
                
                .btn.danger {
                    background-color: #F44336;
                    color: var(--text-light);
                }
                
                .btn.danger:hover {
                    background-color: #d32f2f;
                }
                
                .circuit-header {
                    padding: 2rem 1.5rem;
                    background: linear-gradient(90deg, var(--secondary-color), #333);
                    color: var(--text-light);
                }
                
                .circuit-header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }
                
                .circuit-location {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                }
                
                .circuit-tags {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .tag {
                    padding: 0.4rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                
                .tag.continent {
                    background-color: var(--primary-color);
                    color: var(--text-light);
                }
                
                .tag.difficulty {
                    background-color: rgba(255, 255, 255, 0.2);
                    color: var(--text-light);
                }
                
                .circuit-image-container {
                    width: 100%;
                    height: 400px;
                    overflow: hidden;
                }
                
                .circuit-image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .circuit-content {
                    padding: 2rem 1.5rem;
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }
                
                @media (min-width: 768px) {
                    .circuit-content {
                        grid-template-columns: 3fr 2fr;
                    }
                }
                
                .circuit-description h2,
                .circuit-specs h2 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: var(--secondary-color);
                    font-weight: 600;
                }
                
                .circuit-description p {
                    line-height: 1.6;
                    color: #444;
                }
                
                .specs-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                
                .spec-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background-color: var(--background-light);
                    padding: 1rem;
                    border-radius: var(--border-radius);
                    transition: var(--transition);
                }
                
                .spec-item:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow);
                }
                
                .spec-icon {
                    background-color: var(--primary-color);
                    color: var(--text-light);
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-size: 1.5rem;
                }
                
                .spec-info h3 {
                    font-size: 1rem;
                    margin-bottom: 0.2rem;
                    color: var(--secondary-color);
                }
                
                .spec-info p {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--primary-color);
                }
                
                /* Loading and Error Styles */
                .loading, .error {
                    padding: 3rem;
                    text-align: center;
                }
                
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid var(--primary-color);
                    border-radius: 50%;
                    margin: 0 auto 1rem;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .loading p, .error p {
                    margin: 1rem 0;
                    font-size: 1.1rem;
                    color: var(--text-dark);
                }
                
                .error i {
                    font-size: 3rem;
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                }
                
                .error-actions {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                
                /* Responsive Adjustments */
                @media (max-width: 768px) {
                    .circuit-header h1 {
                        font-size: 2rem;
                    }
                    
                    .circuit-image-container {
                        height: 250px;
                    }
                    
                    .specs-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
            
            <div class="detail-container">
                <div class="circuit-container">
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Cargando detalles del circuito...</p>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('circuit-detail', CircuitDetail); 