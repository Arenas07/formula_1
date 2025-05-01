import { VehiclesService } from "../services/vehicles.service.js";

class VehicleList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.vehiclesService = new VehiclesService();
      this.vehicles = [];
    }
  
    connectedCallback() {
      this.render();
      this.loadData();
    }
  
    async loadData() {
      try {
        const container = this.shadowRoot.querySelector("#list__vehicles");
        container.innerHTML = `
          <div class='loading'>
            <div class="spinner"></div>
            <p>Cargando vehículos...</p>
          </div>
        `;
        
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
      container.innerHTML = `
        <div class='error'>
          <i class='bx bx-error-circle'></i>
          <p>Error al cargar los vehículos</p>
          <button class="retry-btn" id="retryBtn">Intentar nuevamente</button>
        </div>
      `;
      
      this.shadowRoot.querySelector("#retryBtn").addEventListener("click", () => this.loadData());
    }
  
    generateVehicles() {
      const container = this.shadowRoot.querySelector("#list__vehicles");
      container.innerHTML = "";
  
      if (!this.vehicles || this.vehicles.length === 0) {
        container.innerHTML = `
          <div class='no-data'>
            <i class='bx bx-car'></i>
            <p>No hay vehículos disponibles</p>
          </div>
        `;
        return;
      }
      
      // Contenedor para todas las tarjetas
      const cardsContainer = document.createElement("div");
      cardsContainer.className = "cards-grid";
      container.appendChild(cardsContainer);
  
      this.vehicles.forEach(vehicle => {
        const card = document.createElement("div");
        card.className = "vehicle-container";
        
        // Determinar el color de fondo basado en el equipo
        const teamColors = {
          "Red Bull Racing": "#0600EF",
          "Mercedes-AMG Petronas": "#00D2BE",
          "Ferrari": "#DC0000",
          "McLaren": "#FF8700",
          "Aston Martin": "#006F62",
          "Alpine": "#0090FF",
          "Haas F1 Team": "#FFFFFF",
          "AlphaTauri": "#2B4562",
          "Williams": "#005AFF"
        };
        
        const bgColor = teamColors[vehicle.equipo] || "#FF6F61";
        
        card.innerHTML = `
          <div class="top-info">
            <p class="team-name">${vehicle.equipo || 'Equipo no asignado'}</p>
            <p class="vehicle-id">${vehicle.id || '#'}</p>
          </div>
          <div class="model">
            <h2>${vehicle.modelo || 'Modelo desconocido'}</h2>
          </div>
          <div class="principal-img">
            <img src="${vehicle.imagen || '../../design/images/default-vehicle.png'}" 
                 alt="${vehicle.modelo || 'Vehículo'}"
                 onerror="this.src='../../design/images/default-vehicle.png'">
          </div>
          <p class="more-info">Ver más <i class='bx bx-right-arrow-alt'></i></p>
        `;
        
        // Aplicar estilo personalizado basado en el equipo
        card.style.background = bgColor;
        // Ajustar color del texto según el fondo
        if (bgColor === "#FFFFFF" || bgColor === "#00D2BE" || bgColor === "#FF8700") {
          card.style.color = "#000000";
        } else {
          card.style.color = "#FFFFFF";
        }
  
        card.addEventListener("click", () => this.openPopup(vehicle));
        cardsContainer.appendChild(card);
      });
    }
  
    openPopup(vehicle) {
      const popup = this.shadowRoot.querySelector("#popup");
      const popupImg = this.shadowRoot.querySelector("#popup-img");
      const popupTitle = this.shadowRoot.querySelector("#popup-title");
      const motorInfo = this.shadowRoot.querySelector("#motor-info");
      const dimensionInfo = this.shadowRoot.querySelector("#dimension-info");
  
      popupTitle.textContent = `${vehicle.modelo || 'Vehículo'} - ${vehicle.equipo || 'Equipo'}`;
      popupImg.src = vehicle.imagen || '../../design/images/default-vehicle.png';
      
      motorInfo.innerHTML = `
        <div class="info-item">
          <i class='bx bx-engine'></i>
          <div>
            <p>Motor</p>
            <b>${vehicle.motor || 'No disponible'}</b>
          </div>
        </div>
        <div class="info-item">
          <i class='bx bx-tachometer'></i>
          <div>
            <p>Potencia</p>
            <b>${vehicle.potencia || 'N/A'} HP</b>
          </div>
        </div>
        <div class="info-item">
          <i class='bx bx-timer'></i>
          <div>
            <p>Velocidad máxima</p>
            <b>${vehicle.velocidad_maxima_kmh || 'N/A'} km/h</b>
          </div>
        </div>
      `;
      
      dimensionInfo.innerHTML = `
        <div class="info-item">
          <i class='bx bx-weight'></i>
          <div>
            <p>Peso</p>
            <b>${vehicle.dimensiones?.peso || 'N/A'} kg</b>
          </div>
        </div>
        <div class="info-item">
          <i class='bx bx-ruler'></i>
          <div>
            <p>Longitud</p>
            <b>${vehicle.dimensiones?.longitud || 'N/A'} mm</b>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <i class='bx bx-arrows-horizontal'></i>
            <div>
              <p>Anchura</p>
              <b>${vehicle.dimensiones?.anchura || 'N/A'} mm</b>
            </div>
          </div>
          <div class="info-item">
            <i class='bx bx-arrows-vertical'></i>
            <div>
              <p>Altura</p>
              <b>${vehicle.dimensiones?.altura || 'N/A'} mm</b>
            </div>
          </div>
        </div>
      `;
  
      popup.style.display = "flex";
      
      // Animación de entrada
      const popupContent = this.shadowRoot.querySelector(".popup-content");
      popupContent.style.animation = "popupIn 0.3s ease-out forwards";
    }
  
    closePopup() {
      const popup = this.shadowRoot.querySelector("#popup");
      const popupContent = this.shadowRoot.querySelector(".popup-content");
      
      // Animación de salida
      popupContent.style.animation = "popupOut 0.2s ease-in forwards";
      
      // Esperar a que termine la animación
      setTimeout(() => {
        popup.style.display = "none";
      }, 200);
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          
          @keyframes popupIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes popupOut {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0; }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          #list__vehicles {
            margin-top: 5rem;
            padding: 2rem;
            min-height: 400px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
            width: 100%;
            max-width: 1400px;
          }
          
          .vehicle-container {
            border-radius: 15px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            padding: 1.2rem;
            transition: all 0.3s ease-in-out;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            min-height: 320px;
          }
          
          .vehicle-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
            z-index: 1;
            pointer-events: none;
          }
          
          .vehicle-container:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
          }
          
          .top-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.8rem;
            z-index: 2;
          }
          
          .team-name {
            font-size: 1rem;
            font-weight: bold;
            background: rgba(0, 0, 0, 0.1);
            padding: 0.3rem 0.7rem;
            border-radius: 20px;
          }
          
          .vehicle-id {
            font-size: 1.2rem;
            font-weight: bold;
            background: rgba(0, 0, 0, 0.2);
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }
          
          .model {
            z-index: 2;
          }
          
          .model h2 {
            font-size: 2rem;
            text-align: center;
            margin-bottom: 1rem;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .principal-img {
            position: relative;
            height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            margin-bottom: 1rem;
          }
          
          .principal-img img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
            transition: transform 0.3s ease;
          }
          
          .vehicle-container:hover .principal-img img {
            transform: scale(1.05);
          }
          
          .more-info {
            text-align: right;
            font-size: 0.9rem;
            font-weight: bold;
            padding: 0.5rem 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            z-index: 2;
          }
          
          .more-info i {
            margin-left: 0.3rem;
            font-size: 1.1rem;
            transition: transform 0.2s ease;
          }
          
          .vehicle-container:hover .more-info i {
            transform: translateX(3px);
          }
          
          .popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
            backdrop-filter: blur(5px);
          }
          
          .popup-content {
            background-color: #ffffff;
            border-radius: 20px;
            padding: 2rem;
            width: 100%;
            max-width: 700px;
            color: #1f2937;
            position: relative;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          
          #popup-title {
            font-size: 1.8rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 1.5rem;
            color: #1e3a8a;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 1rem;
          }
          
          .popup-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            align-items: start;
          }
          
          @media (max-width: 768px) {
            .popup-body {
              grid-template-columns: 1fr;
            }
          }
          
          .popup-body img {
            width: 100%;
            height: auto;
            max-height: 250px;
            object-fit: contain;
            border-radius: 10px;
            background-color: #f8fafc;
            grid-column: 1 / -1;
            padding: 1rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          
          #motor-info, #dimension-info {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }
          
          .info-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            background-color: #f8fafc;
            padding: 0.8rem;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s ease;
          }
          
          .info-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.8rem;
          }
          
          .info-item i {
            font-size: 1.5rem;
            color: #2563eb;
            background-color: #eff6ff;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
          }
          
          .info-item p {
            font-size: 0.8rem;
            color: #64748b;
            margin-bottom: 0.2rem;
          }
          
          .info-item b {
            font-size: 1.1rem;
            color: #0f172a;
          }
          
          .close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 1.5rem;
            color: #ef4444;
            background-color: #fee2e2;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          
          .close-btn:hover {
            transform: scale(1.1);
            background-color: #fecaca;
          }
          
          .loading, .error, .no-data {
            width: 100%;
            text-align: center;
            padding: 3rem;
            font-size: 1.2rem;
            color: #64748b;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
          }
          
          .loading .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #e2e8f0;
            border-top: 5px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          .error {
            color: #ef4444;
            background-color: #fee2e2;
            border-radius: 10px;
          }
          
          .error i, .no-data i {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          
          .retry-btn {
            margin-top: 1rem;
            padding: 0.7rem 1.5rem;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .retry-btn:hover {
            background-color: #2563eb;
          }
        </style>
  
        <div id="list__vehicles">
          <div class="loading">
            <div class="spinner"></div>
            <p>Cargando vehículos...</p>
          </div>
        </div>
  
        <div id="popup" class="popup">
          <div class="popup-content">
            <button class="close-btn" id="closeBtn"><i class='bx bx-x'></i></button>
            <h2 id="popup-title">Detalles del vehículo</h2>
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