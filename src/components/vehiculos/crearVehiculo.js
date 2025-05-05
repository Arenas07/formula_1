import { VehiclesService } from '../../services/vehicles.service';
import { tokenValidator } from "../../utils/shared/tokenValidator";
import { isAdmin } from "../../utils/shared/roleValidator";
import { showError, showSuccess } from '../../utils/shared/notifications';

class CrearVehiculo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        // Verificar permisos al cargar la página
        const existToken = tokenValidator();
        console.log('🔑 Estado del token en crear vehículo:', existToken ? 'Presente' : 'No presente');
        
        if (existToken) {
            const isUserAdmin = await isAdmin();
            console.log('🔐 Estado de permisos en crear vehículo:', { existToken, isUserAdmin });
            
            if (!isUserAdmin) {
                console.log('👤 Usuario no es administrador, mostrando mensaje de error');
                this.shadowRoot.innerHTML = `
                    <div style="padding: 2rem; text-align: center; font-size: 1.2rem;">
                        No tienes permisos para crear vehículos.
                    </div>
                `;
                return;
            }
        } else {
            console.log('🔒 No hay token, mostrando mensaje de error');
            this.shadowRoot.innerHTML = `
                <div style="padding: 2rem; text-align: center; font-size: 1.2rem;">
                    No tienes permisos para crear vehículos.
                </div>
            `;
            return;
        }

        this.render();
        this.setupEventListeners();
    }

    render() {
        let template = '';
        template += `<link rel="stylesheet" href="/src/design/css/crearVehiculo.css">`;
        template += `<div class="container">
            <div class="crear-vehiculo">
                <h1>Crear Vehículo</h1>
                <form id="form-vehiculo">
                    <div class="form-group">
                        <label for="equipo">Equipo</label>
                        <input type="text" id="equipo" name="equipo" required>
                    </div>
                    <div class="form-group">
                        <label for="modelo">Modelo</label>
                        <input type="text" id="modelo" name="modelo" required>
                    </div>
                    <div class="form-group">
                        <label for="motor">Motor</label>
                        <input type="text" id="motor" name="motor" required>
                    </div>
                    <div class="form-group">
                        <label for="potencia">Potencia (HP)</label>
                        <input type="number" id="potencia" name="potencia" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="velocidad_maxima_kmh">Velocidad Máxima (km/h)</label>
                        <input type="number" id="velocidad_maxima_kmh" name="velocidad_maxima_kmh" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="aceleracion_0_100">Aceleración 0-100 (s)</label>
                        <input type="number" id="aceleracion_0_100" name="aceleracion_0_100" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="imagen">URL de la imagen</label>
                        <input type="url" id="imagen" name="imagen" required>
                    </div>
                    <div class="form-group">
                        <label for="pilotos">IDs de pilotos (separados por coma)</label>
                        <input type="text" id="pilotos" name="pilotos" placeholder="1,2" required>
                    </div>
                    <fieldset>
                        <legend>Dimensiones</legend>
                        <div class="form-group"><label for="peso">Peso (kg)</label><input type="number" id="peso" name="peso" min="0" required></div>
                        <div class="form-group"><label for="longitud">Longitud (m)</label><input type="number" id="longitud" name="longitud" min="0" step="0.01" required></div>
                        <div class="form-group"><label for="anchura">Anchura (m)</label><input type="number" id="anchura" name="anchura" min="0" step="0.01" required></div>
                        <div class="form-group"><label for="altura">Altura (m)</label><input type="number" id="altura" name="altura" min="0" step="0.01" required></div>
                    </fieldset>
                    <fieldset>
                        <legend>Rendimiento</legend>
                        <div class="form-group"><label>Conducción Normal - Velocidad Promedio (km/h)</label><input type="number" id="velocidad_promedio_normal" name="velocidad_promedio_normal" min="0" required></div>
                        <div class="form-group"><label>Conducción Normal - Consumo Combustible (seco, lluvioso, extremo)</label><input type="text" id="consumo_normal" name="consumo_normal" placeholder="2.5,2.8,3.0" required></div>
                        <div class="form-group"><label>Conducción Normal - Desgaste Neumáticos (seco, lluvioso, extremo)</label><input type="text" id="desgaste_normal" name="desgaste_normal" placeholder="1.2,1.5,2.0" required></div>
                        <div class="form-group"><label>Conducción Agresiva - Velocidad Promedio (km/h)</label><input type="number" id="velocidad_promedio_agresiva" name="velocidad_promedio_agresiva" min="0" required></div>
                        <div class="form-group"><label>Conducción Agresiva - Consumo Combustible (seco, lluvioso, extremo)</label><input type="text" id="consumo_agresiva" name="consumo_agresiva" placeholder="3.0,3.3,3.5" required></div>
                        <div class="form-group"><label>Conducción Agresiva - Desgaste Neumáticos (seco, lluvioso, extremo)</label><input type="text" id="desgaste_agresiva" name="desgaste_agresiva" placeholder="2.0,2.3,2.8" required></div>
                        <div class="form-group"><label>Ahorro Combustible - Velocidad Promedio (km/h)</label><input type="number" id="velocidad_promedio_ahorro" name="velocidad_promedio_ahorro" min="0" required></div>
                        <div class="form-group"><label>Ahorro Combustible - Consumo Combustible (seco, lluvioso, extremo)</label><input type="text" id="consumo_ahorro" name="consumo_ahorro" placeholder="2.0,2.2,2.4" required></div>
                        <div class="form-group"><label>Ahorro Combustible - Desgaste Neumáticos (seco, lluvioso, extremo)</label><input type="text" id="desgaste_ahorro" name="desgaste_ahorro" placeholder="1.0,1.2,1.5" required></div>
                    </fieldset>
                    <fieldset>
                        <legend>Innovaciones</legend>
                        <div class="form-group"><label>Nombre 1</label><input type="text" id="innovacion_nombre_1" name="innovacion_nombre_1"></div>
                        <div class="form-group"><label>Descripción 1</label><input type="text" id="innovacion_desc_1" name="innovacion_desc_1"></div>
                        <div class="form-group"><label>Impacto 1</label><input type="text" id="innovacion_impacto_1" name="innovacion_impacto_1"></div>
                        <div class="form-group"><label>Nombre 2</label><input type="text" id="innovacion_nombre_2" name="innovacion_nombre_2"></div>
                        <div class="form-group"><label>Descripción 2</label><input type="text" id="innovacion_desc_2" name="innovacion_desc_2"></div>
                        <div class="form-group"><label>Impacto 2</label><input type="text" id="innovacion_impacto_2" name="innovacion_impacto_2"></div>
                    </fieldset>
                    <fieldset>
                        <legend>Aerodinámica</legend>
                        <div class="form-group"><label for="aerodinamica_tipo">Tipo</label><input type="text" id="aerodinamica_tipo" name="aerodinamica_tipo" required></div>
                    </fieldset>
                    <fieldset>
                        <legend>Presión Neumáticos</legend>
                        <div class="form-group"><label for="presion_tipo">Tipo</label><input type="text" id="presion_tipo" name="presion_tipo" required></div>
                        <div class="form-group"><label for="presion_valor">Presión</label><input type="number" id="presion_valor" name="presion_valor" step="0.01" required></div>
                    </fieldset>
                    <fieldset>
                        <legend>Neumáticos</legend>
                        <div class="form-group"><label for="neumaticos_tipo">Tipo</label><input type="text" id="neumaticos_tipo" name="neumaticos_tipo" required></div>
                    </fieldset>
                    <button type="submit">Crear Vehículo</button>
                </form>
            </div>
        </div>`;
        this.shadowRoot.innerHTML = template;
    }

    setupEventListeners() {
        const form = this.shadowRoot.querySelector('#form-vehiculo');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Validar campos numéricos
                const numericFields = ['potencia', 'velocidad_maxima_kmh', 'aceleracion_0_100', 'peso', 'longitud', 'anchura', 'altura', 'velocidad_promedio_normal', 'velocidad_promedio_agresiva', 'velocidad_promedio_ahorro', 'presion_valor'];
                for (const field of numericFields) {
                    if (isNaN(data[field]) || data[field] < 0) {
                        showError(`El campo ${field} debe ser un número válido mayor o igual a 0`);
                        return;
                    }
                }

                // Validar que los campos de consumo y desgaste tengan 3 valores
                const tripleFields = [
                    { name: 'consumo_normal', label: 'Consumo Combustible (Conducción Normal)' },
                    { name: 'desgaste_normal', label: 'Desgaste Neumáticos (Conducción Normal)' },
                    { name: 'consumo_agresiva', label: 'Consumo Combustible (Conducción Agresiva)' },
                    { name: 'desgaste_agresiva', label: 'Desgaste Neumáticos (Conducción Agresiva)' },
                    { name: 'consumo_ahorro', label: 'Consumo Combustible (Ahorro Combustible)' },
                    { name: 'desgaste_ahorro', label: 'Desgaste Neumáticos (Ahorro Combustible)' }
                ];
                for (const field of tripleFields) {
                    const arr = (data[field.name] || '').split(',').map(x => x.trim()).filter(x => x !== '');
                    if (arr.length !== 3) {
                        showError(`El campo "${field.label}" debe tener 3 valores separados por coma. Ejemplo: 2.5,2.8,3.0`);
                        return;
                    }
                }

                // Procesar arrays y objetos anidados
                const pilotos = data.pilotos.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
                // Rendimiento
                const parseTriple = (str) => {
                    const arr = str.split(',').map(x => Number(x.trim()));
                    return { seco: arr[0] || 0, lluvioso: arr[1] || 0, extremo: arr[2] || 0 };
                };
                const rendimiento = {
                    conduccion_normal: {
                        velocidad_promedio_kmh: Number(data.velocidad_promedio_normal),
                        consumo_combustible: parseTriple(data.consumo_normal),
                        desgaste_neumaticos: parseTriple(data.desgaste_normal)
                    },
                    conduccion_agresiva: {
                        velocidad_promedio_kmh: Number(data.velocidad_promedio_agresiva),
                        consumo_combustible: parseTriple(data.consumo_agresiva),
                        desgaste_neumaticos: parseTriple(data.desgaste_agresiva)
                    },
                    ahorro_combustible: {
                        velocidad_promedio_kmh: Number(data.velocidad_promedio_ahorro),
                        consumo_combustible: parseTriple(data.consumo_ahorro),
                        desgaste_neumaticos: parseTriple(data.desgaste_ahorro)
                    }
                };
                // Innovaciones
                const innovaciones = [];
                if (data.innovacion_nombre_1) {
                    innovaciones.push({
                        nombre: data.innovacion_nombre_1,
                        descripcion: data.innovacion_desc_1,
                        impacto: data.innovacion_impacto_1
                    });
                }
                if (data.innovacion_nombre_2) {
                    innovaciones.push({
                        nombre: data.innovacion_nombre_2,
                        descripcion: data.innovacion_desc_2,
                        impacto: data.innovacion_impacto_2
                    });
                }
                // Armar el objeto final
                const vehiculoData = {
                    equipo: data.equipo,
                    modelo: data.modelo,
                    motor: data.motor,
                    potencia: Number(data.potencia),
                    velocidad_maxima_kmh: Number(data.velocidad_maxima_kmh),
                    aceleracion_0_100: Number(data.aceleracion_0_100),
                    imagen: data.imagen,
                    pilotos,
                    dimensiones: {
                        peso: Number(data.peso),
                        longitud: Number(data.longitud),
                        anchura: Number(data.anchura),
                        altura: Number(data.altura)
                    },
                    rendimiento,
                    innovaciones,
                    aerodinamica: {
                        tipo: data.aerodinamica_tipo
                    },
                    presion_neumaticos: {
                        tipo: data.presion_tipo,
                        presion: Number(data.presion_valor)
                    },
                    neumaticos: {
                        tipo: data.neumaticos_tipo
                    }
                };

                try {
                    const service = new VehiclesService();
                    await service.createVehicle(vehiculoData);
                    showSuccess('Vehículo creado exitosamente');
                    window.location.href = '/src/modules/vehicles/vehiclesView.html';
                } catch (error) {
                    showError('Error al crear el vehículo: ' + error.message);
                }
            });
        }
    }
}

customElements.define('crear-vehiculo', CrearVehiculo); 