import { pilotCard } from '../../components/pilotos/pilotCard.js';
import { tittleContainer } from '../../components/pilotos/tittleContainer.js';

class PilotosView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.initializeComponents();
    }

    render() {
        const template = `
            <link rel="stylesheet" href="../../design/css/piloto.css">
            <div class="piloto-container">
                <div class="nav-bar"></div>
                <div class="tittle-container"></div>
                <div class="piloto-card" id="piloto-card"></div>
            </div>
        `;
        
        this.shadowRoot.innerHTML = template;
    }

    initializeComponents() {
        // Esperamos a que el Shadow DOM esté listo
        requestAnimationFrame(() => {
            tittleContainer(this.shadowRoot);
            pilotCard(this.shadowRoot);
        });
    }
}

// Registrar el componente
customElements.define('pilotos-view', PilotosView);
