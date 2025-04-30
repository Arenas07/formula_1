
class navBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const linkStyle = document.createElement("link");
        linkStyle.setAttribute("rel", "stylesheet");
        linkStyle.setAttribute("href", "../design/css/home.css");
        this.shadowRoot.appendChild(linkStyle);

        const nav = document.createElement("div");

        nav.innerHTML = `
            <header class="header">
                <div class="logo">
                    <img src="../icons/F1-text-logo.png" alt="">
                    <img src="../icons/F1-logo-background.webp" alt="">
                </div>
                <div class="header-menu">
                    <a href="../../modules/homePage.html"><button id="init">Inicio</button></a>
                    <a href=""><button id="circuits">Circuitos</button></a>
                    <a href=""><button id="pilots">Pilotos</button></a>
                    <a href=""><button id="vehicles">Vehiculos</button></a>
                    <a href=""><button id="simulation">Simulacion</button></a>
                </div>
                <div class="header-exit">
                    <button>Salir</button>
                </div>
            </header>
        `;

        this.shadowRoot.appendChild(nav);
    }
}

customElements.define("custom-navbar", navBar);
