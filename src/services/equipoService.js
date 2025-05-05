import { AuthService } from './login.service';

export class EquipoService {
    constructor() {
        // Verificar si tenemos una URL base configurada en el entorno
        const envBaseUrl = import.meta.env?.VITE_API_BASE_URL;
        
        // Si no hay URL base en variables de entorno, usar localhost como fallback
        this.baseUrl = envBaseUrl || 'http://localhost:3000';
        
        // Imprimir todas las variables de entorno disponibles para diagnóstico
        console.log('🔍 Variables de entorno disponibles:', Object.keys(import.meta.env || {}));
        
        // Log de diagnóstico detallado
        console.log('🌐 EquipoService inicializado con URL base:', this.baseUrl);
        console.log('📊 Datos completos de configuración:', {
            envBaseUrl: envBaseUrl || 'No definido',
            finalBaseUrl: this.baseUrl
        });
        
        this.authService = new AuthService();
    }

    async isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    async getHeaders() {
        try {
            // Obtener el token de localStorage con múltiples opciones
            let token = localStorage.getItem('token') || 
                      localStorage.getItem('auth_token') || 
                      localStorage.getItem('accessToken');
                      
            console.log('🔑 Token obtenido desde localStorage:', token ? `${token.substring(0, 15)}...` : 'Token no encontrado');
            
            if (!token) {
                // Intentar obtener el token desde AuthService como último recurso
                try {
                    token = this.authService.getToken();
                    console.log('🔄 Token obtenido desde AuthService:', token ? 'Token presente' : 'No hay token en AuthService');
                } catch (e) {
                    console.warn('⚠️ Error al obtener token desde AuthService:', e.message);
                }
                
                if (!token) {
                    throw new Error('No hay token de autenticación');
                }
            }
            
            // Construir el header de autorización en el formato esperado exactamente por el backend
            // IMPORTANTE: El espacio después de "Bearer" es crítico
            let authHeader;
            
            // Si el token ya incluye el prefijo "Bearer ", no lo duplicamos
            if (token.startsWith('Bearer ')) {
                authHeader = token;
                console.log('⚠️ Token ya incluye prefijo Bearer, se usará tal cual');
            } else {
                authHeader = `Bearer ${token}`;
                console.log('✅ Se agregó prefijo Bearer al token');
            }
            
            // Crear headers exactamente como los espera el backend
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            };
            
            // Validación para asegurar formato correcto
            if (!headers['Authorization'].startsWith('Bearer ')) {
                console.error('❌ ERROR CRÍTICO: Header de autorización mal formado');
                console.log('🛠️ Reintentando con formato explícito "Bearer [token]"');
                headers['Authorization'] = `Bearer ${token.replace(/^Bearer\s+/i, '')}`;
            }
            
            console.log('📤 Headers preparados:', {
                contentType: headers['Content-Type'],
                authorization: headers['Authorization'].substring(0, 25) + '...',
                authFormat: headers['Authorization'].startsWith('Bearer ') ? 'Formato correcto' : 'FORMATO INCORRECTO'
            });
            
            return headers;
        } catch (error) {
            console.error('❌ Error al obtener headers:', error);
            throw error;
        }
    }

    async getEquipos() {
        try {
            const headers = await this.getHeaders();
            const url = `${this.baseUrl}/api/equipos`;
            console.log('📡 Petición GET a:', url);
            
            // Usar try/catch específico para el fetch para capturar errores de red
            let response;
            try {
                response = await fetch(url, {
                    method: 'GET',
                    headers,
                    // Agregar opciones para evitar caché y mejorar debugging
                    cache: 'no-cache',
                    credentials: 'same-origin'
                });
                console.log('📥 Respuesta recibida:', response.status, response.statusText);
            } catch (fetchError) {
                console.error('❌ Error de red al obtener equipos:', fetchError);
                throw new Error(`Error de red: ${fetchError.message}`);
            }
            
            // Si la respuesta no es OK, manejar diferentes códigos de error
            if (!response.ok) {
                if (response.status === 401) {
                    console.error('🔒 Error de autenticación al obtener equipos');
                }
                
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    console.error('❌ No se pudo extraer JSON del error:', e);
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            let responseData;
            try {
                responseData = await response.json();
                console.log('✅ Datos recibidos:', responseData);
            } catch (jsonError) {
                console.error('❌ Error al parsear JSON:', jsonError);
                throw new Error('Error al procesar la respuesta del servidor');
            }
            
            // Devolver el array de equipos según el formato documentado
            if (responseData.status === 'success' && responseData.data) {
                return responseData.data;
            } else if (Array.isArray(responseData)) {
                return responseData;
            } else {
                // Si la respuesta tiene un formato diferente, intentar extraer los datos
                console.warn('⚠️ Formato de respuesta diferente al esperado:', responseData);
                return responseData.data || responseData.equipos || responseData || [];
            }
        } catch (error) {
            console.error('❌ Error al obtener equipos:', error);
            throw error;
        }
    }

    async getEquipoById(id) {
        try {
            const headers = await this.getHeaders();
            const url = `${this.baseUrl}/api/equipos/${id}`;
            console.log(`📡 Petición GET a: ${url}`);
            
            // Usar try/catch específico para el fetch para capturar errores de red
            let response;
            try {
                response = await fetch(url, {
                    method: 'GET',
                    headers
                });
                console.log('📥 Respuesta recibida:', response.status, response.statusText);
            } catch (fetchError) {
                console.error(`❌ Error de red al obtener equipo ${id}:`, fetchError);
                throw new Error(`Error de red: ${fetchError.message}`);
            }
            
            if (!response.ok) {
                if (response.status === 401) {
                    console.error('🔒 Error de autenticación al obtener equipo');
                }
                
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    console.error('❌ No se pudo extraer JSON del error:', e);
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            let responseData;
            try {
                responseData = await response.json();
                console.log(`✅ Datos de equipo ${id} recibidos:`, responseData);
            } catch (jsonError) {
                console.error('❌ Error al parsear JSON:', jsonError);
                throw new Error('Error al procesar la respuesta del servidor');
            }
            
            // Extraer el equipo según el formato documentado
            if (responseData.status === 'success' && responseData.data) {
                return responseData.data;
            } else {
                // Si la respuesta tiene un formato diferente, devolver el objeto completo
                return responseData;
            }
        } catch (error) {
            console.error(`❌ Error al obtener equipo ${id}:`, error);
            throw error;
        }
    }

    async createEquipo(equipoData) {
        try {
            // Verificar token antes de hacer la petición
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
            if (!token) {
                console.error('❌ No hay token disponible para crear equipo');
                throw new Error('No hay token de autenticación');
            }
            
            // Obtener headers con formato correcto
            const headers = await this.getHeaders();
            
            // Log detallado de la petición para diagnosticar problemas
            console.log('🔐 Verificación de token:', {
                existe: !!token,
                longitud: token.length,
                formato: token.includes('.') ? 'JWT válido' : 'Formato no estándar',
                primeros_caracteres: token.substring(0, 10) + '...'
            });
            
            // Generar un ID numérico basado en timestamp si no se proporciona
            if (!equipoData.id) {
                equipoData.id = parseInt(Date.now().toString().slice(-6));
            }
            
            // Asegurar que el formato cumpla con los requisitos documentados
            const dataToSend = {
                ...equipoData,
                // Asegurarse de que ciertos campos sean numéricos
                campeonatos: Number(equipoData.campeonatos || 0),
                victorias: Number(equipoData.victorias || 0),
                fecha_fundacion: equipoData.fecha_fundacion || new Date().getFullYear()
            };

            const url = `${this.baseUrl}/api/equipos`;
            console.log('📡 Petición POST a:', url);
            console.log('📤 Datos a enviar:', dataToSend);
            
            // Usar try/catch específico para el fetch para capturar errores de red
            let response;
            try {
                const fetchOptions = {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(dataToSend),
                    // Agregar opciones para diagnóstico
                    credentials: 'same-origin',
                    mode: 'cors',
                    cache: 'no-cache',
                    redirect: 'follow'
                };
                
                console.log('🚀 Enviando petición con opciones:', {
                    method: fetchOptions.method,
                    headersKeys: Object.keys(fetchOptions.headers),
                    bodyLength: JSON.stringify(dataToSend).length,
                    url
                });
                
                response = await fetch(url, fetchOptions);
                console.log('📥 Respuesta recibida:', {
                    status: response.status,
                    statusText: response.statusText,
                    headers: [...response.headers.entries()].map(h => `${h[0]}: ${h[1]}`).join(', ')
                });
            } catch (fetchError) {
                console.error('❌ Error de red al crear equipo:', fetchError);
                throw new Error(`Error de red: ${fetchError.message}`);
            }

            // Verificar la respuesta HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    console.error('🔒 Error de autenticación al crear equipo. Detalles:', response.statusText);
                    throw new Error(`No autorizado (401): Verifica tu token de autenticación`);
                }
                
                let errorData;
                try {
                    errorData = await response.json();
                    console.error('❌ Respuesta de error del backend:', errorData);
                } catch (e) {
                    console.error('❌ No se pudo extraer JSON del error:', e);
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            let responseData;
            try {
                responseData = await response.json();
                console.log('✅ Equipo creado exitosamente:', responseData);
            } catch (jsonError) {
                console.error('❌ Error al parsear JSON:', jsonError);
                // Si no hay respuesta JSON pero la petición fue exitosa
                return { success: true, message: 'Equipo creado correctamente' };
            }

            // Extraer datos del equipo creado según el formato documentado
            if (responseData.status === 'success' && responseData.data) {
                return responseData.data;
            }
            return responseData;
        } catch (error) {
            console.error('❌ Error al crear el equipo:', error);
            throw error;
        }
    }

    async updateEquipo(id, equipoData) {
        try {
            // Verificar token antes de hacer la petición
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
            if (!token) {
                console.error('❌ No hay token disponible para actualizar equipo');
                throw new Error('No hay token de autenticación');
            }
            
            const headers = await this.getHeaders();
            
            // Si hay _id como propiedad, quitarlo para evitar problemas al actualizar
            const dataToSend = { ...equipoData };
            if (dataToSend._id) {
                delete dataToSend._id;
            }
            
            // Asegurar que ciertos campos sean numéricos
            if (dataToSend.campeonatos) dataToSend.campeonatos = Number(dataToSend.campeonatos);
            if (dataToSend.victorias) dataToSend.victorias = Number(dataToSend.victorias);
            if (dataToSend.fecha_fundacion) {
                // Si es una fecha en formato YYYY-MM-DD, convertir a año
                if (typeof dataToSend.fecha_fundacion === 'string' && dataToSend.fecha_fundacion.includes('-')) {
                    const date = new Date(dataToSend.fecha_fundacion);
                    if (!isNaN(date.getTime())) {
                        dataToSend.fecha_fundacion = date.getFullYear();
                    }
                }
            }
            
            const url = `${this.baseUrl}/api/equipos/${id}`;
            console.log(`📡 Petición PUT a: ${url}`);
            console.log('📤 Datos a enviar:', dataToSend);
            
            // Usar try/catch específico para el fetch para capturar errores de red
            let response;
            try {
                response = await fetch(url, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(dataToSend)
                });
                console.log('📥 Respuesta recibida:', response.status, response.statusText);
            } catch (fetchError) {
                console.error(`❌ Error de red al actualizar equipo ${id}:`, fetchError);
                throw new Error(`Error de red: ${fetchError.message}`);
            }
            
            // Verificar la respuesta HTTP
            if (!response.ok) {
                if (response.status === 401) {
                    console.error('🔒 Error de autenticación al actualizar equipo');
                }
                
                let errorData;
                try {
                    errorData = await response.json();
                    console.error('❌ Respuesta de error del backend:', errorData);
                } catch (e) {
                    console.error('❌ No se pudo extraer JSON del error:', e);
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            let responseData;
            try {
                responseData = await response.json();
                console.log('✅ Equipo actualizado exitosamente:', responseData);
            } catch (jsonError) {
                console.error('❌ Error al parsear JSON:', jsonError);
                // Si no hay respuesta JSON pero la petición fue exitosa
                return { success: true, message: 'Equipo actualizado correctamente' };
            }
            
            // Extraer el equipo actualizado según el formato documentado
            if (responseData.status === 'success' && responseData.data) {
                return responseData.data;
            }
            return responseData;
        } catch (error) {
            console.error(`❌ Error al actualizar equipo ${id}:`, error);
            throw error;
        }
    }

    async deleteEquipo(id) {
        try {
            // Verificar token antes de hacer la petición
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
            if (!token) {
                console.error('❌ No hay token disponible para eliminar equipo');
                throw new Error('No hay token de autenticación');
            }
            
            const headers = await this.getHeaders();
            const url = `${this.baseUrl}/api/equipos/${id}`;
            console.log(`📡 Petición DELETE a: ${url}`);
            
            // Usar try/catch específico para el fetch para capturar errores de red
            let response;
            try {
                response = await fetch(url, {
                    method: 'DELETE',
                    headers
                });
                console.log('📥 Respuesta recibida:', response.status, response.statusText);
            } catch (fetchError) {
                console.error(`❌ Error de red al eliminar equipo ${id}:`, fetchError);
                throw new Error(`Error de red: ${fetchError.message}`);
            }
            
            if (!response.ok) {
                if (response.status === 401) {
                    console.error('🔒 Error de autenticación al eliminar equipo');
                }
                
                let errorData;
                try {
                    errorData = await response.json();
                    console.error('❌ Respuesta de error del backend:', errorData);
                } catch (e) {
                    console.error('❌ No se pudo extraer JSON del error:', e);
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            let responseData;
            try {
                responseData = await response.json();
                console.log('✅ Equipo eliminado exitosamente:', responseData);
            } catch (jsonError) {
                console.error('❌ Error al parsear JSON:', jsonError);
                // Si no hay respuesta JSON pero la petición fue exitosa
                return { success: true, message: 'Equipo eliminado correctamente' };
            }
            
            return responseData;
        } catch (error) {
            console.error(`❌ Error al eliminar equipo ${id}:`, error);
            throw error;
        }
    }

    // Método para verificar la conexión con el backend
    async testConnection() {
        try {
            console.log('🧪 Probando conexión con el backend...');
            
            // Probar tanto la ruta de health como endpoints base
            const healthUrl = `${this.baseUrl}/api/health`;
            const equiposUrl = `${this.baseUrl}/api/equipos`;
            const authUrl = `${this.baseUrl}/auth/login`;
            
            console.log('📡 URLs de prueba:', {
                healthUrl,
                equiposUrl,
                authUrl
            });
            
            // Intentar primero con el endpoint de auth por ser normalmente más liviano
            try {
                const authResponse = await fetch(authUrl, {
                    method: 'HEAD', // Solo verificar disponibilidad, no necesitamos el cuerpo
                    cache: 'no-cache'
                });
                
                console.log('📡 Test de conexión (auth):', {
                    status: authResponse.status,
                    statusText: authResponse.statusText,
                    ok: authResponse.ok || authResponse.status === 401 // 401 es normal para rutas auth sin credenciales
                });
                
                // Un 401 es normal en rutas de auth cuando no hay credenciales
                if (authResponse.status === 401 || authResponse.ok) {
                    return {
                        success: true,
                        endpoint: 'auth',
                        authenticated: false,
                        message: 'Conectado al servidor (endpoint de autenticación)'
                    };
                }
            } catch (authError) {
                console.warn('⚠️ No se pudo conectar al endpoint de auth:', authError.message);
            }
            
            // Si auth falla, intentar con el endpoint de health
            try {
                const healthResponse = await fetch(healthUrl, {
                    method: 'GET',
                    cache: 'no-cache'
                });
                
                console.log('📡 Test de conexión (health):', {
                    status: healthResponse.status,
                    statusText: healthResponse.statusText,
                    ok: healthResponse.ok
                });
                
                if (healthResponse.ok) {
                    return {
                        success: true,
                        endpoint: 'health',
                        message: 'Conexión exitosa con el endpoint de health'
                    };
                }
                
                // Si devuelve 401, el servidor está respondiendo pero requiere autenticación
                if (healthResponse.status === 401) {
                    return {
                        success: true,
                        endpoint: 'health',
                        authenticated: false,
                        message: 'El servidor está accesible pero requiere autenticación'
                    };
                }
            } catch (healthError) {
                console.warn('⚠️ No se pudo conectar al endpoint de health:', healthError.message);
            }
            
            // Finalmente intentar con el endpoint de equipos
            try {
                const equiposResponse = await fetch(equiposUrl, {
                    method: 'GET',
                    cache: 'no-cache'
                });
                
                console.log('📡 Test de conexión (equipos):', {
                    status: equiposResponse.status,
                    statusText: equiposResponse.statusText,
                    ok: equiposResponse.ok
                });
                
                // Un 401 en equipos es buena señal, significa que la API está en línea
                if (equiposResponse.status === 401 || equiposResponse.ok) {
                    return {
                        success: true,
                        endpoint: 'equipos',
                        authenticated: equiposResponse.ok,
                        message: 'Conexión establecida con el endpoint de equipos'
                    };
                }
            } catch (equiposError) {
                console.error('❌ Error al conectar con equipos:', equiposError);
                
                // Si llegamos aquí, todos los intentos fallaron
                return {
                    success: false,
                    message: 'No se pudo establecer conexión con ningún endpoint'
                };
            }
            
            return {
                success: false,
                message: 'No se pudo establecer conexión con ninguno de los endpoints probados'
            };
        } catch (error) {
            console.error('❌ Error general en test de conexión:', error);
            return {
                success: false,
                message: `Error general: ${error.message}`,
                error
            };
        }
    }
}