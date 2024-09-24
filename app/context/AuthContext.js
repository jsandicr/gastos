import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { API_URL, TOKEN_KEY } from '@env';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    
    const [ authState, setAuthState ] = useState({
        token: null,
        authenticated: null
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                axios.defaults.headers.common['Content-Type'] = 'application/json',
                setAuthState({
                    token: token,
                    authenticated: true
                });
            }
        }
        const responseInterceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                if (error.response && error.response.status === 403) { // Si el token no es válido
                    alert("Su sesion expiró")
                    await logout("El token ha expirado. Por favor, inicia sesión de nuevo.");
                }
                return Promise.reject(error);
            }
        );

        loadToken();

        return () => {
            axios.interceptors.response.eject(responseInterceptor); // Limpia el interceptor al desmontar
        };
    }, []);

    const register = async (email, name, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { email, name, password });
            if (response.status === 200) {
                return "Ok"
            }
        } catch (e) {
            if (e.response && e.response.data) {
                return { error: true, msg: e.response.data.msg };
            } else {
                return { error: true, msg: 'Error de conexión o servidor no disponible' };
            }
        }
    };
    
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });

            const data = response.data;
    
            if (response.status === 200) {
                setAuthState({
                    token: data.token,
                    authenticated: true
                });
    
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                await SecureStore.setItemAsync(TOKEN_KEY, data.token);
                await SecureStore.setItemAsync('email', data.email);
            }
    
            return data;
        } catch (e) {
            console.log(e.response)
            if (e.response && e.response.data) {
                return { error: true, msg: e.response.data.msg };
            } else {
                return { error: true, msg: 'Error de conexión o servidor no disponible' };
            }
        }
    };
    

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync('email');
            axios.defaults.headers.common['Authorization'] = ``;
            setAuthState({
                token: null,
                authenticated: false
            });
        } catch (e) {
            return { error: true, msg: e.message };
        }
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
