import { createContext, useState } from "react";

export const UserProgressContext = createContext({
    progress: '',
    showCart: () => {},
    hideCart: () => {},
    showCheckout: () => {},
    hideCheckout: () => {},
});

export function UserProgressContextProvider({children}){

    const [userProgress, setUserProgress] = useState('');

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

    const userProgressContextValue = {
        progress: userProgress,
        showCart,
        hideCart,
        showCheckout,
        hideCheckout
    }

    return <UserProgressContext value={userProgressContextValue}>{children}</UserProgressContext>
}