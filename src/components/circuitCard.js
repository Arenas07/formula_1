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
                .loading, .no-data, .error-message {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    text-align: center;
                    color: #555;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #ccc;
                    border-top: 4px solid #555;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .card { /* simplificado */
                    border-radius: 16px;
                    background: linear-gradient(to top, #333, #ccc);
                    color: white;
                    padding: 1rem;
                    margin: 1rem;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }

                .popup-card {
                    position: fixed;
                    top: 10%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: white;
                    padding: 2rem;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
                    z-index: 10;
                    border-radius: 12px;
                    max-width: 600px;
                    width: 90%;
                }

                #popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.6);
                    display: none;
                    align-items: center;
                    justify-content: center;
                }

                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    font-size: 1.5rem;
                    background: transparent;
                    border: none;
                    cursor: pointer;
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
            const circuitsData = await this.circuitsService.getCircuitos();
            this.circuits = circuitsData || [];
            this.renderCards();
        } catch (error) {
            console.error('Error al cargar los circuitos:', error);
            this.renderError();
        }
    }

    renderCards() {
        const container = this.shadowRoot.querySelector('#list__circuits');
        container.innerHTML = '';

        if (this.circuits.length === 0) {
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
                <div class="upper-information">
                    <p>${circuito.continente}</p>
                    <span class="difficulty">${circuito.dificultad}</span>
                </div>
                <div class="name-information">
                    <h2>${circuito.nombre}</h2>
                    <h4>${circuito.ciudad}, ${circuito.pais}</h4>
                </div>
                <div class="card-footer">
                    <span>📅 ${circuito.fecha}</span>
                    <span class="info-btn" style="cursor:pointer;">ℹ️</span>
                </div>
            `;
            card.querySelector('.info-btn').onclick = () => this.abrirPopup(circuito.nombre);
            container.appendChild(card);
        });
    }

    abrirPopup(nombre) {
        const circuito = this.circuits.find(c => c.nombre === nombre);
        const popup = this.shadowRoot.querySelector('#popup');
        popup.innerHTML = `
            <div class="popup-card">
                <button class="close-btn">×</button>
                <div class="popup-header">
                    <div class="location-info">
                        <h2>${circuito.nombre}</h2>
                        <h4>${circuito.ciudad}, ${circuito.pais}</h4>
                    </div>
                    <span class="continent-tag">${circuito.continente}</span>
                </div>
                <img src="${circuito.imagen}" alt="${circuito.nombre}" />
                <div class="extra-information">
                    <div class="description">
                        <h3>Descripción</h3>
                        <p>${circuito.descripcion}</p>
                    </div>
                    <div class="caracteristics">
                        <div class="little-info"><p>Longitud:</p><b>${circuito.longitud_km}</b></div>
                        <div class="little-info"><p>Curvas:</p><b>${circuito.curvas.total}</b></div>
                        <div class="little-info"><p>Vueltas:</p><b>${circuito.Vueltas}</b></div>
                    </div>
                </div>
            </div>
        `;
        popup.querySelector('.close-btn').onclick = () => this.cerrarPopup();
        popup.style.display = 'flex';
    }

    cerrarPopup() {
        const popup = this.shadowRoot.querySelector('#popup');
        popup.style.display = 'none';
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
