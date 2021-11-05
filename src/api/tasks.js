/* Funciones para interacción con la API de tareas */
import axios from 'axios';

/* Función para obtener todas las tareas asociadas a un usuario */
const getUserTaskList = async (currentUser, accessToken) => {
    if (currentUser === undefined || accessToken === undefined) {
        window.location.replace('http://localhost:3000/signIn');
        return;
    }

    let userId = currentUser.id;

    try {
        let response = await axios.get('/users/' + userId + '/tasks/', {
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

            return error.response;

        }
        return undefined;
    }
};

/* Función para registrar una nueva tarea asociada a un usuario */
const addUserTask = async (currentUser, accessToken, formData) => {
    if (currentUser === undefined || accessToken === undefined) {
        window.location.replace('http://localhost:3000/signIn');
        return;
    }

    let userId = currentUser.id;

    try {
        let response = await axios({
            url: '/users/' + userId + '/tasks/',
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
};

/* Función para modificar una tarea existente */
const modifyUserTask = async (currentUser, accessToken, formData) => {
    if (currentUser === undefined || accessToken === undefined) {
        window.location.replace('http://localhost:3000/signIn');
        return;
    }

    let userId = currentUser.id;

    try {
        let response = await axios({
            url: '/users/' + userId + '/tasks/' + formData.taskId + '/',
            method: 'PUT',
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

const removeUserTask = async (currentUser, taskId, accessToken) => {
    if (currentUser === undefined || accessToken === undefined) {
        window.location.replace('http://localhost:3000/signIn');
        return;
    }

    let userId = currentUser.id;

    try {
        let response = await axios({
            url: '/users/' + userId + '/tasks/' + taskId + '/',
            method: 'DELETE',
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

            return error.response;

        }
        return undefined;
    }
};

export {
    getUserTaskList,
    addUserTask,
    modifyUserTask,
    removeUserTask
};