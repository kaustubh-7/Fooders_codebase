import { useContext, useActionState, useState, useEffect } from 'react';
import Modal from './UI/Modal.jsx';
import CartContext from '../store/CartContext.jsx';
import { currencyFormatter } from '../util/formatCurrency.js';
import Input from './UI/Input.jsx';
import Button from './UI/Buttons.jsx';
import { UserProgressContext } from '../store/UserProgressContext.jsx';
import useHttp from '../hooks/useHttp.js';
import Error from './Error.jsx';

const postConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
};

export default function Checkout() {

    const cartCtx = useContext(CartContext);
    const progressCtx = useContext(UserProgressContext);
    const [userInfo, setUserInfo]= useState(null);

    const { data,
        error,
        sendRequest,
        clearData
    } = useHttp('https://fooders-backend-lccf.onrender.com/orders', postConfig)


    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity * item.price,
        0
    );

    function handleClose() {
        progressCtx.hideCheckout();
    }

    function handleFinish() {
        progressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch("https://fooders-backend-lccf.onrender.com/user/profile", {
                    method: "GET",
                    credentials: "include",
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
    
                const data = await response.json();
            
                setUserInfo(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    
        if (progressCtx.progress === 'checkout') {
            fetchUserData();
        };
    }, [progressCtx.progress]);

{/* React's re-rendering happens between JavaScript's execution cycles, not while JavaScript is actively running. Let's break this down:
JavaScript runs on a single thread, meaning it can only do one thing at a time.
When you trigger a state change in React (like setting isSubmitting = true), React doesn't re-render the UI instantly.
Instead, it schedules the re-render to happen after the current JavaScript execution finishes.
Without async/await: If you don’t pause JavaScript (e.g., the code keeps running without waiting), 
React might not have enough time to re-render the UI before the next steps in your code execute.
With async/await: JavaScript pauses at the await, giving React the opportunity to process the state change and re-render the UI before the function continues.*/}
    async function handleSubmit(prevState, fd) {
        await sendRequest(JSON.stringify({
            order: {
                items: cartCtx.items,
            },
        })
        );
    }
    const [formState, formAction, isSubmitting] = useActionState(handleSubmit, null);

    let actions = (
        <>
            <Button type='button' textOnly onClick={handleClose}>Close</Button>
            <Button >Submit Order?</Button>
        </>
    );


    if (isSubmitting) {
        actions = (<span>Sending order data...</span>);
    }

    if (data && !error) {
        return <Modal open={progressCtx.progress === 'checkout'} onClose={handleClose} >
            <h2>Success!</h2>
            <p>Your order was submitted successfully.</p>
            <p>We will connect to you shorlty for more details via email.</p>
            <p className='modal-actions'>
                <Button onClick={handleFinish}>Ok</Button>
            </p>
        </Modal>
    }

   

    return <Modal open={progressCtx.progress === 'checkout'} onClose={handleClose}>
        <form action={formAction}>
            <h2>Checkout</h2>
            <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
            <p>Ordered by: {userInfo?.fullName}</p>
            <p>Delivering to: {userInfo?.address}</p>
            
            {error && <Error title='Failed to submit order' message={error} />}
            <p className='modal-actions'>
                {actions}
            </p>
        </form>
    </Modal>
}
