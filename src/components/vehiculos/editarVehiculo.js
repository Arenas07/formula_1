import { VehiclesService } from "../../services/vehicles.service";
import { tokenValidator } from "../../utils/shared/tokenValidator";
import { isAdmin } from "../../utils/shared/roleValidator";
import { showError, showSuccess } from '../../utils/shared/notifications';

class EditarVehiculo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.vehiculoId = null;
        this.vehiculoData = null;
    }
    
    async connectedCallback() {
        // Verificar permisos al cargar la página
        const existToken = tokenValidator();
        console.log('🔑 Estado del token en editar vehículo:', existToken ? 'Presente' : 'No presente');
        
        if (existToken) {
            const isUserAdmin = await isAdmin();
            console.log('🔐 Estado de permisos en editar vehículo:', { existToken, isUserAdmin });
            
            if (!isUserAdmin) {
                console.log('👤 Usuario no es administrador, mostrando mensaje de error');
                this.shadowRoot.innerHTML = `
                    <div style="padding: 2rem; text-align: center; font-size: 1.2rem;">
                        No tienes permisos para editar vehículos.
                    </div>
                `;
                return;
            }
        } else {
            console.log('🔒 No hay token, mostrando mensaje de error');
            this.shadowRoot.innerHTML = `
                <div style="padding: 2rem; text-align: center; font-size: 1.2rem;">
                    No tienes permisos para editar vehículos.
                </div>
            `;
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        this.vehiculoId = urlParams.get("id");
        if (!this.vehiculoId) {
            showError('No se encontró el ID del vehículo');
            this.render();
            return;
        }

        try {
            console.log('🔄 Obteniendo datos del vehículo con ID:', this.vehiculoId);
            const service = new VehiclesService();
            const response = await service.getVehicleById(this.vehiculoId);
            this.vehiculoData = response.data || response.vehiculo || response;
            if (!this.vehiculoData) throw new Error('No se recibieron datos del vehículo');
            console.log('✅ Datos del vehículo obtenidos:', this.vehiculoData);
            this.render();
            this.updateFormValues();
            this.setupEventListeners();
        } catch (error) {
            console.error("❌ Error al obtener los datos del vehículo:", error);
            showError('Error al cargar los datos del vehículo: ' + error.message);
            this.render();
        }
    }

    render() {
        let template = '';
        template += `<link rel="stylesheet" href="/src/design/css/crearVehiculo.css">`;
        template += `<div class="container">
            <div class="crear-vehiculo">
                <h1>Editar Vehículo</h1>
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
                        <input type="number" id="aceleracion_0_100" name="aceleracion_0_100" min="0" step="0.1" required>
                    </div>
                    <div class="form-group">
                        <label for="peso">Peso (kg)</label>
                        <input type="number" id="peso" name="peso" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="longitud">Longitud (mm)</label>
                        <input type="number" id="longitud" name="longitud" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="anchura">Anchura (mm)</label>
                        <input type="number" id="anchura" name="anchura" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="altura">Altura (mm)</label>
                        <input type="number" id="altura" name="altura" min="0" required>
                    </div>
                    <button type="submit">Guardar Cambios</button>
                </form>
            </div>
        </div>`;
        this.shadowRoot.innerHTML = template;
    }

    updateFormValues() {
        if (!this.vehiculoData) return;
        const form = this.shadowRoot.querySelector('#form-vehiculo');
        if (!form) return;

        // Actualizar campos principales
        form.equipo.value = this.vehiculoData.equipo || '';
        form.modelo.value = this.vehiculoData.modelo || '';
        form.motor.value = this.vehiculoData.motor || '';
        form.potencia.value = this.vehiculoData.potencia || '';
        form.velocidad_maxima_kmh.value = this.vehiculoData.velocidad_maxima_kmh || '';
        form.aceleracion_0_100.value = this.vehiculoData.aceleracion_0_100 || '';

        // Actualizar dimensiones
        if (this.vehiculoData.dimensiones) {
            form.peso.value = this.vehiculoData.dimensiones.peso || '';
            form.longitud.value = this.vehiculoData.dimensiones.longitud || '';
            form.anchura.value = this.vehiculoData.dimensiones.anchura || '';
            form.altura.value = this.vehiculoData.dimensiones.altura || '';
        }
    }

    setupEventListeners() {
        const form = this.shadowRoot.querySelector('#form-vehiculo');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Validar campos numéricos
                const numericFields = ['potencia', 'velocidad_maxima_kmh', 'aceleracion_0_100', 'peso', 'longitud', 'anchura', 'altura'];
                for (const field of numericFields) {
                    if (isNaN(data[field]) || data[field] < 0) {
                        showError(`El campo ${field} debe ser un número válido mayor o igual a 0`);
                        return;
                    }
                }

                // Estructurar los datos según el formato requerido
                const vehiculoData = {
                    equipo: data.equipo,
                    modelo: data.modelo,
                    motor: data.motor,
                    potencia: Number(data.potencia),
                    velocidad_maxima_kmh: Number(data.velocidad_maxima_kmh),
                    aceleracion_0_100: Number(data.aceleracion_0_100),
                    pilotos: this.vehiculoData.pilotos || [], // Mantener los pilotos existentes
                    dimensiones: {
                        peso: Number(data.peso),
                        longitud: Number(data.longitud),
                        anchura: Number(data.anchura),
                        altura: Number(data.altura)
                    }
                };

                try {
                    const service = new VehiclesService();
                    await service.updateVehicle(this.vehiculoId, vehiculoData);
                    showSuccess('Vehículo actualizado exitosamente');
                    window.location.href = '/src/modules/vehicles/vehiclesView.html';
                } catch (error) {
                    showError('Error al actualizar el vehículo: ' + error.message);
                }
            });
        }
    }
}

customElements.define("editar-vehiculo", EditarVehiculo); 