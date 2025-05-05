import { runConnectionDiagnostic } from './connectionTester.js';

class DiagnosticView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.results = null;
        this.isRunning = false;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                h1 {
                    color: #1e3a8a;
                    margin-bottom: 1rem;
                    text-align: center;
                }
                
                .subtitle {
                    color: #6b7280;
                    text-align: center;
                    margin-bottom: 2rem;
                }
                
                .card {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                }
                
                .actions {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                
                button {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 5px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                
                .primary-button {
                    background-color: #2563eb;
                    color: white;
                }
                
                .primary-button:hover {
                    background-color: #1d4ed8;
                }
                
                .secondary-button {
                    background-color: #6b7280;
                    color: white;
                }
                
                .secondary-button:hover {
                    background-color: #4b5563;
                }
                
                .results {
                    white-space: pre-wrap;
                    font-family: monospace;
                    padding: 1rem;
                    background: #f3f4f6;
                    border-radius: 5px;
                    overflow-x: auto;
                    max-height: 500px;
                    overflow-y: auto;
                }
                
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                }
                
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top-color: #2563eb;
                    animation: spin 1s ease-in-out infinite;
                }
                
                .env-info {
                    margin-top: 1.5rem;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 1.5rem;
                }
                
                .env-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1rem;
                }
                
                .env-table th, .env-table td {
                    padding: 0.75rem;
                    text-align: left;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .env-table th {
                    background-color: #f3f4f6;
                    font-weight: 600;
                }
                
                .test-summary {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }
                
                .test-badge {
                    padding: 0.5rem 1rem;
                    border-radius: 9999px;
                    color: white;
                    font-weight: 600;
                }
                
                .test-badge.success {
                    background-color: #10b981;
                }
                
                .test-badge.error {
                    background-color: #ef4444;
                }
                
                .tests-list {
                    margin-bottom: 1.5rem;
                }
                
                .test-item {
                    padding: 1rem;
                    border-radius: 5px;
                    margin-bottom: 0.75rem;
                    border-left: 4px solid transparent;
                }
                
                .test-item.success {
                    background-color: #ecfdf5;
                    border-left-color: #10b981;
                }
                
                .test-item.error {
                    background-color: #fef2f2;
                    border-left-color: #ef4444;
                }
                
                .test-title {
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                }
                
                .test-icon {
                    margin-right: 0.5rem;
                }
                
                .test-details {
                    margin-top: 0.5rem;
                    font-size: 0.875rem;
                }
                
                .error-message {
                    color: #ef4444;
                    font-weight: 600;
                    margin-top: 0.5rem;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
            
            <h1>Diagnóstico del Sistema</h1>
            <p class="subtitle">Verifica la conexión con el backend y las configuraciones del sistema</p>
            
            <div class="card">
                <h2>Diagnóstico de Conexión</h2>
                <p>Este diagnóstico verifica la conexión con el backend, las variables de entorno y los endpoints críticos.</p>
                
                <div class="actions">
                    <button id="run-test" class="primary-button">Ejecutar Diagnóstico</button>
                    <button id="view-env" class="secondary-button">Ver Variables de Entorno</button>
                </div>
                
                <div id="results-container">
                    <!-- Aquí se mostrarán los resultados -->
                </div>
            </div>
            
            <div class="card">
                <h2>Información del Sistema</h2>
                <p>Información sobre el entorno y la configuración de la aplicación.</p>
                
                <dl>
                    <dt>URL Base API:</dt>
                    <dd id="api-url">Cargando...</dd>
                    
                    <dt>Navegador:</dt>
                    <dd>${navigator.userAgent}</dd>
                    
                    <dt>Versión Vite:</dt>
                    <dd id="vite-version">No disponible</dd>
                </dl>
                
                <div id="env-container" style="display:none;" class="env-info">
                    <h3>Variables de Entorno</h3>
                    <p>Variables disponibles para la aplicación:</p>
                    
                    <table class="env-table">
                        <thead>
                            <tr>
                                <th>Variable</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody id="env-table-body">
                            <!-- Aquí se mostrarán las variables de entorno -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="card">
                <h2>Soluciones Comunes</h2>
                
                <h3>Problemas de Conexión</h3>
                <ul>
                    <li>Verifica que el servidor backend esté en ejecución</li>
                    <li>Comprueba la URL base de la API en el archivo .env o .env.local</li>
                    <li>Asegúrate de que no hay problemas de red o firewall bloqueando la conexión</li>
                </ul>
                
                <h3>Problemas de Autenticación</h3>
                <ul>
                    <li>Inicia sesión nuevamente para obtener un token fresco</li>
                    <li>Verifica que el token está correctamente almacenado en localStorage</li>
                    <li>Comprueba que el formato del token es correcto</li>
                </ul>
            </div>
        `;
        
        // Mostrar la URL base de la API
        const apiUrl = import.meta.env?.VITE_API_BASE_URL || 'No configurada';
        this.shadowRoot.querySelector('#api-url').textContent = apiUrl;
    }

    setupEventListeners() {
        const runButton = this.shadowRoot.querySelector('#run-test');
        const viewEnvButton = this.shadowRoot.querySelector('#view-env');
        
        runButton.addEventListener('click', async () => {
            if (this.isRunning) return;
            
            this.isRunning = true;
            runButton.disabled = true;
            runButton.textContent = 'Ejecutando...';
            
            const resultsContainer = this.shadowRoot.querySelector('#results-container');
            resultsContainer.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            `;
            
            try {
                const results = await runConnectionDiagnostic();
                this.results = results;
                this.renderResults(results);
            } catch (error) {
                console.error('Error al ejecutar diagnóstico:', error);
                resultsContainer.innerHTML = `
                    <div class="results">
                        <div class="error-message">Error al ejecutar diagnóstico: ${error.message}</div>
                    </div>
                `;
            } finally {
                this.isRunning = false;
                runButton.disabled = false;
                runButton.textContent = 'Ejecutar Diagnóstico';
            }
        });
        
        viewEnvButton.addEventListener('click', () => {
            const envContainer = this.shadowRoot.querySelector('#env-container');
            const envTableBody = this.shadowRoot.querySelector('#env-table-body');
            
            if (envContainer.style.display === 'none') {
                envContainer.style.display = 'block';
                viewEnvButton.textContent = 'Ocultar Variables de Entorno';
                
                // Llenar la tabla con variables de entorno
                envTableBody.innerHTML = '';
                const env = import.meta.env || {};
                
                // Primero mostrar las variables VITE_ que son las más relevantes
                Object.keys(env)
                    .filter(key => key.startsWith('VITE_'))
                    .forEach(key => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${key}</td>
                            <td>${env[key]}</td>
                        `;
                        envTableBody.appendChild(row);
                    });
                
                // Luego otras variables
                Object.keys(env)
                    .filter(key => !key.startsWith('VITE_'))
                    .forEach(key => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${key}</td>
                            <td>${env[key]}</td>
                        `;
                        envTableBody.appendChild(row);
                    });
            } else {
                envContainer.style.display = 'none';
                viewEnvButton.textContent = 'Ver Variables de Entorno';
            }
        });
    }

    renderResults(results) {
        const resultsContainer = this.shadowRoot.querySelector('#results-container');
        
        // Contar pruebas exitosas y fallidas
        const passedTests = results.tests.filter(test => test.success).length;
        const failedTests = results.tests.filter(test => !test.success).length;
        
        resultsContainer.innerHTML = `
            <div class="test-summary">
                <div>
                    <h3>Resultado general: ${results.overallSuccess ? 'Exitoso' : 'Fallido'}</h3>
                </div>
                <div>
                    <span class="test-badge success">${passedTests} exitosas</span>
                    <span class="test-badge error">${failedTests} fallidas</span>
                </div>
            </div>
            
            <div class="tests-list">
                ${results.tests.map(test => `
                    <div class="test-item ${test.success ? 'success' : 'error'}">
                        <div class="test-title">
                            <span class="test-icon">${test.success ? '✅' : '❌'}</span>
                            ${test.name} ${test.critical ? '(crítico)' : ''}
                        </div>
                        
                        ${this.renderTestDetails(test)}
                        
                        ${test.details.error ? `
                            <div class="error-message">Error: ${test.details.error}</div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            
            ${!results.overallSuccess ? `
                <div>
                    <h3>Recomendaciones</h3>
                    <ul>
                        ${this.generateRecommendations(results)}
                    </ul>
                </div>
            ` : ''}
            
            <button id="copy-results" class="secondary-button">Copiar Informe</button>
        `;
        
        // Evento para copiar resultados
        this.shadowRoot.querySelector('#copy-results').addEventListener('click', () => {
            const tester = new ConnectionTester();
            tester.results = results;
            const report = tester.generateReport();
            
            navigator.clipboard.writeText(report)
                .then(() => alert('Informe copiado al portapapeles'))
                .catch(err => console.error('Error al copiar:', err));
        });
    }

    renderTestDetails(test) {
        if (!test.details) return '';
        
        let html = '<div class="test-details">';
        
        Object.entries(test.details).forEach(([key, value]) => {
            if (key !== 'error') {
                if (typeof value === 'object') {
                    html += `<div><strong>${key}:</strong> ${JSON.stringify(value, null, 2)}</div>`;
                } else {
                    html += `<div><strong>${key}:</strong> ${value}</div>`;
                }
            }
        });
        
        html += '</div>';
        return html;
    }

    generateRecommendations(results) {
        const failedTests = results.tests.filter(test => !test.success);
        let recommendations = [];
        
        if (failedTests.some(test => test.name.includes('Variables de Entorno'))) {
            recommendations.push('<li>Verifica que el archivo .env existe y contiene VITE_API_BASE_URL</li>');
            recommendations.push('<li>Asegúrate de que la aplicación se reinició después de modificar .env</li>');
        }
        
        if (failedTests.some(test => test.name.includes('URL Base'))) {
            recommendations.push('<li>Verifica que el servidor backend está en ejecución</li>');
            recommendations.push('<li>Comprueba si hay problemas de red o firewall</li>');
            recommendations.push('<li>Asegúrate de que la URL base es correcta</li>');
        }
        
        if (failedTests.some(test => test.name.includes('Endpoint'))) {
            recommendations.push('<li>Verifica que las rutas API en el backend son correctas</li>');
            recommendations.push('<li>Comprueba si ha cambiado la estructura de la API</li>');
        }
        
        if (failedTests.some(test => test.name.includes('Autenticado'))) {
            recommendations.push('<li>Inicia sesión nuevamente para obtener un token fresco</li>');
            recommendations.push('<li>Verifica los permisos de tu usuario</li>');
        }
        
        return recommendations.join('');
    }
}

customElements.define('diagnostic-view', DiagnosticView); 