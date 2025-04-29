class Login extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({ mode: "open" })
    }
    connectedCallback() {
        this.render();
        requestAnimationFrame(() => {
            this.shadowRoot.querySelector('.wrapper')?.classList.add('visible');
        });
        this.shadowRoot.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
    }

    render() {
        
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css">
        <div class="background-decor"></div>
        <div class="wrapper">

            <style>
            
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: "IBM Plex Sans";
            }
            .background-decor {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: #5c0000;
                z-index: 0;
                overflow: hidden;
                }

            .background-decor::before,
            .background-decor::after {
                content: "";
                position: absolute;
                border-radius: 50%;
                opacity: 0.2;
                animation: float 10s infinite ease-in-out;
            }

            body{
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;

            }
            
            .wrapper{
                width: 420px;
                background: rgba(139, 0, 0, 0.8);
                position: relative;
                color: #fff;
                padding: 30px 40px;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
                border-radius: 10px;
                box-shadow: 0 0 15px rgba(255, 85, 85, 0.57); /* Efecto de brillo rojo */
                
            }

            .wrapper.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .wrapper h1{
                font-size: 36px;
                text-align: center;
            }
            
            .wrapper .input-box{
                width: 100%;
                height: 50px;
                margin: 30px 0;
                position: relative;
            }
            
            .input-box input{
                width: 100%;
                height: 100%;
                background: transparent;
                border: none;
                outline: none;
                border: 2px solid rgba(255, 255, 255, .2);
                color: #fff;
                border-radius: 40px;
                padding: 20px 45px 20px 20px
            }
            
            .input-box input::placeholder{
                color: #fff
            }

            .input-box i{
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 20px
            }

            .wrapper .btn{
                width: 100%;
                height: 45px;
                background: #fff;
                border: none;
                outline: none;
                border-radius: 40px;
                box-shadow: 0 0 10px rgba(0, 0, 0, .1);
                cursor: pointer;
                font-size: 1rem;
                color: #333;
                font-weight: 600;
            }

            .wrapper .register-user{
                font-size: 0.9rem
                text-align: center;
                margin-top: 20px;
            }

            .register-user{

                text-align: center;
            }
        
            .register-user p a{
                color: #fff;
                text-decoration: none
            }
            .register-user p a:hover{
                text-decoration: underline;
            }

            .img-max {
                position: absolute;
                bottom: 0; 
                right: 0;
                transform: translateX(30%); 
                z-index: 2; 
                height: 92vh;
                
            }
            
            .img-car {
                position: absolute;
                bottom: -7%; 
                left: 0;
                z-index: 2; 
                height: 30vh;
                
            }

            </style>

            <form action="">
                <h1>Login</h1>
                <div class="input-box">
                    <input type="text" placeholder="Username" required>
                    <i class="bx bx-user"></i>
                </div>
                <div class="input-box">
                    <input type="password" placeholder="Password" required>
                    <i class="bx bx-lock-alt"></i>
                </div>
                <button type="submit" class="btn">Login</button>
                <div class="register-user">
                    <p>¿No tienes cuenta? <a href="#"> Register </a> </p>
                </div>
            </form>
        </div> 
        <img src="../src/icons/Max-Verstappen.png" class="img-max">
        <img src="../src/icons/redbull.png" class="img-car">
        `
    }
}

customElements.define('login-component', Login);