export const getUserRole = async () => {
    console.log('🔍 Iniciando validación de rol de usuario');
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('🔒 Usuario no autenticado - No hay token');
            return null;
        }
        console.log('🔑 Token encontrado, validando con el servidor...');

        const response = await fetch('http://localhost:3000/auth/role', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`❌ Error en la respuesta del servidor: ${response.status}`);
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('📦 Respuesta del servidor:', data);

        if (data.success) {
            console.log(`👤 Rol actual del usuario: ${data.data.rol}`);
            return data.data.rol;
        }
        console.log('❌ No se pudo obtener el rol del usuario - Respuesta del servidor:', data);
        return null;
    } catch (error) {
        console.error('❌ Error al obtener el rol del usuario:', error);
        return null;
    }
};

export const isAdmin = async () => {
    console.log('👑 Verificando si el usuario es administrador...');
    const role = await getUserRole();
    const isAdminUser = role === 'admin';
    console.log(`👑 ¿Es administrador?: ${isAdminUser ? 'Sí' : 'No'}`);
    return isAdminUser;
}; 