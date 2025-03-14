import { currencyFormatter } from "../util/formatCurrency.js";
import { AnimatePresence, motion } from "framer-motion";

export default function CartItem({ name, quantity, price, onIncrease, onDecrease }){
    return <motion.li layout
            exit={{ y: -30, opacity: 0, transition: { duration: 0.3 } }} // Exit works now
            initial={{ opacity: 0, y: 20 }} // Enter animation
            animate={{ opacity: 1, y: 0 }}               
            className="cart-item">
        <p>
            {name} - {quantity} X {currencyFormatter.format(price)}
        </p>
        <p className="cart-item-actions">
            <button onClick={onDecrease}>-</button>
            <span>{quantity}</span>
            <button onClick={onIncrease}>+</button>
        </p>
    </motion.li>
}