/* Funciones para interacción con la API de asignaturas */
import axios from 'axios';


/* Función para obtener la lista de asignaturas asociadas a un usuario */
const getUserSubjects = async (currentUser, accessToken) => {
    if (currentUser === undefined || accessToken === undefined) {
        window.location.replace('http://localhost:3000/signIn');
        return;
    }

    let userId = currentUser.id;
    
    try {
        let response = await axios.get('/users/' + userId + '/subjects/', {
            headers: {
                Authorization: accessToken
            }
        });

        return response;

    } catch (error) {
        if (error.response) {
            // Error enviado por la API
            if (error.response.status === 401 || error.response.status === 403) {
                window.location.replace('http://localhost:3000/signIn');
            }

            if (error.response.status === 404) {
                return error.response;
            }

        }
        return undefined;
    }
};


/* Función para registrar una nueva asignatura */
const addNewSubject = async (currentUser, formData, accessToken) => {
    try {
        if (currentUser === undefined || accessToken === undefined) {
            window.location.replace('http://localhost:3000/signIn');
            return;
        }
    
        let userId = currentUser.id;

        let response = await axios({
            url: '/users/' + userId + '/subjects/',
            method: 'POST',
            headers: {
                Authorization: accessToken
            },
            data: formData
        });

        return response;

    } catch (error) {
        if (error.response) {
            // Error enviado por la API
            if (error.response.status === 401 || error.response.status === 403) {
                window.location.replace('http://localhost:3000/signIn');
            }

            if (error.response.status === 404) {
                return error.response;
            }

            return error.response;

        }
        return undefined;
    }
}

export {
    getUserSubjects,
    addNewSubject
};