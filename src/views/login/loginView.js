import { AuthService } from "../../services/login.service";
import { showError, showSuccess } from '../../utils/shared/notifications';

class Login extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({ mode: "open" })
        this.isLogin = true; // Estado inicial
        this.authService = new AuthService();
        this.isSubmitting = false; // Para evitar múltiples envíos
    }

    connectedCallback() {
        // Verificar si el usuario ya está autenticado
        if (this.authService.isAuthenticated()) {
            window.location.href = '../homePage.html';
            return;
        }
        this.initializeStyles();
        this.render();
    }

    initializeStyles() {
        // Solo inicializamos los estilos una vez
        if (!this.shadowRoot.querySelector('link[rel="stylesheet"]')) {
            const linkStyle = document.createElement("link");
            linkStyle.setAttribute("rel", "stylesheet");
            linkStyle.setAttribute("href", "../../design/css/login.css");
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
            <form id="auth-form">
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
                <button type="submit" class="btn" ${this.isSubmitting ? 'disabled' : ''}>
                    ${this.isLogin ? "Login" : "Registrarse"}
                </button>
                <div class="register-user">
                    <p>${this.isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
                        <a href="#" id="toggle-mode">${this.isLogin ? " Registrar" : " Iniciar sesion"}</a>
                    </p>
                </div>
            </form>
        </div> 
        <img src="../../design/icons/Max-Verstappen.png" class="img-right">
        <img src="../../design/icons/Sergio-perez.png" class="img-left">
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

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) {
            console.log('Ya hay una petición en curso');
            return;
        }

        this.isSubmitting = true;
        const submitButton = this.shadowRoot.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = this.isLogin ? "Iniciando sesión..." : "Registrando...";
        }

        try {
            const email = this.shadowRoot.querySelector('#email').value;
            const password = this.shadowRoot.querySelector('#password').value;

            if (this.isLogin) {
                console.log('Intentando login...');
                const data = await this.authService.login(email, password);
                console.log('Login exitoso:', data);
                showSuccess('Login exitoso. Bienvenido.');
                window.location.href = '../homePage.html';
            } else {
                const nombre = this.shadowRoot.querySelector('#nombre').value;
                console.log('Intentando registro...');
                const response = await this.authService.register({ email, password, nombre });
                console.log('Registro exitoso:', response);
                if (response.success) {
                    showSuccess('Registro exitoso. Por favor, inicia sesión.');
                    this.isLogin = true;
                    this.render();
                } else {
                    throw new Error(response.message || 'Error en el registro');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || (this.isLogin ? 'Error al iniciar sesión' : 'Error al registrar'));
        } finally {
            this.isSubmitting = false;
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = this.isLogin ? "Login" : "Registrarse";
            }
        }
    }

    initializeEventListeners() {
        // Evento para cambiar entre login y registro
        this.shadowRoot.querySelector("#toggle-mode")?.addEventListener("click", (e) => {
            e.preventDefault();
            this.isLogin = !this.isLogin;
            this.render();
        });

        // Evento para el formulario
        const form = this.shadowRoot.querySelector('#auth-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
}

customElements.define('login-component', Login);