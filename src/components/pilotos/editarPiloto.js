import { PilotoService } from "../../services/piloto.service";

class EditarPiloto extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    
    async connectedCallback() {
        this.render();
        const urlParams = new URLSearchParams(window.location.search);
        const pilotoId = urlParams.get("id");
        if(!pilotoId) {
            this.render();
            return;
        }
        try{
            const service = new PilotoService();
            const pilotoData = await service.getPilotoById(pilotoId);
            this.render(pilotoData.piloto);    
        }catch(error){
            console.error("Error al obtener los datos del piloto:", error);
            this.render();
        }
        this.setupEventListeners();
        this.updatePreview();
    }

    render(pilotoData) {
        if (!pilotoData || typeof pilotoData !== 'object') {
            this.shadowRoot.innerHTML = `<div style="padding:2rem;text-align:center;font-size:1.2rem;">No se han recibido datos del piloto para editar.</div>`;
            return;
        }
        // Determinar si es competidor por la presencia de estadísticas
        const isCompetidor = !!pilotoData.estadisticas;
        const numberField = isCompetidor ? 'driver_number' : 'diver_number';
        const colorField = isCompetidor ? 'team_colour' : 'team_color';
        let template = '';
        template += `<link rel="stylesheet" href="/src/design/css/crearPiloto.css">`;
        template += `<div class="container">
            <div class="crear-piloto">
                <h1>${isCompetidor ? 'Editar Piloto Competidor' : 'Editar Piloto'}</h1>
                <form id="form-piloto">
                    <div class="form-group">
                        <label for="first_name">Nombre</label>
                        <input type="text" id="first_name" name="first_name" value="${pilotoData.first_name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="last_name">Apellido</label>
                        <input type="text" id="last_name" name="last_name" value="${pilotoData.last_name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="country_code">Código de país</label>
                        <input type="text" id="country_code" name="country_code" maxlength="3" value="${pilotoData.country_code || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="${numberField}">Número de piloto</label>
                        <input type="number" id="${numberField}" name="${numberField}" value="${pilotoData.driver_number || pilotoData.diver_number || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="headshot_url">Foto de cabeza</label>
                        <input type="text" id="headshot_url" name="headshot_url" value="${pilotoData.headshot_url || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="${colorField}">Color del equipo</label>
                        <input type="color" id="${colorField}" name="${colorField}" value="${pilotoData.team_colour || pilotoData.team_color || '#000000'}" class="color-picker" required>
                    </div>
                    <div class="form-group">
                        <label for="team_name">Nombre del equipo</label>
                        <input type="text" id="team_name" name="team_name" value="${pilotoData.team_name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="rol">Rol</label>
                        <select id="rol" name="rol" required>
                            <option value="">Selecciona un rol</option>
                            <option value="Líder" ${pilotoData.rol === 'Líder' ? 'selected' : ''}>Líder</option>
                            <option value="Escudero" ${pilotoData.rol === 'Escudero' ? 'selected' : ''}>Escudero</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tipo_conduccion">Tipo de conducción</label>
                        <select id="tipo_conduccion" name="tipo_conduccion" required>
                            <option value="">Selecciona un tipo</option>
                            <option value="normal" ${pilotoData.tipo_conduccion === 'normal' ? 'selected' : ''}>Normal</option>
                            <option value="agresiva" ${pilotoData.tipo_conduccion === 'agresiva' ? 'selected' : ''}>Agresiva</option>
                            <option value="ahorro_combustible" ${pilotoData.tipo_conduccion === 'ahorro_combustible' ? 'selected' : ''}>Ahorro de combustible</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="estrategia">Estrategia de conducción</label>
                        <select id="estrategia" name="estrategia" required>
                            <option value="">Selecciona una estrategia</option>
                            <option value="agresiva" ${pilotoData.estrategia === 'agresiva' ? 'selected' : ''}>Agresiva</option>
                            <option value="balanceada" ${pilotoData.estrategia === 'balanceada' ? 'selected' : ''}>Balanceada</option>
                            <option value="ahorro" ${pilotoData.estrategia === 'ahorro' ? 'selected' : ''}>Ahorro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="biografia">Biografía</label>
                        <textarea id="biografia" name="biografia" rows="3" style="width:100%;border-radius:8px;padding:0.8rem 1rem;border:2px solid var(--input-border);background:var(--input-background);font-size:1rem;">${pilotoData.biografia || ''}</textarea>
                    </div>
                    ${isCompetidor ? `
                    <fieldset style="border:1px solid var(--input-border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;">
                        <legend style="font-weight:600;color:var(--primary-color);">Estadísticas</legend>
                        <div class="form-group">
                            <label for="victorias">Victorias</label>
                            <input type="number" id="victorias" name="victorias" min="0" value="${pilotoData.estadisticas?.victorias || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="podios">Podios</label>
                            <input type="number" id="podios" name="podios" min="0" value="${pilotoData.estadisticas?.podios || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="poles">Poles</label>
                            <input type="number" id="poles" name="poles" min="0" value="${pilotoData.estadisticas?.poles || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="mejor_tiempo">Mejor tiempo</label>
                            <input type="text" id="mejor_tiempo" name="mejor_tiempo" value="${pilotoData.estadisticas?.mejor_tiempo || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="campeonatos_mundiales">Campeonatos mundiales</label>
                            <input type="number" id="campeonatos_mundiales" name="campeonatos_mundiales" min="0" value="${pilotoData.estadisticas?.campeonatos_mundiales || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="puntos_f1">Puntos F1</label>
                            <input type="number" id="puntos_f1" name="puntos_f1" min="0" value="${pilotoData.estadisticas?.puntos_f1 || 0}" required>
                        </div>
                    </fieldset>
                    ` : ''}
                    <button type="submit">Guardar Cambios</button>
                </form>
            </div>
            <div class="preview-container">
                <h1>Vista Previa</h1>
                <div id="preview-card"></div>
            </div>
                    </div>`;
        this.shadowRoot.innerHTML = template;
    }

    setupEventListeners() {
        const form = this.shadowRoot.querySelector('#form-piloto');
        if (form) {
            form.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('input', () => this.updatePreview());
                input.addEventListener('change', () => this.updatePreview());
            });
        }
        // Flip funcional
        this.shadowRoot.addEventListener('click', (e) => {
            const flipBox = this.shadowRoot.querySelector('.flip-box');
            if (flipBox && (e.target.closest('.flip-box') || e.target.classList.contains('flip-box'))) {
                flipBox.classList.toggle('flip');
            }
        });
    }

    updatePreview() {
        const form = this.shadowRoot.querySelector('#form-piloto');
        const previewCard = this.shadowRoot.querySelector('#preview-card');
        const flipBox = previewCard?.querySelector('.flip-box');
        const isFlipped = flipBox?.classList.contains('flip');
        if (!form || !previewCard) return;
        // Detectar si es competidor por los campos del formulario
        const isCompetidor = !!form.querySelector('[name="victorias"]');
        // Datos comunes
        const number = form.querySelector('[name="driver_number"]')?.value || form.querySelector('[name="diver_number"]')?.value || '';
        const team = form.querySelector('[name="team_name"]')?.value || 'Equipo';
        const firstName = form.querySelector('[name="first_name"]')?.value || 'Nombre';
        const lastName = form.querySelector('[name="last_name"]')?.value || 'APELLIDO';
        const imageUrl = form.querySelector('[name="headshot_url"]')?.value || '../../design/images/default-pilot.png';
        const country = form.querySelector('[name="country_code"]')?.value || '-';
        const rol = form.querySelector('[name="rol"]')?.value || '-';
        const driving = form.querySelector('[name="tipo_conduccion"]')?.value || '-';
        const strategy = form.querySelector('[name="estrategia"]')?.value || '-';
        const acronym = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        const teamColor = form.querySelector('[name="team_colour"]')?.value || form.querySelector('[name="team_color"]')?.value || '#424242';
        const biografia = form.querySelector('[name="biografia"]')?.value || 'Biografía del piloto...';
        // Asegurar que el número siempre tenga el #
        const formattedNumber = number ? `#${number}` : '#';
        // Estadísticas (solo para competidor)
        const victorias = isCompetidor ? form.querySelector('[name="victorias"]')?.value || 0 : 0;
        const podios = isCompetidor ? form.querySelector('[name="podios"]')?.value || 0 : 0;
        const poles = isCompetidor ? form.querySelector('[name="poles"]')?.value || 0 : 0;
        const mejor_tiempo = isCompetidor ? form.querySelector('[name="mejor_tiempo"]')?.value || '-' : '-';
        const campeonatos = isCompetidor ? form.querySelector('[name="campeonatos_mundiales"]')?.value || 0 : 0;
        const puntos_f1 = isCompetidor ? form.querySelector('[name="puntos_f1"]')?.value || 0 : 0;
        const fullName = `${firstName} ${lastName}`.trim();
        previewCard.innerHTML = `
        <div class="piloto-card-item">
            <div class="flip-box ${isFlipped ? 'flip' : ''}">
                <div class="flip-box-inner">
                    <div class="flip-box-front">
                        <div class="number-background">${formattedNumber}</div>
                        <div class="top-section">
                            <p class="team-name">${team}</p>
                            <p class="team-country">${country}</p>
                        </div>
                        <img src="${imageUrl}" alt="${fullName}" class="driver-image">
                        <p class="driver-first-name">${firstName}</p>
                        <p class="driver-last-name">${lastName.toUpperCase()}</p>
                        <p class="driver-sub-info-role">${rol}</p>
                        <div class="driver-sub-info">
                            <p class="driver-sub-info-number">${formattedNumber}</p>
                            <p class="driver-sub-info-name_acronym">${acronym}</p>
                        </div>
                        <p class="driver-stats-link">Ver estadísticas &gt;</p>
                    </div>
                    <div class="flip-box-back">
                        <div class="back-top-section">
                            <p class="back-pilot-full-name">${fullName}</p>
                            <p class="back-pilot-number">${formattedNumber}</p>
                        </div>
                        <p class="stats">Estadísticas</p>
                        <div class="stats-section">
                            <div class="Victorias">
                                <img src="/src/design/icons/victory_icon.png" alt="Victorias-icon">
                                <div class="Victorias-container">
                                    <p class="Victorias-title">Victorias</p>
                                    <p class="Victorias-value">${victorias}</p>
                                </div>
                            </div>
                            <div class="Podios">
                                <img src="/src/design/icons/podio.webp" alt="Podios-icon">
                                <div class="Podios-container">
                                    <p class="Podios-title">Podios</p>
                                    <p class="Podios-value">${podios}</p>
                                </div>
                            </div>
                            <div class="Poles">
                                <img src="/src/design/icons/poles.webp" alt="Poles-icon">
                                <div class="Poles-container">
                                    <p class="Poles-title">Poles</p>
                                    <p class="Poles-value">${poles}</p>
                                </div>
                            </div>
                            <div class="Mejor_tiempo">
                                <img src="/src/design/icons/cronometro.webp" alt="Mejor_tiempo-icon">
                                <div class="Mejor_tiempo-container">
                                    <p class="Mejor_tiempo-title">Mejor tiempo</p>
                                    <p class="Mejor_tiempo-value">${mejor_tiempo}</p>
                                </div>
                            </div>
                        </div>
                        <div class="campeonatos">
                            <p class="campeonatos-title">Campeonatos</p>
                            <span class="campeonatos-icons">${Array(Number(campeonatos)).fill('🏆').join('')}</span>
                        </div>
                        <div class="biografia">
                            <p class="biografia-title">Biografía</p>
                            <p class="biografia-text">${biografia}</p>
                        </div>
                        <div class="puntos">
                            <p class="puntos-title">Puntos</p>
                            <div class="puntos-container">
                                <img src="/src/design/icons/points.png" alt="Puntos-icon" class="puntos-icon">
                                <p class="puntos-text">${puntos_f1}</p>
                            </div>
                        </div>
                        <div class="conducta">
                            <p class="conducta-title">Tipo de conducción</p>
                            <p class="tipo-conduccion">${driving}</p>
                            <p class="estrategia-title">Tipo de estrategia</p>
                            <p class="estrategia-conduccion">${strategy}</p>
                        </div>
                        <p class="ver-piloto">Ver piloto &gt;</p>
                    </div>
                </div>
            </div>
        </div>`;
        // Ajustar colores para garantizar contraste
        const flipBoxFront = previewCard.querySelector('.flip-box-front');
        const flipBoxBack = previewCard.querySelector('.flip-box-back');
        if (flipBoxFront && flipBoxBack) {
            const darkerColor = this.darkenColor(teamColor, 20);
            const textColor = this.getContrastColor(teamColor);
            flipBoxFront.style.setProperty('background', `linear-gradient(145deg, ${teamColor}, ${darkerColor})`, 'important');
            flipBoxBack.style.setProperty('background', `linear-gradient(145deg, ${teamColor}, ${darkerColor})`, 'important');
            flipBoxFront.style.setProperty('color', textColor, 'important');
            flipBoxBack.style.setProperty('color', textColor, 'important');
            const iconFilter = textColor === '#000000' ? 'brightness(0) saturate(100%)' : 'brightness(0) invert(1)';
            flipBoxFront.style.setProperty('--icon-filter', iconFilter, 'important');
            flipBoxBack.style.setProperty('--icon-filter', iconFilter, 'important');
        }
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    }

    getContrastColor(hexColor) {
        // Convertir hex a RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        // Calcular luminosidad
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        // Retornar blanco o negro según la luminosidad
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }
}

customElements.define("editar-piloto", EditarPiloto);