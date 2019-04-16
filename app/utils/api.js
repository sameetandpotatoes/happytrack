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
        }
    });
}

function loginBackend(tok, callback) {
    getAxiosInstance().post('/api/login/', {token: tok })
        .then(callback)
        .catch(handleError);
}

function logoutBackend(callback) {
    getAxiosInstance().post('/api/logout/')
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
    getAxiosInstance().post('/api/interaction/', 
        {
            loggee_id: data.loggee_id,
            time: data.time,
            social: data.social,
            medium: data.medium,
            reaction: data.reaction,
            description: data.description
        })
        .then(callback)
        .catch(handleError);
}

function getRecommendations(callback) {
    getAxiosInstance().get('/api/recommendation/')
        .then(callback)
        .catch(handleError);
}

function postRecommendation(data, callback) {
    getAxiosInstance().post('/api/recommendation/', 
        {
            feedback_id: 0,
            feedback: ''
        })
        .then(callback)
        .catch(handleError);
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