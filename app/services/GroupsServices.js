import { API_URL } from '@env';
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

export const loadGroups = async () => {
    const email = await SecureStore.getItemAsync('email');
    if(!email){
        return []
    }
    try {
        const response = await axios.get(`${API_URL}/groups/${email}`);
        return response.data;
    } catch (e) {
        if (e.response && e.response.data) {
            return { error: true, msg: e.response.data.msg };
        } else {
            return { error: true, msg: 'Error de conexión o servidor no disponible' };
        }
    }
}

export const onJoinGroup = async (code) => {
    try {
        const email = await SecureStore.getItemAsync('email');
        if(!email){    
            return {error: true, msg: "Ocurrio un problema"}
        }
        const response = await axios.get(`${API_URL}/groups/join/${code}/${email}`);
        if(response.message != null){
            return {error: true, msg: data.message}
        }
        return response.data;
    } catch (e) {
        if (e.response && e.response.data) {
            return { error: true, msg: e.response.data.msg };
        } else {
            return { error: true, msg: 'Error de conexión o servidor no disponible' };
        }
    }
}

export const onLeaveGroup = async (code) => {
    try {
        const email = await SecureStore.getItemAsync('email');
        if(!email){
            return {error: true, msg: "Ocurrio un problema"}
        }
        const response = await axios.post(`${API_URL}/groups/leave/${code}/${email}`);
        if(response.message != null){
            return {error: true, msg: data.message}
        }
        return response.data;
    } catch (e) {
        if (e.response && e.response.data) {
            return { error: true, msg: e.response.data.msg };
        } else {
            return { error: true, msg: 'Error de conexión o servidor no disponible' };
        }
    }
}

export const onCreateGroup = async (description) => {
    try {
        const email = await SecureStore.getItemAsync('email');
        const requestBody = {
            email,
            description
        };
        const response = await axios.post(`${API_URL}/groups/add`, requestBody);
        return response.data
    } catch (e) {
        if (e.response && e.response.data) {
            return { error: true, msg: e.response.data.msg };
        } else {
            return { error: true, msg: 'Error de conexión o servidor no disponible' };
        }
    }
}
