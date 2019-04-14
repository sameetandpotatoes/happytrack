import axios from 'axios';
import { API_URL } from '../config/env';


function handleError(err) {
    if (err.request) {
        console.error(err.request);
    } else {
        console.error(err);
    }
}

function getAxiosInstance() {
    return axios.create({
        baseURL: API_URL,
    });
}

function loginBackend(tok, callback) {
    getAxiosInstance().post('/api/login/', {token: tok })
        .catch(handleError)
        .then(callback);
}

function logoutBackend(callback) {
    getAxiosInstance().post('/api/logout/')
        .catch(handleError)
        .then(callback);
}

function getFriends(callback) {
    getAxiosInstance().get('/api/friends/')
        .catch(handleError)
        .then(callback);
}

function postFriend(friend, callback) {
    getAxiosInstance().post('/api/friends/', { name: friend })
        .catch(handleError)
        .then(callback);
}

function postInteraction(data, callback) {
    getAxiosInstance().post('/api/interaction/', 
        {
            loggee_id: data.loggee_id,
            time: data.time,
            social: data.social,
            medium: data.medium,
            description: data.description
        })
        .catch(handleError)
        .then(callback);
}

function getRecommendations(callback) {
    getAxiosInstance().get('/api/recommendation/')
        .catch(handleError)
        .then(callback);
}

function postRecommendation(data, callback) {
    getAxiosInstance().post('/api/recommendation/', 
        {
            feedback_id: 0,
            feedback: ''
        })
        .catch(handleError)
        .then(callback);
}

export {
    loginBackend,
    logoutBackend,
    postInteraction,
    getFriends,
    postFriend,
    getRecommendations,
    postRecommendation
}