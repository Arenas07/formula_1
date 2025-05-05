const mongoose = require('mongoose');
const Piloto = require('./models/Piloto');
const Equipo = require('./models/Equipo');
const Vehiculo = require('./models/Vehiculo');
const Circuito = require('./models/Circuito');
const ConfiguracionSimulacion = require('./models/ConfiguracionSimulacion');

// Datos de pilotos
const pilotos = [
    {
        id: 1,
        broadcast_name: "M VERSTAPPEN",
        country_code: "NED",
        driver_number: 1,
        first_name: "Max",
        full_name: "Max VERSTAPPEN",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/mverstappen_2025.png",
        last_name: "Verstappen",
        meeting_key: 1219,
        name_acronym: "VER",
        session_key: 9158,
        team_colour: "#f01919",
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
        headshot_url: "https://soyf1.com/wp-content/uploads/checo-perez-11.png",
        last_name: "Perez",
        meeting_key: 1219,
        name_acronym: "PER",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Red Bull Racing",
        estadisticas: {
            victorias: 6,
            podios: 35,
            poles: 3,
            mejor_tiempo: "1:28.120",
            campeonatos_mundiales: 0,
            puntos_f1: 1489
        },
        biografia: "Primer piloto mexicano en ganar un Gran Premio desde 1970.",
        rol: "Escudero",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 3,
        broadcast_name: "L HAMILTON",
        country_code: "GBR",
        driver_number: 44,
        first_name: "Lewis",
        full_name: "Lewis HAMILTON",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/lhamilton_2025.png",
        last_name: "Hamilton",
        meeting_key: 1219,
        name_acronym: "HAM",
        session_key: 9158,
        team_colour: "#f01919",
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
    },
    {
        id: 4,
        broadcast_name: "G RUSSELL",
        country_code: "GBR",
        driver_number: 63,
        first_name: "George",
        full_name: "George RUSSELL",
        headshot_url: "https://images.ctfassets.net/1fvlg6xqnm65/66fJ1wrYcN0LBtsmPQjcTC/0ffbd03a4a5e0cc5396746216c1d154f/George_Russell.png?w=3840&q=75&fm=webp",
        last_name: "Russell",
        meeting_key: 1219,
        name_acronym: "RUS",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Mercedes-AMG Petronas",
        estadisticas: {
            victorias: 1,
            podios: 11,
            poles: 1,
            mejor_tiempo: "1:27.743",
            campeonatos_mundiales: 0,
            puntos_f1: 469
        },
        biografia: "Joven promesa británica, campeón de F2 en 2018.",
        rol: "Escudero",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 5,
        broadcast_name: "C LECLERC",
        country_code: "MON",
        driver_number: 16,
        first_name: "Charles",
        full_name: "Charles LECLERC",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/cleclerc_2025.png",
        last_name: "Leclerc",
        meeting_key: 1219,
        name_acronym: "LEC",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Ferrari",
        estadisticas: {
            victorias: 5,
            podios: 30,
            poles: 23,
            mejor_tiempo: "1:27.249",
            campeonatos_mundiales: 0,
            puntos_f1: 1074
        },
        biografia: "Joven piloto monegasco, considerado uno de los mejores talentos de la F1 actual.",
        rol: "Líder",
        tipo_conduccion: "agresiva",
        estrategia: "agresiva"
    },
    {
        id: 6,
        broadcast_name: "C SAINZ",
        country_code: "ESP",
        driver_number: 55,
        first_name: "Carlos",
        full_name: "Carlos SAINZ",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/csainz_2025.png",
        last_name: "Sainz",
        meeting_key: 1219,
        name_acronym: "SAI",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Ferrari",
        estadisticas: {
            victorias: 2,
            podios: 18,
            poles: 5,
            mejor_tiempo: "1:27.762",
            campeonatos_mundiales: 0,
            puntos_f1: 982.5
        },
        biografia: "Hijo del bicampeón mundial de rally Carlos Sainz Sr.",
        rol: "Escudero",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 7,
        broadcast_name: "L NORRIS",
        country_code: "GBR",
        driver_number: 4,
        first_name: "Lando",
        full_name: "Lando NORRIS",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/lnorris_2025.png",
        last_name: "Norris",
        meeting_key: 1219,
        name_acronym: "NOR",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "McLaren",
        estadisticas: {
            victorias: 0,
            podios: 13,
            poles: 1,
            mejor_tiempo: "1:27.949",
            campeonatos_mundiales: 0,
            puntos_f1: 633
        },
        biografia: "Joven promesa británica, conocido por su personalidad en redes sociales.",
        rol: "Líder",
        tipo_conduccion: "agresiva",
        estrategia: "balanceada"
    },
    {
        id: 8,
        broadcast_name: "O PIASTRI",
        country_code: "AUS",
        driver_number: 81,
        first_name: "Oscar",
        full_name: "Oscar PIASTRI",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/opiastri_2025.png",
        last_name: "Piastri",
        meeting_key: 1219,
        name_acronym: "PIA",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "McLaren",
        estadisticas: {
            victorias: 0,
            podios: 2,
            poles: 0,
            mejor_tiempo: "1:28.540",
            campeonatos_mundiales: 0,
            puntos_f1: 97
        },
        biografia: "Novato australiano, campeón de F2 en 2021.",
        rol: "Escudero",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 9,
        broadcast_name: "F ALONSO",
        country_code: "ESP",
        driver_number: 14,
        first_name: "Fernando",
        full_name: "Fernando ALONSO",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/falonso_2025.png",
        last_name: "Alonso",
        meeting_key: 1219,
        name_acronym: "ALO",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Aston Martin",
        estadisticas: {
            victorias: 32,
            podios: 106,
            poles: 22,
            mejor_tiempo: "1:27.418",
            campeonatos_mundiales: 2,
            puntos_f1: 2267
        },
        biografia: "Doble campeón del mundo, uno de los pilotos más experimentados de la parrilla.",
        rol: "Líder",
        tipo_conduccion: "agresiva",
        estrategia: "agresiva"
    },
    {
        id: 10,
        broadcast_name: "L STROLL",
        country_code: "CAN",
        driver_number: 18,
        first_name: "Lance",
        full_name: "Lance STROLL",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/lstroll_2025.png",
        last_name: "Stroll",
        meeting_key: 1219,
        name_acronym: "STR",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Aston Martin",
        estadisticas: {
            victorias: 0,
            podios: 3,
            poles: 1,
            mejor_tiempo: "1:28.430",
            campeonatos_mundiales: 0,
            puntos_f1: 277
        },
        biografia: "Hijo del dueño del equipo Aston Martin.",
        rol: "Escudero",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 11,
        broadcast_name: "E OCON",
        country_code: "FRA",
        driver_number: 31,
        first_name: "Esteban",
        full_name: "Esteban OCON",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/eocon_2025.png",
        last_name: "Ocon",
        meeting_key: 1219,
        name_acronym: "OCO",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Alpine",
        estadisticas: {
            victorias: 1,
            podios: 3,
            poles: 0,
            mejor_tiempo: "1:28.101",
            campeonatos_mundiales: 0,
            puntos_f1: 422
        },
        biografia: "Piloto francés, ganador del Gran Premio de Hungría 2021.",
        rol: "Líder",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 12,
        broadcast_name: "P GASLY",
        country_code: "FRA",
        driver_number: 10,
        first_name: "Pierre",
        full_name: "Pierre GASLY",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/pgasly_2025.png",
        last_name: "Gasly",
        meeting_key: 1219,
        name_acronym: "GAS",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Alpine",
        estadisticas: {
            victorias: 1,
            podios: 4,
            poles: 0,
            mejor_tiempo: "1:28.101",
            campeonatos_mundiales: 0,
            puntos_f1: 394
        },
        biografia: "Ganador del Gran Premio de Italia 2020 con AlphaTauri.",
        rol: "Escudero",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 13,
        broadcast_name: "V BOTTAS",
        country_code: "FIN",
        driver_number: 77,
        first_name: "Valtteri",
        full_name: "Valtteri BOTTAS",
        headshot_url: "https://soymotor.com/sites/default/files/2024-02/valtteri-bottas-2024.png",
        last_name: "Bottas",
        meeting_key: 1219,
        name_acronym: "BOT",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Alfa Romeo",
        estadisticas: {
            victorias: 10,
            podios: 67,
            poles: 20,
            mejor_tiempo: "1:27.264",
            campeonatos_mundiales: 0,
            puntos_f1: 1797
        },
        biografia: "Ex piloto de Mercedes, conocido por su consistencia y rapidez en clasificación.",
        rol: "Líder",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 14,
        broadcast_name: "Z GUANYU",
        country_code: "CHN",
        driver_number: 24,
        first_name: "Zhou",
        full_name: "Zhou GUANYU",
        headshot_url: "https://soymotor.com/sites/default/files/2024-02/guanyu-zhou-2024.png",
        last_name: "Guanyu",
        meeting_key: 1219,
        name_acronym: "ZHO",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Alfa Romeo",
        estadisticas: {
            victorias: 0,
            podios: 0,
            poles: 0,
            mejor_tiempo: "1:28.540",
            campeonatos_mundiales: 0,
            puntos_f1: 12
        },
        biografia: "Primer piloto chino en la F1, promesa del automovilismo asiático.",
        rol: "Escudero",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 15,
        broadcast_name: "K MAGNUSSEN",
        country_code: "DEN",
        driver_number: 20,
        first_name: "Kevin",
        full_name: "Kevin MAGNUSSEN",
        headshot_url: "https://soymotor.com/sites/default/files/2024-02/kevin-magnussen-2024.png",
        last_name: "Magnussen",
        meeting_key: 1219,
        name_acronym: "MAG",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Haas",
        estadisticas: {
            victorias: 0,
            podios: 1,
            poles: 0,
            mejor_tiempo: "1:28.101",
            campeonatos_mundiales: 0,
            puntos_f1: 186
        },
        biografia: "Hijo del expiloto Jan Magnussen, conocido por su estilo agresivo.",
        rol: "Líder",
        tipo_conduccion: "agresiva",
        estrategia: "agresiva"
    },
    {
        id: 16,
        broadcast_name: "N HULKENBERG",
        country_code: "GER",
        driver_number: 27,
        first_name: "Nico",
        full_name: "Nico HULKENBERG",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/nhulkenberg_2025.png",
        last_name: "Hulkenberg",
        meeting_key: 1219,
        name_acronym: "HUL",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Haas",
        estadisticas: {
            victorias: 0,
            podios: 0,
            poles: 1,
            mejor_tiempo: "1:28.101",
            campeonatos_mundiales: 0,
            puntos_f1: 530
        },
        biografia: "Piloto alemán con gran experiencia en F1, conocido por su consistencia.",
        rol: "Escudero",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 17,
        broadcast_name: "Y TSUNODA",
        country_code: "JPN",
        driver_number: 22,
        first_name: "Yuki",
        full_name: "Yuki TSUNODA",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/yuki-tsunoda-red-bull-2025.png",
        last_name: "Tsunoda",
        meeting_key: 1219,
        name_acronym: "TSU",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "AlphaTauri",
        estadisticas: {
            victorias: 0,
            podios: 0,
            poles: 0,
            mejor_tiempo: "1:28.540",
            campeonatos_mundiales: 0,
            puntos_f1: 67
        },
        biografia: "Joven promesa japonesa, graduado del programa de jóvenes pilotos de Red Bull.",
        rol: "Escudero",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 18,
        broadcast_name: "D RICCIARDO",
        country_code: "AUS",
        driver_number: 3,
        first_name: "Daniel",
        full_name: "Daniel RICCIARDO",
        headshot_url: "https://soyf1.com/wp-content/uploads/daniel-ricciardo-03.png",
        last_name: "Ricciardo",
        meeting_key: 1219,
        name_acronym: "RIC",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "AlphaTauri",
        estadisticas: {
            victorias: 8,
            podios: 32,
            poles: 3,
            mejor_tiempo: "1:27.418",
            campeonatos_mundiales: 0,
            puntos_f1: 1317
        },
        biografia: "Popular piloto australiano conocido por su personalidad carismática y estilo de conducción agresivo.",
        rol: "Líder",
        tipo_conduccion: "agresiva",
        estrategia: "agresiva"
    },
    {
        id: 19,
        broadcast_name: "A ALBON",
        country_code: "THA",
        driver_number: 23,
        first_name: "Alexander",
        full_name: "Alexander ALBON",
        headshot_url: "https://soymotor.com/sites/default/files/2025-03/aalbon_2025.png",
        last_name: "Albon",
        meeting_key: 1219,
        name_acronym: "ALB",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Williams",
        estadisticas: {
            victorias: 0,
            podios: 2,
            poles: 0,
            mejor_tiempo: "1:28.101",
            campeonatos_mundiales: 0,
            puntos_f1: 228
        },
        biografia: "Piloto tailandés-británico, conocido por su habilidad en condiciones difíciles.",
        rol: "Líder",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    },
    {
        id: 20,
        broadcast_name: "L SARGEANT",
        country_code: "USA",
        driver_number: 2,
        first_name: "Logan",
        full_name: "Logan SARGEANT",
        headshot_url: "https://soymotor.com/sites/default/files/2024-02/logan-sargeant-2024.png",
        last_name: "Sargeant",
        meeting_key: 1219,
        name_acronym: "SAR",
        session_key: 9158,
        team_colour: "#f01919",
        team_name: "Williams",
        estadisticas: {
            victorias: 0,
            podios: 0,
            poles: 0,
            mejor_tiempo: "1:28.540",
            campeonatos_mundiales: 0,
            puntos_f1: 1
        },
        biografia: "Novato estadounidense, primer piloto de su país en la F1 desde 2015.",
        rol: "Escudero",
        tipo_conduccion: "normal",
        estrategia: "balanceada"
    }
];

// Datos de equipos
const equipos = [
    {
        id: 1,
        nombre: "Red Bull Racing",
        pais: "Austria",
        motor: "Honda",
        pilotos: [1, 2],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Red_Bull_Racing_Logo.svg",
        fecha_fundacion: 2005,
        sede: "Milton Keynes, Reino Unido",
        campeonatos: 6,
        victorias: 113,
        descripcion: "Equipo dominante en la era híbrida de la F1",
        director: "Christian Horner",
        presupuesto: 445000000
    },
    {
        id: 2,
        nombre: "Mercedes-AMG Petronas",
        pais: "Alemania",
        motor: "Mercedes",
        pilotos: [3, 4],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/3/32/Mercedes_AMG_Petronas_F1_Team_logo.svg",
        fecha_fundacion: 2010,
        sede: "Brackley, Reino Unido",
        campeonatos: 8,
        victorias: 125,
        descripcion: "Equipo dominante en la era híbrida de la F1",
        director: "Toto Wolff",
        presupuesto: 450000000
    },
    {
        id: 3,
        nombre: "Ferrari",
        pais: "Italia",
        motor: "Ferrari",
        pilotos: [5, 6],
        imagen: "https://upload.wikimedia.org/wikipedia/en/d/d4/Scuderia_Ferrari_Logo.svg",
        fecha_fundacion: 1929,
        sede: "Maranello, Italia",
        campeonatos: 16,
        victorias: 243,
        descripcion: "El equipo más antiguo y exitoso de la F1",
        director: "Frédéric Vasseur",
        presupuesto: 400000000
    },
    {
        id: 4,
        nombre: "McLaren",
        pais: "Reino Unido",
        motor: "Mercedes",
        pilotos: [7, 8],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/3/3a/McLaren_Racing_logo.svg",
        fecha_fundacion: 1963,
        sede: "Woking, Reino Unido",
        campeonatos: 8,
        victorias: 183,
        descripcion: "Uno de los equipos más exitosos de la historia de la F1",
        director: "Andrea Stella",
        presupuesto: 350000000
    },
    {
        id: 5,
        nombre: "Aston Martin",
        pais: "Reino Unido",
        motor: "Mercedes",
        pilotos: [9, 10],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Aston_Martin_Aramco_Cognizant_F1_Team_logo.svg",
        fecha_fundacion: 2021,
        sede: "Silverstone, Reino Unido",
        campeonatos: 0,
        victorias: 0,
        descripcion: "Equipo en crecimiento con ambiciones de victoria",
        director: "Mike Krack",
        presupuesto: 300000000
    },
    {
        id: 6,
        nombre: "Alpine",
        pais: "Francia",
        motor: "Renault",
        pilotos: [11, 12],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Alpine_F1_Team_logo.svg",
        fecha_fundacion: 2021,
        sede: "Enstone, Reino Unido",
        campeonatos: 0,
        victorias: 1,
        descripcion: "Equipo francés con potencial de crecimiento",
        director: "Bruno Famin",
        presupuesto: 250000000
    },
    {
        id: 7,
        nombre: "Alfa Romeo",
        pais: "Suiza",
        motor: "Ferrari",
        pilotos: [13, 14],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Alfa_Romeo_Racing_logo.svg",
        fecha_fundacion: 1993,
        sede: "Hinwil, Suiza",
        campeonatos: 0,
        victorias: 1,
        descripcion: "Equipo con gran historia en la F1",
        director: "Alessandro Alunni Bravi",
        presupuesto: 200000000
    },
    {
        id: 8,
        nombre: "Haas",
        pais: "Estados Unidos",
        motor: "Ferrari",
        pilotos: [15, 16],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Haas_F1_Team_logo.svg",
        fecha_fundacion: 2016,
        sede: "Kannapolis, Estados Unidos",
        campeonatos: 0,
        victorias: 0,
        descripcion: "Equipo estadounidense en crecimiento",
        director: "Ayao Komatsu",
        presupuesto: 150000000
    },
    {
        id: 9,
        nombre: "AlphaTauri",
        pais: "Italia",
        motor: "Honda",
        pilotos: [17, 18],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Scuderia_AlphaTauri_logo.svg",
        fecha_fundacion: 2020,
        sede: "Faenza, Italia",
        campeonatos: 0,
        victorias: 1,
        descripcion: "Equipo filial de Red Bull Racing",
        director: "Franz Tost",
        presupuesto: 150000000
    },
    {
        id: 10,
        nombre: "Williams",
        pais: "Reino Unido",
        motor: "Mercedes",
        pilotos: [19, 20],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Williams_Racing_logo.svg",
        fecha_fundacion: 1977,
        sede: "Grove, Reino Unido",
        campeonatos: 9,
        victorias: 114,
        descripcion: "Uno de los equipos más históricos de la F1",
        director: "James Vowles",
        presupuesto: 150000000
    }
];

// Datos de vehículos
const vehiculos = [
    {
      "id": 4,
      "equipo": "McLaren",
      "modelo": "MCL38",
      "motor": "Mercedes",
      "potencia": 970,
      "velocidad_maxima_kmh": 350,
      "aceleracion_0_100": 2,
      "imagen": "https://www.formula1.com/content/dam/fom-website/teams/2024/mclaren.png",
      "pilotos": [7, 8],
      "dimensiones": {
        "peso": 798,
        "longitud": 5,
        "anchura": 2,
        "altura": 1
      },
      "rendimiento": {
        "conduccion_normal": {
          "velocidad_promedio_kmh": 315,
          "consumo_combustible": { "seco": 1, "lluvioso": 2, "extremo": 2},
          "desgaste_neumaticos": { "seco": 1, "lluvioso": 0, "extremo": 2 }
        },
        "conduccion_agresiva": {
          "velocidad_promedio_kmh": 335,
          "consumo_combustible": { "seco": 2, "lluvioso": 2, "extremo": 3 },
          "desgaste_neumaticos": { "seco": 2, "lluvioso": 1, "extremo": 3 }
        },
        "ahorro_combustible": {
          "velocidad_promedio_kmh": 295,
          "consumo_combustible": { "seco": 1, "lluvioso": 1, "extremo": 2 },
          "desgaste_neumaticos": { "seco": 1, "lluvioso": 0, "extremo": 1 }
        }
      },
      "innovaciones": [
        {
          "nombre": "Sistema de refrigeración optimizado",
          "descripcion": "Mejora en la eficiencia térmica del motor",
          "impacto": "Reducción del 5% en temperatura del motor"
        }
      ],
      "aerodinamica": {
        "tipo": "media-alta"
      },
      "presion_neumaticos": {
        "tipo": "media",
        "presion": 1
      },
      "neumaticos": {
        "tipo": "Pirelli P Zero"
      }
    },
    {
      "id": 5,
      "equipo": "Aston Martin",
      "modelo": "AMR24",
      "motor": "Mercedes",
      "potencia": 965,
      "velocidad_maxima_kmh": 348,
      "aceleracion_0_100": 2,
      "imagen": "https://www.formula1.com/content/dam/fom-website/teams/2024/aston-martin.png",
      "pilotos": [9, 10],
      "dimensiones": {
        "peso": 799,
        "longitud": 5,
        "anchura": 2,
        "altura": 1
      },
      "rendimiento": {
        "conduccion_normal": {
          "velocidad_promedio_kmh": 312,
          "consumo_combustible": { "seco": 1, "lluvioso": 2, "extremo": 2 },
          "desgaste_neumaticos": { "seco": 1, "lluvioso": 0, "extremo": 2 }
        },
        "conduccion_agresiva": {
          "velocidad_promedio_kmh": 332,
          "consumo_combustible": { "seco": 2, "lluvioso": 2, "extremo": 3 },
          "desgaste_neumaticos": { "seco": 2, "lluvioso": 1, "extremo": 3 }
        },
        "ahorro_combustible": {
          "velocidad_promedio_kmh": 292,
          "consumo_combustible": { "seco": 1, "lluvioso": 1, "extremo": 2 },
          "desgaste_neumaticos": { "seco": 1, "lluvioso": 0, "extremo": 1 }
        }
      },
      "innovaciones": [
        {
          "nombre": "Suspensión adaptativa",
          "descripcion": "Sistema que ajusta la suspensión en tiempo real",
          "impacto": "Mejora del 7% en estabilidad en curvas"
        }
      ],
      "aerodinamica": {
        "tipo": "alta"
      },
      "presion_neumaticos": {
        "tipo": "media",
        "presion": 1
      },
      "neumaticos": {
        "tipo": "Pirelli P Zero"
      }
    },
    {
      "id": 6,
      "equipo": "Alpine",
      "modelo": "A524",
      "motor": "Renault",
      "potencia": 960,
      "velocidad_maxima_kmh": 345,
      "aceleracion_0_100": 2,
      "imagen": "https://www.formula1.com/content/dam/fom-website/teams/2024/alpine.png",
      "pilotos": [11, 12],
      "dimensiones": {
        "peso": 798,
        "longitud": 5,
        "anchura": 2,
        "altura": 1
      },
      "rendimiento": {
        "conduccion_normal": {
          "velocidad_promedio_kmh": 310,
          "consumo_combustible": { "seco": 2, "lluvioso": 2, "extremo": 2 },
          "desgaste_neumaticos": { "seco": 1, "lluvioso": 0, "extremo": 2 }
        },
        "conduccion_agresiva": {
          "velocidad_promedio_kmh": 330,
          "consumo_combustible": { "seco": 2, "lluvioso": 2, "extremo": 3 },
          "desgaste_neumaticos": { "seco": 2, "lluvioso": 1, "extremo": 3 }
        },
        "ahorro_combustible": {
          "velocidad_promedio_kmh": 290,
          "consumo_combustible": { "seco": 1, "lluvioso": 1, "extremo": 2 },
          "desgaste_neumaticos": { "seco": 1, "lluvioso": 0, "extremo": 1 }
        }
      },
      "innovaciones": [
        {
          "nombre": "Sistema de recuperación de energía mejorado",
          "descripcion": "Tecnología avanzada para recuperar energía en frenadas",
          "impacto": "Aumento del 6% en eficiencia energética"
        }
      ],
      "aerodinamica": {
        "tipo": "media"
      },
      "presion_neumaticos": {
        "tipo": "media",
        "presion": 1
      },
      "neumaticos": {
        "tipo": "Pirelli P Zero"
      }
    }, 
    {
          "id": 7,
          "equipo": "Alpine F1 Team",
          "modelo": "A524",
          "motor": "Renault",
          "potencia": 950,
          "velocidad_maxima_kmh": 350,
          "aceleracion_0_100": 2.7,
          "imagen": "https://www.formula1.com/content/dam/fom-website/teams/2024/alpine.png",
          "pilotos": [13, 14],
          "dimensiones": {
            "peso": 798,
            "longitud": 5,
            "anchura": 2,
            "altura": 1
          },
          "rendimiento": {
            "conduccion_normal": {
              "velocidad_promedio_kmh": 310,
              "consumo_combustible": {
                "seco": 1,
                "lluvioso": 2,
                "extremo": 2
              },
              "desgaste_neumaticos": {
                "seco": 1,
                "lluvioso": 0,
                "extremo": 2
              }
            },
            "conduccion_agresiva": {
              "velocidad_promedio_kmh": 330,
              "consumo_combustible": {
                "seco": 2,
                "lluvioso": 2,
                "extremo": 3
              },
              "desgaste_neumaticos": {
                "seco": 2,
                "lluvioso": 1,
                "extremo": 3
              }
            },
            "ahorro_combustible": {
              "velocidad_promedio_kmh": 290,
              "consumo_combustible": {
                "seco": 1,
                "lluvioso": 1,
                "extremo": 2
              },
              "desgaste_neumaticos": {
                "seco": 1,
                "lluvioso": 0,
                "extremo": 1
              }
            }
          },
          "innovaciones": [
            {
              "nombre": "Sistema de recuperación de energía mejorado",
              "descripcion": "Nueva tecnología de recuperación de energía en frenadas",
              "impacto": "Aumento del 7% en eficiencia energética"
            }
          ],
          "aerodinamica": {
            "tipo": "alta"
          },
          "presion_neumaticos": {
            "tipo": "media",
            "presion": 1
          },
          "neumaticos": {
            "tipo": "Pirelli P Zero"
          }
        },
        {
          "id": 8,
          "equipo": "Aston Martin Aramco Cognizant F1 Team",
          "modelo": "AMR24",
          "motor": "Mercedes",
          "potencia": 970,
          "velocidad_maxima_kmh": 355,
          "aceleracion_0_100": 2,
          "imagen": "https://www.formula1.com/content/dam/fom-website/teams/2024/aston-martin.png",
          "pilotos": [15, 16],
          "dimensiones": {
            "peso": 798,
            "longitud": 5,
            "anchura": 2,
            "altura": 1
          },
          "rendimiento": {
            "conduccion_normal": {
              "velocidad_promedio_kmh": 315,
              "consumo_combustible": {
                "seco": 2.0,
                "lluvioso": 2.2,
                "extremo": 2.5
              },
              "desgaste_neumaticos": {
                "seco": 1,
                "lluvioso": 0,
                "extremo": 2
              }
            },
            "conduccion_agresiva": {
              "velocidad_promedio_kmh": 335,
              "consumo_combustible": {
                "seco": 2,
                "lluvioso": 2,
                "extremo": 3
              },
              "desgaste_neumaticos": {
                "seco": 2,
                "lluvioso": 1,
                "extremo": 3
              }
            },
            "ahorro_combustible": {
              "velocidad_promedio_kmh": 295,
              "consumo_combustible": {
                "seco": 1,
                "lluvioso": 1,
                "extremo": 2
              },
              "desgaste_neumaticos": {
                "seco": 1,
                "lluvioso": 0,
                "extremo": 1
              }
            }
          },
          "innovaciones": [
            {
              "nombre": "Sistema de suspensión activa",
              "descripcion": "Nueva tecnología de suspensión adaptativa",
              "impacto": "Mejora del 8% en estabilidad en curvas"
            }
          ],
          "aerodinamica": {
            "tipo": "media-alta"
          },
          "presion_neumaticos": {
            "tipo": "media",
            "presion": 1
          },
          "neumaticos": {
            "tipo": "Pirelli P Zero"
          }
        },
        {
          "id": 9,
          "equipo": "Haas F1 Team",
          "modelo": "VF-24",
          "motor": "Ferrari",
          "potencia": 960,
          "velocidad_maxima_kmh": 352,
          "aceleracion_0_100": 2,
          "imagen": "https://www.formula1.com/content/dam/fom-website/teams/2024/haas.png",
          "pilotos": [17, 18],
          "dimensiones": {
            "peso": 798,
            "longitud": 5,
            "anchura": 2,
            "altura": 1
          },
          "rendimiento": {
            "conduccion_normal": {
              "velocidad_promedio_kmh": 312,
              "consumo_combustible": {
                "seco": 1,
                "lluvioso": 2,
                "extremo": 2
              },
              "desgaste_neumaticos": {
                "seco": 1,
                "lluvioso": 1,
                "extremo": 2
              }
            },
            "conduccion_agresiva": {
              "velocidad_promedio_kmh": 332,
              "consumo_combustible": {
                "seco": 2,
                "lluvioso": 2,
                "extremo": 3
              },
              "desgaste_neumaticos": {
                "seco": 2,
                "lluvioso": 1,
                "extremo": 3
              }
            },
            "ahorro_combustible": {
              "velocidad_promedio_kmh": 292,
              "consumo_combustible": {
                "seco": 1,
                "lluvioso": 1,
                "extremo": 2
              },
              "desgaste_neumaticos": {
                "seco": 1,
                "lluvioso": 0,
                "extremo": 1
              }
            }
          },
          "innovaciones": [
            {
              "nombre": "Sistema de recuperación de energía mejorado",
              "descripcion": "Nueva tecnología de recuperación de energía en frenadas",
              "impacto": "Aumento del 7% en eficiencia energética"
            }
          ],
          "aerodinamica": {
            "tipo": "alta"
          },
          "presion_neumaticos": {
            "tipo": "media",
            "presion": 1
          },
          "neumaticos": {
            "tipo": "Pirelli P Zero"
          }
        },
        {
            "id": 10,
            "equipo": "Alpine F1 Team",
            "modelo": "A525",
            "motor": "Renault E-Tech RE25",
            "potencia": 980,
            "velocidad_maxima_kmh": 350,
            "aceleracion_0_100": 2,
            "imagen": "https://www.formula1.com/content/dam/fom-website/teams/2024/alpine.png",
            "pilotos": [7, 10],
            "dimensiones": {
              "peso": 800,
              "longitud": 5,
              "anchura": 2,
              "altura": 0
            },
            "rendimiento": {
              "conduccion_normal": {
                "velocidad_promedio_kmh": 315,
                "consumo_combustible": { "seco": 1, "lluvioso": 2, "extremo": 2 },
                "desgaste_neumaticos": { "seco": 1, "lluvioso": 0, "extremo": 2 }
              },
              "conduccion_agresiva": {
                "velocidad_promedio_kmh": 335,
                "consumo_combustible": { "seco": 2, "lluvioso": 2, "extremo": 3 },
                "desgaste_neumaticos": { "seco": 2, "lluvioso": 1, "extremo": 3 }
              },
              "ahorro_combustible": {
                "velocidad_promedio_kmh": 295,
                "consumo_combustible": { "seco": 1, "lluvioso": 1, "extremo": 2 },
                "desgaste_neumaticos": { "seco": 1, "lluvioso": 0, "extremo": 1}
              }
            },
            "innovaciones": [
              {
                "nombre": "Sistema de recuperación de energía mejorado",
                "descripcion": "Nueva tecnología de recuperación de energía en frenadas",
                "impacto": "Aumento del 7% en eficiencia energética"
              }
            ],
            "aerodinamica": {
              "tipo": "media-alta"
            },
            "presion_neumaticos": {
              "tipo": "media",
              "presion": 1
            },
            "neumaticos": {
              "tipo": "Pirelli P Zero"
            }
          }]


// Datos de circuitos
const circuitos = [
    {
        id: 1,
        nombre: "Circuito de Mónaco",
        pais: "Mónaco",
        ciudad: "Montecarlo",
        continente: "Europa",
        longitud_km: 3,
        vueltas: 78,
        descripcion: "Uno de los circuitos más prestigiosos y difíciles del calendario, conocido por sus calles angostas y la falta de zonas de adelantamiento.",
        record_vuelta: {
            tiempo: "1:10.166",
            piloto: "Lewis Hamilton",
            año: 2019
        },
        ganadores: [
            { temporada: 2021, piloto: 1 },
            { temporada: 2022, piloto: 2 },
            { temporada: 2023, piloto: 1 }
        ],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Monte_Carlo_Formula_1_track_map.svg/1200px-Monte_Carlo_Formula_1_track_map.svg.pnghttps://img2.51gt3.com/rac/track/202304/adbd43e013004af186a50503a1c2b260.png",
        imagen_destacada: "https://img.redbull.com/images/c_limit,w_1500,h_1000/f_auto,q_auto/redbullcom/2021/5/18/ipsdfstmkuw0faah8vru/guia-circuito-monaco-formula-1",
        trazado: "Circuito urbano",
        curvas: {
            total: 19,
            izquierda: 10,
            derecha: 9
        },
        vueltas_carrera: 78,
        distancia_carrera: 260,
        zonas_drs: {
            cantidad: 1,
            ubicaciones: ["Túnel"]
        },
        primer_gp: 1950,
        caracteristicas_tecnicas: {
            dificultad: "alta",
            evolucion_pista: "baja",
            dificultad_adelantamiento: "alta",
            desgaste_neumaticos: "bajo",
            severidad_frenado: "alta",
            clima_promedio: "soleado"
        },
        curvas_clave: [
            {
                nombre: "Casino Square",
                descripcion: "Curva cerrada de 90 grados después de una bajada",
                dificultad: "alta"
            }
        ],
        historia: "El Gran Premio de Mónaco es uno de los eventos más prestigiosos del automovilismo mundial.",
        momentos_memorables: [
            {
                año: 2018,
                suceso: "Daniel Ricciardo gana con problemas de potencia",
                imagen: "https://soymotor.com/sites/default/files/imagenes/noticia/ricciardo-gana-monza-soymotor.jpg"
            }
        ]
    },
      {
          id: 2,
          nombre: "Circuito de Suzuka",
          pais: "Japón",
          ciudad: "Suzuka",
          continente: "Asia",
          longitud_km: 5,
          vueltas: 53,
          descripcion: "Uno de los pocos circuitos con diseño en forma de ocho, conocido por su fluidez y curvas técnicas.",
          record_vuelta: {
              tiempo: "1:30.983",
              piloto: "Kimi Räikkönen",
              año: 2005
          },
          ganadores: [
              { temporada: 2021, piloto: 3 },
              { temporada: 2022, piloto: 4 },
              { temporada: 2023, piloto: 4 }
          ],
          imagen: "https://img2.51gt3.com/rac/track/aacbce6c41dd4e5496eea246fc5e7c6b.jpg",
          imagen_destacada: "https://www.autohebdo.fr/app/uploads/2023/09/DPPI_00123037_387.jpg",
          trazado: "Permanente",
          curvas: {
              total: 18,
              izquierda: 10,
              derecha: 8
          },
          vueltas_carrera: 53,
          distancia_carrera: 307,
          zonas_drs: {
              cantidad: 1,
              ubicaciones: ["Recta principal"]
          },
          primer_gp: 1987,
          caracteristicas_tecnicas: {
              dificultad: "media",
              evolucion_pista: "media",
              dificultad_adelantamiento: "media",
              desgaste_neumaticos: "alto",
              severidad_frenado: "media",
              clima_promedio: "lluvioso"
          },
          curvas_clave: [
              {
                  nombre: "130R",
                  descripcion: "Curva rápida y de alta carga aerodinámica",
                  dificultad: "alta"
              }
          ],
          historia: "Famoso por decidir múltiples campeonatos, especialmente en la era de Senna y Prost.",
          momentos_memorables: [
              {
                  año: 1989,
                  suceso: "Accidente entre Senna y Prost en la chicana final",
                  imagen: "https://cdn-6.motorsport.com/images/amp/6l9JzEx0/s1000/alain-prost-mclaren-ayrton-sen.jpg"
              }
          ]
      },
      {
          id: 3,
          nombre: "Autódromo Hermanos Rodríguez",
          pais: "México",
          ciudad: "Ciudad de México",
          continente: "América",
          longitud_km: 4,
          vueltas: 71,
          descripcion: "Famoso por su altitud extrema y la sección del estadio con una atmósfera vibrante.",
          record_vuelta: {
              tiempo: "1:17.774",
              piloto: "Valtteri Bottas",
              año: 2021
          },
          ganadores: [
              { temporada: 2021, piloto: 5 },
              { temporada: 2022, piloto: 6 },
              { temporada: 2023, piloto: 5 }
          ],
          imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2015.svg/1200px-Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2015.svg.png",
          imagen_destacada: "https://i0.wp.com/mayacomunicacion.com.mx/wp-content/uploads/2024/10/Gran-Premio-de-Mexico-2025-%C2%BFCuando-sera.png?fit=818%2C545&ssl=1",
          trazado: "Permanente",
          curvas: {
              total: 17,
              izquierda: 10,
              derecha: 7
          },
          vueltas_carrera: 71,
          distancia_carrera: 305,
          zonas_drs: {
              cantidad: 2,
              ubicaciones: ["Recta principal", "entre curvas 3 y 4"]
          },
          primer_gp: 1963,
          caracteristicas_tecnicas: {
              dificultad: "media",
              evolucion_pista: "alta",
              dificultad_adelantamiento: "baja",
              desgaste_neumaticos: "medio",
              severidad_frenado: "alta",
              clima_promedio: "templado"
          },
          curvas_clave: [
              {
                  nombre: "Foro Sol",
                  descripcion: "Curvas lentas dentro de un estadio lleno de fans",
                  dificultad: "media"
              }
          ],
          historia: "Reinstaurado en 2015 con gran éxito y una afición entusiasta.",
          momentos_memorables: [
              {
                  año: 2017,
                  suceso: "Hamilton gana el campeonato pese a terminar noveno",
                  imagen: "https://s.yimg.com/ny/api/res/1.2/4LbKVSqVfhYSataq8P5Jpw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQwOA--/https://media.zenfs.com/en_us/News/Reuters/2017-10-29T223255Z_1_LYNXMPED9S0R7_RTROPTP_2_AUTOMOVILISMO-F1-HAMILTON.JPG"
              }
          ]
      },
      {
          id: 4,
          nombre: "Circuito de Spa-Francorchamps",
          pais: "Bélgica",
          ciudad: "Stavelot",
          continente: "Europa",
          longitud_km: 7,
          vueltas: 44,
          descripcion: "Uno de los circuitos más largos y legendarios, conocido por su clima impredecible y curvas como Eau Rouge.",
          record_vuelta: {
              tiempo: "1:46.286",
              piloto: "Valtteri Bottas",
              año: 2018
          },
          ganadores: [
              { temporada: 2021, piloto: 2 },
              { temporada: 2022, piloto: 1 },
              { temporada: 2023, piloto: 1 }
          ],
          imagen: "https://img2.51gt3.com/rac/track/202304/1aebcbf68ab14bce81924c06009fbe62.png",
          imagen_destacada: "https://www.spa-francorchamps.be/assets/cache/41f96bbd-ec49-4132-9e37-3462e031622a/aa3d7a4f7fc53143af3b3e05619e0b16-1.png",
          trazado: "Permanente",
          curvas: {
              total: 20,
              izquierda: 9,
              derecha: 11
          },
          vueltas_carrera: 44,
          distancia_carrera: 308,
          zonas_drs: {
              cantidad: 2,
              ubicaciones: ["Recta Kemmel", "antes de la chicana final"]
          },
          primer_gp: 1950,
          caracteristicas_tecnicas: {
              dificultad: "alta",
              evolucion_pista: "media",
              dificultad_adelantamiento: "media",
              desgaste_neumaticos: "medio",
              severidad_frenado: "media",
              clima_promedio: "variable"
          },
          curvas_clave: [
              {
                  nombre: "Eau Rouge - Raidillon",
                  descripcion: "Secuencia en subida tomada a alta velocidad",
                  dificultad: "alta"
              }
          ],
          historia: "Ha albergado carreras épicas desde los inicios de la F1 moderna.",
          momentos_memorables: [
              {
                  año: 1998,
                  suceso: "Choque múltiple bajo la lluvia en la primera vuelta",
                  imagen: "https://img.vavel.com/b/GP%20BELGICA%201998%20-%20D_%20HILL%2022%C2%BA.jpg"
              }
          ]
      }
  ]


// Datos de configuraciones de simulación
const configuracionesSimulacion = [
    {
        id: 1,
        usuario_id: new mongoose.Types.ObjectId(), // ID de usuario por defecto
        piloto_id: new mongoose.Types.ObjectId(), // Se actualizará después
        vehiculo_id: new mongoose.Types.ObjectId(), // Se actualizará después
        circuito_id: new mongoose.Types.ObjectId(), // Se actualizará después
        configuracion: {
            aerodinamica: "alta",
            presion_neumatica: "media",
            tipo_conduccion: "agresiva",
            carga_aerodinamica: "alta",
            estrategia: "agresiva"
        },
        clima: "seco",
        fecha_simulacion: new Date(),
        resultados: {
            tiempo_total: "1:45:23.456",
            posicion_final: 1,
            vueltas_completadas: 78,
            consumo_combustible: 95,
            desgaste_neumaticos: 75
        }
    }
];

const initDB = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect('mongodb://root:example@localhost:27017/formula1?authSource=admin');
        console.log('✅ Conectado a MongoDB');

        // Limpiar colecciones existentes
        await Piloto.deleteMany({});
        await Equipo.deleteMany({});
        await Vehiculo.deleteMany({});
        await Circuito.deleteMany({});
        await ConfiguracionSimulacion.deleteMany({});
        console.log('🗑️ Colecciones limpiadas');

        // Insertar datos
        const pilotosInsertados = await Piloto.insertMany(pilotos);
        console.log('👤 Pilotos insertados');

        await Equipo.insertMany(equipos);
        console.log('🏎️ Equipos insertados');

        const vehiculosInsertados = await Vehiculo.insertMany(vehiculos);
        console.log('🚗 Vehículos insertados');

        const circuitosInsertados = await Circuito.insertMany(circuitos);
        console.log('🏁 Circuitos insertados');

        // Obtener los ObjectIds de los elementos insertados
        const pilotoId = pilotosInsertados[0]._id;
        const vehiculoId = vehiculosInsertados[0]._id;
        const circuitoId = circuitosInsertados[0]._id;

        // Actualizar las configuraciones de simulación con los ObjectIds correctos
        const configuracionesActualizadas = configuracionesSimulacion.map(config => ({
            ...config,
            piloto_id: pilotoId,
            vehiculo_id: vehiculoId,
            circuito_id: circuitoId
        }));

        await ConfiguracionSimulacion.insertMany(configuracionesActualizadas);
        console.log('⚙️ Configuraciones de simulación insertadas');

        console.log('✅ Base de datos inicializada correctamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error inicializando la base de datos:', error);
        process.exit(1);
    }
};

initDB(); 