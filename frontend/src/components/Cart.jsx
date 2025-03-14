import { useContext, useState } from 'react';
import Modal from './UI/Modal.jsx';
import CartContext from '../store/CartContext.jsx';
import { currencyFormatter } from '../util/formatCurrency.js';
import Button from './UI/Buttons.jsx';
import { UserProgressContext } from '../store/UserProgressContext.jsx';
import CartItem from './CartItem.jsx';
import LoginModal from "./loginModal.jsx";
import { AnimatePresence, motion } from "framer-motion";

export default function Cart() {
    const cartCtx = useContext(CartContext);
    const progressCtx = useContext(UserProgressContext);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity * item.price,
        0);

    function handleHideCart() {
        progressCtx.hideCart();
    }

    async function handleGoToCheckout() {
        const res = await fetch("https://fooders-backend-lccf.onrender.com/auth/check", {
            method: "GET",
            credentials: "include",
        });
        const data = await res.json();

        if (!data.authenticated) {
            progressCtx.showLogin();
            return;
        } else {
            progressCtx.showCheckout();
        }
    }

    return <>
            <Modal className='cart' open={progressCtx.progress === 'cart'} onClose={progressCtx.progress === 'cart' ? handleHideCart : null}>
                <h2>Your Cart</h2>
                <motion.ul>
                    <AnimatePresence>
                        {cartCtx.items.map((item) => (
                            <CartItem
                                key={item.id}
                                {...item}
                                onDecrease={() => cartCtx.removeItem(item.id)}
                                onIncrease={() => cartCtx.addItem(item)}
                            />
                        )
                        )}
                    </AnimatePresence>
                </motion.ul>
                <p className='cart-total'>{currencyFormatter.format(cartTotal)}</p>
                <p className='modal-actions'>
                    <Button textOnly onClick={handleHideCart}>Close</Button>
                    {cartCtx.items.length > 0 &&
                        <Button onClick={handleGoToCheckout}>Go to Checkout</Button>}
                </p>

            </Modal> 
            <Modal open={progressCtx.progress === 'login'}>
                <LoginModal onClose={progressCtx.hideLogin} className='cart' />
            </Modal>
    </>
}
