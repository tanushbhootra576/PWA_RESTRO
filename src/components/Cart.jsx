import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
    const { state, dispatch } = useCart();
    const navigate = useNavigate();

    const handleIncrement = (item) => {
        dispatch({ type: "INCREMENT", payload: item });
    };

    const handleDecrement = (item) => {
        dispatch({ type: "DECREMENT", payload: item });
    };

    const handleRemove = (item) => {
        dispatch({ type: "REMOVE", payload: item });
    };

    const handleClearCart = () => {
        dispatch({ type: "CLEAR_CART" });
    };

    const calculateTotal = () => {
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <>
            <Navbar />
            <div className="cart-container">
                <h1>Your Cart</h1>

                {state.items.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any items to your cart yet.</p>
                        <button onClick={() => navigate("/menu")} className="browse-menu-btn">
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {state.items.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img src={item.image || "/images/default-food.png"} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p className="item-price">₹{item.price}</p>
                                    </div>
                                    <div className="item-actions">
                                        <div className="quantity-controls">
                                            <button onClick={() => handleDecrement(item)} className="qty-btn">
                                                -
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button onClick={() => handleIncrement(item)} className="qty-btn">
                                                +
                                            </button>
                                        </div>
                                        <button onClick={() => handleRemove(item)} className="remove-btn">
                                            Remove
                                        </button>
                                    </div>
                                    <div className="item-total">
                                        <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="cart-summary">
                            <h2>Order Summary</h2>
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax (12%)</span>
                                    <span>₹{(calculateTotal() * 0.12).toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery</span>
                                    <span>₹40.00</span>
                                </div>
                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>₹{(calculateTotal() + calculateTotal() * 0.12 + 40).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="cart-actions">
                                <button onClick={handleClearCart} className="clear-cart-btn">
                                    Clear Cart
                                </button>
                                <button onClick={() => navigate("/checkout")} className="checkout-btn">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
