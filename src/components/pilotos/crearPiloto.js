class CrearPiloto extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    //recalco desde ya, que todos los comentarios de aca para adelante son mi de autoria, ya que queria mejorar bien el estilo de todo para que fuera mucho mejor


    //callback para renderizaar el componente y setupear los event listeners
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    //seteo de los event listeners para los actions que sucedan en la pagina, siendo los principales el componente de la tarjeta para la vista previa, el cambio de data automatica en la vista previa, el flip de la tarjeta y la carga del formulario
    setupEventListeners() {
        //carga dle formulario y de los inputs
        const form = this.shadowRoot.querySelector('#form-piloto');
        const inputs = form.querySelectorAll('input, select');

        //evento para cambiar la data de los inputs en la vista previa
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
            input.addEventListener('change', () => this.updatePreview());
        });

        //evento para el flip de la tarjeta
        const flipBox = this.shadowRoot.querySelector('.flip-box');
        if (flipBox) {
            flipBox.addEventListener('click', () => {
                flipBox.classList.toggle('flip');
            });
        }

        // Handler para el submit del formulario
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            // Importar el service dinámicamente
            const { PilotoService } = await import('../../services/piloto.service.js');
            const service = new PilotoService();
            try {
                await service.createPilotoNuevo(data);
                alert('Piloto creado exitosamente');
                form.reset();
                this.updatePreview();
            } catch (err) {
                alert('Error al crear el piloto: ' + err.message);
            }
        });
    }

    //funcion para actualizar la vista del contenido previo de la tarjeta
    updatePreview() {
        //se selecciona el formulario de la tarjeta
        const form = this.shadowRoot.querySelector('#form-piloto');
        //se crea un nuevo formdata para obtener los datos del formulario
        const formData = new FormData(form);

        //se obtiene el numero del piloto
        const number = formData.get('diver_number');
        //se actualiza el numero del piloto en las tres tarjetas
        this.shadowRoot.querySelectorAll('#preview-number, #preview-number-2, #preview-number-3').forEach(el => {
            el.textContent = number ? `#${number}` : '#';
        });

        //se obtiene el equipo
        const team = formData.get('team_name');
        //se actualiza el equipo en la tarjeta
        this.shadowRoot.querySelector('#preview-team').textContent = team || 'Equipo';

        //se obtiene el nombre
        const firstName = formData.get('first_name') || '';
        //se obtiene el apellido
        const lastName = formData.get('last_name') || '';
        //se actualiza el nombre en la tarjeta
        this.shadowRoot.querySelector('#preview-first-name').textContent = firstName || 'Nombre';
        //se actualiza el apellido en la tarjeta
        this.shadowRoot.querySelector('#preview-last-name').textContent = lastName.toUpperCase() || 'APELLIDO';
        //se actualiza el nombre completo en la tarjeta, el cual es una anidacion entre el primer y el apellido
        this.shadowRoot.querySelector('#preview-full-name').textContent = 
            `${firstName} ${lastName}`.trim() || 'Nombre Apellido';

        //se obtiene la imagen
        const imageUrl = formData.get('headshot_url');
        //se actualiza la imagen en la tarjeta
        const previewImage = this.shadowRoot.querySelector('#preview-image');
        //se valida el url de la imagen
        if (imageUrl) {
            //si el url esta presente, se actualiza la imagen
            previewImage.src = imageUrl;
        } else {
            //si el url no esta presente, se muestra la imagen por defecto
            previewImage.src = '../../design/images/default-pilot.png';
        }

        //se obtiene el pais
        const country = formData.get('country_code');
        //se actualiza el pais en la tarjeta
        this.shadowRoot.querySelector('#preview-country').textContent = country || '-';

        //se obtiene el rol
        const rol = formData.get('rol');
        //se actualiza el rol en la tarjeta
        this.shadowRoot.querySelector('#preview-rol').textContent = rol || '-';

        //se obtiene el tipo de conduccion
        const driving = formData.get('tipo_conduccion');
        //se actualiza el tipo de conduccion en la tarjeta
        this.shadowRoot.querySelector('#preview-driving').textContent = driving || '-';

        //se obtiene la estrategia
        const strategy = formData.get('estrategia');
        //se actualiza la estrategia en la tarjeta
        this.shadowRoot.querySelector('#preview-strategy').textContent = strategy || '-';

        //se obtiene el acronimo
        const acronym = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        //se actualiza el acronimo en la tarjeta
        this.shadowRoot.querySelector('#preview-acronym').textContent = acronym || '-';

        //se obtiene el color del equipo
        const teamColor = formData.get('team_color');
        //se actualiza el color del equipo en la tarjeta por delante
        const flipBoxFront = this.shadowRoot.querySelector('.flip-box-front');
        //se actualiza el color del equipo en la tarjeta por detras
        const flipBoxBack = this.shadowRoot.querySelector('.flip-box-back');
        //se valida el color del equipo
        if (teamColor) {
            //esto se hace para hacer el degradado de los colores para darle un toque mas estetico a la tarjeta
            const darkerColor = this.darkenColor(teamColor, 20);
            flipBoxFront.style.background = `linear-gradient(145deg, ${teamColor}, ${darkerColor})`;
            flipBoxBack.style.background = `linear-gradient(145deg, ${teamColor}, ${darkerColor})`;
        }

        //se obtiene la biografia
        const biografia = formData.get('biografia');
        //se actualiza la biografia en la tarjeta
        this.shadowRoot.querySelector('#preview-biografia').textContent = biografia || 'Biografía del piloto...';
    }

    //funcion para hacer el degradado de los colores para darle un toque mas estetico a la tarjeta
    darkenColor(color, percent) {
        //se obtiene el color y el porcentaje de degradado  
        const num = parseInt(color.replace("#", ""), 16);
        //se calcula el porcentaje de degradado
        const amt = Math.round(2.55 * percent);
        //se calcula el color degradado
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        //se devuelve el color degradado
        return "#" + (
            //se hace el degradado de los colores
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    }

    //funcion para renderizar el componente
    render() {
        //se obtiene el parametro de la url para saber si es nuevo o no
        const urlParams = new URLSearchParams(window.location.search);
        //se almacena en una variable el parametro de la url de isNew
        const isNew = urlParams.get("isNew");
        //se almacena en una variable el parametro de la url de isCompetidor
        const isCompetidor = urlParams.get("isCompetidor");

        //se crea un template para renderizar el componente
        let template = '';

        //se valida si es nuevo o no
        if (isNew) {
            //se renderiza el componente para crear un nuevo piloto
            template = `
                <style>
                    /* Estilos del formulario */
                    /*seteamos los colores y los demas estilos*/
                    :host {
                        --primary-color: #e53935;
                        --secondary-color: #333;
                        --text-light: #ffffff;
                        --text-dark: #333333;
                        --input-border: #ddd;
                        --input-focus: #e53935;
                        --input-background: #f9f9f9;
                        --form-background: #ffffff;
                        --form-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        --transition-speed: 0.3s;
                        font-family: 'Roboto', 'Segoe UI', sans-serif;
                    }

                    /*seteamos el contenedor de los componentes*/

                    .container {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 2rem;
                        max-width: 1200px;
                        margin: 100px auto;
                        padding: 0 2rem;
                    }

                    /*seteamos el contenedor de los componentes para crear un nuevo piloto*/

                    .crear-piloto {
                        padding: 2rem;
                        background: var(--form-background);
                        border-radius: 16px;
                        box-shadow: var(--form-shadow);
                        height: fit-content;
                    }

                    /*seteamos el contenedor de los componentes para la vista previa*/

                    .preview-container {
                        padding: 2rem;
                        background: var(--form-background);
                        border-radius: 16px;
                        box-shadow: var(--form-shadow);
                        height: fit-content;
                        position: sticky;
                        top: 2rem;
                        min-width: 350px;
                        min-height: 600px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: flex-start;
                    }

                    /*seteamos el titulo de la pagina*/

                    h1 {
                        color: var(--primary-color);
                        margin-bottom: 2rem;
                        font-size: 2rem;
                        font-weight: 700;
                        text-align: center;
                        position: relative;
                        padding-bottom: 1rem;
                    }

                    h1::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 100px;
                        height: 4px;
                        background: var(--primary-color);
                        border-radius: 2px;
                    }

                    /*seteamos el grupo de los inputs*/

                    .form-group {
                        margin-bottom: 1.5rem;
                        position: relative;
                    }

                    /*seteamos el label de los inputs*/

                    label {
                        display: block;
                        margin-bottom: 0.5rem;
                        color: var(--text-dark);
                        font-weight: 500;
                        font-size: 0.95rem;
                        transition: all var(--transition-speed) ease;
                    }

                    /*seteamos el input de los inputs*/

                    input[type="text"],
                    input[type="number"],
                    select {
                        width: 100%;
                        padding: 0.8rem 1rem;
                        border: 2px solid var(--input-border);
                        border-radius: 8px;
                        background: var(--input-background);
                        font-size: 1rem;
                        transition: all var(--transition-speed) ease;
                    }

                    /*seteamos el input de los inputs cuando esta en focus*/

                    input[type="text"]:focus,
                    input[type="number"]:focus,
                    select:focus {
                        outline: none;
                        border-color: var(--input-focus);
                        box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
                    }

                    /*seteamos el input de los inputs para el color*/

                    .color-picker {
                        width: 100%;
                        height: 50px;
                        padding: 5px;
                        border: 2px solid var(--input-border);
                        border-radius: 8px;
                        background: var(--input-background);
                        cursor: pointer;
                        transition: all var(--transition-speed) ease;
                    }

                    /*seteamos el input de los inputs para el color cuando esta en hover*/

                    .color-picker:hover {
                        border-color: var(--input-focus);
                    }

                    /*seteamos el input de los inputs para el color picker*/

                    .color-picker::-webkit-color-swatch {
                        border: none;
                        border-radius: 6px;
                    }

                    .color-picker::-webkit-color-swatch-wrapper {
                        padding: 0;
                    }

                    /*seteamos el input de los inputs para el color picker*/

                    select {
                        appearance: none;
                        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                        background-repeat: no-repeat;
                        background-position: right 1rem center;
                        background-size: 1em;
                        padding-right: 2.5rem;
                    }

                    /*seteamos el input de los inputs para el boton de submit*/

                    button[type="submit"] {
                        width: 100%;
                        padding: 1rem;
                        background: var(--primary-color);
                        color: var(--text-light);
                        border: none;
                        border-radius: 8px;
                        font-size: 1.1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all var(--transition-speed) ease;
                        margin-top: 1rem;
                    }

                    /*seteamos el input de los inputs para el boton de submit cuando esta en hover*/
                    button[type="submit"]:hover {
                        background: #c62828;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    }








                    
                    /* Preview Card Styles */

                    /*seteamos el contenedor de los componentes para la vista previa*/
                    .flip-box {
                        background-color: transparent;
                        width: 350px;
                        height: 550px;
                        perspective: 1000px;
                        cursor: pointer;
                        position: relative;
                        margin: auto;
                    }

                    /*seteamos el contenedor de los componentes para la vista previa de su contenido interno*/
                    .flip-box-inner {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        text-align: center;
                        transition: transform 0.8s;
                        transform-style: preserve-3d;
                    }

                    /*seteamos el contenedor de los componentes para la vista previa de su contenido interno cuando esta flipado*/
                    .flip-box.flip .flip-box-inner {
                        transform: rotateY(180deg);
                    }

                    /*seteo del contenedor de la vista previa de su contenido interno por delante y por detras*/
                    .flip-box-front, .flip-box-back {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        backface-visibility: hidden;
                        border-radius: 16px;
                        top: 0;
                        left: 0;
                        overflow: hidden;
                        padding: 2rem;
                        box-sizing: border-box;
                        overflow-y: auto;
                    }

                    .flip-box-front::-webkit-scrollbar,
                    .flip-box-back::-webkit-scrollbar {
                        width: 8px;
                        background: transparent;
                    }

                    .flip-box-front::-webkit-scrollbar-thumb,
                    .flip-box-back::-webkit-scrollbar-thumb {
                        background: rgba(255,255,255,0.15);
                        border-radius: 8px;
                        transition: background 0.3s;
                    }

                    .flip-box-front::-webkit-scrollbar-thumb:hover,
                    .flip-box-back::-webkit-scrollbar-thumb:hover {
                        background: rgba(255,255,255,0.35);
                    }

                    .flip-box-front, .flip-box-back {
                        scrollbar-width: thin;
                        scrollbar-color: rgba(255,255,255,0.15) transparent;
                    }

                    /*seteo del contenedor de la vista previa de su contenido interno por delante*/
                    .flip-box-front {
                        background: linear-gradient(145deg, #424242, #212121);
                        color: white;
                    }

                    /*seteo del contenedor de la vista previa de su contenido interno por detras*/
                    .flip-box-back {
                        background: linear-gradient(145deg, #424242, #212121);
                        color: white;
                        transform: rotateY(180deg);
                    }









                    /*seteo de la seccion superior de la vista previa*/
                    .top-section {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 1rem;
                    }

                    /*seteo del nombre del equipo*/
                    .team-name {
                        font-size: 1.2rem;
                        font-weight: 600;
                    }

                    /*seteo del pais del equipo*/
                    .team-country {
                        font-size: 1rem;
                        opacity: 0.8;
                    }

                    /*seteo del numero del piloto*/
                    .driver-number {
                        font-size: 3rem;
                        font-weight: 700;
                        margin: 1rem 0;
                    }

                    /*seteo de la imagen del piloto*/
                    .driver-image {
                        width: 150px;
                        height: 150px;
                        border-radius: 50%;
                        object-fit: cover;
                        margin: 1rem auto;
                        border: 3px solid white;
                    }

                    /*seteo del nombre del piloto*/
                    .driver-first-name {
                        font-size: 1.5rem;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                    }

                    /*seteo del apellido del piloto*/
                    .driver-last-name {
                        font-size: 2rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        margin-bottom: 1rem;
                    }

                    /*seteo del rol del piloto*/
                    .driver-sub-info-role {
                        font-size: 1.1rem;
                        opacity: 0.8;
                        margin-bottom: 1rem;
                    }

                    /*seteo del contenedor de la informacion del piloto*/
                    .driver-sub-info {
                        display: flex;
                        justify-content: center;
                        gap: 1rem;
                        margin-bottom: 1rem;
                    }

                    /*seteo del numero del piloto*/
                    .driver-sub-info-number, .driver-sub-info-name_acronym {
                        font-size: 1rem;
                        opacity: 0.8;
                    }

                    /*seteo del enlace de las estadisticas del piloto*/
                    .driver-stats-link {
                        font-size: 1.1rem;
                        text-decoration: underline;
                        cursor: pointer;
                    }

                    /*seteo de la seccion superior de la vista previa por detras*/
                    .back-top-section {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 1rem;
                    }

                    /*seteo del nombre del piloto por detras*/
                    .back-pilot-full-name {
                        font-size: 1.5rem;
                        font-weight: 600;
                    }

                    /*seteo del numero del piloto por detras*/
                    .back-pilot-number {
                        font-size: 1.2rem;
                        opacity: 0.8;
                    }

                    /*seteo del titulo de las estadisticas*/
                    .stats {
                        font-size: 1.3rem;
                        font-weight: 600;
                        margin-bottom: 1rem;
                    }

                    /*seteo del contenedor de las estadisticas*/
                    .stats-section {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                        margin-bottom: 1.5rem;
                    }

                    /*seteo del contenedor de las estadisticas*/
                    .stats-item {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    /*seteo de la imagen de las estadisticas*/
                    .stats-item img {
                        width: 24px;
                        height: 24px;
                    }

                    /*seteo del texto de las estadisticas*/
                    .stats-item p {
                        margin: 0;
                    }

                    /*seteo del titulo de las estadisticas*/
                    .stats-title {
                        font-size: 0.9rem;
                        opacity: 0.8;
                    }

                    /*seteo del valor de las estadisticas*/
                    .stats-value {
                        font-size: 1.1rem;
                        font-weight: 600;
                    }

                    /*seteo del contenedor de los campeonatos*/
                    .campeonatos {
                        margin-bottom: 1.5rem;
                    }

                    /*seteo del titulo de los campeonatos*/
                    .campeonatos-title {
                        font-size: 1.1rem;
                        margin-bottom: 0.5rem;
                    }

                    /*seteo de los iconos de los campeonatos*/
                    .campeonatos-icons {
                        font-size: 1.5rem;
                    }

                    /*seteo del contenedor de la biografia*/
                    .biografia {
                        margin-bottom: 1.5rem;
                    }

                    /*seteo del titulo de la biografia*/
                    .biografia-title {
                        font-size: 1.1rem;
                        margin-bottom: 0.5rem;
                    }

                    /*seteo del texto de la biografia*/
                    .biografia-text {
                        font-size: 0.9rem;
                        opacity: 0.8;
                    }

                    /*seteo del contenedor de los puntos*/
                    .puntos {
                        margin-bottom: 1.5rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        text-align: center;
                    }

                    /*seteo del titulo de los puntos*/
                    .puntos-title {
                        font-size: 1.1rem;
                        margin-bottom: 0.5rem;
                    }

                    /*seteo del contenedor de los puntos*/
                    .puntos-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.75rem;
                        width: 100%;
                        margin-bottom: 0.5rem;
                    }

                    /*seteo del icono de los puntos*/
                    .puntos-icon {
                        width: 48px;
                        height: 48px;
                        object-fit: contain;
                        display: inline-block;
                        margin-right: 0.75rem;
                        vertical-align: middle;
                        filter: brightness(0) invert(1);
                    }

                    /*seteo del texto de los puntos*/
                    .puntos-text {
                        font-size: 2.2rem;
                        font-weight: 700;
                        text-align: center;
                        margin: 0;
                        line-height: 1;
                    }

                    /*seteo del contenedor de la conducta*/
                    .conducta {
                        margin-bottom: 1.5rem;
                    }

                    /*seteo del titulo de la conducta*/
                    .conducta-title {
                        font-size: 1.1rem;
                        margin-bottom: 0.5rem;
                    }

                    /*seteo del tipo de conduccion*/
                    .tipo-conduccion, .estrategia-conduccion {
                        font-size: 0.9rem;
                        opacity: 0.8;
                        margin-bottom: 0.5rem;
                    }

                    /*seteo del enlace de la vista previa del piloto*/
                    .ver-piloto {
                        font-size: 1.1rem;
                        text-decoration: underline;
                        cursor: pointer;
                    }

                    /*seteo de la media query para el contenedor de los componentes*/
                    @media (max-width: 1024px) {
                        .container {
                            grid-template-columns: 1fr;
                        }

                        /*seteo de la media query para el contenedor de la vista previa*/
                        .preview-container {
                            position: relative;
                            top: 0;
                        }
                    }

                    /*seteo de la media query para el contenedor de los componentes*/
                    @media (max-width: 768px) {
                        .container {
                            margin: 50px 1rem;
                            padding: 0;
                        }

                        /*seteo de la media query para el contenedor de la vista previa*/
                        .crear-piloto, .preview-container {
                            padding: 1.5rem;
                        }

                        /*seteo de la media query para el titulo de la pagina*/
                        h1 {
                            font-size: 1.5rem;
                        }
                    }
                </style>
                <div class="container">
                    <div class="crear-piloto">
                        <h1>Crear Piloto</h1>
                        <form id="form-piloto">
                            <div class="form-group">
                                <label for="first_name">Nombre</label>
                                <input type="text" id="first_name" name="first_name" required>
                            </div>
                            <div class="form-group">
                                <label for="last_name">Apellido</label>
                                <input type="text" id="last_name" name="last_name" required>
                            </div>
                            <div class="form-group">
                                <label for="country_code">Código de país</label>
                                <input type="text" id="country_code" name="country_code" required>
                            </div>
                            <div class="form-group">
                                <label for="diver_number">Número de piloto</label>
                                <input type="number" id="diver_number" name="diver_number" required>
                            </div>
                            <div class="form-group">
                                <label for="headshot_url">Foto de cabeza</label>
                                <input type="text" id="headshot_url" name="headshot_url" required>
                            </div>
                            <div class="form-group">
                                <label for="team_color">Color del equipo</label>
                                <input type="color" id="team_color" name="team_color" value="#000000" class="color-picker">
                            </div>
                            <div class="form-group">
                                <label for="team_name">Nombre del equipo</label>
                                <input type="text" id="team_name" name="team_name" required>
                            </div>
                            <div class="form-group">
                                <label for="rol">Rol</label>
                                <select id="rol" name="rol" required>
                                    <option value="">Selecciona un rol</option>
                                    <option value="Lider">Líder</option>
                                    <option value="Escudero">Escudero</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="tipo_conduccion">Tipo de conducción</label>
                                <select id="tipo_conduccion" name="tipo_conduccion" required>
                                    <option value="">Selecciona un tipo</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Agresivo">Agresivo</option>
                                    <option value="Ahorro de combustible">Ahorro de combustible</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="estrategia">Estrategia de conducción</label>
                                <select id="estrategia" name="estrategia" required>
                                    <option value="">Selecciona una estrategia</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Agresivo">Agresivo</option>
                                    <option value="Ahorro">Ahorro</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="biografia">Biografía</label>
                                <textarea id="biografia" name="biografia" rows="3" style="width:100%;border-radius:8px;padding:0.8rem 1rem;border:2px solid var(--input-border);background:var(--input-background);font-size:1rem;"></textarea>
                            </div>
                            <button type="submit">Crear Piloto</button>
                        </form>
                    </div>
                    <div class="preview-container">
                        <h1>Vista Previa</h1>
                        <div class="flip-box">
                            <div class="flip-box-inner">
                                <div class="flip-box-front">
                                    <div class="top-section">
                                        <p class="team-name" id="preview-team">Equipo</p>
                                        <p class="team-country" id="preview-country">-</p>
                                    </div>
                                    <p class="driver-number" id="preview-number">#</p>
                                    <img id="preview-image" alt="Piloto" class="driver-image">
                                    <p class="driver-first-name" id="preview-first-name">Nombre</p>
                                    <p class="driver-last-name" id="preview-last-name">APELLIDO</p>
                                    <p class="driver-sub-info-role" id="preview-rol">-</p>
                                    <div class="driver-sub-info">
                                        <p class="driver-sub-info-number" id="preview-number-2">#</p>
                                        <p class="driver-sub-info-name_acronym" id="preview-acronym">-</p>
                                    </div>
                                    <p class="driver-stats-link">Ver estadísticas ></p>
                                </div>
                                <div class="flip-box-back">
                                    <div class="back-top-section">
                                        <p class="back-pilot-full-name" id="preview-full-name">Nombre Apellido</p>
                                        <p class="back-pilot-number" id="preview-number-3">#</p>
                                    </div>
                                    <p class="stats">Estadísticas</p>
                                    <div class="stats-section">
                                        <div class="stats-item">
                                            <img src="/src/design/icons/victory_icon.png" alt="Victorias" style="filter: brightness(0) invert(1);">
                                            <div>
                                                <p class="stats-title">Victorias</p>
                                                <p class="stats-value">0</p>
                                            </div>
                                        </div>
                                        <div class="stats-item">
                                            <img src="/src/design/icons/podio.webp" alt="Podios" alt="Victorias" style="filter: brightness(0) invert(1);">
                                            <div>
                                                <p class="stats-title">Podios</p>
                                                <p class="stats-value">0</p>
                                            </div>
                                        </div>
                                        <div class="stats-item">
                                            <img src="/src/design/icons/poles.webp" alt="Poles" style="filter: brightness(0) invert(1);">
                                            <div>
                                                <p class="stats-title">Poles</p>
                                                <p class="stats-value">0</p>
                                            </div>
                                        </div>
                                        <div class="stats-item">
                                            <img src="/src/design/icons/cronometro.webp" alt="Mejor tiempo" alt="Victorias" style="filter: brightness(0) invert(1);">
                                            <div>
                                                <p class="stats-title">Mejor tiempo</p>
                                                <p class="stats-value">-</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="campeonatos">
                                        <p class="campeonatos-title">Campeonatos</p>
                                        <span class="campeonatos-icons">🏆</span>
                                    </div>
                                    <div class="biografia">
                                        <p class="biografia-title">Biografía</p>
                                        <p class="biografia-text" id="preview-biografia">Biografía del piloto...</p>
                                    </div>
                                    <div class="puntos">
                                        <p class="puntos-title">Puntos</p>
                                        <div class="puntos-container">
                                            <img src="/src/design/icons/points.png" alt="Puntos" class="puntos-icon">
                                            <p class="puntos-text">0</p>
                                        </div>
                                    </div>
                                    <div class="conducta">
                                        <p class="conducta-title">Tipo de conducción</p>
                                        <p class="tipo-conduccion" id="preview-driving">-</p>
                                        <p class="estrategia-title">Tipo de estrategia</p>
                                        <p class="estrategia-conduccion" id="preview-strategy">-</p>
                                    </div>
                                    <p class="ver-piloto">Ver piloto ></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (isCompetidor) {
            //se renderiza el componente para crear un piloto competidor
            template = `
                <style>
                    :host {
                        --primary-color: #e53935;
                        --secondary-color: #333;
                        --text-light: #ffffff;
                        --text-dark: #333333;
                        --input-border: #ddd;
                        --input-focus: #e53935;
                        --input-background: #f9f9f9;
                        --form-background: #ffffff;
                        --form-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        --transition-speed: 0.3s;
                        font-family: 'Roboto', 'Segoe UI', sans-serif;
                    }
                    .container {
                        display: flex;
                        flex-direction: column;
                        max-width: 600px;
                        margin: 100px auto;
                        padding: 2rem;
                        background: var(--form-background);
                        border-radius: 16px;
                        box-shadow: var(--form-shadow);
                    }
                    h1 {
                        color: var(--primary-color);
                        margin-bottom: 2rem;
                        font-size: 2rem;
                        font-weight: 700;
                        text-align: center;
                        position: relative;
                        padding-bottom: 1rem;
                    }
                    h1::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 100px;
                        height: 4px;
                        background: var(--primary-color);
                        border-radius: 2px;
                    }
                    .form-group {
                        margin-bottom: 1.5rem;
                        position: relative;
                    }
                    label {
                        display: block;
                        margin-bottom: 0.5rem;
                        color: var(--text-dark);
                        font-weight: 500;
                        font-size: 0.95rem;
                        transition: all var(--transition-speed) ease;
                    }
                    input[type="text"],
                    input[type="number"],
                    select {
                        width: 100%;
                        padding: 0.8rem 1rem;
                        border: 2px solid var(--input-border);
                        border-radius: 8px;
                        background: var(--input-background);
                        font-size: 1rem;
                        transition: all var(--transition-speed) ease;
                    }
                    input[type="text"]:focus,
                    input[type="number"]:focus,
                    select:focus {
                        outline: none;
                        border-color: var(--input-focus);
                        box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
                    }
                    .color-picker {
                        width: 100%;
                        height: 50px;
                        padding: 5px;
                        border: 2px solid var(--input-border);
                        border-radius: 8px;
                        background: var(--input-background);
                        cursor: pointer;
                        transition: all var(--transition-speed) ease;
                    }
                    .color-picker:hover {
                        border-color: var(--input-focus);
                    }
                    .color-picker::-webkit-color-swatch {
                        border: none;
                        border-radius: 6px;
                    }
                    .color-picker::-webkit-color-swatch-wrapper {
                        padding: 0;
                    }
                    select {
                        appearance: none;
                        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                        background-repeat: no-repeat;
                        background-position: right 1rem center;
                        background-size: 1em;
                        padding-right: 2.5rem;
                    }
                    button[type="submit"] {
                        width: 100%;
                        padding: 1rem;
                        background: var(--primary-color);
                        color: var(--text-light);
                        border: none;
                        border-radius: 8px;
                        font-size: 1.1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all var(--transition-speed) ease;
                        margin-top: 1rem;
                    }
                    button[type="submit"]:hover {
                        background: #c62828;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    }
                </style>
                <div class="container">
                    <h1>Crear Piloto Competidor</h1>
                    <form id="form-piloto-competidor">
                        <div class="form-group">
                            <label for="first_name">Nombre</label>
                            <input type="text" id="first_name" name="first_name" required>
                        </div>
                        <div class="form-group">
                            <label for="last_name">Apellido</label>
                            <input type="text" id="last_name" name="last_name" required>
                        </div>
                        <div class="form-group">
                            <label for="country_code">Código de país</label>
                            <input type="text" id="country_code" name="country_code" maxlength="3" required>
                        </div>
                        <div class="form-group">
                            <label for="driver_number">Número de piloto</label>
                            <input type="number" id="driver_number" name="driver_number" required>
                        </div>
                        <div class="form-group">
                            <label for="headshot_url">Foto de cabeza</label>
                            <input type="text" id="headshot_url" name="headshot_url" required>
                        </div>
                        <div class="form-group">
                            <label for="team_colour">Color del equipo</label>
                            <input type="color" id="team_colour" name="team_colour" value="#000000" class="color-picker" required>
                        </div>
                        <div class="form-group">
                            <label for="team_name">Nombre del equipo</label>
                            <input type="text" id="team_name" name="team_name" required>
                        </div>
                        <div class="form-group">
                            <label for="rol">Rol</label>
                            <select id="rol" name="rol" required>
                                <option value="">Selecciona un rol</option>
                                <option value="Líder">Líder</option>
                                <option value="Escudero">Escudero</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="tipo_conduccion">Tipo de conducción</label>
                            <select id="tipo_conduccion" name="tipo_conduccion" required>
                                <option value="">Selecciona un tipo</option>
                                <option value="normal">Normal</option>
                                <option value="agresiva">Agresiva</option>
                                <option value="ahorro_combustible">Ahorro de combustible</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="estrategia">Estrategia de conducción</label>
                            <select id="estrategia" name="estrategia" required>
                                <option value="">Selecciona una estrategia</option>
                                <option value="agresiva">Agresiva</option>
                                <option value="balanceada">Balanceada</option>
                                <option value="ahorro">Ahorro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="biografia">Biografía</label>
                            <textarea id="biografia" name="biografia" rows="3" style="width:100%;border-radius:8px;padding:0.8rem 1rem;border:2px solid var(--input-border);background:var(--input-background);font-size:1rem;"></textarea>
                        </div>
                        <fieldset style="border:1px solid var(--input-border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;">
                            <legend style="font-weight:600;color:var(--primary-color);">Estadísticas</legend>
                            <div class="form-group">
                                <label for="victorias">Victorias</label>
                                <input type="number" id="victorias" name="victorias" min="0" value="0" required>
                            </div>
                            <div class="form-group">
                                <label for="podios">Podios</label>
                                <input type="number" id="podios" name="podios" min="0" value="0" required>
                            </div>
                            <div class="form-group">
                                <label for="poles">Poles</label>
                                <input type="number" id="poles" name="poles" min="0" value="0" required>
                            </div>
                            <div class="form-group">
                                <label for="mejor_tiempo">Mejor tiempo</label>
                                <input type="text" id="mejor_tiempo" name="mejor_tiempo" value="" required>
                            </div>
                            <div class="form-group">
                                <label for="campeonatos_mundiales">Campeonatos mundiales</label>
                                <input type="number" id="campeonatos_mundiales" name="campeonatos_mundiales" min="0" value="0" required>
                            </div>
                            <div class="form-group">
                                <label for="puntos_f1">Puntos F1</label>
                                <input type="number" id="puntos_f1" name="puntos_f1" min="0" value="0" required>
                            </div>
                        </fieldset>
                        <button type="submit">Crear Piloto Competidor</button>
                    </form>
                </div>
            `;
        }
        this.shadowRoot.innerHTML = template;
        if (isCompetidor) this.setupCompetidorForm();
    }

    setupCompetidorForm() {
        const form = this.shadowRoot.querySelector('#form-piloto-competidor');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            // Construir el objeto de estadísticas
            const estadisticas = {
                victorias: Number(formData.get('victorias')),
                podios: Number(formData.get('podios')),
                poles: Number(formData.get('poles')),
                mejor_tiempo: formData.get('mejor_tiempo') || '',
                campeonatos_mundiales: Number(formData.get('campeonatos_mundiales')),
                puntos_f1: Number(formData.get('puntos_f1'))
            };
            // Construir el objeto principal
            const data = {
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                country_code: formData.get('country_code'),
                driver_number: Number(formData.get('driver_number')),
                headshot_url: formData.get('headshot_url'),
                team_colour: formData.get('team_colour'),
                team_name: formData.get('team_name'),
                rol: formData.get('rol'),
                tipo_conduccion: formData.get('tipo_conduccion'),
                estrategia: formData.get('estrategia'),
                biografia: formData.get('biografia') || '',
                estadisticas
            };
            // Importar el service dinámicamente
            const { PilotoService } = await import('../../services/piloto.service.js');
            const service = new PilotoService();
            try {
                await service.createPilotoNuevo(data);
                alert('Piloto competidor creado exitosamente');
                form.reset();
            } catch (err) {
                alert('Error al crear el piloto competidor: ' + err.message);
            }
        });
    }
}

customElements.define('crear-piloto', CrearPiloto);
