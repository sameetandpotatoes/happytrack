import axios from 'axios';
import { API_URL } from '../config/env';


function getAxiosInstance() {
    return axios.create({
        baseURL: API_URL,
    });
}

function loginBackend(tok, callback) {
    getAxiosInstance().post('/api/login/', {token: tok })
        .catch(function(error) {
            console.log(error.request);
        })
        .then(callback);
}

function logoutBackend(callback) {
    getAxiosInstance().post('/api/logout/')
        .catch(function(error) {
            console.log(error.request);
        })
        .then(callback);
}

export {
    loginBackend,
    logoutBackend
}