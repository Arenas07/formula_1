// pilotosView.js
import { pilotCard } from '../../components/pilotos/pilotCard.js';
import { tittleContainer } from '../../components/pilotos/tittleContainer.js';
import { PilotoService } from '../../services/piloto.service.js';   
import { isAdmin } from '../../utils/shared/roleValidator.js';

class PilotosView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.pilotoService = new PilotoService();
    }

    async connectedCallback() {
        console.log('🚀 Iniciando vista de pilotos');
        this.render();
        await this.initializeComponents();
    }

    render() {
        const template = `
            <link rel="stylesheet" href="../../design/css/piloto.css">
            <div class="piloto-container">
                <div class="nav-bar"></div>
                <div class="tittle-container"></div>
                <div class="piloto-card" id="piloto-card">
                    <div class="loading">Cargando pilotos...</div>
                </div>
            </div>
        `;
        
        this.shadowRoot.innerHTML = template;
    }

    async initializeComponents() {
        try {
            console.log('🔄 Inicializando componentes');
            
            // Inicializar el contenedor de título
            await tittleContainer(this.shadowRoot);
            
            // Obtener los datos de los pilotos
            const response = await this.pilotoService.getPilotos();
            
            // Verificar si hay datos
            if (!response) {
                const pilotoCardContainer = this.shadowRoot.querySelector("#piloto-card");
                pilotoCardContainer.innerHTML = '<div class="error">No se encontraron pilotos</div>';
                return;
            }

            // Renderizar las tarjetas de pilotos
            await pilotCard(this.shadowRoot, response.data || response);
        } catch (error) {
            console.error('❌ Error al cargar los pilotos:', error);
            const pilotoCardContainer = this.shadowRoot.querySelector("#piloto-card");
            pilotoCardContainer.innerHTML = '<div class="error">Error al cargar los pilotos</div>';
        }
    }
}

// Registrar el componente
customElements.define('pilotos-view', PilotosView);