import { useContext } from "react";
import { currencyFormatter } from "../util/formatCurrency.js";
import Button from './UI/Buttons.jsx';
import CartContext from "../store/CartContext.jsx";

export default function MealItem({meal}){
    const {addItem}= useContext(CartContext);

    function addMealToCart(){
        addItem(meal);
    }

    return <li className="meal-item">
        <article>
            <img src={`http://localhost:3000/${meal.image}`} alt={meal.name} />
            <div>
             <h3>{meal.name}</h3>
             <p className="meal-item-price">{currencyFormatter.format(meal.price)}</p> {/* the format method is used to format a number according to the settings specified when creating the NumberFormat object */}
             <p className="meal-item-description">{meal.description}</p>
            </div>
            <p className="mean-item-actions">
                <Button onClick={addMealToCart}> Add to Cart</Button>
            </p>
        </article>
    </li>
}