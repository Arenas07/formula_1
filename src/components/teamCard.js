const nuevoEquipo = [{
    id: 1,
    nombre: "Red Bull Racing",
    pais: "Austria",
    motor: "Honda",
    pilotos: [33, 11], // IDs de pilotos relacionados
    imagen: "https://example.com/redbull.png",
    fecha_fundacion: 2005,
    sede: "Milton Keynes",
    campeonatos: 6,
    victorias: 115,
    descripcion: "Equipo dominante en la era híbrida con Verstappen.",
    director: "Christian Horner",
    presupuesto: 450000000
  }, {
    id: 2,
    nombre: "Mercedes AMG Petronas",
    pais: "Alemania",
    motor: "Mercedes",
    pilotos: [44, 63], // IDs de pilotos relacionados
    imagen: "https://example.com/mercedes.png",
    fecha_fundacion: 2010,
    sede: "Brackley",
    campeonatos: 8,
    victorias: 125,
    descripcion: "Dominadores de la era híbrida con Hamilton.",
    director: "Toto Wolff",
    presupuesto: 470000000
  },
  {
    id: 2,
    nombre: "Mercedes AMG Petronas",
    pais: "Alemania",
    motor: "Mercedes",
    pilotos: [44, 63], // IDs de pilotos relacionados
    imagen: "https://example.com/mercedes.png",
    fecha_fundacion: 2010,
    sede: "Brackley",
    campeonatos: 8,
    victorias: 125,
    descripcion: "Dominadores de la era híbrida con Hamilton.",
    director: "Toto Wolff",
    presupuesto: 470000000
  },
  {
    id: 2,
    nombre: "Mercedes AMG Petronas",
    pais: "Alemania",
    motor: "Mercedes",
    pilotos: [44, 63], // IDs de pilotos relacionados
    imagen: "https://example.com/mercedes.png",
    fecha_fundacion: 2010,
    sede: "Brackley",
    campeonatos: 8,
    victorias: 125,
    descripcion: "Dominadores de la era híbrida con Hamilton.",
    director: "Toto Wolff",
    presupuesto: 470000000
  }];
  
const listTeams = document.getElementById("list__teams")
let template

function pilotCard(data){
    const datos = data
    console.log(datos);
    
    listTeams.innerHTML = ''
    template = ''
    datos.forEach(dato => {
        template += `
        <div class="overall-information">
            <div class="flip-box">
            <div class="flip-box-inner">
            <div class="flip-box-front">
                <div class="title__information">
                <h3>${dato.nombre}</h3>
                <p class="fundation-year">${dato.fecha_fundacion}</p>
                </div>
                <div class="info-container">
                <img src="${dato.imagen}" alt="${dato.nombre}">
                <h2>${dato.nombre}</h2>
                <div class="drivers-name">
                    <p>${dato.pilotos[0] ?? ""}</p>
                    <p>${dato.pilotos[1] ?? ""}</p>
                </div>
                </div>
                <div class="details">
                <strong>Ver detalles ></strong>
                </div>
            </div>

            <!-- BACK -->
            <div class="flip-box-back">
                <div class="title__information">
                <h3>${dato.nombre}</h3>
                <p class="fundation-year">${dato.fecha_fundacion}</p>
                </div>
                <section class="section-top">
                    <h2>Información del equipo</h2>
                    <div class="location">
                        <i class='bx bx-current-location'></i>
                        <div class="extra-information">
                            <p>Sede</p>
                            <b>${dato.sede}</b>
                        </div>
                    </div>
                    <div class="manager">
                        <i class='bx bxs-user' ></i>
                        <div class="extra-information">
                            <p>Director de Equipo</p>
                            <b>${dato.director}</b>
                        </div>
                    </div>
                    <div class="motor">
                        <i class='bx bxs-wrench' ></i>
                        <div class="extra-information">
                            <p>Unidad de potencia</p>
                            <b>${dato.motor}</b>
                        </div>
                    </div>
                    <div class="budge">
                        <i class='bx bx-wallet' ></i>
                        <div class="extra-information">
                            <p>Presupuesto</p>
                            <b>${dato.presupuesto}</b>
                        </div>
                    </div>
                </section>
                <section class="section-bottom">
                    <h2>Estadísticas</h2>
                    <div class="first-container">
                        <i class='bx bxs-trophy'></i>
                        <div class="second-container">
                            <p>Campeonatos</p>
                            <b>${dato.campeonatos}</b>
                        </div>
                    </div>
                    <div class="first-container">
                        <i class='bx bxs-flag-alt'></i>
                        <div class="second-container">
                            <p>Victorias</p>
                            <b>${dato.victorias}</b>
                        </div>
                    </div>
                </section>
            </div>
            </div>
            </div>
        </div>
        `

    });
    listTeams.innerHTML += template
      
} 

pilotCard(nuevoEquipo)

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".flip-box").forEach((card) => {
      card.addEventListener("click", () => {
        card.classList.toggle("flipped");
      });
    });
  });
  