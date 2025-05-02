class CrearPiloto extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const urlParams = new URLSearchParams(window.location.search);
        const isNew = urlParams.get("isNew");
        const isCompetidor = urlParams.get("isCompetidor");

        let template = '';
        
        if (isNew) {
            console.log("Es nuevo");
            template = `
                <style>
                    .crear-piloto {
                        padding: 2rem;
                        max-width: 800px;
                        margin: 100px auto;
                    }
                    h1 {
                        color: #333;
                        margin-bottom: 2rem;
                    }
                </style>
                <div class="crear-piloto">
                    <h1>Crear Piloto</h1>
                </div>
            `;
        } else if (isCompetidor) {
            console.log("Es competidor");
            template = `
                <style>
                    .crear-piloto {
                        padding: 2rem;
                        max-width: 800px;
                        margin: 100px auto;
                    }
                    h1 {
                        color: #333;
                        margin-bottom: 2rem;
                    }
                </style>
                <div class="crear-piloto">
                    <h1>Crear Piloto Competidor</h1>
                </div>
            `;
        }
        
        this.shadowRoot.innerHTML = template;
    }
}

customElements.define('crear-piloto', CrearPiloto);
