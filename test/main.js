const URL_api = 'http://localhost:3000'; // Quitamos la barra al final
const data = {
    "email": "usuario1@ejemplo.com",
    "password": "Contraseña123",
    "nombre": "Nombre Usuario"
}
const route = 'auth/register';

async function register(URL_api, route, data) {
    try {
        const response = await fetch(URL_api + '/' + route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const data_res = await response.json();
        console.log('Respuesta del servidor:', data_res);
        return data_res;
    } catch (error) {
        console.error('Error al registrar:', error);
        throw error;
    }
}

const config = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
}

const route_Register = 'auth/register';

async function formato(URL_api, route, config) {
    const response = await fetch(URL_api + '/' + route, config);
    const data_res = await response.json();
    console.log(data_res);
}

const boton = document.querySelector('.btn');
boton.addEventListener('click', async () => {
    try {
        console.log('Registrando usuario...');
        const resultado = await register(URL_api, 'auth/register', data);
        console.log('Registro completado:', resultado.message);
        alert('Registro completado: ' + resultado.message);
        
    } catch (error) {
        console.error('Error en el proceso de registro:', error);
    }
});



