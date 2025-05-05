// Utilidad para depurar problemas de autenticación
export function checkAuthentication() {
    const auth = {
        token: localStorage.getItem('token'),
        auth_token: localStorage.getItem('auth_token'),
        user: localStorage.getItem('user')
    };
    
    console.log('=== ESTADO DE AUTENTICACIÓN ===');
    console.log('Token:', auth.token ? `${auth.token.substring(0, 15)}...` : 'No encontrado');
    console.log('Auth Token:', auth.auth_token ? `${auth.auth_token.substring(0, 15)}...` : 'No encontrado');
    console.log('Usuario:', auth.user ? JSON.parse(auth.user).email : 'No encontrado');
    console.log('Autenticado:', !!(auth.token || auth.auth_token));
    
    return !!(auth.token || auth.auth_token);
}

// Función para almacenar los datos de autenticación en todos los formatos posibles
export function storeAuthData(data) {
    console.log('Almacenando datos de autenticación:', data);
    
    // Guardar token en múltiples formatos para compatibilidad
    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('auth_token', data.token);
    } else if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('auth_token', data.access_token);
    } else if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('auth_token', data.data.token);
    }
    
    // Guardar datos de usuario
    const user = data.user || (data.data && data.data.user);
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
}

// Función para limpiar todos los datos de autenticación
export function clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    console.log('Datos de autenticación eliminados');
} 