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
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 2000
    });
}

function loginBackend(tok, callback) {
    console.info("Calling API")
    getAxiosInstance().post('/api/login/', {token: tok })
        .then(callback)
        .catch(handleError);
}

function logoutBackend(callback) {
    getAxiosInstance().post('/api/logout/')
        .then(callback)
        .catch(handleError);
        
}

function getInteractions(callback) {
    getAxiosInstance().get('/api/interaction/')
        .then(callback)
        .catch(handleError);
}

function getFriends(callback) {
    getAxiosInstance().get('/api/friends/')
        .then(callback)
        .catch(handleError);
}

function postFriend(friend, callback) {
    getAxiosInstance().post('/api/friends/', { name: friend })
        .then(callback)
        .catch(handleError);
}

function postInteraction(data, callback) {
    getAxiosInstance().post('/api/interaction/', data)
        .then(callback)
        .catch(handleError);
}

function getRecommendations(callback) {
    getAxiosInstance().get('/api/recommendation/')
        .then(callback)
        .catch(handleError);
}

function postFeedback(rec_id, feedback_typ, callback) {
    getAxiosInstance().post('/api/recommendation/', 
        {
            feedback_id: rec_id,
            feedback: feedback_typ
        })
        .then(callback)
        .catch(handleError);
}

function getEmailUrl() {
    return API_URL + '/api/email/';
}

export {
    loginBackend,
    logoutBackend,
    getInteractions,
    postInteraction,
    getFriends,
    postFriend,
    getRecommendations,
    postFeedback,
    getEmailUrl
}