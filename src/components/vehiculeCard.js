import { VehiclesService } from "../services/vehicles.service.js";
import { AuthService } from "../services/login.service.js";
import { showNotification } from "../utils/notifications.js";

class VehicleList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.vehiclesService = new VehiclesService();
      this.authService = new AuthService();
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
        const response = await this.vehiclesService.getVehicles();
        console.log('Vehículos recibidos:', response);
        
        // Validar y extraer los vehículos de la estructura anidada
        if (response && 
            response.success && 
            response.vehiculos && 
            response.vehiculos.success && 
            Array.isArray(response.vehiculos.vehiculos)) {
          this.vehicles = response.vehiculos.vehiculos;
        } else {
          console.error('Formato de respuesta inválido:', response);
          this.vehicles = [];
        }
        
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
  
      // Validar que this.vehicles sea un array
      if (!Array.isArray(this.vehicles)) {
        console.error('this.vehicles no es un array:', this.vehicles);
        this.vehicles = [];
      }
  
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
          </div>
          <div class="card-actions-bottom">
            <button class="more-info"><i class='bx bx-right-arrow-alt'></i> Ver más</button>
            ${this.authService.isAdmin() ? `
              <button class="edit-btn"><i class='bx bx-edit'></i> Editar</button>
              <button class="delete-btn"><i class='bx bx-trash'></i> Eliminar</button>
            ` : ''}
          </div>
        `;
        
        // Aplicar estilo personalizado basado en el equipo
        card.style.background = bgColor;
        // Ajustar color del texto según el fondo
        if (bgColor === "#FFFFFF" || bgColor === "#00D2BE" || bgColor === "#FF8700") {
          card.style.color = "#000000";
        } else {
          card.style.color = "#FFFFFF";
        }
  
        card.addEventListener("click", (e) => {
          // No abrir el popup si se hizo clic en los botones de admin
          if (!e.target.closest('.admin-actions')) {
            this.openPopup(vehicle);
          }
        });

        // Agregar event listeners para los botones de admin
        if (this.authService.isAdmin()) {
          const editBtn = card.querySelector('.edit-btn');
          const deleteBtn = card.querySelector('.delete-btn');

          editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleEdit(vehicle.id);
          });

          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDelete(vehicle.id);
          });
        }

        // El botón ver más debe abrir el popup
        const moreInfoBtn = card.querySelector('.more-info');
        if (moreInfoBtn) {
          moreInfoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openPopup(vehicle);
          });
        }

        cardsContainer.appendChild(card);
      });
    }

    async handleEdit(id) {
      try {
        window.location.href = `/src/modules/vehicles/editarVehiculo.html?id=${id}`;
      } catch (error) {
        console.error('Error al redirigir a la página de edición:', error);
        showNotification('Error al redirigir a la página de edición', 'error');
      }
    }

    async handleDelete(id) {
      try {
        const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este vehículo?');
        if (!confirmDelete) return;

        await this.vehiclesService.deleteVehicle(id);
        showNotification('Vehículo eliminado exitosamente', 'success');
        this.loadData(); // Recargar la lista
      } catch (error) {
        console.error('Error al eliminar el vehículo:', error);
        showNotification(error.message || 'Error al eliminar el vehículo', 'error');
      }
    }
  
    openPopup(vehicle) {
      const popup = this.shadowRoot.querySelector("#popup");
      const popupTitle = this.shadowRoot.querySelector("#popup-title");
      const motorInfo = this.shadowRoot.querySelector("#motor-info");
      const dimensionInfo = this.shadowRoot.querySelector("#dimension-info");
  
      popupTitle.textContent = `${vehicle.modelo || 'Vehículo'} - ${vehicle.equipo || 'Equipo'}`;
      
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
          
          body {
            background: #f3f4f8;
          }
          
          #list__vehicles {
            margin-top: 7rem;
            padding: 2.5rem 1rem 2rem 1rem;
            min-height: 400px;
            display: flex;
            flex: 1; 
            flex-direction: column;
            background: #f3f4f8;
          }
          
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 2.5rem;
            width: 100%;
            max-width: 1500px;
            margin: 0 auto;
          }
          
          .vehicle-container {
            border-radius: 2rem;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 6px 0 rgba(0,0,0,0.10);
            padding: 2rem 1.5rem 1.5rem 1.5rem;
            transition: transform 0.25s cubic-bezier(.4,2,.3,1), box-shadow 0.25s;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            min-height: 370px;
            background: rgba(255,255,255,0.75);
            backdrop-filter: blur(8px);
            border: 1.5px solid rgba(255,255,255,0.25);
          }
          
          .vehicle-container:hover {
            transform: translateY(-12px) scale(1.03);
            box-shadow: 0 16px 40px 0 rgba(31, 38, 135, 0.22), 0 4px 16px 0 rgba(0,0,0,0.13);
          }
          
          .top-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.2rem;
            z-index: 2;
          }
          
          .team-name {
            font-size: 1.05rem;
            font-weight: 700;
            background: rgba(255,255,255,0.35);
            color: #222;
            padding: 0.5rem 1.2rem;
            border-radius: 1.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
            backdrop-filter: blur(6px);
            border: 1px solid rgba(255,255,255,0.25);
            letter-spacing: 0.5px;
          }
          
          .vehicle-id {
            font-size: 1.15rem;
            font-weight: 700;
            background: rgba(0,0,0,0.10);
            color: #333;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 1px solid rgba(0,0,0,0.08);
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
            backdrop-filter: blur(3px);
          }
          
          .model {
            z-index: 2;
            text-align: center;
            margin: 1.2rem 0 0.7rem 0;
          }
          
          .model h2 {
            font-size: 2.3rem;
            font-weight: 900;
            text-shadow: 0 2px 8px rgba(0,0,0,0.10);
            letter-spacing: 1.5px;
            color: #222;
          }
          
          .principal-img {
            position: relative;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            margin: 1.2rem 0 0.7rem 0;
          }
          
          .principal-img img {
            width: 90%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 8px 18px rgba(0,0,0,0.18));
            transition: transform 0.35s cubic-bezier(.4,2,.3,1);
          }
          
          .vehicle-container:hover .principal-img img {
            transform: scale(1.08) rotate(-2deg);
          }
          
          .card-actions-bottom {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 0.7rem;
            width: 100%;
            margin-top: 1.5rem;
            padding-bottom: 0.2rem;
            background: none;
            position: absolute;
            bottom: 1.2rem;
            right: 1.2rem;
            left: 1.2rem;
            z-index: 10;
          }
          .more-info, .edit-btn, .delete-btn {
            background: rgba(255,255,255,0.92);
            border: none;
            min-width: 90px;
            height: 42px;
            border-radius: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            cursor: pointer;
            transition: all 0.22s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.10);
            font-size: 1.08rem;
            color: #222;
            border: 1.5px solid #e5e7eb;
            font-weight: 600;
            padding: 0 1.1rem;
          }
          .more-info:hover {
            background: linear-gradient(135deg, #2563eb 60%, #1e3a8a 100%);
            color: #fff;
            box-shadow: 0 4px 16px #2563eb44;
            border-color: #2563eb;
          }
          .edit-btn:hover {
            background: linear-gradient(135deg, #3b82f6 60%, #1e3a8a 100%);
            color: #fff;
            box-shadow: 0 4px 16px #3b82f6aa;
            border-color: #3b82f6;
          }
          .delete-btn:hover {
            background: linear-gradient(135deg, #ef4444 60%, #b91c1c 100%);
            color: #fff;
            box-shadow: 0 4px 16px #ef4444aa;
            border-color: #ef4444;
          }
          .more-info i, .edit-btn i, .delete-btn i {
            font-size: 1.15rem;
          }

          /* Animaciones y glassmorphism para el popup */
          .popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(30, 41, 59, 0.85);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 2rem;
            backdrop-filter: blur(10px);
          }
          .popup-content {
            background: rgba(255,255,255,0.92);
            border-radius: 2rem;
            padding: 2.5rem;
            width: 100%;
            max-width: 850px;
            color: #1f2937;
            position: relative;
            box-shadow: 0 25px 50px rgba(0,0,0,0.25);
            max-height: 90vh;
            overflow-y: auto;
            border: 1.5px solid rgba(255,255,255,0.25);
            backdrop-filter: blur(8px);
          }
          #popup-title {
            font-size: 2.1rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 2rem;
            color: #1e3a8a;
            border-bottom: 3px solid #e5e7eb;
            padding-bottom: 1rem;
            letter-spacing: 1px;
          }
          .popup-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            align-items: start;
          }
          @media (max-width: 900px) {
            .popup-body {
              grid-template-columns: 1fr;
            }
            .popup-content {
              padding: 1.5rem;
            }
          }
          .popup-body img {
            width: 100%;
            height: auto;
            max-height: 300px;
            object-fit: contain;
            border-radius: 1.2rem;
            background: #f8fafc;
            grid-column: 1 / -1;
            padding: 1.5rem;
            box-shadow: 0 8px 20px rgba(0,0,0,0.10);
          }
          #motor-info, #dimension-info {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
            width: 100%;
          }
          .info-item {
            display: flex;
            align-items: center;
            gap: 1.2rem;
            background: rgba(248,250,252,0.85);
            padding: 1.1rem;
            border-radius: 1.2rem;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            transition: all 0.3s;
          }
          .info-item:hover {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 6px 16px rgba(0,0,0,0.10);
            background: #f1f5f9;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .info-item i {
            font-size: 1.8rem;
            color: #2563eb;
            background: #eff6ff;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            transition: all 0.3s;
          }
          .info-item:hover i {
            transform: scale(1.1);
            background: #dbeafe;
          }
          .info-item p {
            font-size: 0.98rem;
            color: #64748b;
            margin-bottom: 0.3rem;
            font-weight: 500;
          }
          .info-item b {
            font-size: 1.18rem;
            color: #0f172a;
            font-weight: 700;
          }
          .close-btn {
            position: absolute;
            top: 22px;
            right: 22px;
            font-size: 1.8rem;
            color: #ef4444;
            background: #fee2e2;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            transition: all 0.3s;
            box-shadow: 0 4px 8px rgba(0,0,0,0.10);
          }
          .close-btn:hover {
            transform: scale(1.13) rotate(90deg);
            background: #fecaca;
          }
          .loading, .error, .no-data {
            width: 100%;
            text-align: center;
            padding: 4rem 2rem;
            font-size: 1.3rem;
            color: #64748b;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            background: rgba(255,255,255,0.93);
            border-radius: 2rem;
            box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          }
          .loading .spinner {
            width: 64px;
            height: 64px;
            border: 7px solid #e2e8f0;
            border-top: 7px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          .error {
            color: #ef4444;
            background: #fee2e2;
            border-radius: 1.5rem;
          }
          .error i, .no-data i {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            color: #ef4444;
          }
          .retry-btn {
            margin-top: 1.5rem;
            padding: 1rem 2.2rem;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 1.2rem;
            font-weight: bold;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.10);
          }
          .retry-btn:hover {
            background: #2563eb;
            transform: translateY(-2px) scale(1.04);
            box-shadow: 0 6px 16px rgba(0,0,0,0.15);
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