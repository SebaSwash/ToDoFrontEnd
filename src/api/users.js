/* Funciones para interacción con la API de usuarios */

import axios from 'axios';

const userAuthentication = async (formData) => {
    let response = await axios.post('/session/', formData);
    return response;
};

const getUserData = async (currentUser, accessToken) => {
    if (currentUser === undefined || accessToken === undefined) {
        window.location.replace('http://localhost:3000/signIn');
        return;
    }
    
    let userId = currentUser.id;

    try {
        let response = await axios.get('/users/' + userId, {
            headers: {
                Authorization: accessToken
        }});

        return response;

    } catch (error) {
        if (error.response) {
            // Error enviado por la API
            if (error.response.status === 401 || error.response.status === 403 || error.response.status === 404) {
                window.location.replace('http://localhost:3000/signIn');
            }
        }
        return undefined;
    }

};

export {
    userAuthentication,
    getUserData
};
