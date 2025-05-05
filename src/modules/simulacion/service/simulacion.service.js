const SimulacionRepository = require('../infraestructure/repository/simulacion.repository');
const PilotoRepository = require('../../pilotos/infraestructure/repository/piloto.repository');
const VehiculoRepository = require('../../vehiculo/infraestructure/repository/vehiculo.repository');
const CircuitoRepository = require('../../circuito/infraestructure/repository/circuito.repository');

class SimulacionService {
    async getConfiguraciones(usuario_id) {
        try {
            const configuraciones = await SimulacionRepository.getConfiguraciones(usuario_id);
            if (configuraciones.length === 0) {
                return { 
                    success: false, 
                    message: 'No hay configuraciones disponibles para este usuario' 
                };
            }
            return { 
                success: true, 
                configuraciones 
            };
        } catch (error) {
            console.error('💥 SimulacionService - getConfiguraciones - Error:', error);
            throw error;
        }
    }

    async getConfiguracionById(id, usuario_id) {
        try {
            const configuracion = await SimulacionRepository.getConfiguracionById(id, usuario_id);
            if (!configuracion) {
                return { 
                    success: false, 
                    message: 'Configuración no encontrada para este usuario' 
                };
            }
            return { 
                success: true, 
                configuracion 
            };
        } catch (error) {
            console.error('💥 SimulacionService - getConfiguracionById - Error:', error);
            throw error;
        }
    }

    async createConfiguracion(data) {
        try {
            // Verificar que el piloto existe
            const piloto = await PilotoRepository.getPilotoById(data.piloto_id);
            if (!piloto) {
                return { 
                    success: false, 
                    message: 'Piloto no encontrado' 
                };
            }

            // Verificar que el vehículo existe
            const vehiculo = await VehiculoRepository.getVehiculoById(data.vehiculo_id);
            if (!vehiculo) {
                return { 
                    success: false, 
                    message: 'Vehículo no encontrado' 
                };
            }

            // Verificar que el circuito existe
            const circuito = await CircuitoRepository.getCircuitoById(data.circuito_id);
            if (!circuito) {
                return { 
                    success: false, 
                    message: 'Circuito no encontrado' 
                };
            }

            const configuracion = await SimulacionRepository.createConfiguracion(data);
            return { 
                success: true, 
                configuracion 
            };
        } catch (error) {
            console.error('💥 SimulacionService - createConfiguracion - Error:', error);
            throw error;
        }
    }

    async updateConfiguracion(id, usuario_id, data) {
        try {
            // Verificar que la configuración existe y pertenece al usuario
            const configuracionExistente = await SimulacionRepository.getConfiguracionById(id, usuario_id);
            if (!configuracionExistente) {
                return { 
                    success: false, 
                    message: 'Configuración no encontrada para este usuario' 
                };
            }

            // Si se actualiza el piloto, verificar que existe
            if (data.piloto_id) {
                const piloto = await PilotoRepository.getPilotoById(data.piloto_id);
                if (!piloto) {
                    return { 
                        success: false, 
                        message: 'Piloto no encontrado' 
                    };
                }
            }

            // Si se actualiza el vehículo, verificar que existe
            if (data.vehiculo_id) {
                const vehiculo = await VehiculoRepository.getVehiculoById(data.vehiculo_id);
                if (!vehiculo) {
                    return { 
                        success: false, 
                        message: 'Vehículo no encontrado' 
                    };
                }
            }

            // Si se actualiza el circuito, verificar que existe
            if (data.circuito_id) {
                const circuito = await CircuitoRepository.getCircuitoById(data.circuito_id);
                if (!circuito) {
                    return { 
                        success: false, 
                        message: 'Circuito no encontrado' 
                    };
                }
            }

            const configuracion = await SimulacionRepository.updateConfiguracion(id, usuario_id, data);
            return { 
                success: true, 
                configuracion 
            };
        } catch (error) {
            console.error('💥 SimulacionService - updateConfiguracion - Error:', error);
            throw error;
        }
    }

    async deleteConfiguracion(id, usuario_id) {
        try {
            const configuracion = await SimulacionRepository.deleteConfiguracion(id, usuario_id);
            if (!configuracion) {
                return { 
                    success: false, 
                    message: 'Configuración no encontrada para este usuario' 
                };
            }
            return { 
                success: true, 
                message: 'Configuración eliminada exitosamente' 
            };
        } catch (error) {
            console.error('💥 SimulacionService - deleteConfiguracion - Error:', error);
            throw error;
        }
    }

    async ejecutarSimulacion(data) {
        try {
            // Obtener datos necesarios para la simulación
            const piloto = await PilotoRepository.getPilotoById(data.piloto_id);
            const vehiculo = await VehiculoRepository.getVehiculoById(data.vehiculo_id);
            const circuito = await CircuitoRepository.getCircuitoById(data.circuito_id);

            if (!piloto || !vehiculo || !circuito) {
                return { 
                    success: false, 
                    message: 'Datos incompletos para la simulación' 
                };
            }

            // Calcular resultados basados en la configuración y datos
            const resultados = this._calcularResultados(data, piloto, vehiculo, circuito);

            // Guardar la configuración y resultados
            const configuracion = await SimulacionRepository.createConfiguracion({
                ...data,
                resultados
            });

            return { 
                success: true, 
                resultados,
                configuracion 
            };
        } catch (error) {
            console.error('💥 SimulacionService - ejecutarSimulacion - Error:', error);
            throw error;
        }
    }

    _calcularResultados(data, piloto, vehiculo, circuito) {
        // Obtener el rendimiento base del vehículo según el tipo de conducción
        const rendimientoBase = vehiculo.rendimiento[data.configuracion.tipo_conduccion];
        
        // Calcular tiempo total basado en la longitud del circuito y velocidad promedio
        const tiempoTotal = this._calcularTiempoTotal(
            circuito.longitud_km,
            rendimientoBase.velocidad_promedio_kmh
        );

        // Calcular consumo de combustible
        const consumoCombustible = this._calcularConsumoCombustible(
            rendimientoBase.consumo_combustible[data.clima],
            circuito.longitud_km
        );

        // Calcular desgaste de neumáticos
        const desgasteNeumaticos = this._calcularDesgasteNeumaticos(
            rendimientoBase.desgaste_neumaticos[data.clima],
            circuito.caracteristicas_tecnicas.desgaste_neumaticos,
            data.configuracion.presion_neumatica
        );

        // Calcular posición final (simplificado)
        const posicionFinal = this._calcularPosicionFinal(
            piloto.estadisticas,
            vehiculo.potencia,
            circuito.caracteristicas_tecnicas.dificultad
        );

        return {
            tiempo_total: tiempoTotal,
            posicion_final: posicionFinal,
            vueltas_completadas: circuito.numero_vueltas,
            consumo_combustible: consumoCombustible,
            desgaste_neumaticos: desgasteNeumaticos
        };
    }

    _calcularTiempoTotal(longitudCircuito, velocidadPromedio) {
        const tiempoEnHoras = longitudCircuito / velocidadPromedio;
        const horas = Math.floor(tiempoEnHoras);
        const minutos = Math.floor((tiempoEnHoras - horas) * 60);
        const segundos = Math.floor(((tiempoEnHoras - horas) * 60 - minutos) * 60);
        const milisegundos = Math.floor((((tiempoEnHoras - horas) * 60 - minutos) * 60 - segundos) * 1000);
        
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}.${milisegundos.toString().padStart(3, '0')}`;
    }

    _calcularConsumoCombustible(consumoBase, longitudCircuito) {
        return Math.min(100, Math.round(consumoBase * longitudCircuito));
    }

    _calcularDesgasteNeumaticos(desgasteBase, dificultadCircuito, presionNeumaticos) {
        const factorDificultad = {
            'baja': 0.8,
            'media': 1.0,
            'alta': 1.2
        }[dificultadCircuito];

        const factorPresion = {
            'baja': 1.2,
            'media': 1.0,
            'alta': 0.8
        }[presionNeumaticos];

        return Math.min(100, Math.round(desgasteBase * factorDificultad * factorPresion));
    }

    _calcularPosicionFinal(estadisticasPiloto, potenciaVehiculo, dificultadCircuito) {
        // Factor de habilidad del piloto (basado en sus estadísticas)
        const factorHabilidad = (
            estadisticasPiloto.victorias * 0.4 +
            estadisticasPiloto.podios * 0.3 +
            estadisticasPiloto.poles * 0.2 +
            estadisticasPiloto.campeonatos_mundiales * 0.1
        ) / 100;

        // Factor de rendimiento del vehículo
        const factorVehiculo = potenciaVehiculo / 1000;

        // Factor de dificultad del circuito
        const factorDificultad = {
            'baja': 1.2,
            'media': 1.0,
            'alta': 0.8
        }[dificultadCircuito];

        // Calcular posición final (entre 1 y 20)
        const puntuacion = (factorHabilidad * 0.6 + factorVehiculo * 0.4) * factorDificultad;
        return Math.max(1, Math.min(20, Math.round(20 - (puntuacion * 10))));
    }
}

module.exports = new SimulacionService(); 