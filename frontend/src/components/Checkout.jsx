import { useContext, useActionState } from 'react';
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

    const { data,
        error,
        sendRequest,
        clearData
    } = useHttp('https://fooders-backend-lqyp.onrender.com', postConfig)


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
{/* React's re-rendering happens between JavaScript's execution cycles, not while JavaScript is actively running. Let's break this down:
JavaScript runs on a single thread, meaning it can only do one thing at a time.
When you trigger a state change in React (like setting isSubmitting = true), React doesn't re-render the UI instantly.
Instead, it schedules the re-render to happen after the current JavaScript execution finishes.
Without async/await: If you don’t pause JavaScript (e.g., the code keeps running without waiting), 
React might not have enough time to re-render the UI before the next steps in your code execute.
With async/await: JavaScript pauses at the await, giving React the opportunity to process the state change and re-render the UI before the function continues.*/}
    async function handleSubmit(prevState, fd) {

        const customerData = Object.fromEntries(fd.entries());

        await sendRequest(JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData
            },
        })
        );
    }

    const [formState, formAction, isSubmitting] = useActionState(handleSubmit, null);
    console.log(isSubmitting);

    let actions = (
        <>
            <Button type='button' textOnly onClick={handleClose}>Close</Button>
            <Button >Submit Order</Button>
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

            <Input label='Full Name' type='text' id='name' />
            <Input label='E-Mail' type='email' id='email' />
            <Input label='Address' type='text' id='street' />
            <div className='control-row'>
                <Input label='Postal Code' type='text' id='postalCode' />
                <Input label='City' type='text' id='city' />
            </div>
            {error && <Error title='Failed to submit order' message={error} />}
            <p className='modal-actions'>
                {actions}
            </p>
        </form>
    </Modal>
}
