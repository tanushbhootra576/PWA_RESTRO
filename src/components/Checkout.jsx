import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const Checkout = () => {
    const { state, dispatch } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        paymentMethod: "card",
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
    });

    const [errors, setErrors] = useState({});
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
            newErrors.phone = "Phone must be 10 digits";
        }

        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

        if (formData.paymentMethod === "card") {
            if (!formData.cardNumber.trim()) {
                newErrors.cardNumber = "Card number is required";
            } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
                newErrors.cardNumber = "Invalid card number";
            }

            if (!formData.cardExpiry.trim()) {
                newErrors.cardExpiry = "Expiry date is required";
            } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
                newErrors.cardExpiry = "Format must be MM/YY";
            }

            if (!formData.cardCvv.trim()) {
                newErrors.cardCvv = "CVV is required";
            } else if (!/^\d{3,4}$/.test(formData.cardCvv)) {
                newErrors.cardCvv = "CVV must be 3-4 digits";
            }
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Generate random order number
        const generatedOrderNumber = "ORD" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        setOrderNumber(generatedOrderNumber);
        setOrderPlaced(true);

        // Clear cart after successful order
        setTimeout(() => {
            dispatch({ type: "CLEAR_CART" });
        }, 1000);
    };

    const calculateTotal = () => {
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateTax = () => {
        return calculateTotal() * 0.12; // 12% tax
    };

    const calculateGrandTotal = () => {
        return calculateTotal() + calculateTax() + 40; // Add delivery charge
    };

    if (orderPlaced) {
        return (
            <>
                <Navbar />
                <div className="checkout-container">
                    <div className="order-success">
                        <div className="success-icon">✓</div>
                        <h2>Order Placed Successfully!</h2>
                        <p className="order-id">Order ID: <span>{orderNumber}</span></p>
                        <p>Thank you for your order. We have received your order and will process it shortly.</p>
                        <p>A confirmation email has been sent to <strong>{formData.email}</strong></p>

                        <div className="order-details-summary">
                            <h3>Order Summary</h3>
                            <div className="order-summary-items">
                                {state.items.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <span>{item.quantity} x {item.name}</span>
                                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total-line">
                                <span>Subtotal:</span>
                                <span>₹{calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="order-total-line">
                                <span>Tax (12%):</span>
                                <span>₹{calculateTax().toFixed(2)}</span>
                            </div>
                            <div className="order-total-line">
                                <span>Delivery:</span>
                                <span>₹40.00</span>
                            </div>
                            <div className="order-grand-total">
                                <span>Total:</span>
                                <span>₹{calculateGrandTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <button onClick={() => navigate("/")} className="continue-shopping">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="checkout-container">
                <h1>Checkout</h1>

                {state.items.length === 0 ? (
                    <div className="empty-cart-message">
                        <p>Your cart is empty. Add some items before checkout.</p>
                        <button onClick={() => navigate("/menu")} className="shop-now-btn">
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className="checkout-content">
                        <div className="checkout-form-container">
                            <form onSubmit={handleSubmit} className="checkout-form">
                                <h2>Delivery Information</h2>

                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className={errors.name ? "input-error" : ""}
                                    />
                                    {errors.name && <span className="error-message">{errors.name}</span>}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter email address"
                                            className={errors.email ? "input-error" : ""}
                                        />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            className={errors.phone ? "input-error" : ""}
                                        />
                                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter your address"
                                        className={errors.address ? "input-error" : ""}
                                    />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city">City</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Enter city"
                                            className={errors.city ? "input-error" : ""}
                                        />
                                        {errors.city && <span className="error-message">{errors.city}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="zipCode">ZIP Code</label>
                                        <input
                                            type="text"
                                            id="zipCode"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            placeholder="Enter ZIP code"
                                            className={errors.zipCode ? "input-error" : ""}
                                        />
                                        {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                                    </div>
                                </div>

                                <h2>Payment Method</h2>

                                <div className="payment-options">
                                    <div className="payment-option">
                                        <input
                                            type="radio"
                                            id="card"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === "card"}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="card">Credit/Debit Card</label>
                                    </div>

                                    <div className="payment-option">
                                        <input
                                            type="radio"
                                            id="cod"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === "cod"}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="cod">Cash on Delivery</label>
                                    </div>
                                </div>

                                {formData.paymentMethod === "card" && (
                                    <div className="card-details">
                                        <div className="form-group">
                                            <label htmlFor="cardNumber">Card Number</label>
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleChange}
                                                placeholder="1234 5678 9012 3456"
                                                className={errors.cardNumber ? "input-error" : ""}
                                            />
                                            {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="cardExpiry">Expiry Date (MM/YY)</label>
                                                <input
                                                    type="text"
                                                    id="cardExpiry"
                                                    name="cardExpiry"
                                                    value={formData.cardExpiry}
                                                    onChange={handleChange}
                                                    placeholder="MM/YY"
                                                    className={errors.cardExpiry ? "input-error" : ""}
                                                />
                                                {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="cardCvv">CVV</label>
                                                <input
                                                    type="text"
                                                    id="cardCvv"
                                                    name="cardCvv"
                                                    value={formData.cardCvv}
                                                    onChange={handleChange}
                                                    placeholder="123"
                                                    className={errors.cardCvv ? "input-error" : ""}
                                                />
                                                {errors.cardCvv && <span className="error-message">{errors.cardCvv}</span>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="place-order-btn">
                                    Place Order
                                </button>
                            </form>
                        </div>

                        <div className="order-summary">
                            <h2>Order Summary</h2>
                            <div className="summary-items">
                                {state.items.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <div className="item-details">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-quantity">x{item.quantity}</span>
                                        </div>
                                        <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax (12%)</span>
                                    <span>₹{calculateTax().toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery</span>
                                    <span>₹40.00</span>
                                </div>
                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>₹{calculateGrandTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Checkout;