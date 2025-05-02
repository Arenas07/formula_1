import { circuitsService } from '../services/circuits.service.js'

class circuitos extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({ mode: "open"})
        this.circuitsService = new circuitsService()
        this.circuits = []
    }

    connectedCallback(){
        this.render()
        this.loadData()
    }

    // async loadData() {
    //     try {
    //       const container = this.shadowRoot.querySelector("#list__vehicles");
    //       container.innerHTML = `
    //         <div class='loading'>
    //           <div class="spinner"></div>
    //           <p>Cargando circuitos...</p>
    //         </div>
    //       `;
          
    //       console.log('Iniciando carga de circuitos...');
    //       const circuitsData = await this.vehiclesService.getVehicles();
    //       console.log('Vehículos recibidos:', vehiclesData);
          
    //       this.vehicles = vehiclesData || [];
    //       this.generateVehicles();
    //     } catch (error) {
    //       console.error('Error al cargar los vehículos:', error);
    //       this.renderError();
    //     }
    //   }
    render(){

    }
}