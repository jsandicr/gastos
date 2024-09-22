import { API_URL } from '@env';
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

export const loadExpenses = async (idGroup) => {
    try {
        const response = await fetch(`${API_URL}/expenses/${idGroup}`, { //Buscar por id de grupo
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': axios.defaults.headers.common['Authorization']
            }
        });
        let data = await response.json();
        if (data && Array.isArray(data.expenses)) {
            // Filtrar miembros activos en cada gasto
            data.expenses = data.expenses.map(expense => {
                if (expense.members) {
                    expense.members = expense.members.filter(member => member.isActive);
                }
                return expense;
            });
        }
        return data;
    } catch (e) {
        return { error: true, msg: e.message };
    }
}

export const onAddExpenses = async (idGroup, expenses, description, members) => {
    try {
        const requestBody = {
            expenses,
            description,
            members
        };
        
        const email = await SecureStore.getItemAsync('email');
        const response = await fetch(`${API_URL}/expenses/add/${idGroup}/${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': axios.defaults.headers.common['Authorization']
            },
            body: JSON.stringify(requestBody)
        });
        let data = await response.json();
        return data;
    } catch (e) {
        return { error: true, msg: e.message };
    }
}

export const onUpdateExpenses = async (idGroup, idExpenses, expenses, description, members) => {
    try {
        const requestBody = {
            expenses,
            description,
            members
        };
        
        const email = await SecureStore.getItemAsync('email');
        const response = await fetch(`${API_URL}/expenses/update/${idGroup}/${email}/${idExpenses}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': axios.defaults.headers.common['Authorization']
            },
            body: JSON.stringify(requestBody)
        });
        
        const responseText = await response.text();
        
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            const data = JSON.parse(responseText);
            return data;
        } else {
            return { error: true, msg: 'Unexpected response format' };
        }
    } catch (e) {
        return { error: true, msg: e.message };
    }
};


export const onCloseExpenses = async (idGroup, idExpenses) => {
    try {
        const email = await SecureStore.getItemAsync('email');
        const response = await fetch(`${API_URL}/expenses/close/${idGroup}/${email}/${idExpenses}`, {
            method: 'POST',
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

export const onDeleteExpenses = async (idGroup, idExpenses) => {
    try {
        const email = await SecureStore.getItemAsync('email');
        const response = await fetch(`${API_URL}/expenses/delete/${idGroup}/${email}/${idExpenses}`, {
            method: 'DELETE',
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