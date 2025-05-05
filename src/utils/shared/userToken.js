const getUserToken = () => {
    const token = localStorage.getItem('token');
    return token;
}

const setUserToken = (token) => {
    localStorage.setItem('token', token);
}

const removeUserToken = () => {
    localStorage.removeItem('token');
}

export { getUserToken, setUserToken, removeUserToken };

