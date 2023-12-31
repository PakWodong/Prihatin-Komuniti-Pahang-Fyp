import { useEffect, useState } from "react";
import axios from "axios";
export const Logout = () => {

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/logout/`, {
                    refresh_token: localStorage.getItem('refresh_token')
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, { withCredentials: true });
                localStorage.clear();
                window.location.href = '/login'
                console.log('logout', data)
                localStorage.clear();
                axios.defaults.headers.common['Authorization'] = null;
                window.location.href = '/login'
            } catch (e) {
                console.log('logout not working')
            }
        })();
    }, []);

    return (
        <div></div>
    )
}