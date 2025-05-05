import { VehiclesService } from '../services/vehicles.service.js';
import { circuitsService as CircuitsServiceClass } from '../services/circuits.service.js';
import { SimulacionService } from '../services/simulacion.service.js';

const vehiclesService = new VehiclesService();
let vehiculos = [];

// Datos temporales en caso de que la API no esté disponible
const vehiculosDummy = [
    { 
        id: 1, 
        nombre: "McLaren MCL38", 
        modelo: "MCL38", 
        descripcion: "Coche de McLaren para la temporada 2023", 
        imagen: "/src/design/icons/mclaren.avif" 
    },
    { 
        id: 2, 
        nombre: "Ferrari SF-24", 
        modelo: "SF-24", 
        descripcion: "Coche de Ferrari para la temporada 2023", 
        imagen: "/src/design/icons/ferrari.jpg" 
    },
    { 
        id: 3, 
        nombre: "Red Bull RB20", 
        modelo: "RB20", 
        descripcion: "Coche de Red Bull para la temporada 2023", 
        imagen: "/src/design/icons/redbull.webp" 
    }
];

const circuitosDummy = [
    { 
        id: 1, 
        nombre: "Monza", 
        ubicacion: "Italia", 
        longitud: 5.793, 
        imagen: "/src/design/icons/monza.jpg" 
    },
    { 
        id: 2, 
        nombre: "Silverstone", 
        ubicacion: "Reino Unido", 
        longitud: 5.891, 
        imagen: "/src/design/icons/silverstone.jpg" 
    },
    { 
        id: 3, 
        nombre: "Spa-Francorchamps", 
        ubicacion: "Bélgica", 
        longitud: 7.004, 
        imagen: "/src/design/icons/spa.jpg" 
    }
];

async function cargarVehiculos() {
    try {
        const response = await vehiclesService.getVehicles();
        vehiculos = Array.isArray(response) ? response : [];
        console.log('Vehículos cargados:', vehiculos);
        
        // Si no hay vehículos, usar los datos temporales
        if (vehiculos.length === 0) {
            console.log('Usando datos temporales para vehículos');
            vehiculos = vehiculosDummy;
        }
        
        renderizarVehiculos(vehiculos);
    } catch (err) {
        console.error('Error al cargar vehículos:', err);
        console.log('Usando datos temporales para vehículos debido al error');
        vehiculos = vehiculosDummy;
        renderizarVehiculos(vehiculos);
    }
}

cargarVehiculos();

// Instanciar correctamente circuitsService
const circuitsService = new CircuitsServiceClass();
let circuitos = [];

async function cargarCircuitos() {
    try {
        const response = await circuitsService.getCircuitos();
        circuitos = Array.isArray(response) ? response : [];
        console.log('Circuitos cargados:', circuitos);
        
        // Si no hay circuitos, usar los datos temporales
        if (circuitos.length === 0) {
            console.log('Usando datos temporales para circuitos');
            circuitos = circuitosDummy;
        }
        
        renderizarCircuitos(circuitos);
    } catch (err) {
        console.error('Error al cargar circuitos:', err);
        console.log('Usando datos temporales para circuitos debido al error');
        circuitos = circuitosDummy;
        renderizarCircuitos(circuitos);
    }
}

cargarCircuitos();

const simulacionService = new SimulacionService();

// Validar sesión antes de cualquier acción
function isAuthenticated() {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    return !!token;
}
if (!isAuthenticated()) {
    console.log("No se detectó autenticación. Redirigiendo a login...");
    window.location.href = '/src/modules/login/loginView.html';
}

const modoConduccion = [
    { id: 1, nombre: "Agresivo" },
    { id: 2, nombre: "Equilibrado" },
    { id: 3, nombre: "Conservador" }
];

const aeroCarga = [
    { id: 1, nombre: "Alta (circuitos técnicos)" },
    { id: 2, nombre: "Media (circuitos mixtos)" },
    { id: 3, nombre: "Baja (circuitos rápidos)" }
];

const presionNeumaticos = [
    { id: 1, nombre: "Alta (mayor velocidad, menor duración)" },
    { id: 2, nombre: "Media (equilibrado)" },
    { id: 3, nombre: "Baja (menor velocidad, mayor duración)" }
];

const estrategiaCombustible = [
    { id: 1, nombre: "Carga completa (sin paradas)" },
    { id: 2, nombre: "Estrategia 1 parada" },
    { id: 3, nombre: "Estrategia 2 paradas" }
];

// Recuperar historial de localStorage al cargar la página
let historialConfiguraciones = JSON.parse(localStorage.getItem('historialSimulaciones')) || [];

function guardarHistorial() {
    localStorage.setItem('historialSimulaciones', JSON.stringify(historialConfiguraciones));
}

function renderizarVehiculos(listaVehiculos) {
    const vehicleList = document.getElementById('vehicle-list');
    if (!vehicleList) {
        console.error('No se encontró el elemento vehicle-list');
        return;
    }
    
    vehicleList.innerHTML = '';
    
    // Asegurarse de que listaVehiculos sea un array
    if (!Array.isArray(listaVehiculos)) {
        console.error('listaVehiculos no es un array:', listaVehiculos);
        return;
    }
    
    if (listaVehiculos.length === 0) {
        console.warn('No hay vehículos para mostrar');
        vehicleList.innerHTML = '<div class="no-data">No hay vehículos disponibles</div>';
        return;
    }


    console.log('Lista de vehículos a renderizar:', listaVehiculos);

    listaVehiculos.forEach(vehiculo => {
        // Verificar formato de los datos del vehículo
        console.log('Procesando vehículo:', vehiculo);
        
        // Obtener nombre del vehículo según los posibles campos
        const nombreVehiculo = vehiculo.nombre || vehiculo.modelo || vehiculo.name || 'Vehículo';
        
        const item = document.createElement('div');
        item.className = 'vehicle-card';
        item.innerHTML = `
            <img src="${vehiculo.imagen || vehiculo.image || ''}" alt="${nombreVehiculo}" width="80">
            <p>${nombreVehiculo}</p>
        `;
        
        // Añadir data attribute para facilitar la identificación
        item.setAttribute('data-vehicle-id', vehiculo.id);
        item.setAttribute('data-vehicle-name', nombreVehiculo);
        if (vehiculo.modelo) {
            item.setAttribute('data-vehicle-model', vehiculo.modelo);
        }
        
        item.addEventListener('click', () => {
            document.getElementById('vehicle').value = vehiculo.id;

            document.querySelectorAll('.vehicle-card').forEach(card => card.classList.remove('selected'));
            item.classList.add('selected');

            onVehicleSelect();
        });

        vehicleList.appendChild(item);
    });
}

function renderizarCircuitos(listaCircuitos) {
    const circuitList = document.getElementById('circuit-list');
    if (!circuitList) {
        console.error('No se encontró el elemento circuit-list');
        return;
    }
    
    circuitList.innerHTML = '';
    
    // Asegurarse de que listaCircuitos sea un array
    if (!Array.isArray(listaCircuitos)) {
        console.error('listaCircuitos no es un array:', listaCircuitos);
        return;
    }
    
    if (listaCircuitos.length === 0) {
        console.warn('No hay circuitos para mostrar');
        circuitList.innerHTML = '<div class="no-data">No hay circuitos disponibles</div>';
        return;
    }

    listaCircuitos.forEach(circuito => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.innerHTML = `
            <img src="${circuito.imagen}" alt="${circuito.nombre}" width="80">
            <p>${circuito.nombre}</p>
        `;
        card.addEventListener('click', () => {
            document.getElementById('circuit').value = circuito.id;

            document.querySelectorAll('#circuit-list .vehicle-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            onCircuitSelect();
        });

        circuitList.appendChild(card);
    });
}

function onVehicleSelect() {
    const vehicleId = document.getElementById('vehicle').value;
    const circuitList = document.getElementById('circuit-list');
    const esperaCircuito = document.getElementById('espera-circuito');

    if (!circuitList) {
        console.error('No se encontró el elemento circuit-list');
        return;
    }

    circuitList.innerHTML = '';
    document.getElementById('circuit').value = '';

    // Deshabilitar selectores
    const elementos = [
        'modo-conduccion',
        'aero-carga',
        'presion-neumaticos',
        'estrategia-combustible'
    ];
    
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.disabled = true;
    });

    if (!vehicleId) {
        if (esperaCircuito) esperaCircuito.classList.remove('oculto');
        return;
    }

    if (esperaCircuito) esperaCircuito.classList.add('oculto');

    // Verificar que circuitos sea un array
    if (!Array.isArray(circuitos) || circuitos.length === 0) {
        console.error('No hay circuitos disponibles');
        circuitList.innerHTML = '<div class="error-message">No hay circuitos disponibles</div>';
        return;
    }

    circuitos.forEach(circuito => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.innerHTML = `
            <img src="${circuito.imagen}" alt="${circuito.nombre}" width="80">
            <p>${circuito.nombre}</p>
        `;
        card.addEventListener('click', () => {
            document.getElementById('circuit').value = circuito.id;

            document.querySelectorAll('#circuit-list .vehicle-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            onCircuitSelect();
        });

        circuitList.appendChild(card);
    });
}

function onCircuitSelect() {
    const circuitoId = document.getElementById('circuit').value;

    const modoSelect = document.getElementById('modo-conduccion');
    const aeroSelect = document.getElementById('aero-carga');
    const presionSelect = document.getElementById('presion-neumaticos');
    const combustibleSelect = document.getElementById('estrategia-combustible');

    modoSelect.innerHTML = '';
    aeroSelect.innerHTML = '';
    presionSelect.innerHTML = '';
    combustibleSelect.innerHTML = '';

    if (circuitoId) {
        modoSelect.disabled = false;
        aeroSelect.disabled = false;
        presionSelect.disabled = false;
        combustibleSelect.disabled = false;

        modoConduccion.forEach(m => {
            modoSelect.innerHTML += `<option value="${m.id}">${m.nombre}</option>`;
        });

        aeroCarga.forEach(a => {
            aeroSelect.innerHTML += `<option value="${a.id}">${a.nombre}</option>`;
        });

        presionNeumaticos.forEach(p => {
            presionSelect.innerHTML += `<option value="${p.id}">${p.nombre}</option>`;
        });

        estrategiaCombustible.forEach(e => {
            combustibleSelect.innerHTML += `<option value="${e.id}">${e.nombre}</option>`;
        });
    }
}

function enviarConfiguracion() {
    const vehiculoId = parseInt(document.getElementById('vehicle').value);
    const circuitoId = parseInt(document.getElementById('circuit').value);

    const vehiculo = vehiculos.find(v => v.id === vehiculoId);
    const circuito = circuitos.find(c => c.id === circuitoId);

    console.log('Vehículo seleccionado:', vehiculo);
    
    // Determinar el nombre/modelo del vehículo de la manera más fiable posible
    let vehiculoNombre;
    if (vehiculo) {
        vehiculoNombre = vehiculo.modelo || vehiculo.nombre || 
                         (document.querySelector(`.vehicle-card[data-vehicle-id="${vehiculoId}"]`)?.getAttribute('data-vehicle-name')) || 
                         'Desconocido';
    } else {
        vehiculoNombre = 'Desconocido';
    }
    
    const circuitoNombre = circuito?.nombre || 'Desconocido';

    const modoId = document.getElementById('modo-conduccion').value;
    const modoNombre = document.getElementById('modo-conduccion').selectedOptions[0]?.textContent || '';
    const aeroId = document.getElementById('aero-carga').value;
    const aeroNombre = document.getElementById('aero-carga').selectedOptions[0]?.textContent || '';
    const presionId = document.getElementById('presion-neumaticos').value;
    const presionNombre = document.getElementById('presion-neumaticos').selectedOptions[0]?.textContent || '';
    const combustibleId = document.getElementById('estrategia-combustible').value;
    const combustibleNombre = document.getElementById('estrategia-combustible').selectedOptions[0]?.textContent || '';

    if (!vehiculoNombre || !circuitoNombre || !modoNombre || !aeroNombre || !presionNombre || !combustibleNombre) return;

    console.log('Configuración a simular:', {
        vehiculoNombre,
        circuitoNombre,
        modoNombre,
        aeroNombre,
        presionNombre,
        combustibleNombre
    });

    let tiempo = 100;
    const clima = generarClima();

    switch (clima) {
        case "Lluvioso": tiempo += 5; break;
        case "Extremo": tiempo += 12; break;
    }

    switch (vehiculoNombre) {
        case "MCL38": tiempo -= 10; break;
        case "McLaren MCL38": tiempo -= 10; break;
        case "SF-24": tiempo -= 8; break;
        case "Ferrari SF-24": tiempo -= 8; break;
        case "RB20": tiempo -= 12; break;
        case "Red Bull RB20": tiempo -= 12; break;
        case "AMR24": tiempo -= 7; break;
        case "A525": tiempo -= 6; break;
        case "A524": tiempo -= 3; break;
        case "VF-24": tiempo += 1; break;
        case "Desconocido": tiempo += 10; break;
        default: 
            console.log('Modelo no reconocido en tiempos:', vehiculoNombre);
            tiempo += 5;
            break;
    }

    switch (circuitoNombre) {
        case "": tiempo += 6; break;
        case "Monza": tiempo -= 3; break;
        case "Silverstone": tiempo += 1; break;
        case "Desconocido": tiempo += 7; break;
        default: tiempo += 15; break;
    }

    switch (modoNombre) {
        case "Agresivo": tiempo -= 5; break;
        case "Conservador": tiempo += 5; break;
    }

    switch (aeroNombre) {
        case "Alta (circuitos técnicos)": tiempo += 3; break;
        case "Baja (circuitos rápidos)": tiempo -= 2; break;
    }

    switch (presionNombre) {
        case "Alta (mayor velocidad, menor duración)": tiempo -= 2; break;
        case "Baja (menor velocidad, mayor duración)": tiempo += 3; break;
    }

    switch (combustibleNombre) {
        case "Carga completa (sin paradas)": tiempo += 4; break;
        case "Estrategia 2 paradas": tiempo -= 3; break;
    }

    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${vehiculoNombre}</td>
        <td>${circuitoNombre}</td>
        <td>${modoNombre}</td>
        <td>${aeroNombre}</td>
        <td>${presionNombre}</td>
        <td>${combustibleNombre}</td>
        <td>${clima}</td> 
        <td>${tiempo}</td>
    `;
    document.querySelector('#tabla-resultados tbody').appendChild(fila);

    const config = {
        vehiculoId, circuitoId, modoId, aeroId, presionId, combustibleId,
        vehiculoNombre, circuitoNombre, modoNombre, aeroNombre, presionNombre, combustibleNombre,
        clima
    };
    historialConfiguraciones.push(config);
    guardarHistorial();
    renderHistorial();
}

function generarClima() {
    const random = Math.random();
    if (random < 0.7) return "Normal";     
    if (random < 0.9) return "Lluvioso";    
    return "Extremo";
}               

function renderHistorial() {
    const contenedor = document.getElementById('tarjetas-config');
    if (!contenedor) {
        console.error('No se encontró el elemento tarjetas-config');
        return;
    }
    
    contenedor.innerHTML = '';
    
    if (!Array.isArray(historialConfiguraciones) || historialConfiguraciones.length === 0) {
        contenedor.innerHTML = '<div class="no-history">No hay historial de simulaciones</div>';
        return;
    }

    console.log('Historial de configuraciones:', historialConfiguraciones);

    historialConfiguraciones.forEach((config) => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-config';
        
        // Verificar que los nombres existan
        const vehiculoNombre = config.vehiculoNombre || 'Vehículo desconocido';
        const circuitoNombre = config.circuitoNombre || 'Circuito desconocido';
        
        tarjeta.innerHTML = `
            <strong>${vehiculoNombre}</strong> en <strong>${circuitoNombre}</strong><br>
            Modo: ${config.modoNombre || 'No especificado'}<br>
            Aero: ${config.aeroNombre || 'No especificado'}<br>
            Presión: ${config.presionNombre || 'No especificado'}<br>
            Combustible: ${config.combustibleNombre || 'No especificado'}<br>
            Clima: <em>${config.clima || 'Normal'}</em>
        `;

        tarjeta.addEventListener('click', () => {
            document.getElementById('vehicle').value = config.vehiculoId;
            document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
            const selected = Array.from(document.querySelectorAll('.vehicle-card')).find(el => {
                const cardName = el.querySelector('p')?.textContent || '';
                return cardName.includes(vehiculoNombre) || 
                      (el.getAttribute('data-vehicle-name') === vehiculoNombre) ||
                      (el.getAttribute('data-vehicle-id') == config.vehiculoId);
            });
            
            if (selected) selected.classList.add('selected');

            onVehicleSelect();

            setTimeout(() => {
                document.getElementById('circuit').value = config.circuitoId;
                document.querySelectorAll('#circuit-list .vehicle-card').forEach(c => c.classList.remove('selected'));
                const circuitoCard = Array.from(document.querySelectorAll('#circuit-list .vehicle-card')).find(el => {
                    const cardName = el.querySelector('p')?.textContent || '';
                    return cardName.includes(circuitoNombre);
                });
                
                if (circuitoCard) circuitoCard.classList.add('selected');

                onCircuitSelect();

                document.getElementById('modo-conduccion').value = config.modoId;
                document.getElementById('aero-carga').value = config.aeroId;
                document.getElementById('presion-neumaticos').value = config.presionId;
                document.getElementById('estrategia-combustible').value = config.combustibleId;
            }, 300);
        });

        contenedor.appendChild(tarjeta);
    });
}

// Al cargar la página, renderizar el historial guardado
renderHistorial();

document.getElementById("start-simulation").addEventListener("click", () => {
    document.querySelector(".success-message").style.display = "none";
    document.getElementById("resultados-simulacion").style.display = "none";
    document.getElementById("car-race-container").style.display = "block";

    const car = document.getElementById("car-race");
    car.style.animation = "none";
    car.offsetHeight; 
    car.style.animation = "moveCar 10s linear forwards";

    setTimeout(() => {
        document.getElementById("car-race-container").style.display = "none";
        document.querySelector(".success-message").style.display = "block";
        document.getElementById("resultados-simulacion").style.display = "block";
        enviarConfiguracion(); // <-- Aquí se llama para mostrar y guardar los datos
    }, 8000); 
});

// Ejemplo de función para crear y ejecutar simulación
async function ejecutarSimulacionDesdeFront(configuracion) {
    try {
        await simulacionService.crearSimulacion(configuracion);
        const resultado = await simulacionService.ejecutarSimulacion(configuracion);
        mostrarResultadosSimulacion(resultado);
    } catch (error) {
        showError('Error en la simulación: ' + error.message);
    }
}

// Ejemplo de cómo armar la configuración para enviar (sin usuario_id)
function armarConfiguracionSimulacion() {
    // Aquí debes obtener los valores seleccionados en la UI
    return {
        piloto_id: document.getElementById('piloto')?.value, // si tienes selector de piloto
        vehiculo_id: document.getElementById('vehicle').value,
        circuito_id: document.getElementById('circuit').value,
        configuracion: {
            aerodinamica: obtenerValorAerodinamica(),
            presion_neumatica: obtenerValorPresion(),
            tipo_conduccion: obtenerValorConduccion(),
            carga_aerodinamica: obtenerValorCarga(),
            estrategia: obtenerValorEstrategia()
        },
        clima: obtenerValorClima(),
        fecha_simulacion: new Date().toISOString()
    };
}

// Llama a ejecutarSimulacionDesdeFront(armarConfiguracionSimulacion()) cuando el usuario envíe la simulación
