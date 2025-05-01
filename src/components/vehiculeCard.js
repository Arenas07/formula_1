const vehicles = [
    {
        "id": 2,
        "equipo": "Storm Racers",
        "modelo": "SRX-22",
        "motor": "V6 Híbrido",
        "potencia": 870,
        "velocidad_maxima_kmh": 340,
        "aceleracion_0_100": 2.7,
        "pilotos": [103, 104],
        "dimensiones": {
          "peso": 745,
          "longitud": 4980,
          "anchura": 1980,
          "altura": 930
        },
        "rendimiento": {
          "conduccion_normal": {
            "velocidad_promedio_kmh": 215,
            "consumo_combustible": {
              "seco": 2.3,
              "lluvioso": 2.9,
              "extremo": 3.7
            },
            "desgaste_neumaticos": {
              "seco": 1.0,
              "lluvioso": 1.3,
              "extremo": 1.8
            }
          },
          "conduccion_agresiva": {
            "velocidad_promedio_kmh": 275,
            "consumo_combustible": {
              "seco": 3.6,
              "lluvioso": 4.0,
              "extremo": 4.8
            },
            "desgaste_neumaticos": {
              "seco": 1.9,
              "lluvioso": 2.2,
              "extremo": 2.8
            }
          },
          "ahorro_combustible": {
            "velocidad_promedio_kmh": 175,
            "consumo_combustible": {
              "seco": 1.7,
              "lluvioso": 2.0,
              "extremo": 2.6
            },
            "desgaste_neumaticos": {
              "seco": 0.8,
              "lluvioso": 1.0,
              "extremo": 1.4
            }
          }
        },
        "innovaciones": [
          {
            "nombre": "Refrigeración líquida activa",
            "descripcion": "Mantiene la temperatura del motor estable en cualquier clima.",
            "impacto": "Mejora la eficiencia en 5%"
          }
        ],
        "aerodinamica": {
          "tipo": "Media carga aerodinámica"
        },
        "presion_neumaticos": {
          "tipo": "Manual",
          "presion": 1.8
        },
        "neumaticos": {
          "tipo": "Lisos (slicks)"
        }
      }, 
      {
        "id": 3,
        "equipo": "Apex Thunder",
        "modelo": "AT-R3",
        "motor": "V10 Atmosférico",
        "potencia": 1020,
        "velocidad_maxima_kmh": 370,
        "aceleracion_0_100": 2.2,
        "pilotos": [105, 106],
        "dimensiones": {
          "peso": 760,
          "longitud": 5020,
          "anchura": 2020,
          "altura": 940
        },
        "rendimiento": {
          "conduccion_normal": {
            "velocidad_promedio_kmh": 230,
            "consumo_combustible": {
              "seco": 2.7,
              "lluvioso": 3.2,
              "extremo": 4.3
            },
            "desgaste_neumaticos": {
              "seco": 1.3,
              "lluvioso": 1.6,
              "extremo": 2.2
            }
          },
          "conduccion_agresiva": {
            "velocidad_promedio_kmh": 290,
            "consumo_combustible": {
              "seco": 4.0,
              "lluvioso": 4.5,
              "extremo": 5.4
            },
            "desgaste_neumaticos": {
              "seco": 2.2,
              "lluvioso": 2.5,
              "extremo": 3.3
            }
          },
          "ahorro_combustible": {
            "velocidad_promedio_kmh": 190,
            "consumo_combustible": {
              "seco": 1.9,
              "lluvioso": 2.3,
              "extremo": 2.8
            },
            "desgaste_neumaticos": {
              "seco": 1.0,
              "lluvioso": 1.2,
              "extremo": 1.6
            }
          }
        },
        "innovaciones": [
          {
            "nombre": "Chasis de fibra de grafeno",
            "descripcion": "Más resistente y liviano que el carbono tradicional.",
            "impacto": "Reduce el peso en 12 kg"
          },
          {
            "nombre": "Dirección inteligente asistida",
            "descripcion": "Optimiza el giro en curvas cerradas.",
            "impacto": "Aumenta la precisión en curvas"
          }
        ],
        "aerodinamica": {
          "tipo": "Baja carga aerodinámica"
        },
        "presion_neumaticos": {
          "tipo": "Automática",
          "presion": 1.5
        },
        "neumaticos": {
          "tipo": "Mixtos"
        }
      }
]


function generarVehiculos(data){
    const listVehicles = document.getElementById("list__vehicles")
    let template = ""
    const datos = data
    datos.forEach(e => {
        template += `
        <div class="vehicle-container" onClick="openPopup">

        </div>
        `
    });
}
