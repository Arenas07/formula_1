const getUserToken = () => {
    const token_id = localStorage.getItem('token_id');
    return token_id;
}

const setUserToken = (token_id) => {
    localStorage.setItem('token_id', token_id);
}

const removeUserToken = () => {
    localStorage.removeItem('token_id');
}

export { getUserToken, setUserToken, removeUserToken };

