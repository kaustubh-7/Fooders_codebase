import { createContext, useState } from "react";

export const UserProgressContext = createContext({
    progress: '',
    Authenticated: false,
    showCart: () => {},
    hideCart: () => {},
    showCheckout: () => {},
    hideCheckout: () => {},
    showSignup: () => {},
    hideSignup: () => {},
    showLogin: () => {},
    hideLogin: () => {},
    logoutUser: () => {},
    loginUser: () => {},
    setIsAuthenticated: ()=>{},
    closeAllModals: () => {},
});

export function UserProgressContextProvider({children}){

    const [userProgress, setUserProgress] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function showLogin(){
        setUserProgress('login');
    }

    function hideLogin(){
        setUserProgress('');
    }

    function showSignup(){
        setUserProgress('signup');
    }

    function hideSignup(){
        setUserProgress('');
    }

    function showCart(){
        setUserProgress('cart');
    }
    function hideCart(){
        setUserProgress('');
    }

    function showCheckout(){
        setUserProgress('checkout');
    }
    function hideCheckout(){
        setUserProgress('');
    }
    function closeAllModals() {
        setUserProgress('');  
    }

    async function logoutUser() {
        const res = await fetch("https://fooders-backend-lccf.onrender.com/logout", { 
        method: "POST", 
        credentials: "include"
    });

    if (res.ok) {
        setIsAuthenticated(false);
        console.log("Logged out successfully");
    } else {
        console.error("Logout failed");
    }
}

    async function loginUser() {
        showLogin();      
    }

    const userProgressContextValue = {
        progress: userProgress,
        Authenticated: isAuthenticated,
        showCart,
        hideCart,
        showCheckout,
        hideCheckout,
        showSignup,
        hideSignup,
        showLogin,
        hideLogin,
        logoutUser,
        loginUser,
        setIsAuthenticated,
        closeAllModals
    }

    return <UserProgressContext value={userProgressContextValue}>{children}</UserProgressContext>
}
