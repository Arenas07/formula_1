import { AuthService } from "../services/login.service";
class Login extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({ mode: "open" })
        this.isLogin = true; // Estado inicial
    }

    connectedCallback() {
        this.initializeStyles();
        this.render();
    }

    initializeStyles() {
        // Solo inicializamos los estilos una vez
        if (!this.shadowRoot.querySelector('link[rel="stylesheet"]')) {
            const linkStyle = document.createElement("link");
            linkStyle.setAttribute("rel", "stylesheet");
            linkStyle.setAttribute("href", "../design/css/login.css");
            this.shadowRoot.appendChild(linkStyle);

            const linkIcons = document.createElement("link");
            linkIcons.setAttribute("rel", "stylesheet");
            linkIcons.setAttribute("href", "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css");
            this.shadowRoot.appendChild(linkIcons);
        }
    }

    render() {
        const container = document.createElement("div");
        container.innerHTML = `
        <div class="background-decor"></div>
        <div class="wrapper">
            <form action="">
                <h1>${this.isLogin ? "Login" : "Registro"}</h1>
                <div class="input-box">
                    <input type="text" placeholder="E-mail" id="email" required>
                    <i class='bx bx-envelope'></i>
                </div>
                ${!this.isLogin ? `
                <div class="input-box">
                    <input type="text" placeholder="Nombre" id="nombre" required>
                    <i class="bx bx-user"></i>
                </div>
                ` : ''}
                <div class="input-box">
                    <input type="password" placeholder="Password" id="password" required>
                    <i class="bx bx-lock-alt"></i>
                </div>
                <button type="submit" class="btn" id="${this.isLogin ? 'btn-login' : 'btn-register'}">
                    ${this.isLogin ? "Login" : "Registrarse"}
                </button>
                <div class="register-user">
                    <p>${this.isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
                        <a href="#" id="toggle-mode">${this.isLogin ? " Registrar" : " Iniciar sesion"}</a>
                    </p>
                </div>
            </form>
        </div> 
        <img src="../design/icons/Max-Verstappen.png" class="img-right">
        <img src="../design/icons/Sergio-perez.png" class="img-left">
        `;

        // Limpiamos el contenido anterior pero mantenemos los estilos
        const existingContainer = this.shadowRoot.querySelector('div');
        if (existingContainer) {
            this.shadowRoot.removeChild(existingContainer);
        }
        this.shadowRoot.appendChild(container);

        // Agregamos la clase visible después de un pequeño retraso
        requestAnimationFrame(() => {
            this.shadowRoot.querySelector('.wrapper')?.classList.add('visible');
        });

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.shadowRoot.querySelector("#toggle-mode")?.addEventListener("click", (e) => {
            e.preventDefault();
            this.isLogin = !this.isLogin;
            this.render();
        });

        this.shadowRoot.querySelector('#btn-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            const email = this.shadowRoot.querySelector('#email').value;
            const password = this.shadowRoot.querySelector('#password').value;
            console.log('Intentando login con:', { email, password });
            const authService = new AuthService();
            authService.login(email, password)
                .then(data => {
                    console.log('Login exitoso:', data);
                    // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
                })
                .catch(error => {
                    console.error('Error en login:', error);
                    alert(error.message);
                });
        });

        this.shadowRoot.querySelector('#btn-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            const email = this.shadowRoot.querySelector('#email').value;
            const password = this.shadowRoot.querySelector('#password').value;
            const nombre = this.shadowRoot.querySelector('#nombre').value;
            console.log('Intentando registro con:', { email, password, nombre });
            const authService = new AuthService();
            authService.register({ email, password, nombre })
                .then(data => {
                    console.log('Registro exitoso:', data);
                    alert('Registro exitoso. Por favor, inicia sesión.');
                    this.isLogin = true;
                    this.render();
                })
                .catch(error => {
                    console.error('Error en registro:', error);
                    alert(error.message);
                });
        });
    }
}

customElements.define('login-component', Login);