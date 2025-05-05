import { tokenValidator, tokenValidatorAdmin, hasPermission } from "../../utils/shared/tokenValidator";
import { PilotoService } from "../../services/piloto.service";
import { showError, showSuccess } from "../../utils/shared/notifications";

export const pilotCard = (shadowRoot, pilotos = []) => {
    const pilotoCardContainer = shadowRoot.querySelector("#piloto-card");
    const pilotoService = new PilotoService();
    
    // Asegurar que pilotos sea un array
    const pilotosArray = Array.isArray(pilotos) ? pilotos : 
                        (pilotos && typeof pilotos === 'object' ? (pilotos.pilotos || pilotos.data || []) : []);
    
    const generarTarjeta = (piloto) => {
        // Formatear número
        const formattedNumber = piloto.driver_number ? `#${piloto.driver_number}` : '#';
        const acronym = (piloto.first_name?.charAt(0) + (piloto.last_name?.charAt(0) || '')).toUpperCase();
        const fullName = `${piloto.first_name || ''} ${piloto.last_name || ''}`.trim();
        const campeonatos = piloto.estadisticas?.campeonatos_mundiales || 0;
        const teamColor = piloto.team_colour || piloto.team_color || '#424242';
        // Calcular color de contraste
        function getContrastColor(hexColor) {
            const r = parseInt(hexColor.slice(1, 3), 16);
            const g = parseInt(hexColor.slice(3, 5), 16);
            const b = parseInt(hexColor.slice(5, 7), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5 ? '#000000' : '#FFFFFF';
        }
        const textColor = getContrastColor(teamColor);
        // Color translúcido para fondo de país
        const countryBg = teamColor + '22';
        const countryBorder = teamColor + '99';
        return `
            <div class="piloto-card-item">
                <div class="flip-box" style="--team-color: ${teamColor}; --text-color: ${textColor};">
                    <div class="flip-box-inner">
                        <div class="flip-box-front" style="background:linear-gradient(145deg, ${teamColor}, #222);color:${textColor};">
                            <div class="number-background" style="color:${textColor}; opacity:0.08; font-size:18rem;">${formattedNumber}</div>
                            <div class="top-section">
                                <p class="team-name">${piloto.team_name || ''}</p>
                                <p class="team-country" style="background:${countryBg};border:2px solid ${countryBorder};border-radius:8px;padding:2px 10px;display:inline-block;font-weight:bold;">${piloto.country_code || ''}</p>
                            </div>
                            <img src="${piloto.headshot_url || '../../design/images/default-pilot.png'}" alt="${fullName}" class="driver-image">
                            <p class="driver-first-name">${piloto.first_name || ''}</p>
                            <p class="driver-last-name">${(piloto.last_name || '').toUpperCase()}</p>
                            <p class="driver-sub-info-role">${piloto.rol || ''}</p>
                            <div class="driver-sub-info">
                                <p class="driver-sub-info-number" style="font-size:1.2rem;font-weight:bold;">${formattedNumber}</p>
                                <p class="driver-sub-info-name_acronym">${acronym}</p>
                            </div>
                            <p class="driver-stats-link">Ver estadísticas &gt;</p>
                            <div class="admin-actions">
                                <div class="editar">
                                    <button class="btn-editar" data-piloto-id="${piloto.id}">Editar</button>
                                </div>
                                <div class="eliminar">
                                    <button class="btn-eliminar" data-piloto-id="${piloto.id}">Eliminar</button>
                                </div>
                            </div>
                        </div>
                        <div class="flip-box-back" style="background:linear-gradient(145deg, ${teamColor}, #222);color:${textColor};">
                            <div class="back-top-section">
                                <p class="back-pilot-full-name">${fullName}</p>
                                <p class="back-pilot-number" style="border:none; font-weight:bold;">${formattedNumber}</p>
                            </div>
                            <p class="stats">Estadísticas</p>
                            <div class="stats-section">
                                <div class="Victorias">
                                    <img src="/src/design/icons/victory_icon.png" alt="Victorias-icon">
                                    <div class="Victorias-container">
                                        <p class="Victorias-title">Victorias</p>
                                        <p class="Victorias-value">${piloto.estadisticas?.victorias || 0}</p>
                                    </div>
                                </div>
                                <div class="Podios">
                                    <img src="/src/design/icons/podio.webp" alt="Podios-icon">
                                    <div class="Podios-container">
                                        <p class="Podios-title">Podios</p>
                                        <p class="Podios-value">${piloto.estadisticas?.podios || 0}</p>
                                    </div>
                                </div>
                                <div class="Poles">
                                    <img src="/src/design/icons/poles.webp" alt="Poles-icon">
                                    <div class="Poles-container">
                                        <p class="Poles-title">Poles</p>
                                        <p class="Poles-value">${piloto.estadisticas?.poles || 0}</p>
                                    </div>
                                </div>
                                <div class="Mejor_tiempo">
                                    <img src="/src/design/icons/cronometro.webp" alt="Mejor_tiempo-icon">
                                    <div class="Mejor_tiempo-container">
                                        <p class="Mejor_tiempo-title">Mejor tiempo</p>
                                        <p class="Mejor_tiempo-value">${piloto.estadisticas?.mejor_tiempo || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="campeonatos">
                                <p class="campeonatos-title">Campeonatos</p>
                                <span class="campeonatos-icons">${Array(Number(campeonatos)).fill('🏆').join('')}</span>
                            </div>
                            <div class="biografia">
                                <p class="biografia-title">Biografía</p>
                                <p class="biografia-text">${piloto.biografia || ''}</p>
                            </div>
                            <div class="puntos">
                                <p class="puntos-title">Puntos</p>
                                <div class="puntos-container">
                                    <img src="/src/design/icons/points.png" alt="Puntos-icon" class="puntos-icon">
                                    <p class="puntos-text">${piloto.estadisticas?.puntos_f1 || 0}</p>
                                </div>
                            </div>
                            <div class="conducta">
                                <p class="conducta-title">Tipo de conducción</p>
                                <p class="tipo-conduccion">${piloto.tipo_conduccion || ''}</p>
                                <p class="estrategia-title">Tipo de estrategia</p>
                                <p class="estrategia-conduccion">${piloto.estrategia || ''}</p>
                            </div>
                            <p class="ver-piloto">Ver piloto &gt;</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    // Generar todas las tarjetas
    if (pilotosArray.length === 0) {
        pilotoCardContainer.innerHTML = '<div class="error">No se encontraron pilotos</div>';
        return;
    }
    
    const template = pilotosArray.map(piloto => generarTarjeta(piloto)).join('');
    pilotoCardContainer.innerHTML = template;

    // Event listener para el efecto flip
    const tarjetas = shadowRoot.querySelectorAll(".flip-box");
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
            tarjeta.classList.toggle("flip");
        });
    });

    const btnsEditar = shadowRoot.querySelectorAll(".btn-editar");
    const btnsEliminar = shadowRoot.querySelectorAll(".btn-eliminar");
    

    // Verificar permisos al cargar la página
    const existToken = tokenValidator();
    if (existToken) {
        // Verificar si el usuario tiene permisos de administrador
        const canManagePilots = hasPermission('puedeGestionarPilotos');
        if (!canManagePilots) {
            btnsEditar.forEach(btn => btn.style.display = 'none');
            btnsEliminar.forEach(btn => btn.style.display = 'none');
        }
    } else {
        btnsEditar.forEach(btn => btn.style.display = 'none');
        btnsEliminar.forEach(btn => btn.style.display = 'none');
    }

    btnsEliminar.forEach(btn => {
        btn.addEventListener("click", async (event) => {
            event.stopPropagation(); // Detiene la propagación del evento
            const pilotoId = btn.getAttribute('data-piloto-id');
            
            if (!pilotoId) {
                console.error("No se encontró el ID del piloto");
                showError("No se encontró el ID del piloto");
                return;
            }

            // Confirmar antes de eliminar
            if (!confirm('¿Estás seguro de que deseas eliminar este piloto?')) {
                return;
            }

            try {
                // Deshabilitar el botón durante la operación
                btn.disabled = true;
                btn.textContent = 'Eliminando...';

                await pilotoService.eliminarPiloto(pilotoId);
                showSuccess('Piloto eliminado exitosamente');
                // Recargar la página para actualizar la lista
                window.location.reload();
            } catch (error) {
                console.error("Error al eliminar el piloto:", error);
                // Restaurar el botón
                btn.disabled = false;
                btn.textContent = 'Eliminar';
                // Mostrar mensaje de error más descriptivo
                showError(`Error al eliminar el piloto: ${error.message}`);
            }
        });
    });

    btnsEditar.forEach(btnEditar => {
        btnEditar.addEventListener("click", (event) => {
            event.stopPropagation(); // Detiene la propagación del evento
            const pilotoId = btnEditar.getAttribute('data-piloto-id');
            console.log("Editar piloto con ID:", pilotoId);
            window.location.href = `/src/modules/admin/pilotos/editarPiloto.html?id=${pilotoId}`;
        });
    });
};


