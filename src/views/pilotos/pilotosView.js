import { pilotCard } from '../../components/pilotos/pilotCard.js';
import { tittleContainer } from '../../components/pilotos/tittleContainer.js';

// Datos de ejemplo de pilotos
const pilotosData = [
    {
        id: 1,
        broadcast_name: "M VERSTAPPEN",
        country_code: "NED",
        driver_number: 1,
        first_name: "Max",
        full_name: "Max VERSTAPPEN",
        headshot_url: "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
        last_name: "Verstappen",
        meeting_key: 1219,
        name_acronym: "VER",
        session_key: 9158,
        team_colour: "3671C6",
        team_name: "Red Bull Racing",
        estadisticas: {
            victorias: 54,
            podios: 98,
            poles: 32,
            mejor_tiempo: "1:27.249",
            campeonatos_mundiales: 3,
            puntos_f1: 2586.5
        },
        biografia: "Campeón del mundo en 2021, 2022 y 2023. Hijo del expiloto Jos Verstappen.",
        rol: "Líder",
        tipo_conduccion: "agresiva",
        estrategia: "agresiva"
    },
    {
        id: 2,
        broadcast_name: "S PEREZ",
        country_code: "MEX",
        driver_number: 11,
        first_name: "Sergio",
        full_name: "Sergio PEREZ",
        headshot_url: "https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/1col/image.png",
        last_name: "Perez",
        meeting_key: 1219,
        name_acronym: "PER",
        session_key: 9158,
        team_colour: "3671C6",
        team_name: "Red Bull Racing",
        estadisticas: {
            victorias: 6,
            podios: 35,
            poles: 3,
            mejor_tiempo: "1:28.120",
            campeonatos_mundiales: 0,
            puntos_f1: 1250.5
        },
        biografia: "El primer piloto mexicano en ganar un Gran Premio desde 1970. Conocido como 'Checo'.",
        rol: "Segundo piloto",
        tipo_conduccion: "consistente",
        estrategia: "conservadora"
    },
    {
        id: 3,
        broadcast_name: "L HAMILTON",
        country_code: "GBR",
        driver_number: 44,
        first_name: "Lewis",
        full_name: "Lewis HAMILTON",
        headshot_url: "https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png",
        last_name: "Hamilton",
        meeting_key: 1219,
        name_acronym: "HAM",
        session_key: 9158,
        team_colour: "00D2BE",
        team_name: "Mercedes-AMG Petronas",
        estadisticas: {
            victorias: 103,
            podios: 197,
            poles: 104,
            mejor_tiempo: "1:27.264",
            campeonatos_mundiales: 7,
            puntos_f1: 4639.5
        },
        biografia: "Siete veces campeón del mundo, el piloto más exitoso en la historia de la F1.",
        rol: "Líder",
        tipo_conduccion: "agresiva",
        estrategia: "balanceada"
    }
];

class PilotosView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.initializeComponents();
    }

    render() {
        const template = `
            <link rel="stylesheet" href="../../design/css/piloto.css">
            <div class="piloto-container">
                <div class="nav-bar"></div>
                <div class="tittle-container"></div>
                <div class="piloto-card" id="piloto-card"></div>
            </div>
        `;
        
        this.shadowRoot.innerHTML = template;
    }

    initializeComponents() {
        // Esperamos a que el Shadow DOM esté listo
        requestAnimationFrame(() => {
            tittleContainer(this.shadowRoot);
            pilotCard(this.shadowRoot, pilotosData);
        });
    }
}

// Registrar el componente
customElements.define('pilotos-view', PilotosView);
