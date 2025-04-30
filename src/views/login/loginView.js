import { AuthService } from "../../services/login.service";
class Login extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({ mode: "open" })
        
    }
    connectedCallback() {
        const mode = this.getAttribute('mode') || "login";
        this.render(mode);
        
        requestAnimationFrame(() => {
            this.shadowRoot.querySelector('.wrapper')?.classList.add('visible');
        });
    }

    render(mode) {
        const isLogin = mode === "login"
        this.shadowRoot.innerHTML = "";

        const linkStyle = document.createElement("link");
        linkStyle.setAttribute("rel", "stylesheet");
        linkStyle.setAttribute("href", "../design/css/login.css");
        this.shadowRoot.appendChild(linkStyle);

        const linkIcons = document.createElement("link");
        linkIcons.setAttribute("rel", "stylesheet");
        linkIcons.setAttribute("href", "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css");
        this.shadowRoot.appendChild(linkIcons);


        const container = document.createElement("div")

        container.innerHTML = `
        <div class="background-decor"></div>
        <div class="wrapper">

            <form action="">
                <h1>${isLogin ? "Login" : "Registro"}</h1>
                <div class="input-box">
                    <input type="text" placeholder="${isLogin ? "E-mail" : "Ingrese su E-mail"}" required>
                    <i class='bx bx-envelope'></i>
                </div>
                ${isLogin ?  '' : `
                <div class="input-box">
                    <input type="text" placeholder="Nombre" required>
                    <i class="bx bx-user"></i>
                </div>
                `}
                <div class="input-box">
                    <input type="password" placeholder="${isLogin ? "Password" : "Ingrese su contraseña"}" required>
                    <i class="bx bx-lock-alt"></i>
                </div>
                <button type="submit" class="btn" id="btn-login">${isLogin ? "Login" : "Registrarse"}</button>
                <div class="register-user">
                    <p>${isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}<a href="#" id="toggle-mode">${isLogin ? " Registrar" : " Iniciar sesion"}  </a> </p>
                </div>
            </form>
        </div> 
        <img src="../design/icons/Max-Verstappen.png" class="img-right">
        <img src="../design/icons/Sergio-perez.png" class="img-left">
        
        `

        this.shadowRoot.appendChild(container);

        this.shadowRoot.querySelector("#toggle-mode")?.addEventListener("click", (e)=>{
            e.preventDefault();
        
            const newMode = isLogin ? "register" : "login";
            this.setAttribute("mode", newMode);
            this.render(newMode);
        
            requestAnimationFrame(() => {
                this.shadowRoot.querySelector('.wrapper')?.classList.add('visible');
            });
        });

        this.shadowRoot.querySelector('#btn-login').addEventListener('click', (e)=>{
            e.preventDefault();
            const username = this.shadowRoot.querySelector('input[type="text"]').value;
            const password = this.shadowRoot.querySelector('input[type="password"]').value;
            console.log(username, password);
            const authService = new AuthService();
            authService.login(username, password);
        });
        
    }
    
}


customElements.define('login-component', Login);