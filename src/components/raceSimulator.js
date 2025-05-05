import { VehiclesService } from "../services/vehicles.service.js";
import { CircuitsService } from '../services/CircuitsService.js';

const vehiclesService = new VehiclesService();
let vehiculos = [];

async function cargarVehiculos() {
    try {
        vehiculos = await vehiclesService.getVehicles();
        renderizarVehiculos(vehiculos); 
    } catch (err) {
        console.error('Error al cargar vehículos:', err);
    }
}

cargarVehiculos();

const circuitsService = new CircuitsService();
let circuitos = [];

async function cargarCircuitos() {
    try {
        circuitos = await circuitsService.getCircuits();
        renderizarCircuitos(circuitos); 
    } catch (err) {
        console.error('Error al cargar circuitos:', err);
    }
}

cargarCircuitos();


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

const historialConfiguraciones = [];

function renderizarVehiculos(listaVehiculos) {
    const vehicleList = document.getElementById('vehicle-list');
    vehicleList.innerHTML = '';

    listaVehiculos.forEach(vehiculo => {
        const item = document.createElement('div');
        item.className = 'vehicle-card';
        item.innerHTML = `
            <img src="${vehiculo.imagen}" alt="${vehiculo.nombre}" width="80">
            <p>${vehiculo.nombre}</p>
        `;
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
    circuitList.innerHTML = '';

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

    circuitList.innerHTML = '';
    document.getElementById('circuit').value = '';

    document.getElementById('modo-conduccion').disabled = true;
    document.getElementById('aero-carga').disabled = true;
    document.getElementById('presion-neumaticos').disabled = true;
    document.getElementById('estrategia-combustible').disabled = true;

    if (!vehicleId) {
        esperaCircuito.classList.remove('oculto');
        return;
    }

    esperaCircuito.classList.add('oculto');

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

    const vehiculoNombre = vehiculo?.modelo || 'Desconocido';
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

    let tiempo = 100;
    const clima = generarClima();

    switch (clima) {
        case "Lluvioso": tiempo += 5; break;
        case "Extremo": tiempo += 12; break;
    }

    switch (vehiculoNombre) {
        case "AMR24": tiempo -= 12; break;
        case "MCL38": tiempo -= 10; break;
        case "A525": tiempo -= 6; break;
        case "A524": tiempo -= 3; break;
        case "VF-24": tiempo += 1; break;
        case "AMR24": tiempo += 7; break;
        case "Desconocido": tiempo += 10; break;
        case _: tiempo += 15; break;
    }

    switch (circuitoNombre) {
        case "Circuito de Mónaco": tiempo += 3; break;
        case "Circuito de Suzuka": tiempo += 5; break;
        case "Autódromo Hermanos Rodríguez": tiempo += 4; break;
        case "Circuito de Spa-Francorchamps": tiempo += 7; break;
        case "Desconocido": tiempo += 7; break;
        case _: tiempo += 15; break;
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
    contenedor.innerHTML = '';

    historialConfiguraciones.forEach((config) => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-config';
        tarjeta.innerHTML = `
            <strong>${config.vehiculoNombre}</strong> en <strong>${config.circuitoNombre}</strong><br>
            Modo: ${config.modoNombre}<br>
            Aero: ${config.aeroNombre}<br>
            Presión: ${config.presionNombre}<br>
            Combustible: ${config.combustibleNombre}<br>
            Clima: <em>${config.clima}</em>
        `;

        tarjeta.addEventListener('click', () => {
            document.getElementById('vehicle').value = config.vehiculoId;
            document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
            const selected = Array.from(document.querySelectorAll('.vehicle-card')).find(el => el.textContent.includes(config.vehiculoNombre));
            if (selected) selected.classList.add('selected');

            onVehicleSelect();

            setTimeout(() => {
                document.getElementById('circuit').value = config.circuitoId;
                document.querySelectorAll('#circuit-list .vehicle-card').forEach(c => c.classList.remove('selected'));
                const circuitoCard = Array.from(document.querySelectorAll('#circuit-list .vehicle-card')).find(el => el.textContent.includes(config.circuitoNombre));
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
    }, 8000); 
});
