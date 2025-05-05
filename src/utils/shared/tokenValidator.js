import { getUserToken } from './userToken';

const tokenValidator = () => {
    const token = getUserToken();
    if (token) {
        return token;
    }
    return false;
}

const tokenValidatorAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.rol === 'admin';
}

const hasPermission = (permission) => {
    const permisos = JSON.parse(localStorage.getItem('user_permisos') || '{}');
    return permisos[permission] === true;
}

export { tokenValidator, tokenValidatorAdmin, hasPermission };
