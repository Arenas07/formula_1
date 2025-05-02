class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.mobileMenuOpen = false;
    }

    connectedCallback() {
        this.render();
        this.initializeEventListeners();
    }

    render() {
        const style = document.createElement("style");
        style.textContent = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: "Form-regular", sans-serif;
            }
            
            .header {
                display: flex;
                position: fixed;
                top: 0;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 2rem;
                width: 100%;
                background: rgba(240, 242, 245, 0.6);
                backdrop-filter: blur(10px);
                z-index: 10;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            }
            
            .logo {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .logo img {
                height: 30px;
                width: auto;
            }
            
            .header-menu {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
            }
            
            .header-menu a {
                text-decoration: none;
            }
            
            .header-menu button {
                background: none;
                cursor: pointer;
                border: none;
                font-size: 1.2rem;
                color: #333;
                padding: 5px 10px;
                transition: color 0.3s ease;
            }
            
            .header-menu button:hover {
                color: #e10600;
            }
            
            .header-exit button {
                background: none;
                cursor: pointer;
                border: none;
                font-size: 1.2rem;
                color: #333;
                padding: 5px 10px;
                transition: color 0.3s ease;
            }
            
            .header-exit button:hover {
                color: #e10600;
            }
            
            .mobile-menu-toggle {
                display: none;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #333;
            }
            
            /* Responsive styles */
            @media screen and (max-width: 1024px) {
                .header-menu {
                    gap: 10px;
                }
                
                .header-menu button {
                    font-size: 1rem;
                }
            }
            
            @media screen and (max-width: 850px) {
                .header {
                    padding: 1rem;
                }
                
                .mobile-menu-toggle {
                    display: block;
                }
                
                .header-menu {
                    position: fixed;
                    top: 64px;
                    left: 0;
                    flex-direction: column;
                    width: 100%;
                    background: rgba(240, 242, 245, 0.95);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                    padding: 1rem 0;
                    transform: translateY(-100%);
                    opacity: 0;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                    pointer-events: none;
                    z-index: 5;
                }
                
                .header-menu.active {
                    transform: translateY(0);
                    opacity: 1;
                    pointer-events: auto;
                }
                
                .header-menu a {
                    width: 100%;
                    text-align: center;
                }
                
                .header-menu button {
                    width: 100%;
                    padding: 15px 0;
                    font-size: 1.1rem;
                }
                
                .header-menu button:hover {
                    background-color: rgba(225, 6, 0, 0.1);
                }
            }
            
            @media screen and (max-width: 1200px) {
                .logo img:last-child {
                    display: none;
                }
            }
        `;

        const nav = document.createElement("div");
        nav.innerHTML = `
            <header class="header">
                <div class="logo">
                    <img src="/src/design/icons/F1-text-logo.png" alt="Formula 1 Text">
                    <img src="/src/design/icons/F1-logo-background.webp" alt="Formula 1 Logo">
                </div>
                <button class="mobile-menu-toggle" id="mobile-toggle">
                    ☰
                </button>
                <div class="header-menu" id="menu">
                    <a href="/src/modules/homePage.html"><button id="init">Inicio</button></a>
                    <a href="/src/modules/teams/teamView.html"><button id="teams">Equipos</button></a>
                    <a href="/src/modules/circuits/circuitsView.html"><button id="circuits">Circuitos</button></a>
                    <a href="/src/modules/pilotos/pilotosView.html"><button id="pilots">Pilotos</button></a>
                    <a href="/src/modules/vehicles/vehiclesView.html"><button id="vehicles">Vehículos</button></a>
                    <a href="/src/modules/homePage.html"><button id="simulation">Simulación</button></a>
                </div>
                <div class="header-exit">
                    <button id="exit">Salir</button>
                </div>
            </header>
        `;

        this.shadowRoot.appendChild(style);
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

        
        const mobileToggle = this.shadowRoot.getElementById("mobile-toggle");
        const menu = this.shadowRoot.getElementById("menu");
        
        if (mobileToggle && menu) {
            mobileToggle.addEventListener("click", () => {
                this.mobileMenuOpen = !this.mobileMenuOpen;
                if (this.mobileMenuOpen) {
                    menu.classList.add("active");
                    mobileToggle.innerHTML = '✕';
                } else {
                    menu.classList.remove("active");
                    mobileToggle.innerHTML = '☰';
                }
            });
            
            
            const menuItems = this.shadowRoot.querySelectorAll(".header-menu a");
            menuItems.forEach(item => {
                item.addEventListener("click", () => {
                    if (this.mobileMenuOpen) {
                        menu.classList.remove("active");
                        mobileToggle.innerHTML = '<i class="bx bx-menu"></i>';
                        this.mobileMenuOpen = false;
                    }
                });
            });
        }
    }
}

customElements.define("custom-navbar", NavBar);