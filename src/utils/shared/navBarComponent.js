class navBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.initializeEventListeners();
    }

    render() {
        const linkStyle = document.createElement("link");
        linkStyle.setAttribute("rel", "stylesheet");
        linkStyle.setAttribute("href", "../../../src/design/css/home.css");
        this.shadowRoot.appendChild(linkStyle);

        const nav = document.createElement("div");

        nav.innerHTML = `
            <header class="header">
                <div class="logo">
                    <img src="../../../src/design/icons/F1-text-logo.png" alt="">
                    <img src="../../../src/design/icons/F1-logo-background.webp" alt="">
                </div>
                <div class="header-menu">
                    <a href="../../modules/homePage.html"><button id="init">Inicio</button></a>
                    <a href="../../modules/teams/teamView.html"><button id="teams">Equipos</button></a>
                    <a href="../../modules/circuits/circuitView.html"><button id="circuits">Circuitos</button></a>
                    <a href="../../modules/pilotos/pilotosView.html"><button id="pilots">Pilotos</button></a>
                    <a href="../../modules/vehicles/vehiclesView.html"><button id="vehicles">Vehículos</button></a>
                    <a href="../../modules/simulation/simulationView.html"><button id="simulation">Simulación</button></a>
                </div>
                <div class="header-exit">
                    <button id="exit">Salir</button>
                </div>
            </header>
        `;

        this.shadowRoot.appendChild(nav);
    }

    initializeEventListeners() {
        const exitButton = this.shadowRoot.getElementById("exit");
        if (exitButton) {
            exitButton.addEventListener("click", () => {
                console.log("Cerrando sesión...");
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
                
                window.location.href = "../../modules/login/loginView.html";
            });
        } else {
            console.error("No se encontró el botón de salir");
        }
    }
}

customElements.define("custom-navbar", navBar);
