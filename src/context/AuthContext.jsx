import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { name, email, role: 'user' | 'admin' | 'super-admin' }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse user session:', error);
                localStorage.removeItem('currentUser');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // userData should include role
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const registerUser = (newUser) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find((u) => u.email === newUser.email)) {
            throw new Error('Email already registered');
        }
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after register?
        // login({ ...newUser, role: 'user' }); 
    };

    // Default admin accounts (matching legacy system)
    const defaultAdmins = [
        {
            email: 'admin@codechef-projects.com',
            password: 'Admin@123',
            createdAt: new Date().toISOString(),
            role: 'super-admin'
        },
        {
            email: 'lead@codechef-projects.com',
            password: 'Lead@123',
            createdAt: new Date().toISOString(),
            role: 'admin'
        }
    ];

    // Admin logic
    const getAdmins = () => {
        const stored = JSON.parse(localStorage.getItem('adminAccounts'));
        if (!stored || stored.length === 0) {
            localStorage.setItem('adminAccounts', JSON.stringify(defaultAdmins));
            return defaultAdmins;
        }
        return stored;
    };

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

    const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

    const openLogin = () => { setIsLoginOpen(true); setIsSignupOpen(false); setIsForgotPasswordOpen(false); setIsAdminLoginOpen(false); };
    const closeLogin = () => setIsLoginOpen(false);
    const openSignup = () => { setIsSignupOpen(true); setIsLoginOpen(false); setIsForgotPasswordOpen(false); setIsAdminLoginOpen(false); };
    const closeSignup = () => setIsSignupOpen(false);
    const openForgotPassword = () => { setIsForgotPasswordOpen(true); setIsLoginOpen(false); setIsSignupOpen(false); setIsAdminLoginOpen(false); };
    const closeForgotPassword = () => setIsForgotPasswordOpen(false);
    const openAdminLogin = () => { setIsAdminLoginOpen(true); setIsLoginOpen(false); setIsSignupOpen(false); setIsForgotPasswordOpen(false); };
    const closeAdminLogin = () => setIsAdminLoginOpen(false);

    const openAdminDashboard = () => setIsAdminDashboardOpen(true);
    const closeAdminDashboard = () => setIsAdminDashboardOpen(false);

    return (
        <AuthContext.Provider value={{
            user, loading, login, logout, registerUser, getAdmins,
            isLoginOpen, openLogin, closeLogin,
            isSignupOpen, openSignup, closeSignup,
            isForgotPasswordOpen, openForgotPassword, closeForgotPassword,
            isAdminLoginOpen, openAdminLogin, closeAdminLogin,
            isAdminDashboardOpen, openAdminDashboard, closeAdminDashboard
        }}>
            {children}
        </AuthContext.Provider>
    );
};
