/**
 * Utilitario para diagnosticar problemas de conexión con el backend
 */
export class ConnectionTester {
    /**
     * Construye una nueva instancia del tester de conexión
     * @param {string} baseUrl - URL base de la API
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl || import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000';
        this.results = {
            baseUrl: this.baseUrl,
            tests: [],
            overallSuccess: false,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Ejecuta todos los tests de conexión
     * @returns {Promise<object>} Resultados de los tests
     */
    async runAllTests() {
        console.log('🧪 Iniciando diagnóstico de conexión...');
        
        // Probar que la URL base exista
        await this.testBaseUrlExists();
        
        // Probar variables de entorno
        this.testEnvironmentVariables();
        
        // Probar endpoints específicos
        await this.testEndpoint('/api/health', 'Verificación de salud');
        await this.testEndpoint('/api/equipos', 'Listado de equipos');
        await this.testAuthEndpoint('/auth/profile', 'Perfil de usuario (autenticado)');
        
        // Determinar si todos los tests pasaron
        const criticalTests = this.results.tests.filter(test => test.critical);
        this.results.overallSuccess = criticalTests.every(test => test.success);
        
        console.log('✅ Diagnóstico de conexión completado:', 
            this.results.overallSuccess ? 'EXITOSO' : 'FALLIDO');
        
        return this.results;
    }
    
    /**
     * Verifica que la URL base esté accesible
     */
    async testBaseUrlExists() {
        const testName = 'URL Base Accesible';
        console.log(`🧪 Probando: ${testName}`);
        
        try {
            const response = await fetch(this.baseUrl, {
                method: 'HEAD',
                cache: 'no-cache',
                mode: 'cors',
                credentials: 'same-origin',
                redirect: 'follow',
                timeout: 5000 // 5 segundos
            });
            
            const success = response.ok || response.status === 404;
            
            this.results.tests.push({
                name: testName,
                success,
                critical: true,
                details: {
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok
                }
            });
            
            console.log(`${success ? '✅' : '❌'} ${testName}: ${response.status} ${response.statusText}`);
        } catch (error) {
            this.results.tests.push({
                name: testName,
                success: false,
                critical: true,
                details: {
                    error: error.message
                }
            });
            
            console.log(`❌ ${testName}: ${error.message}`);
        }
    }
    
    /**
     * Prueba las variables de entorno disponibles
     */
    testEnvironmentVariables() {
        const testName = 'Variables de Entorno';
        console.log(`🧪 Probando: ${testName}`);
        
        const env = import.meta.env || {};
        const relevantVars = {
            VITE_API_BASE_URL: env.VITE_API_BASE_URL,
            BASE_URL: env.BASE_URL,
            MODE: env.MODE,
            DEV: env.DEV,
            PROD: env.PROD
        };
        
        const success = !!env.VITE_API_BASE_URL;
        
        this.results.tests.push({
            name: testName,
            success,
            critical: true,
            details: {
                variables: relevantVars,
                allVariables: Object.keys(env)
            }
        });
        
        console.log(`${success ? '✅' : '❌'} ${testName}: VITE_API_BASE_URL ${success ? 'encontrado' : 'no encontrado'}`);
    }
    
    /**
     * Prueba un endpoint específico
     * @param {string} path - Ruta del endpoint a probar
     * @param {string} description - Descripción del test
     */
    async testEndpoint(path, description) {
        const testName = description || `Endpoint ${path}`;
        console.log(`🧪 Probando: ${testName}`);
        
        try {
            const url = `${this.baseUrl}${path}`;
            const response = await fetch(url, {
                method: 'GET',
                cache: 'no-cache',
                mode: 'cors',
                credentials: 'same-origin',
                redirect: 'follow'
            });
            
            // Consideramos exitoso si devuelve cualquier respuesta (incluso un 401 para endpoints protegidos)
            const success = response.status !== 404 && response.status !== 0;
            
            this.results.tests.push({
                name: testName,
                success,
                critical: path === '/health',
                details: {
                    url,
                    status: response.status,
                    statusText: response.statusText
                }
            });
            
            console.log(`${success ? '✅' : '❌'} ${testName}: ${response.status} ${response.statusText}`);
        } catch (error) {
            this.results.tests.push({
                name: testName,
                success: false,
                critical: path === '/health',
                details: {
                    url: `${this.baseUrl}${path}`,
                    error: error.message
                }
            });
            
            console.log(`❌ ${testName}: ${error.message}`);
        }
    }
    
    /**
     * Prueba un endpoint que requiere autenticación
     * @param {string} path - Ruta del endpoint a probar
     * @param {string} description - Descripción del test
     */
    async testAuthEndpoint(path, description) {
        const testName = description || `Endpoint Autenticado ${path}`;
        console.log(`🧪 Probando: ${testName}`);
        
        try {
            // Intentar obtener token
            const token = localStorage.getItem('token') || 
                         localStorage.getItem('auth_token') || 
                         localStorage.getItem('accessToken');
            
            if (!token) {
                this.results.tests.push({
                    name: testName,
                    success: false,
                    critical: false,
                    details: {
                        error: 'No hay token disponible para probar endpoints autenticados'
                    }
                });
                
                console.log(`⚠️ ${testName}: No hay token disponible`);
                return;
            }
            
            const url = `${this.baseUrl}${path}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache',
                mode: 'cors',
                credentials: 'same-origin',
                redirect: 'follow'
            });
            
            // Test exitoso si devuelve 200 o 401 (indica que el endpoint existe pero requiere credenciales válidas)
            const success = response.status === 200 || response.status === 401;
            
            this.results.tests.push({
                name: testName,
                success,
                critical: false,
                details: {
                    url,
                    status: response.status,
                    statusText: response.statusText,
                    authenticated: response.status === 200
                }
            });
            
            console.log(`${success ? '✅' : '❌'} ${testName}: ${response.status} ${response.statusText}`);
        } catch (error) {
            this.results.tests.push({
                name: testName,
                success: false,
                critical: false,
                details: {
                    url: `${this.baseUrl}${path}`,
                    error: error.message
                }
            });
            
            console.log(`❌ ${testName}: ${error.message}`);
        }
    }
    
    /**
     * Genera un informe detallado de los problemas
     * @returns {string} Informe en formato texto
     */
    generateReport() {
        let report = '📊 INFORME DE DIAGNÓSTICO DE CONEXIÓN\n';
        report += '=====================================\n\n';
        
        report += `URL Base: ${this.results.baseUrl}\n`;
        report += `Fecha: ${new Date(this.results.timestamp).toLocaleString()}\n`;
        report += `Resultado general: ${this.results.overallSuccess ? '✅ EXITOSO' : '❌ FALLIDO'}\n\n`;
        
        report += 'Pruebas realizadas:\n';
        report += '----------------\n';
        
        this.results.tests.forEach(test => {
            report += `${test.success ? '✅' : '❌'} ${test.name}\n`;
            if (test.details) {
                Object.entries(test.details).forEach(([key, value]) => {
                    if (key !== 'error') {
                        report += `   - ${key}: ${JSON.stringify(value)}\n`;
                    }
                });
                
                if (test.details.error) {
                    report += `   ⚠️ Error: ${test.details.error}\n`;
                }
            }
            report += '\n';
        });
        
        report += '\nRecomendaciones:\n';
        report += '----------------\n';
        
        // Añadir recomendaciones basadas en los resultados
        if (!this.results.overallSuccess) {
            const failedTests = this.results.tests.filter(test => !test.success);
            
            if (failedTests.some(test => test.name.includes('Variables de Entorno'))) {
                report += '• Verifica que el archivo .env existe y contiene VITE_API_BASE_URL\n';
                report += '• Asegúrate de que la aplicación se reinició después de modificar .env\n';
            }
            
            if (failedTests.some(test => test.name.includes('URL Base'))) {
                report += '• Verifica que el servidor backend está en ejecución\n';
                report += '• Comprueba si hay problemas de red o firewall\n';
                report += '• Asegúrate de que la URL base es correcta\n';
            }
            
            if (failedTests.some(test => test.name.includes('Endpoint'))) {
                report += '• Verifica que las rutas API en el backend son correctas\n';
                report += '• Comprueba si ha cambiado la estructura de la API\n';
            }
        }
        
        return report;
    }
}

// Exportar función de utilidad para ejecutar el diagnóstico
export async function runConnectionDiagnostic(baseUrl) {
    const tester = new ConnectionTester(baseUrl);
    const results = await tester.runAllTests();
    console.log(tester.generateReport());
    return results;
} 