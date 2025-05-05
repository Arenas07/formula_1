const VehiculoRepository = require('../infraestructure/repository/vehiculo.repository');

class VehiculoService {
    async getVehiculos() {
        try {
            const vehiculos = await VehiculoRepository.getVehiculos();
            if (vehiculos.length === 0) {
                console.log('❌ VehiculoService - getVehiculos - No hay vehículos disponibles');
                return { success: false, message: 'No hay vehículos disponibles' };
            }
            console.log('✅ VehiculoService - getVehiculos - Todos los vehículos obtenidos');
            return { success: true, vehiculos };
        } catch (error) {
            console.error('💥 VehiculoService - getVehiculos - Error:', error);
            throw error;
        }
    }

    async getVehiculoById(id) {
        try {
            const vehiculo = await VehiculoRepository.getVehiculoById(id);
            if (!vehiculo) {
                console.log('❌ VehiculoService - getVehiculoById - Vehículo no encontrado');
                return { success: false, message: 'Vehículo no encontrado' };
            }
            console.log('✅ VehiculoService - getVehiculoById - Vehículo obtenido');
            return { success: true, vehiculo };
        } catch (error) {
            console.error('💥 VehiculoService - getVehiculoById - Error:', error);
            throw error;
        }
    }

    async createVehiculo(vehiculoData) {
        try {
            // Validar campos básicos requeridos
            const requiredFields = [
                'id', 'equipo', 'modelo', 'motor', 'potencia', 
                'velocidad_maxima_kmh', 'aceleracion_0_100', 'imagen'
            ];
            
            for (const field of requiredFields) {
                if (!vehiculoData[field]) {
                    return { 
                        success: false, 
                        message: `El campo ${field} es requerido` 
                    };
                }
            }

            // Validar dimensiones
            const dimensionesFields = ['peso', 'longitud', 'anchura', 'altura'];
            if (!vehiculoData.dimensiones) {
                return { success: false, message: 'El campo dimensiones es requerido' };
            }
            for (const field of dimensionesFields) {
                if (!vehiculoData.dimensiones[field]) {
                    return { 
                        success: false, 
                        message: `El campo dimensiones.${field} es requerido` 
                    };
                }
            }

            // Validar rendimiento
            const rendimientoTipos = ['conduccion_normal', 'conduccion_agresiva', 'ahorro_combustible'];
            if (!vehiculoData.rendimiento) {
                return { success: false, message: 'El campo rendimiento es requerido' };
            }

            for (const tipo of rendimientoTipos) {
                if (!vehiculoData.rendimiento[tipo]) {
                    return { 
                        success: false, 
                        message: `El campo rendimiento.${tipo} es requerido` 
                    };
                }

                const rendimientoFields = ['velocidad_promedio_kmh', 'consumo_combustible', 'desgaste_neumaticos'];
                for (const field of rendimientoFields) {
                    if (!vehiculoData.rendimiento[tipo][field]) {
                        return { 
                            success: false, 
                            message: `El campo rendimiento.${tipo}.${field} es requerido` 
                        };
                    }
                }

                const condiciones = ['seco', 'lluvioso', 'extremo'];
                for (const condicion of condiciones) {
                    if (!vehiculoData.rendimiento[tipo].consumo_combustible[condicion]) {
                        return { 
                            success: false, 
                            message: `El campo rendimiento.${tipo}.consumo_combustible.${condicion} es requerido` 
                        };
                    }
                    if (!vehiculoData.rendimiento[tipo].desgaste_neumaticos[condicion]) {
                        return { 
                            success: false, 
                            message: `El campo rendimiento.${tipo}.desgaste_neumaticos.${condicion} es requerido` 
                        };
                    }
                }
            }

            // Validar aerodinámica
            if (!vehiculoData.aerodinamica || !vehiculoData.aerodinamica.tipo) {
                return { success: false, message: 'El campo aerodinamica.tipo es requerido' };
            }

            // Validar presión de neumáticos
            if (!vehiculoData.presion_neumaticos || !vehiculoData.presion_neumaticos.tipo || !vehiculoData.presion_neumaticos.presion) {
                return { success: false, message: 'Los campos presion_neumaticos.tipo y presion_neumaticos.presion son requeridos' };
            }

            // Validar neumáticos
            if (!vehiculoData.neumaticos || !vehiculoData.neumaticos.tipo) {
                return { success: false, message: 'El campo neumaticos.tipo es requerido' };
            }

            const vehiculo = await VehiculoRepository.createVehiculo(vehiculoData);
            console.log('✅ VehiculoService - createVehiculo - Vehículo creado');
            return { success: true, vehiculo };
        } catch (error) {
            console.error('💥 VehiculoService - createVehiculo - Error:', error);
            if (error.code === 11000) {
                return { success: false, message: 'Ya existe un vehículo con ese ID' };
            }
            throw error;
        }
    }

    async updateVehiculo(id, vehiculoData) {
        try {
            const vehiculoExistente = await VehiculoRepository.getVehiculoById(id);
            if (!vehiculoExistente) {
                console.log('❌ VehiculoService - updateVehiculo - Vehículo no encontrado');
                return { success: false, message: 'Vehículo no encontrado' };
            }

            const vehiculo = await VehiculoRepository.updateVehiculo(id, vehiculoData);
            console.log('✅ VehiculoService - updateVehiculo - Vehículo actualizado');
            return { success: true, vehiculo };
        } catch (error) {
            console.error('💥 VehiculoService - updateVehiculo - Error:', error);
            throw error;
        }
    }

    async deleteVehiculo(id) {
        try {
            const vehiculoExistente = await VehiculoRepository.getVehiculoById(id);
            if (!vehiculoExistente) {
                console.log('❌ VehiculoService - deleteVehiculo - Vehículo no encontrado');
                return { success: false, message: 'Vehículo no encontrado' };
            }

            await VehiculoRepository.deleteVehiculo(id);
            console.log('✅ VehiculoService - deleteVehiculo - Vehículo eliminado');
            return { success: true };
        } catch (error) {
            console.error('💥 VehiculoService - deleteVehiculo - Error:', error);
            throw error;
        }
    }
}

module.exports = new VehiculoService(); 