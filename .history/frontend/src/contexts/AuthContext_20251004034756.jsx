import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from '../lib/api'; // Import the new function

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const profileData = await getCurrentUser();
            // The backend returns a nested object: { user: {...}, type: '...' }
            // We flatten it for consistent use throughout the app.
            if (profileData && profileData.user && profileData.type) {
                setUser({ ...profileData.user, type: profileData.type });
            } else {
                setUser(profileData); // Fallback for other cases
            }
        } catch (error) {
            // If the token is invalid, clear everything
            localStorage.removeItem('authToken');
            setUser(null);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchUser().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (token, userType) => {
        localStorage.setItem('authToken', token);
        // Set a temporary user object consistent with the final flattened structure
        setUser({ type: userType }); 
        await fetchUser(); // Fetch full user details
        return true;
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    const isAuthenticated = () => !!user;

    const value = { user, setUser, login, logout, loading, isAuthenticated };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};