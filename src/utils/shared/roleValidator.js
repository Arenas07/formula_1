export const getUserRole = async () => {
    console.log('🔍 Iniciando validación de rol de usuario');
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('🔒 Usuario no autenticado - No hay token');
            return null;
        }
        console.log('🔑 Token encontrado, validando con el servidor...');

        // Intentar decodificar el token JWT para obtener el rol directamente (fallback)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('📄 Payload del token:', payload);
            
            // Si el payload tiene información del rol, usarla como fallback
            if (payload && payload.rol) {
                console.log(`👤 Rol desde token JWT: ${payload.rol}`);
                return payload.rol;
            }
        } catch (e) {
            console.warn('⚠️ No se pudo decodificar el token JWT:', e);
            // Continuar con la validación del servidor
        }

        // Verificar con el servidor (método preferido)
        const response = await fetch('http://localhost:3000/auth/role', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`❌ Error en la respuesta del servidor: ${response.status}`);
            
            // Si hay error 401/403, intentar obtener el rol desde localStorage como último recurso
            if (response.status === 401 || response.status === 403) {
                const userData = localStorage.getItem('user');
                if (userData) {
                    try {
                        const user = JSON.parse(userData);
                        if (user && user.rol) {
                            console.log(`👤 Rol desde localStorage: ${user.rol}`);
                            return user.rol;
                        }
                    } catch (e) {
                        console.error('❌ Error al obtener rol desde localStorage:', e);
                    }
                }
            }
            
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('📦 Respuesta del servidor:', data);

        if (data.success) {
            console.log(`👤 Rol actual del usuario: ${data.data.rol}`);
            return data.data.rol;
        }
        
        console.log('❌ No se pudo obtener el rol del usuario - Respuesta del servidor:', data);
        
        // Último intento: verificar en localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user && user.rol) {
                    console.log(`👤 Rol desde localStorage (último recurso): ${user.rol}`);
                    return user.rol;
                }
            } catch (e) {
                console.error('❌ Error al obtener rol desde localStorage:', e);
            }
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error al obtener el rol del usuario:', error);
        
        // Último intento: verificar en localStorage si hubo error en la petición
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user && user.rol) {
                    console.log(`👤 Rol desde localStorage (error fallback): ${user.rol}`);
                    return user.rol;
                }
            } catch (e) {
                console.error('❌ Error al obtener rol desde localStorage:', e);
            }
        }
        
        return null;
    }
};

export const isAdmin = async () => {
    console.log('👑 Verificando si el usuario es administrador...');
    
    // Verificar primero en localStorage para una respuesta más rápida
    try {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user && user.rol === 'admin') {
                console.log('👑 Usuario es administrador (según localStorage)');
                return true;
            }
        }
    } catch (e) {
        console.warn('⚠️ Error al leer datos de usuario de localStorage:', e);
    }
    
    // Verificar con el servidor o token JWT
    const role = await getUserRole();
    const isAdminUser = role === 'admin';
    console.log(`👑 ¿Es administrador según API/JWT?: ${isAdminUser ? 'Sí' : 'No'}`);
    return isAdminUser;
};

// Función adicional para verificar permisos específicos
export const hasPermission = (permission) => {
    // Primero verificar si es admin
    try {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user && user.rol === 'admin') {
                // Los administradores tienen todos los permisos
                return true;
            }
            
            // Verificar permisos específicos
            if (user && user.permisos && user.permisos[permission]) {
                return true;
            }
        }
    } catch (e) {
        console.error('Error al verificar permisos:', e);
    }
    
    return false;
}; 