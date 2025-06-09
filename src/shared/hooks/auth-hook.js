import { useCallback, useEffect, useState } from "react";


let logoutTimer;
export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationTime, setTokenExpirationTime] = useState();
    const [userId, setUserId] = useState(false);

    console.log('tokenExpirationTime from state =>', tokenExpirationTime)
    const login = useCallback((uid, token, expirationTime) => {
        // this func is for  logIn, if user has stored token it will use the stored tokenExpiration time and if user login first time then the expirationTime will  be added by creating or getting time by new Date() method.
        setToken(token);
        setUserId(uid)
        const tokenExpirationTime = expirationTime || new Date(new Date().getTime() + 1000 * 60 * 60 * 2);
        console.log('tokenExpirationTime in funcation =>', tokenExpirationTime)

        setTokenExpirationTime(tokenExpirationTime)

        localStorage.setItem('userData', JSON.stringify({
            userId: uid, token: token, expiration: tokenExpirationTime.toISOString()
        }))
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationTime(null);
        setUserId(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        // this func is for trigger auto logout when time expires
        if (token && tokenExpirationTime) {
            const remainingTokenTime = tokenExpirationTime.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTokenTime);
            console.log('logoutTimer if =>', logoutTimer)
        } else {
            clearTimeout(logoutTimer);
            console.log('logoutTimer in else =>', logoutTimer)
        }

    }, [token, logout, tokenExpirationTime])

    useEffect(() => {
        // this func is for auto login 
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login])

    return { token, login, logout, userId };
};