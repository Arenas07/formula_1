import { EquipoService } from "../services/equipoService.js";

let listTeams;
let isInitialized = false;

function createTeamCard(dato) {
    console.log("Creando tarjeta para:", dato);
    
    const piloto1 = typeof dato.pilotos?.[0] === 'number' ? `Piloto #${dato.pilotos[0]}` : (dato.pilotos?.[0] || "Piloto no asignado");
    const piloto2 = typeof dato.pilotos?.[1] === 'number' ? `Piloto #${dato.pilotos[1]}` : (dato.pilotos?.[1] || "Piloto no asignado");
    
    return `
        <div class="overall-information">
            <div class="flip-box">
                <div class="flip-box-inner">
                    <div class="flip-box-front">
                        <div class="title__information">
                            <h3>${dato.nombre || 'Sin nombre'}</h3>
                            <p class="fundation-year">${dato.fecha_fundacion || 'N/A'}</p>
                        </div>
                        <div class="info-container">
                            <img src="${dato.imagen || '../../design/images/default-team.png'}" 
                                 alt="${dato.nombre || 'Equipo'}" 
                                 onerror="this.src='../../design/images/default-team.png'">
                            <h2>${dato.nombre || 'Sin nombre'}</h2>
                            <div class="drivers-name">
                                <p>${piloto1}</p>
                                <p>${piloto2}</p>
                            </div>
                        </div>
                        <div class="details">
                            <strong>Ver detalles ></strong>
                        </div>
                    </div>

                    <div class="flip-box-back">
                        <div class="title__information">
                            <h3>${dato.nombre || 'Sin nombre'}</h3>
                            <p class="fundation-year">${dato.fecha_fundacion || 'N/A'}</p>
                        </div>
                        <section class="section-top">
                            <h2>Información del equipo</h2>
                            <div class="location">
                                <i class='bx bx-current-location'></i>
                                <div class="extra-information">
                                    <p>Sede</p>
                                    <b>${dato.sede || dato.pais || 'No disponible'}</b>
                                </div>
                            </div>
                            <div class="manager">
                                <i class='bx bxs-user'></i>
                                <div class="extra-information">
                                    <p>Director de Equipo</p>
                                    <b>${dato.director || 'No disponible'}</b>
                                </div>
                            </div>
                            <div class="motor">
                                <i class='bx bxs-wrench'></i>
                                <div class="extra-information">
                                    <p>Unidad de potencia</p>
                                    <b>${dato.motor || 'No disponible'}</b>
                                </div>
                            </div>
                        </section>
                        <section class="section-bottom">
                            <h2>Estadísticas</h2>
                            <div class="first-container">
                                <i class='bx bxs-trophy'></i>
                                <div class="second-container">
                                    <p>Campeonatos</p>
                                    <b>${dato.campeonatos || '0'}</b>
                                </div>
                            </div>
                            <div class="first-container">
                                <i class='bx bxs-flag-alt'></i>
                                <div class="second-container">
                                    <p>Victorias</p>
                                    <b>${dato.victorias || '0'}</b>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTeams(datos) {
    console.log("Renderizando equipos:", datos);
    
    if (!listTeams) {
        console.error('El elemento list__teams no existe en el DOM');
        return;
    }
    
    if (!Array.isArray(datos)) {
        console.error('Los datos recibidos no son un array:', datos);
        listTeams.innerHTML = '<div class="error">Error al cargar los equipos</div>';
        return;
    }

    if (datos.length === 0) {
        listTeams.innerHTML = '<div class="no-data">No hay equipos disponibles</div>';
        return;
    }

    const template = datos.map(createTeamCard).join('');
    console.log("HTML generado:", template.substring(0, 100) + "...");
    listTeams.innerHTML = template;
    
    console.log("HTML después de insertar:", listTeams.innerHTML.substring(0, 100) + "...");
}

function handleFlip(e) {
    const flipBox = e.target.closest(".flip-box");
    if (flipBox) {
        console.log("Aplicando flip a:", flipBox);
        flipBox.classList.toggle("flipped");
    }
}

async function initializeTeams() {
    if (isInitialized) return;
    
    try {
        if (!listTeams) {
            console.error('El elemento list__teams no existe en el DOM');
            return;
        }
        
        listTeams.innerHTML = '<div class="loading">Cargando equipos...</div>';
        const equiposData = await EquipoService.getEquipos();
        
        console.log('Equipos obtenidos:', equiposData);
        
        renderTeams(equiposData);
        isInitialized = true;
        
        listTeams.addEventListener("click", handleFlip);
    } catch (error) {
        console.error('Error al cargar los equipos:', error);
        if (listTeams) {
            listTeams.innerHTML = '<div class="error">Error al cargar los equipos: ' + error.message + '</div>';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM cargado, inicializando...");
    
    setTimeout(() => {
        listTeams = document.getElementById("list__teams");
        console.log("Elemento list__teams:", listTeams);
        
        if (listTeams) {
            initializeTeams();
        } else {
            console.error('No se pudo encontrar el elemento list__teams');
        }
    }, 100);
});

export { initializeTeams, renderTeams };