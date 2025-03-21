import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { URL } from "../url";
import { toast } from 'react-toastify';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, []);

    const getUser = async () => {
        try {
            const res = await axios.get(URL + "/api/auth/refetch");
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
            console.log(err);
        }
    };

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        toast.info("You've been logged out successfully");
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}
