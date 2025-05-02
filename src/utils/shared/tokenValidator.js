import { getUserToken } from './userToken';


const tokenValidator = () => {
    const token = getUserToken();
    if (token) {
        return token;
    }
    return false;
}

const tokenValidatorAdmin = () => {
    const token = getUserToken();
    if (token == 1010) {
        return true;
    }
    return false;
}

export { tokenValidator, tokenValidatorAdmin };
