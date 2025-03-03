import { useContext } from 'react';
import logoImg from '../assets/logo.jpg';
import Button from './UI/Buttons.jsx';
import CartContext from '../store/CartContext.jsx';
import { UserProgressContext } from '../store/UserProgressContext.jsx';

export default function Header(){
    const cartCtx = useContext(CartContext);
    const progressCtx = useContext(UserProgressContext);

    const totalCartItems = cartCtx.items.reduce((totalItems, items)=> {
        return totalItems + items.quantity
    },
     0) 

    function handleShowCart(){
        progressCtx.showCart();
    }

    return (
        <header id="main-header">
            <div id="title"> 
                <img src={logoImg} alt='food pic'/>
                <h1>FOODERS</h1>
            </div>
            <nav> {/*The <nav> element in HTML is used to define a section of a document intended for navigation links. */}
                <Button textOnly onClick={handleShowCart}>Cart ({totalCartItems}) </Button>
            </nav>
        </header>
    );
}