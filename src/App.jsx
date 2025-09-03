import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Menu from "./components/Menu";
import Contact from "./components/Contact";
import Services from "./components/Services";
import Bookings from "./components/Bookings";
import OfferCoupons from "./components/OfferCoupons";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import "./App.css";
import { CartProvider } from "./context/CartContext";
import UpdateNotification from "./components/UpdateNotification";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <UpdateNotification />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/offer-coupons" element={<OfferCoupons />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;