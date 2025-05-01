export const pilotCard = (shadowRoot, pilotos = []) => {
    const pilotoCard = shadowRoot.querySelector("#piloto-card");
    
    const generarTarjeta = (piloto) => {
        return `
            <div class="flip-box">
                <div class="flip-box-inner">
                    <div class="flip-box-front">
                        <div class="top-section">
                            <p class="team-name">${piloto.team_name}</p>
                            <p class="team-country">${piloto.country_code}</p>
                        </div>

                        <p class="driver-number">${piloto.driver_number}</p>

                        <img src="${piloto.headshot_url}" alt="${piloto.full_name}" class="driver-image">

                        <p class="driver-first-name">${piloto.first_name}</p>
                        <p class="driver-last-name">${piloto.last_name.toUpperCase()}</p>

                        <p class="driver-sub-info-role">${piloto.rol}</p>

                        <div class="driver-sub-info">
                            <p class="driver-sub-info-number">${piloto.driver_number}</p>
                            <p class="driver-sub-info-name_acronym">${piloto.name_acronym}</p>
                        </div>

                        <p class="driver-stats-link">Ver estadísticas ></p>
                    </div>

                    <div class="flip-box-back">
                        <div class="back-top-section">
                            <p class="back-pilot-full-name">${piloto.full_name}</p>
                            <p class="back-pilot-number">${piloto.driver_number}</p>
                        </div>

                        <p class="stats">Estadísticas</p>
                        <div class="stats-section">
                            <div class="Victorias">
                                <img src="" alt="Victorias-icon">
                                <div class="Victorias-container">
                                    <p class="Victorias-title">Victorias</p>
                                    <p class="Victorias-value">${piloto.estadisticas.victorias}</p>
                                </div>
                            </div>
                            <div class="Podios">
                                <img src="" alt="Podios-icon">
                                <div class="Podios-container">
                                    <p class="Podios-title">Podios</p>
                                    <p class="Podios-value">${piloto.estadisticas.podios}</p>
                                </div>
                            </div>
                            <div class="Poles">
                                <img src="" alt="Poles-icon">
                                <div class="Poles-container">
                                    <p class="Poles-title">Poles</p>
                                    <p class="Poles-value">${piloto.estadisticas.poles}</p>
                                </div>
                            </div>
                            <div class="Mejor_tiempo">
                                <img src="" alt="Mejor_tiempo-icon">
                                <div class="Mejor_tiempo-container">
                                    <p class="Mejor_tiempo-title">Mejor tiempo</p>
                                    <p class="Mejor_tiempo-value">${piloto.estadisticas.mejor_tiempo}</p>
                                </div>
                            </div>
                        </div>

                        <div class="campeonatos">
                            <p class="campeonatos-title">Campeonatos</p>
                            <span class="campeonatos-icons">
                                ${Array(piloto.estadisticas.campeonatos_mundiales).fill('🏆').join('')}
                            </span>
                        </div>

                        <div class="biografia">
                            <p class="biografia-title">Biografía</p>
                            <p class="biografia-text">${piloto.biografia}</p>
                        </div>

                        <div class="puntos">
                            <p class="puntos-title">Puntos</p>
                            <div class="puntos-container">
                                <span class="puntos-icon">📊</span>
                                <p class="puntos-text">${piloto.estadisticas.puntos_f1}</p>
                            </div>
                        </div>

                        <div class="conducta">
                            <p class="conducta-title">Tipo de conducción</p>
                            <p class="tipo-conduccion">${piloto.tipo_conduccion}</p>
                            <p class="estrategia-title">Tipo de estrategia</p>
                            <p class="estrategia-conduccion">${piloto.estrategia}</p>
                        </div>

                        <p class="ver-piloto">Ver piloto ></p>
                    </div>
                </div>
            </div>
        `;
    };

    // Generar todas las tarjetas
    const template = pilotos.map(piloto => generarTarjeta(piloto)).join('');

    pilotoCard.innerHTML = template;

    // Event listener para el efecto flip
    const tarjetas = shadowRoot.querySelectorAll(".flip-box");
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
            tarjeta.classList.toggle("flip");
        });
    });
}



