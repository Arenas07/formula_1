import { circuitsService } from '../services/circuits.service.js';
import { AuthService } from '../services/login.service.js';

class CircuitAdmin extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.circuitsService = new circuitsService();
        this.authService = new AuthService();
        this.circuits = [];
        this.currentCircuit = null;
        this.isEditing = false;
    }

    connectedCallback() {
        // Verificar si el usuario es administrador
        if (!this.authService.isAdmin()) {
            window.location.href = '/src/modules/circuits/circuitsView.html';
            return;
        }

        this.render();
        this.loadCircuits();
        this.setupEventListeners();
    }

    async loadCircuits() {
        try {
            this.showLoading();
            const circuits = await this.circuitsService.getCircuitos();
            this.circuits = Array.isArray(circuits) ? circuits : [];
            this.renderCircuitsTable();
        } catch (error) {
            console.error('Error al cargar los circuitos:', error);
            this.showError('Error al cargar los circuitos. Por favor, intenta de nuevo más tarde.');
        }
    }

    showLoading() {
        const container = this.shadowRoot.querySelector('#circuits-container');
        if (container) {
            container.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Cargando circuitos...</p>
                </div>
            `;
        }
    }

    showError(message) {
        const container = this.shadowRoot.querySelector('#circuits-container');
        if (container) {
            container.innerHTML = `
                <div class="error">
                    <i class='bx bx-error-circle'></i>
                    <p>${message}</p>
                    <button id="retry-btn" class="btn">Reintentar</button>
                </div>
            `;
            this.shadowRoot.querySelector('#retry-btn').addEventListener('click', () => this.loadCircuits());
        }
    }

    renderCircuitsTable() {
        const container = this.shadowRoot.querySelector('#circuits-container');
        if (!container) return;

        if (!this.circuits || this.circuits.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class='bx bx-map-alt'></i>
                    <p>No hay circuitos disponibles</p>
                    <button id="add-first-circuit" class="btn primary">Añadir el primer circuito</button>
                </div>
            `;
            this.shadowRoot.querySelector('#add-first-circuit').addEventListener('click', () => this.showForm());
            return;
        }

        container.innerHTML = `
            <div class="actions">
                <button id="add-circuit" class="btn primary">
                    <i class='bx bx-plus'></i> Nuevo Circuito
                </button>
            </div>
            <div class="table-container">
                <table class="circuits-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Ubicación</th>
                            <th>Longitud</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="circuits-tbody">
                        ${this.circuits.map(circuit => `
                            <tr data-id="${circuit.id}">
                                <td>${circuit.id}</td>
                                <td>
                                    <div class="circuit-image">
                                        <img src="${circuit.imagen || '/src/design/icons/default-circuit.jpg'}" 
                                            alt="${circuit.nombre}" 
                                            onerror="this.src='/src/design/icons/default-circuit.jpg'">
                                    </div>
                                </td>
                                <td>${circuit.nombre || 'Sin nombre'}</td>
                                <td>${circuit.ciudad || 'N/A'}, ${circuit.pais || 'N/A'}</td>
                                <td>${circuit.longitud_km ? circuit.longitud_km + ' km' : 'N/A'}</td>
                                <td class="actions-cell">
                                    <button class="btn-icon edit" data-id="${circuit.id}">
                                        <i class='bx bx-edit'></i>
                                    </button>
                                    <button class="btn-icon delete" data-id="${circuit.id}">
                                        <i class='bx bx-trash'></i>
                                    </button>
                                    <button class="btn-icon view" data-id="${circuit.id}">
                                        <i class='bx bx-show'></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Configurar event listeners para las acciones
        this.shadowRoot.querySelector('#add-circuit').addEventListener('click', () => this.showForm());
        this.shadowRoot.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', (e) => this.editCircuit(e.currentTarget.getAttribute('data-id')));
        });
        this.shadowRoot.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteCircuit(e.currentTarget.getAttribute('data-id')));
        });
        this.shadowRoot.querySelectorAll('.view').forEach(btn => {
            btn.addEventListener('click', (e) => this.viewCircuit(e.currentTarget.getAttribute('data-id')));
        });
    }

    showForm(circuit = null) {
        this.isEditing = !!circuit;
        this.currentCircuit = circuit || {
            id: '',
            nombre: '',
            ciudad: '',
            pais: '',
            continente: '',
            longitud_km: '',
            curvas: { total: '' },
            vueltas_carrera: '',
            trazado: 'circular',
            imagen: '',
            descripcion: '',
            primer_gp: '',
            caracteristicas_tecnicas: { dificultad: 'Media' }
        };

        const formContainer = this.shadowRoot.querySelector('#form-container');
        formContainer.innerHTML = `
            <div class="form-overlay">
                <div class="form-card">
                    <div class="form-header">
                        <h2>${this.isEditing ? 'Editar Circuito' : 'Nuevo Circuito'}</h2>
                        <button class="close-btn"><i class='bx bx-x'></i></button>
                    </div>
                    <form id="circuit-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="nombre">Nombre del Circuito*</label>
                                <input type="text" id="nombre" value="${this.currentCircuit.nombre}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="ciudad">Ciudad*</label>
                                <input type="text" id="ciudad" value="${this.currentCircuit.ciudad}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="pais">País*</label>
                                <input type="text" id="pais" value="${this.currentCircuit.pais}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="continente">Continente*</label>
                                <select id="continente" required>
                                    <option value="" ${!this.currentCircuit.continente ? 'selected' : ''}>Seleccionar continente</option>
                                    <option value="Europa" ${this.currentCircuit.continente === 'Europa' ? 'selected' : ''}>Europa</option>
                                    <option value="América" ${this.currentCircuit.continente === 'América' ? 'selected' : ''}>América</option>
                                    <option value="Asia" ${this.currentCircuit.continente === 'Asia' ? 'selected' : ''}>Asia</option>
                                    <option value="Oceanía" ${this.currentCircuit.continente === 'Oceanía' ? 'selected' : ''}>Oceanía</option>
                                    <option value="África" ${this.currentCircuit.continente === 'África' ? 'selected' : ''}>África</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="longitud_km">Longitud (km)*</label>
                                <input type="number" id="longitud_km" step="0.001" min="0" value="${this.currentCircuit.longitud_km}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="curvas_total">Número de Curvas*</label>
                                <input type="number" id="curvas_total" min="0" value="${this.currentCircuit.curvas?.total || ''}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="vueltas_carrera">Vueltas de Carrera*</label>
                                <input type="number" id="vueltas_carrera" min="0" value="${this.currentCircuit.vueltas_carrera}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="trazado">Tipo de Trazado*</label>
                                <select id="trazado" required>
                                    <option value="circular" ${this.currentCircuit.trazado === 'circular' || !this.currentCircuit.trazado ? 'selected' : ''}>Circular</option>
                                    <option value="urbano" ${this.currentCircuit.trazado === 'urbano' ? 'selected' : ''}>Urbano</option>
                                    <option value="mixto" ${this.currentCircuit.trazado === 'mixto' ? 'selected' : ''}>Mixto</option>
                                    <option value="montaña" ${this.currentCircuit.trazado === 'montaña' ? 'selected' : ''}>Montaña</option>
                                    <option value="veloz" ${this.currentCircuit.trazado === 'veloz' ? 'selected' : ''}>Alta Velocidad</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="dificultad">Dificultad</label>
                                <select id="dificultad">
                                    <option value="Fácil" ${this.currentCircuit.caracteristicas_tecnicas?.dificultad === 'Fácil' ? 'selected' : ''}>Fácil</option>
                                    <option value="Media" ${!this.currentCircuit.caracteristicas_tecnicas?.dificultad || this.currentCircuit.caracteristicas_tecnicas?.dificultad === 'Media' ? 'selected' : ''}>Media</option>
                                    <option value="Difícil" ${this.currentCircuit.caracteristicas_tecnicas?.dificultad === 'Difícil' ? 'selected' : ''}>Difícil</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="primer_gp">Primer Gran Premio</label>
                                <input type="text" id="primer_gp" value="${this.currentCircuit.primer_gp || ''}">
                            </div>
                            
                            <div class="form-group full-width">
                                <label for="imagen">URL de Imagen</label>
                                <input type="url" id="imagen" value="${this.currentCircuit.imagen || ''}">
                            </div>
                            
                            <div class="form-group full-width">
                                <label for="descripcion">Descripción</label>
                                <textarea id="descripcion" rows="4">${this.currentCircuit.descripcion || ''}</textarea>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn secondary" id="cancel-btn">Cancelar</button>
                            <button type="submit" class="btn primary">${this.isEditing ? 'Actualizar' : 'Crear'} Circuito</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        formContainer.style.display = 'block';
        
        // Configurar event listeners para el formulario
        this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => this.hideForm());
        this.shadowRoot.querySelector('#cancel-btn').addEventListener('click', () => this.hideForm());
        this.shadowRoot.querySelector('#circuit-form').addEventListener('submit', (e) => this.saveCircuit(e));
    }

    hideForm() {
        const formContainer = this.shadowRoot.querySelector('#form-container');
        formContainer.innerHTML = '';
        formContainer.style.display = 'none';
        this.currentCircuit = null;
        this.isEditing = false;
    }

    async saveCircuit(event) {
        event.preventDefault();
        
        try {
            const formData = {
                nombre: this.shadowRoot.querySelector('#nombre').value,
                ciudad: this.shadowRoot.querySelector('#ciudad').value,
                pais: this.shadowRoot.querySelector('#pais').value,
                continente: this.shadowRoot.querySelector('#continente').value,
                longitud_km: parseFloat(this.shadowRoot.querySelector('#longitud_km').value),
                curvas: { 
                    total: parseInt(this.shadowRoot.querySelector('#curvas_total').value) 
                },
                vueltas_carrera: parseInt(this.shadowRoot.querySelector('#vueltas_carrera').value),
                vueltas: parseInt(this.shadowRoot.querySelector('#vueltas_carrera').value),
                trazado: this.shadowRoot.querySelector('#trazado')?.value || "circular",
                imagen: this.shadowRoot.querySelector('#imagen').value,
                descripcion: this.shadowRoot.querySelector('#descripcion').value,
                primer_gp: this.shadowRoot.querySelector('#primer_gp').value,
                caracteristicas_tecnicas: {
                    dificultad: this.shadowRoot.querySelector('#dificultad').value
                }
            };

            const submitBtn = event.target.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = this.isEditing ? 'Actualizando...' : 'Creando...';
                submitBtn.disabled = true;
            }

            if (this.isEditing) {
                // Actualizar circuito existente
                await this.circuitsService.updateCircuito(this.currentCircuit.id, formData);
                this.showNotification('Circuito actualizado con éxito');
            } else {
                // Crear nuevo circuito
                await this.circuitsService.createCircuito(formData);
                this.showNotification('Circuito creado con éxito');
            }

            // Recargar la lista de circuitos
            await this.loadCircuits();
            this.hideForm();
            
        } catch (error) {
            console.error('Error al guardar el circuito:', error);
            this.showNotification('Error al guardar el circuito: ' + error.message, 'error');
            
            // Restaurar el botón si aún existe
            const submitBtn = event.target.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = this.isEditing ? 'Actualizar' : 'Crear';
                submitBtn.disabled = false;
            }
        }
    }

    async editCircuit(id) {
        try {
            const circuit = await this.circuitsService.getCircuitoById(id);
            if (circuit) {
                this.showForm(circuit);
            } else {
                this.showNotification('No se pudo encontrar el circuito', 'error');
            }
        } catch (error) {
            console.error('Error al obtener el circuito para editar:', error);
            this.showNotification('Error al obtener el circuito para editar', 'error');
        }
    }

    async deleteCircuit(id) {
        this.showDeleteConfirmation(id);
    }

    showDeleteConfirmation(id) {
        const circuito = this.circuits.find(c => c.id == id);
        if (!circuito) return;

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
                    <p>¿Estás seguro de que deseas eliminar el circuito "${circuito.nombre}"?</p>
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
            
            .btn.danger {
                background-color: #F44336;
                color: white;
            }
            
            .btn.danger:hover {
                background-color: #d32f2f;
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
                
                await this.circuitsService.deleteCircuito(id);
                
                this.shadowRoot.removeChild(modalContainer);
                this.shadowRoot.removeChild(style);
                
                this.showNotification('Circuito eliminado con éxito');
                await this.loadCircuits();
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

    viewCircuit(id) {
        window.location.href = `/src/modules/circuits/circuitDetail.html?id=${id}`;
    }

    showNotification(message, type = 'success') {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerHTML = `
            <div class="notification-content">
                <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i>
                <p>${message}</p>
            </div>
            <button class="close-notif"><i class='bx bx-x'></i></button>
        `;
        
        this.shadowRoot.appendChild(notif);
        
        // Auto-eliminar notificación después de 5 segundos
        setTimeout(() => {
            notif.classList.add('hide');
            setTimeout(() => {
                if (notif.parentNode) {
                    this.shadowRoot.removeChild(notif);
                }
            }, 300); // Tiempo para la animación de salida
        }, 5000);
        
        // Permitir cerrar manualmente
        notif.querySelector('.close-notif').addEventListener('click', () => {
            notif.classList.add('hide');
            setTimeout(() => {
                if (notif.parentNode) {
                    this.shadowRoot.removeChild(notif);
                }
            }, 300);
        });
    }

    setupEventListeners() {
        // Los event listeners específicos se configuran en cada función de renderizado
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
                
                .admin-container {
                    max-width: 1200px;
                    margin: 2rem auto;
                    padding: 1.5rem;
                    background-color: var(--background-light);
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                }
                
                .actions {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 1.5rem;
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
                
                .btn-icon {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition);
                }
                
                .btn-icon.edit {
                    color: #2196F3;
                }
                
                .btn-icon.edit:hover {
                    background-color: rgba(33, 150, 243, 0.1);
                }
                
                .btn-icon.delete {
                    color: #F44336;
                }
                
                .btn-icon.delete:hover {
                    background-color: rgba(244, 67, 54, 0.1);
                }
                
                .btn-icon.view {
                    color: #4CAF50;
                }
                
                .btn-icon.view:hover {
                    background-color: rgba(76, 175, 80, 0.1);
                }
                
                .table-container {
                    overflow-x: auto;
                    max-width: 100%;
                }
                
                .circuits-table {
                    width: 100%;
                    border-collapse: collapse;
                    border-radius: var(--border-radius);
                    overflow: hidden;
                    box-shadow: var(--shadow);
                }
                
                .circuits-table th, 
                .circuits-table td {
                    padding: 1rem;
                    text-align: left;
                }
                
                .circuits-table th {
                    background-color: var(--secondary-color);
                    color: var(--text-light);
                    font-weight: 600;
                }
                
                .circuits-table tr:nth-child(odd) {
                    background-color: #ffffff;
                }
                
                .circuits-table tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                
                .circuits-table tr:hover {
                    background-color: #f1f1f1;
                }
                
                .circuit-image {
                    width: 80px;
                    height: 50px;
                    overflow: hidden;
                    border-radius: 4px;
                }
                
                .circuit-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .actions-cell {
                    display: flex;
                    gap: 0.5rem;
                }
                
                /* Form Styles */
                #form-container {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    z-index: 1000;
                    overflow-y: auto;
                }
                
                .form-overlay {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    min-height: 100%;
                    padding: 2rem;
                }
                
                .form-card {
                    background-color: #ffffff;
                    border-radius: var(--border-radius);
                    width: 100%;
                    max-width: 800px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }
                
                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .form-header h2 {
                    color: var(--secondary-color);
                    font-weight: 600;
                    margin: 0;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #777;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition);
                }
                
                .close-btn:hover {
                    color: var(--primary-color);
                }
                
                form {
                    padding: 1.5rem;
                }
                
                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-group.full-width {
                    grid-column: 1 / -1;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: var(--text-dark);
                }
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ccc;
                    border-radius: var(--border-radius);
                    font-size: 1rem;
                    transition: var(--transition);
                }
                
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    border-color: var(--primary-color);
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(225, 6, 0, 0.2);
                }
                
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                
                /* Loading, Error, No Data Styles */
                .loading, .error, .no-data {
                    padding: 3rem;
                    text-align: center;
                    background-color: #ffffff;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    margin: 2rem 0;
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
                
                .loading p, .error p, .no-data p {
                    margin: 1rem 0;
                    font-size: 1.1rem;
                    color: var(--text-dark);
                }
                
                .error i, .no-data i {
                    font-size: 3rem;
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                }
                
                /* Notification Styles */
                .notification {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    background-color: white;
                    border-radius: var(--border-radius);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    max-width: 350px;
                    z-index: 1100;
                    animation: slide-in 0.3s ease-out;
                }
                
                .notification.hide {
                    animation: slide-out 0.3s ease-out forwards;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .notification i {
                    font-size: 1.5rem;
                }
                
                .notification.success i {
                    color: #4CAF50;
                }
                
                .notification.error i {
                    color: #F44336;
                }
                
                .notification p {
                    margin: 0;
                    font-size: 0.95rem;
                }
                
                .close-notif {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: #777;
                    padding: 0.2rem;
                }
                
                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slide-out {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                
                /* Responsive Adjustments */
                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .actions-cell {
                        flex-direction: column;
                    }
                    
                    .btn-icon {
                        padding: 0.3rem;
                    }
                    
                    .circuits-table th, 
                    .circuits-table td {
                        padding: 0.75rem 0.5rem;
                    }
                }
            </style>
            
            <div class="admin-container">
                <div id="circuits-container"></div>
                <div id="form-container"></div>
            </div>
        `;
    }
}

customElements.define('circuit-admin', CircuitAdmin); 