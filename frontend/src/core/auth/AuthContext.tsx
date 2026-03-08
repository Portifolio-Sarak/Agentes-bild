import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import api, { authApi, UserProfile } from '../../shared/services/api';

interface AuthContextType {
    user: UserProfile | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('agentes_auth_token') || sessionStorage.getItem('agentes_auth_token')
    );
    const [loading, setLoading] = useState(true);

    // Load user on startup or token change
    useEffect(() => {
        const fetchMe = async () => {
            if (token) {
                try {
                    const profile = await authApi.getProfile();
                    setUser(profile);
                } catch (e) {
                    console.error("Error loading profile:", e);
                    logout();
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        fetchMe();
    }, [token]);

    const login = async (identification: string, password?: string) => {
        try {
            // No backend, o campo 'email' é usado para o identificador (pode ser o nome 'Igor')
            const response = await authApi.login({ email: identification, password });
            const { access_token, user_id, username } = response;

            localStorage.setItem('agentes_auth_token', access_token);
            localStorage.setItem('agentes_user_id', user_id);
            localStorage.setItem('agentes_username', username);

            setToken(access_token);
            return { success: true };
        } catch (error: any) {
            console.error('Login failed:', error);
            const message = error.response?.data?.detail || 'Usuário ou senha inválidos.';
            return { success: false, error: message };
        }
    };

    const logout = () => {
        localStorage.removeItem('agentes_auth_token');
        localStorage.removeItem('agentes_user_id');
        localStorage.removeItem('agentes_username');
        sessionStorage.removeItem('agentes_auth_token');
        sessionStorage.removeItem('agentes_user_id');
        sessionStorage.removeItem('agentes_username');
        setToken(null);
        setUser(null);
    };

    const value = useMemo(() => ({
        user,
        token,
        loading,
        login,
        logout
    }), [user, token, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
