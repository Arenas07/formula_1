import { EquipoService } from "../services/equipoService.js";
import { AuthService } from "../services/login.service.js";
import { showNotification } from "../utils/notifications.js";
import { isAdmin } from "../utils/shared/roleValidator.js";
import { tokenValidator } from "../utils/shared/tokenValidator.js";

class TeamList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.equipoService = new EquipoService();
        this.authService = new AuthService();
        this.equipos = [];
        this.isUserAdmin = false;
        this.teamColors = {
            "Red Bull Racing": "#0600EF",
            "Mercedes-AMG": "#00D2BE",
            "Ferrari": "#DC0000",
            "McLaren": "#FF8700",
            "Aston Martin": "#006F62",
            "Alpine": "#0090FF",
            "Williams": "#005AFF",
            "AlphaTauri": "#2B4562",
            "Alfa Romeo": "#900000",
            "Haas": "#FFFFFF"
        };
    }

    async connectedCallback() {
        // Verificar si el usuario está autenticado y es admin al iniciar
        await this.checkUserPermissions();
        this.render();
        this.loadData();
    }

    async checkUserPermissions() {
        try {
            // Verificar si hay token y si el usuario es administrador
            const token = tokenValidator();
            if (!token) {
                console.log('Usuario no autenticado');
                this.isUserAdmin = false;
                return;
            }
            
            // Verificar primero en localStorage para respuesta rápida
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    if (user && user.rol === 'admin') {
                        console.log('Usuario es administrador (localStorage)');
                        this.isUserAdmin = true;
                        return;
                    }
                } catch (e) {
                    console.warn('Error al leer localStorage:', e);
                }
            }
            
            // Si no se pudo determinar por localStorage, usar la API
            this.isUserAdmin = await isAdmin();
            console.log('¿Es usuario administrador según API?:', this.isUserAdmin);
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            this.isUserAdmin = false;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }

                .list__teams {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 2rem;
                    padding: 2rem;
                }

                .team-container {
                    background: #f5f5f5;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    width: 300px;
                    padding: 0;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .team-container:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
                }

                .team-header {
                    color: white;
                    padding: 1.2rem;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .team-header::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 30%;
                    background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
                }

                .team-header h2 {
                    font-size: 1.8rem;
                    margin: 0;
                    position: relative;
                    z-index: 1;
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
                }

                .team-country {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(255, 255, 255, 0.9);
                    color: #333;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    z-index: 2;
                }

                .team-id {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    z-index: 2;
                }

                .principal-img {
                    width: 100%;
                    height: 180px;
                    background-color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 3px solid #eee;
                    overflow: hidden;
                }

                .principal-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    transition: transform 0.3s ease;
                }

                .team-container:hover .principal-img img {
                    transform: scale(1.05);
                }

                .team-info {
                    padding: 1rem;
                    background: white;
                }

                .team-stats {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 0.8rem;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-value {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #333;
                }

                .stat-label {
                    font-size: 0.8rem;
                    color: #666;
                }

                .card-actions {
                    display: flex;
                    justify-content: space-between;
                    gap: 0.5rem;
                }

                .action-btn {
                    flex: 1;
                    padding: 0.7rem 0;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }

                .view-btn {
                    background-color: #4338ca;
                    color: white;
                }

                .view-btn:hover {
                    background-color: #3730a3;
                }

                .edit-btn {
                    background-color: #f59e0b;
                    color: white;
                }

                .edit-btn:hover {
                    background-color: #d97706;
                }

                .delete-btn {
                    background-color: #ef4444;
                    color: white;
                }

                .delete-btn:hover {
                    background-color: #dc2626;
                }

                .loading {
                    text-align: center;
                    padding: 3rem;
                    font-size: 1.2rem;
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

                .error {
                    text-align: center;
                    padding: 3rem;
                    color: #ef4444;
                    font-size: 1.2rem;
                    background: rgba(239, 68, 68, 0.1);
                    border-radius: 12px;
                    margin: 2rem;
                }

                .no-data {
                    text-align: center;
                    padding: 3rem;
                    color: #666;
                    font-size: 1.2rem;
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 12px;
                    margin: 2rem;
                }

                /* Estilos para el popup */
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                }

                .popup-content {
                    background-color: white;
                    border-radius: 12px;
                    max-width: 700px;
                    width: 90%;
                    max-height: 85vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    position: relative;
                }

                .popup-header {
                    position: relative;
                    padding: 1.5rem;
                    color: white;
                    text-align: center;
                }

                .popup-header h2 {
                    font-size: 2rem;
                    margin: 0;
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
                }

                .popup-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(255, 255, 255, 0.3);
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                }

                .popup-close:hover {
                    background: rgba(255, 255, 255, 0.5);
                }

                .equipo-info {
                    padding: 2rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .equipo-img {
                    grid-column: span 2;
                    text-align: center;
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }

                .equipo-img img {
                    max-width: 100%;
                    height: auto;
                    max-height: 200px;
                    object-fit: contain;
                }

                .info-item {
                    display: flex;
                    flex-direction: column;
                    background: #f9f9f9;
                    padding: 1rem;
                    border-radius: 8px;
                }

                .info-label {
                    font-weight: bold;
                    color: #374151;
                    font-size: 0.9rem;
                    margin-bottom: 0.3rem;
                }

                .info-value {
                    font-size: 1.1rem;
                    color: #1f2937;
                }
            </style>
            <div id="list__teams" class="list__teams">
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Cargando equipos...</p>
                </div>
            </div>
            <div id="popup-container"></div>
        `;
    }

    async loadData() {
        try {
            console.log('🔄 Iniciando carga de equipos...');
            const container = this.shadowRoot.querySelector("#list__teams");
            container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando equipos...</p></div>';
            
            // Usar try-catch para obtener los datos
            let response;
            try {
                response = await this.equipoService.getEquipos();
                console.log('✅ Equipos recibidos:', response);
            } catch (error) {
                console.error('❌ Error al obtener equipos del API:', error);
                throw error;  // re-lanzar para el catch externo
            }
            
            // Procesar la respuesta - aceptar múltiples formatos
            if (Array.isArray(response)) {
                this.equipos = response;
            } else if (response && response.equipos && Array.isArray(response.equipos)) {
                this.equipos = response.equipos;
            } else if (response && response.data && Array.isArray(response.data)) {
                this.equipos = response.data;
            } else if (response && typeof response === 'object') {
                // Buscar cualquier array en la respuesta
                const arrayProps = Object.keys(response).filter(key => 
                    Array.isArray(response[key]) && response[key].length > 0);
                
                if (arrayProps.length > 0) {
                    console.log('🔍 Se encontró un array en la propiedad:', arrayProps[0]);
                    this.equipos = response[arrayProps[0]];
                } else {
                    // Si no hay arrays, pero tenemos un objeto, tal vez ES el equipo
                    this.equipos = [response];
                }
            } else {
                console.error('❌ Formato de respuesta inválido:', response);
                this.equipos = [];
            }
            
            console.log('📋 Equipos procesados:', this.equipos);
            this.generateTeams();
        } catch (error) {
            console.error('❌ Error general al cargar los equipos:', error);
            this.renderError();
        }
    }

    generateTeams() {
        const container = this.shadowRoot.querySelector("#list__teams");
        container.innerHTML = "";

        if (!Array.isArray(this.equipos)) {
            console.error('❌ this.equipos no es un array:', this.equipos);
            this.equipos = [];
        }

        if (!this.equipos || this.equipos.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <p>No hay equipos disponibles</p>
                </div>
            `;
            return;
        }

        this.equipos.forEach(equipo => {
            const card = document.createElement("div");
            card.className = "team-container";
            
            // Obtener o generar un color para el equipo
            const teamColor = this.getTeamColor(equipo.nombre);
            
            // Formatear datos del equipo para la visualización
            const pais = equipo.pais || 'N/A';
            const id = equipo.id || '#';
            const nombre = equipo.nombre || 'Equipo sin nombre';
            const imagenUrl = equipo.imagen || '../../design/images/default-team.png';
            const campeonatos = equipo.campeonatos || 0;
            const victorias = equipo.victorias || 0;
            
            card.innerHTML = `
                <div class="team-header" style="background-color: ${teamColor}">
                    <span class="team-country">${pais}</span>
                    <span class="team-id">#${id}</span>
                    <h2>${nombre}</h2>
                </div>
                <div class="principal-img">
                    <img src="${imagenUrl}" 
                         alt="${nombre}"
                         onerror="this.onerror=null; this.src='../../design/images/default-team.png';">
                </div>
                <div class="team-info">
                    <div class="team-stats">
                        <div class="stat-item">
                            <div class="stat-value">${campeonatos}</div>
                            <div class="stat-label">Campeonatos</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${victorias}</div>
                            <div class="stat-label">Victorias</div>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="action-btn view-btn">Ver detalles</button>
                        ${this.isUserAdmin ? `
                            <button class="action-btn edit-btn">Editar</button>
                            <button class="action-btn delete-btn">Eliminar</button>
                        ` : ''}
                    </div>
                </div>
            `;

            // Agregar eventos a los botones
            const viewBtn = card.querySelector('.view-btn');
            viewBtn.addEventListener('click', () => {
                this.openPopup(equipo, teamColor);
            });

            if (this.isUserAdmin) {
                const editBtn = card.querySelector('.edit-btn');
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleEdit(equipo.id);
                });

                const deleteBtn = card.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleDelete(equipo.id);
                });
            }

            container.appendChild(card);
        });

        console.log('✅ Equipos renderizados correctamente.');
    }

    getTeamColor(teamName) {
        if (!teamName) return '#FF6F61'; // Color por defecto
        
        // Verificar si tenemos un color definido para este equipo
        for (const [key, value] of Object.entries(this.teamColors)) {
            if (teamName.toLowerCase().includes(key.toLowerCase())) {
                return value;
            }
        }
        
        // Generar un color basado en el nombre del equipo
        let hash = 0;
        for (let i = 0; i < teamName.length; i++) {
            hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        
        return color;
    }

    renderError() {
        const container = this.shadowRoot.querySelector("#list__teams");
        container.innerHTML = `
            <div class="error">
                <p>Error al cargar los equipos</p>
            </div>
        `;
    }

    openPopup(equipo, teamColor) {
        console.log('🔍 Mostrando detalles del equipo:', equipo);
        
        const popupContainer = this.shadowRoot.querySelector('#popup-container');
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'popup-overlay';
        
        // Formato de fecha
        let fechaFundacion = 'No disponible';
        if (equipo.fecha_fundacion) {
            try {
                const fecha = new Date(equipo.fecha_fundacion);
                fechaFundacion = fecha.toLocaleDateString();
            } catch (e) {
                fechaFundacion = equipo.fecha_fundacion;
            }
        }
        
        popupOverlay.innerHTML = `
            <div class="popup-content">
                <div class="popup-header" style="background-color: ${teamColor}">
                    <h2>${equipo.nombre || 'Equipo'}</h2>
                    <button class="popup-close">&times;</button>
                </div>
                <div class="equipo-info">
                    <div class="equipo-img">
                        <img src="${equipo.imagen || '../../design/images/default-team.png'}" 
                             alt="${equipo.nombre || 'Equipo'}"
                             onerror="this.onerror=null; this.src='../../design/images/default-team.png';">
                    </div>
                    <div class="info-item">
                        <span class="info-label">País</span>
                        <span class="info-value">${equipo.pais || 'No disponible'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Director</span>
                        <span class="info-value">${equipo.director || 'No disponible'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Motor</span>
                        <span class="info-value">${equipo.motor || 'No disponible'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Fundación</span>
                        <span class="info-value">${fechaFundacion}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Campeonatos</span>
                        <span class="info-value">${equipo.campeonatos || '0'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Victorias</span>
                        <span class="info-value">${equipo.victorias || '0'}</span>
                    </div>
                </div>
            </div>
        `;
        
        popupContainer.appendChild(popupOverlay);
        
        // Agregar evento para cerrar el popup
        const closeButton = popupOverlay.querySelector('.popup-close');
        closeButton.addEventListener('click', () => {
            popupContainer.innerHTML = '';
        });
        
        // Cerrar al hacer clic fuera del contenido
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                popupContainer.innerHTML = '';
            }
        });
    }

    async handleEdit(id) {
        try {
            if (!this.isUserAdmin) {
                showNotification('No tienes permisos para editar equipos', 'error');
                return;
            }
            
            window.location.href = `/src/modules/teams/editarEquipo.html?id=${id}`;
        } catch (error) {
            console.error('❌ Error al redirigir a la página de edición:', error);
            showNotification('Error al redirigir a la página de edición', 'error');
        }
    }

    async handleDelete(id) {
        try {
            if (!this.isUserAdmin) {
                showNotification('No tienes permisos para eliminar equipos', 'error');
                return;
            }
            
            const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este equipo?');
            if (!confirmDelete) return;

            await this.equipoService.deleteEquipo(id);
            showNotification('Equipo eliminado exitosamente', 'success');
            this.loadData();
        } catch (error) {
            console.error('❌ Error al eliminar el equipo:', error);
            showNotification(error.message || 'Error al eliminar el equipo', 'error');
        }
    }
}

customElements.define('team-list', TeamList);