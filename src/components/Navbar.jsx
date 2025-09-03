import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { state } = useCart();

    const cartItemsCount = state.items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
            <div className="navbar-container">
                <Link to="/" className="logo">
                    <img src="/images/logo.png" alt="Restro" />
                </Link>

                <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
                    <ul className="nav-links">
                        <li>
                            <Link to="/" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/menu" onClick={() => setIsMenuOpen(false)}>
                                Menu
                            </Link>
                        </li>
                        <li>
                            <Link to="/services" onClick={() => setIsMenuOpen(false)}>
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/bookings" onClick={() => setIsMenuOpen(false)}>
                                Bookings
                            </Link>
                        </li>
                        <li>
                            <Link to="/offer-coupons" onClick={() => setIsMenuOpen(false)}>
                                Offers
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="nav-icons">
                    <Link to="/cart" className="cart-icon">
                        <i className="fas fa-shopping-cart"></i>
                        {cartItemsCount > 0 && (
                            <span className="cart-count">{cartItemsCount}</span>
                        )}
                    </Link>
                    <div className="menu-toggle" onClick={toggleMenu}>
                        <div className={`hamburger ${isMenuOpen ? "active" : ""}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;