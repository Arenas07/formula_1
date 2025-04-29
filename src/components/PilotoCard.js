class PilotoCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['nombre', 'equipo', 'numero', 'pais'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        const nombre = this.getAttribute('nombre') || '';
        const equipo = this.getAttribute('equipo') || '';
        const numero = this.getAttribute('numero') || '';
        const pais = this.getAttribute('pais') || '';

        this.shadowRoot.innerHTML = `
            <style>
                .piloto-card {
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 16px;
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .piloto-nombre {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                .piloto-info {
                    color: #666;
                }
            </style>
            <div class="piloto-card">
                <div class="piloto-nombre">${nombre}</div>
                <div class="piloto-info">
                    <p>Equipo: ${equipo}</p>
                    <p>Número: ${numero}</p>
                    <p>País: ${pais}</p>
                </div>
            </div>
        `;
    }
}

customElements.define('piloto-card', PilotoCard); 