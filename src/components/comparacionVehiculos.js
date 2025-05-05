import { VehiclesService } from "../services/vehicles.service";

class VehicleComparator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.vehiclesService = new VehiclesService();
        this.vehiclesData = [];
    }

    connectedCallback() {
        this.render();
        this.loadVehicles();

        this.shadowRoot.querySelector('button').addEventListener('click', () => this.compareVehicles());
    }
    async loadVehicles() {
        try {
            this.vehiclesData = await this.vehiclesService.getVehicles();
            if (!this.vehiclesData || this.vehiclesData.length === 0) {
                this.shadowRoot.getElementById('no-data').style.display = 'block';
                return;
            }
            this.populateSelectors();
        } catch (error) {
            console.error('Error cargando vehículos:', error);
            const noData = this.shadowRoot.getElementById('no-data');
            if (noData) {
                noData.textContent = 'Error al cargar datos de vehículos.';
                noData.style.display = 'block';
            }
        }
    }
    
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>

            .title{
                width: 100%;
                text-align: center;
                color: red;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .title h2{
                font-size: clamp(24px, 4vw, 32px);
            }
            
            vehicle-comparator{
                margin: 10rem 10rem;
            }

            .vehicle-comparator-container {
                margin-bottom: 5rem;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .form-wrapper {
                width: 100%;
                max-width: 600px;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                background: #f7f7f7;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                box-shadow: 0 0 0 1px #e0e0e0;
            }

            .form-group label {
                font-weight: bold;
                margin-bottom: 0.3rem;
                position: relative;
                padding-left: 1rem;
                color: #333;
            }

            .form-group label::before {
                content: "";
                position: absolute;
                left: 0;
                top: 0.15rem;
                width: 3px;
                height: 1.2rem;
                background-color: red;
                border-radius: 2px;
            }

            select {
                background-color: #f1f1f1;
                padding: 0.6rem;
                border-radius: 6px;
                border: 1px solid #ccc;
                font-size: 1rem;
                appearance: none;
                cursor: pointer;
            }

            button {
                padding: 0.6rem 1.2rem;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
                align-self: center;
                margin-top: 1rem;
                transition: background-color 0.3s;
            }

            button:hover {
                background-color: #0056b3;
            }

            .comparison-container {
                display: flex;
                gap: 2rem;
                flex-wrap: wrap;
                margin-top: 2rem;
                justify-content: center;
            }

            .vehicle-info {
                border: 1px solid #ddd;
                padding: 1rem;
                border-radius: 12px;
                width: 300px;
                background: linear-gradient(to bottom right, #f0f8ff, #e6f2ff);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s;
            }

            .vehicle-info:hover {
                transform: translateY(-5px);
            }

            .vehicle-info img {
                width: 100%;
                height: auto;
                border-radius: 8px;
                margin-bottom: 0.5rem;
            }

            .vehicle-info h3 {
                margin: 0 0 0.5rem;
                color: #0d47a1;
            }

            .vehicle-info p {
                margin: 0.3rem 0;
                font-size: 0.95rem;
            }

            .comparison-stats {
                margin-top: 1.5rem;
                flex-basis: 100%;
                background: #e3f2fd;
                padding: 1rem;
                border-radius: 12px;
                box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
            }

            </style>

            <div class="title">
                <h2>Compara tus vehiculos</h2>
            </div>
            <div id="no-data" style="display: none; color: #d32f2f; font-weight: bold; text-align: center; margin: 1rem;">
                No se encontraron datos de vehículos.
            </div>
            <div class="form-group">
                <label for="vehicle1">Selecciona el primer vehículo:</label>
                <select id="vehicle1"></select>
            </div>

            <div class="form-group">
                <label for="vehicle2">Comparar con otro vehículo:</label>
                <select id="vehicle2"></select>
                <button>Comparar Vehículos</button>
            </div>

            <div class="comparison-container">
                <div id="vehicle1-info" class="vehicle-info"></div>
                <div id="vehicle2-info" class="vehicle-info"></div>
            </div>
        `;
    }

    populateSelectors() {
        const v1 = this.shadowRoot.getElementById('vehicle1');
        const v2 = this.shadowRoot.getElementById('vehicle2');

        this.vehiclesData.forEach((v, i) => {
            const option1 = document.createElement('option');
            option1.value = i;
            option1.textContent = `${v.equipo} - ${v.modelo}`;
            v1.appendChild(option1);
        
            const option2 = document.createElement('option');
            option2.value = i;
            option2.textContent = `${v.equipo} - ${v.modelo}`;
            v2.appendChild(option2);
        });
        
    }

    compareVehicles() {
        const index1 = this.shadowRoot.getElementById('vehicle1').value;
        const index2 = this.shadowRoot.getElementById('vehicle2').value;

        if (index1 === index2) {
            alert('Selecciona dos vehículos distintos.');
            return;
        }

        const v1 = this.vehiclesData[index1];
        const v2 = this.vehiclesData[index2];


        this.shadowRoot.getElementById('vehicle1-info').innerHTML = this.vehicleInfoHTML(v1);
        this.shadowRoot.getElementById('vehicle2-info').innerHTML = this.vehicleInfoHTML(v2);
        
    }

    vehicleInfoHTML(v) {
        return `
            <h3>${v.equipo} - ${v.modelo}</h3>
            <img src="${v.imagen}" alt="${v.modelo}">
            <p>Potencia: ${v.potencia} CV</p>
            <p>Velocidad máxima: ${v.velocidad_maxima_kmh} km/h</p>
            <p>Aceleración 0-100 km/h: ${v.aceleracion_0_100} s</p>
            <p>Peso: ${v.dimensiones.peso} kg</p>
        `;
    }
}

customElements.define('vehicle-comparator', VehicleComparator);