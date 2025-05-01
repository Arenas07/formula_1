class VehicleList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.vehicles = []; // Esto se llenará luego
    }
  
    connectedCallback() {
      this.render();
      this.loadData();
    }
  
    loadData() {
      this.vehicles = [
        {
          "id": 2,
          "equipo": "Storm Racers",
          "modelo": "SRX-22",
          "motor": "V6 Híbrido",
          "potencia": 870,
          "velocidad_maxima_kmh": 340,
          "aceleracion_0_100": 2.7,
          "imagen": "https://placehold.co/600x400",
          "dimensiones": {
            "peso": 745,
            "longitud": 4980,
            "anchura": 1980,
            "altura": 930
          }
        },
        {
          "id": 3,
          "equipo": "Apex Thunder",
          "modelo": "AT-R3",
          "motor": "V10 Atmosférico",
          "potencia": 1020,
          "velocidad_maxima_kmh": 370,
          "aceleracion_0_100": 2.2,
          "imagen": "https://placehold.co/600x400",
          "dimensiones": {
            "peso": 760,
            "longitud": 5020,
            "anchura": 2020,
            "altura": 940
          }
        }
      ];
  
      this.generateVehicles();
    }
  
    generateVehicles() {
      const container = this.shadowRoot.querySelector("#list__vehicles");
      container.innerHTML = "";
  
      this.vehicles.forEach(vehicle => {
        const card = document.createElement("div");
        card.className = "vehicle-container";
        card.innerHTML = `
          <div class="top-info">
            <p>${vehicle.equipo}</p>
            <p>${vehicle.id}</p>
          </div>
          <div class="model">
            <h2>${vehicle.modelo}</h2>
          </div>
          <div class="principal-img">
            <img src="${vehicle.imagen}" alt="${vehicle.modelo}">
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
  
      popupImg.src = vehicle.imagen;
      motorInfo.innerHTML = `
        <p>Motor: <b>${vehicle.motor}</b></p>
        <p>Potencia: <b>${vehicle.potencia} HP</b></p>
        <p>Velocidad máxima: <b>${vehicle.velocidad_maxima_kmh} km/h</b></p>
      `;
      dimensionInfo.innerHTML = `
        <p>Peso: <b>${vehicle.dimensiones.peso} kg</b></p>
        <p>Longitud: <b>${vehicle.dimensiones.longitud} mm</b></p>
        <p>Anchura: <b>${vehicle.dimensiones.anchura} mm</b></p>
        <p>Altura: <b>${vehicle.dimensiones.altura} mm</b></p>
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
          .vehicle-container {
            margin-top: 7rem;
            width: 400px;
            border-radius: 12px;
            background: rgba(255, 64, 64, 0.76)
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            cursor: pointer;
            transition: transform 0.3s ease;
          }
          .vehicle-container:hover {
            transform: translateY(-5px);
          }
          .vehicle-container img {
            width: 100%;
            border-radius: 8px;
          }
          .top-info, .model, .more-info {
            text-align: center;
            margin: 0.5rem 0;
          }
          .team-name {
            font-size: 1.4rem;
            font-weight: bold;
            color: black;
          }
          .vehicle-id {
            font-size: 1rem;
            color: black;
          }
          .model-name {
            font-size: 1.6rem;
            font-weight: bold;
            color: black;
          }
          .more-info {
            font-size: 1.2rem;
            color: black;
            font-weight: bold;
            text-decoration: underline;
            cursor: pointer;
          }
  
          #list__vehicles {
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            justify-content: center;
            padding: 2rem;
          }
  
          .popup {
            position: fixed;
            top: 0; left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0,0,0,0.6);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 100;
          }
  
          .popup-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }
  
          .popup-content img {
            width: 100%;
            height: auto;
            border-radius: 10px;
          }
  
          .close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            font-size: 1.5rem;
            background: transparent;
            border: none;
            cursor: pointer;
          }
  
          .popup-body {
            margin-top: 1rem;
          }
  
          .popup-content p {
            margin: 0.5rem 0;
            font-size: 1.2rem;
            color: black;
          }
        </style>
  
        <div id="list__vehicles"></div>
  
        <div id="popup" class="popup">
          <div class="popup-content">
            <button class="close-btn" id="closeBtn">×</button>
            <div class="popup-body">
              <img id="popup-img" src="" alt="">
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
  