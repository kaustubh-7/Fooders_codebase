import { useContext } from 'react';
import Modal from './UI/Modal.jsx';
import CartContext from '../store/CartContext.jsx';
import { currencyFormatter } from '../util/formatCurrency.js';
import Button from './UI/Buttons.jsx';
import { UserProgressContext } from '../store/UserProgressContext.jsx';
import CartItem from './CartItem.jsx';

export default function Cart() {

    const cartCtx = useContext(CartContext);
    const progressCtx = useContext(UserProgressContext);

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item)=> totalPrice + item.quantity*item.price,
         0);
    
    function handleHideCart(){
        progressCtx.hideCart();
    }

    function handleGoToCheckout(){
        progressCtx.showCheckout();
    }
    

    return <Modal className='cart' open={progressCtx.progress === 'cart'} onClose={progressCtx.progress === 'cart' ? handleHideCart : null}>
        <h2>Your Cart</h2>
        <ul>
            {cartCtx.items.map((item)=>(
                <CartItem 
                key={item.id} 
                {...item} 
                onDecrease={()=> cartCtx.removeItem(item.id) } 
                onIncrease={()=> cartCtx.addItem(item)}
                />
            )
            )}
        </ul>
        <p className='cart-total'>{currencyFormatter.format(cartTotal)}</p>
        <p className='modal-actions'>
            <Button textOnly onClick={handleHideCart}>Close</Button>
            {cartCtx.items.length > 0 && 
            <Button onClick={handleGoToCheckout}>Go to Checkout</Button> }
        </p>
    </Modal>
}