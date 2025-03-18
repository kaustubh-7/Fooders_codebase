import Header from './components/Header.jsx';
import Meals from './components/Meals.jsx';
import { CartContextProvider } from './store/CartContext.jsx';
import { UserProgressContextProvider } from './store/UserProgressContext.jsx';
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import { Routes, Route } from "react-router-dom";
import Signup from './components/Signup.jsx';

import Home from './components/Home.jsx';


function App() {
  return (<>
    <UserProgressContextProvider>
      <CartContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/meals" element={<Meals />} />
        </Routes>
        <Cart />
        <Checkout />
      </CartContextProvider>
    </UserProgressContextProvider>
  </>
  );
}

export default App;
