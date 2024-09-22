import { API_URL } from '@env';
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

export const loadGroups = async () => {
    const email = await SecureStore.getItemAsync('email');
    if(!email){
        return []
    }
    try {
        const response = await fetch(`${API_URL}/groups/${email}`, { //Buscar por id de usuario
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': axios.defaults.headers.common['Authorization']
            }
        });
        let data = await response.json();
        return data;
    } catch (e) {
        return { error: true, msg: e.message };
    }
}

export const onJoinGroup = async (code) => {
    try {
        const email = await SecureStore.getItemAsync('email');
        const response = await fetch(`${API_URL}/groups/join/${code}/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': axios.defaults.headers.common['Authorization']
            }
        });
        let data = await response.json();
        if(data.message != null){
            return {error: data.message}
        }
        return data;
    } catch (e) {
        return { error: true, msg: e.message };
    }
}

export const onCreateGroup = async (description) => {
    try {
        const email = await SecureStore.getItemAsync('email');
        const requestBody = {
            email,
            description
        };
        
        const response = await fetch(`${API_URL}/groups/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': axios.defaults.headers.common['Authorization']
            },
            body: JSON.stringify(requestBody)
        });
        let data = await response.json();
        return data
    } catch (e) {
        return { error: true, msg: e.message };
    }
}
