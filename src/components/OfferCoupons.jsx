import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./OfferCoupons.css";
import { festivals } from "../utils/festivals";

const OfferCoupons = () => {
    const [couponCode, setCouponCode] = useState("");
    const [isFestive, setIsFestive] = useState(false);
    const [currentFestival, setCurrentFestival] = useState("");

    useEffect(() => {
        const today = new Date();
        const currentYear = today.getFullYear();

        // Check if today matches any festival date
        const festivalToday = festivals.find(festival => {
            const festDate = new Date(festival.date.replace('YYYY', currentYear));
            return festDate.getDate() === today.getDate() &&
                festDate.getMonth() === today.getMonth();
        });

        if (festivalToday) {
            setIsFestive(true);
            setCurrentFestival(festivalToday.name);
            generateFestivalCode(festivalToday.name);
        }
    }, []);

    const generateFestivalCode = (festivalName) => {
        // Generate a 6-letter code based on festival name
        const base = festivalName.replace(/[^A-Z]/ig, '').toUpperCase().substring(0, 3);
        const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
        setCouponCode(base + randomPart);
    };

    return (
        <>
            <Navbar />
            <div className="offer-coupons-container">
                <h1>Special Offers & Coupons</h1>

                <div className="coupons-wrapper">
                    <div className="coupon-card">
                        <h2>New Customer Special</h2>
                        <p>Get 10% off your first order</p>
                        <div className="code-box">WELCOME10</div>
                    </div>

                    <div className="coupon-card">
                        <h2>Weekend Special</h2>
                        <p>Free dessert with orders over ₹500</p>
                        <div className="code-box">SWEET500</div>
                    </div>

                    {isFestive && (
                        <div className="coupon-card festival">
                            <div className="festival-badge">{currentFestival}</div>
                            <h2>{currentFestival} Special Offer</h2>
                            <p>Get 15% off your festival celebration order</p>
                            <div className="code-box">{couponCode}</div>
                        </div>
                    )}

                    <div className="coupon-card">
                        <h2>Family Feast</h2>
                        <p>20% off on orders above ₹1000</p>
                        <div className="code-box">FAMILY20</div>
                    </div>
                </div>

                <div className="offer-terms">
                    <h3>Terms & Conditions</h3>
                    <ul>
                        <li>Offers cannot be combined with other promotions</li>
                        <li>Valid for online orders only</li>
                        <li>Festival offers are valid only on the day of the festival</li>
                        <li>Management reserves the right to modify offers</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default OfferCoupons;