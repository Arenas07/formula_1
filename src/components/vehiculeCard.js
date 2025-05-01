import { VehiclesService } from "../services/vehicles.service.js";

class VehicleList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.vehiclesService = new VehiclesService();
      this.vehicles = []; // Esto se llenará luego
    }
  
    connectedCallback() {
      this.render();
      this.loadData();
    }
  
async loadData() {
  try {
      const container = this.shadowRoot.querySelector("#list__vehicles");
      container.innerHTML = "<div class='loading'>Cargando vehículos...</div>";
      
      console.log('Iniciando carga de vehículos...');
      const vehiclesData = await this.vehiclesService.getVehicles();
      console.log('Vehículos recibidos:', vehiclesData);
      
      this.vehicles = vehiclesData || [];
      this.generateVehicles();
  } catch (error) {
      console.error('Error al cargar los vehículos:', error);
      this.renderError();
  }
}
  
    renderError() {
      const container = this.shadowRoot.querySelector("#list__vehicles");
      container.innerHTML = "<div class='error'>Error al cargar los vehículos</div>";
    }
  
    generateVehicles() {
      const container = this.shadowRoot.querySelector("#list__vehicles");
      container.innerHTML = "";
  
      if (!this.vehicles || this.vehicles.length === 0) {
        container.innerHTML = "<div class='no-data'>No hay vehículos disponibles</div>";
        return;
      }
  
      this.vehicles.forEach(vehicle => {
        const card = document.createElement("div");
        card.className = "vehicle-container";
        card.innerHTML = `
          <div class="top-info">
            <p>${vehicle.equipo || 'Equipo no asignado'}</p>
            <p>${vehicle.id || '#'}</p>
          </div>
          <div class="model">
            <h2>${vehicle.modelo || 'Modelo desconocido'}</h2>
          </div>
          <div class="principal-img">
            <img src="${vehicle.imagen || '../../design/images/default-vehicle.png'}" 
                 alt="${vehicle.modelo || 'Vehículo'}"
                 onerror="this.src='../../design/images/default-vehicle.png'">
          </div>
          <p class="more-info">Ver más ></p>
        `;
  
        card.addEventListener("click", () => this.openPopup(vehicle));
        container.appendChild(card);
      });
    }
  
    openPopup(vehicle) {
      const popup = this.shadowRoot.querySelector("#popup");
      const popupImg = this.shadowRoot.querySelector("#popup-img");
      const motorInfo = this.shadowRoot.querySelector("#motor-info");
      const dimensionInfo = this.shadowRoot.querySelector("#dimension-info");
  
      popupImg.src = vehicle.imagen || '../../design/images/default-vehicle.png';
      motorInfo.innerHTML = `
        <p>Motor: <b>${vehicle.motor || 'No disponible'}</b></p>
        <p>Potencia: <b>${vehicle.potencia || 'N/A'} HP</b></p>
        <p>Velocidad máxima: <b>${vehicle.velocidad_maxima_kmh || 'N/A'} km/h</b></p>
      `;
      dimensionInfo.innerHTML = `
        <p>Peso: <b>${vehicle.dimensiones?.peso || 'N/A'} kg</b></p>
        <p>Longitud: <b>${vehicle.dimensiones?.longitud || 'N/A'} mm</b></p>
        <p>Anchura: <b>${vehicle.dimensiones?.anchura || 'N/A'} mm</b></p>
        <p>Altura: <b>${vehicle.dimensiones?.altura || 'N/A'} mm</b></p>
      `;
  
      popup.style.display = "flex";
    }
  
    closePopup() {
      const popup = this.shadowRoot.querySelector("#popup");
      popup.style.display = "none";
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          #list__vehicles {
            margin-top: 7rem;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 2rem;
            padding: 2rem;
          }
          
          .vehicle-container {
            background: #FF6F61;
            border-radius: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            width: 280px;
            padding: 1rem;
            transition: transform 0.3s ease-in-out;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          
          .vehicle-container:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
          }
          
          .top-info {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            font-weight: bold;
            color: #2563eb;
          }
          
          .model h2 {
            font-size: 1.4rem;
            color: #1e3a8a;
            text-align: center;
            margin: 1rem 0 0.5rem;
          }
          
          .principal-img img {
            width: 100%;
            height: 160px;
            object-fit: cover;
            border-radius: 10px;
            background-color: white;
          }
          
          .more-info {
            text-align: right;
            font-size: 0.85rem;
            color: #2563eb;
            font-weight: bold;
            margin-top: 0.5rem;
          }
          
          .popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .popup-content {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 2rem;
            width: 90%;
            max-width: 600px;
            color: #1f2937;
            position: relative;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .popup-body img {
            width: 100%;
            height: auto;
            object-fit: contain;
            border-radius: 10px;
            background-color: white;
          }
          
          #motor-info, #dimension-info {
            margin-top: 1rem;
            width: 100%;
            font-size: 0.95rem;
          }
          
          #motor-info p, #dimension-info p {
            margin: 0.4rem 0;
            color: #374151;
          }
          
          #motor-info b, #dimension-info b {
            color: #1e40af;
          }
          
          .close-btn {
            position: absolute;
            top: 12px;
            right: 16px;
            font-size: 24px;
            color: #ef4444;
            font-weight: bold;
            cursor: pointer;
            background: none;
            border: none;
          }
          
          .error, .no-data, .loading {
            width: 100%;
            text-align: center;
            padding: 2rem;
            font-size: 1.2rem;
            color: #374151;
          }
          
          .error {
            color: #ef4444;
            background-color: #fee2e2;
            border-radius: 8px;
          }
        </style>
  
        <div id="list__vehicles">
          <div class="loading">Cargando vehículos...</div>
        </div>
  
        <div id="popup" class="popup">
          <div class="popup-content">
            <button class="close-btn" id="closeBtn">×</button>
            <div class="popup-body">
              <img id="popup-img" src="" alt="Detalles del vehículo">
              <div id="motor-info"></div>
              <div id="dimension-info"></div>
            </div>
          </div>
        </div>
      `;
  
      this.shadowRoot.querySelector("#closeBtn").addEventListener("click", () => this.closePopup());
  
      this.shadowRoot.querySelector("#popup").addEventListener("click", e => {
        if (e.target.id === "popup") {
          this.closePopup();
        }
      });
    }
  }
  
  customElements.define('vehicle-list', VehicleList);