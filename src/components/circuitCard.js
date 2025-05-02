import { circuitsService } from '../services/circuits.service.js';

class CircuitosComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.circuitsService = new circuitsService();
        this.circuits = [];
    }

    connectedCallback() {
        this.renderBase();
        this.loadData();
    }

    renderBase() {
        this.shadowRoot.innerHTML = `
            <style>
                body{
                    margin-top: 8rem;
                }
                :host {
                    --primary-color: #e53935;
                    --secondary-color: #333;
                    --text-light: #ffffff;
                    --text-dark: #333333;
                    --card-gradient: linear-gradient(145deg, #424242, #212121);
                    --card-hover-gradient: linear-gradient(145deg, #383838, #1a1a1a);
                    --card-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
                    --card-hover-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                    --border-radius: 16px;
                    --transition-speed: 0.3s;
                    font-family: 'Roboto', 'Segoe UI', sans-serif;
                }
                
                /* Grid container for cards */
                #list__circuits {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    height: 100%; /* Asegura que ocupe toda la altura disponible */
                }
                
                /* Card Design */
                .card {
                    position: relative;
                    height: 220px;
                    border-radius: var(--border-radius);
                    background: var(--card-gradient);
                    color: var(--text-light);
                    padding: 1.5rem;
                    box-shadow: var(--card-shadow);
                    transition: all var(--transition-speed) ease;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                
                .card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    opacity: 0.4;
                    transition: opacity var(--transition-speed);
                    z-index: 0;
                    border-radius: var(--border-radius);
                }
                
                .card:hover {
                    transform: translateY(-8px);
                    box-shadow: var(--card-hover-shadow);
                    background: var(--card-hover-gradient);
                }
                
                .card:hover::before {
                    opacity: 0.6;
                }
                
                .card * {
                    position: relative;
                    z-index: 1;
                }
                
                .upper-information {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                
                .continent-tag {
                    background-color: var(--primary-color);
                    color: var(--text-light);
                    padding: 0.4rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                
                .difficulty {
                    background: rgba(255,255,255,0.2);
                    color: var(--text-light);
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    backdrop-filter: blur(5px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .name-information {
                    margin: 1rem 0;
                }
                
                .name-information h2 {
                    font-size: 1.4rem;
                    font-weight: 700;
                    margin: 0 0 0.3rem 0;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .name-information h4 {
                    font-weight: 400;
                    color: rgba(255,255,255,0.8);
                    font-size: 0.9rem;
                    margin: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 1rem;
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.9);
                }
                
                .first-gp {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }
                
                .info-icon {
                    background-color: var(--primary-color);
                    color: white;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-size: 0.9rem;
                    transition: transform 0.2s;
                }
                
                .info-icon:hover {
                    transform: scale(1.1);
                }
                
                /* Popup Styles */
                #popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.75);
                    backdrop-filter: blur(5px);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                    box-sizing: border-box;
                }
                
                .popup-card {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    width: 100%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
                    position: relative;
                    color: var(--text-dark);
                    animation: popup-fade 0.3s ease-out;
                }
                
                @keyframes popup-fade {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1.5rem;
                    background: rgba(0,0,0,0.1);
                    color: var(--text-dark);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    line-height: 1;
                }
                
                .close-btn:hover {
                    background: rgba(0,0,0,0.2);
                    transform: rotate(90deg);
                }
                
                .popup-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                    padding-right: 2rem;
                }
                
                .location-info h2 {
                    font-size: 1.8rem;
                    margin: 0 0 0.3rem 0;
                    color: var(--text-dark);
                }
                
                .location-info h4 {
                    font-size: 1rem;
                    font-weight: 400;
                    color: #666;
                    margin: 0;
                }
                
                .popup-continent-tag {
                    background-color: var(--primary-color);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }
                
                .circuit-image-container {
                    width: 100%;
                    height: 280px;
                    border-radius: 14px;
                    overflow: hidden;
                    margin: 1rem 0 2rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.15);
                }
                
                .circuit-image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    transition: transform 0.5s ease;
                }
                
                .circuit-image-container:hover img {
                    transform: scale(1.05);
                }
                
                .extra-information {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                
                @media (min-width: 768px) {
                    .extra-information {
                        grid-template-columns: 2fr 1fr;
                    }
                }
                
                .description {
                    background: #f9f9f9;
                    padding: 1.5rem;
                    border-radius: 14px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }
                
                .description h3 {
                    font-size: 1.2rem;
                    margin: 0 0 1rem 0;
                    color: var(--text-dark);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .description h3::before {
                    content: '';
                    display: inline-block;
                    width: 8px;
                    height: 20px;
                    background-color: var(--primary-color);
                    border-radius: 4px;
                }
                
                .description p {
                    margin: 0;
                    line-height: 1.6;
                    color: #555;
                }
                
                .caracteristics {
                    background: linear-gradient(145deg, #f7f9fc, #edf1f7);
                    padding: 1.5rem;
                    border-radius: 14px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }
                
                .caracteristics h3 {
                    font-size: 1.2rem;
                    margin: 0 0 1rem 0;
                    color: var(--text-dark);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .caracteristics h3::before {
                    content: '';
                    display: inline-block;
                    width: 8px;
                    height: 20px;
                    background-color: var(--primary-color);
                    border-radius: 4px;
                }
                
                .little-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.8rem 0;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }
                
                .little-info:last-child {
                    border-bottom: none;
                }
                
                .little-info p {
                    margin: 0;
                    color: #555;
                    font-weight: 500;
                }
                
                .little-info b {
                    color: #222;
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                
                /* Loading and Error States */
                .loading, .no-data, .error-message {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    text-align: center;
                    color: #555;
                    width: 100%;
                    grid-column: 1 / -1;
                }
                
                .spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid #e0e0e0;
                    border-top: 4px solid var(--primary-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1.5rem;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .error-message {
                    display: flex;
                    justify-content: center; /* Centra horizontalmente */
                    align-items: center; /* Centra verticalmente */
                    text-align: center; /* Centra el texto dentro del contenedor */
                    width: 100%; /* Asegura que ocupe todo el ancho */
                    height: 100%; /* Asegura que ocupe toda la altura disponible */
                    color: #555; /* Color del texto */
                    padding: 2rem; /* Espaciado interno opcional */
                    box-sizing: border-box; /* Incluye el padding en el tamaño total */
                }
                
                /* Responsive adjustments */
                @media (max-width: 768px) {
                    #list__circuits {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        padding: 0.75rem;
                    }
                    
                    .popup-card {
                        padding: 1.5rem;
                        border-radius: 16px;
                    }
                    
                    .circuit-image-container {
                        height: 200px;
                    }
                    
                    .popup-header {
                        flex-direction: column;
                    }
                    
                    .popup-continent-tag {
                        margin-top: 0.75rem;
                    }
                }
                
                @media (max-width: 480px) {
                    #list__circuits {
                        grid-template-columns: 1fr;
                    }
                    
                    .card {
                        height: 200px;
                    }
                }
            </style>

            <div id="list__circuits"></div>
            <div id="popup"></div>
        `;
    }

    async loadData() {
        const container = this.shadowRoot.querySelector("#list__circuits");
        container.innerHTML = `
            <div class='loading'>
                <div class="spinner"></div>
                <p>Cargando circuitos...</p>
            </div>
        `;

        try {
            // Llama al servicio para obtener los datos reales
            this.circuits = await this.circuitsService.getCircuits();
            this.renderCards();
        } catch (error) {
            console.error('Error al cargar los circuitos:', error);
            this.renderError();
        }
    }

    renderCards() {
        const container = this.shadowRoot.querySelector('#list__circuits');
        container.innerHTML = '';

        if (!this.circuits || this.circuits.length === 0) {
            container.innerHTML = `
                <div class='no-data'>
                    <div class="spinner"></div>
                    <p>No hay circuitos disponibles.</p>
                </div>
            `;
            return;
        }

        this.circuits.forEach((circuito) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
            <style>
                .card {
                    background: url(${circuito.imagen || '../../design/images/default-circuit.png'}) no-repeat center center;
                }
            </style>
            <span class="info-btn" style="cursor:pointer;">
                <div class="upper-information">
                    <p>${circuito.continente || 'Continente no disponible'}</p>
                    <span class="difficulty">${circuito.caracteristicas_tecnicas?.dificultad || 'N/A'}</span>
                </div>
                <div class="name-information">
                    <h2>${circuito.nombre || 'Nombre no disponible'}</h2>
                    <h4>${circuito.ciudad || 'Ciudad no disponible'}, ${circuito.pais || 'País no disponible'}</h4>
                </div>
                <div class="card-footer">
                    <span>📅 ${circuito.primer_gp || 'Fecha no disponible'}</span>
                    ℹ️
                </div>
            </span>
            `;
            card.querySelector('.info-btn').onclick = () => this.abrirPopup(circuito);
            container.appendChild(card);
        });
    }

    abrirPopup(circuito) {
        const popup = this.shadowRoot.querySelector('#popup');
        popup.innerHTML = `
            <div class="popup-card">
                <button class="close-btn">×</button>
                <div class="popup-header">
                    <div class="location-info">
                        <h2>${circuito.nombre || 'Nombre no disponible'}</h2>
                        <h4>${circuito.ciudad || 'Ciudad no disponible'}, ${circuito.pais || 'País no disponible'}</h4>
                    </div>
                    <span class="continent-tag">${circuito.continente || 'Continente no disponible'}</span>
                </div>
                <img src="${circuito.imagen || '../../design/images/default-circuit.png'}" alt="${circuito.nombre || 'Circuito'}" />
                <div class="extra-information">
                    <div class="description">
                        <h3>Descripción</h3>
                        <p>${circuito.descripcion || 'Descripción no disponible'}</p>
                    </div>
                    <div class="caracteristics">
                        <div class="little-info"><p>Longitud:</p><b>${circuito.longitud_km || 'N/A'} km</b></div>
                        <div class="little-info"><p>Curvas:</p><b>${circuito.curvas?.total || 'N/A'}</b></div>
                        <div class="little-info"><p>Vueltas:</p><b>${circuito.vueltas_carrera || 'N/A'}</b></div>
                    </div>
                </div>
            </div>
        `;
        popup.querySelector('.close-btn').onclick = () => this.cerrarPopup();
        popup.onclick = (e) => {
            if (e.target === popup) {
                this.cerrarPopup();
            }
        };

        popup.style.display = 'flex';
    }

    cerrarPopup() {
        const popup = this.shadowRoot.querySelector('#popup');
        popup.style.display = 'none';
        popup.innerHTML = '';
    }

    renderError() {
        const container = this.shadowRoot.querySelector('#list__circuits');
        container.innerHTML = `
            <div class="error-message">
                <p>Error al cargar los circuitos. Intenta más tarde.</p>
            </div>
        `;
    }
}

customElements.define('circuits-template', CircuitosComponent);
