"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
} from "@/store/slices/cartSlices";
import CartItem from "@/components/CartItem";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Cart({ onClose }) {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const cartRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleCheckoutClick = () => {
        if (cartItems.length > 0) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                handleClose();
                router.push("/checkout");
            }, 1000);
        }
    };

    const totalAmount = cartItems
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);

    return (
        <div
            className={`fixed inset-0 flex justify-end z-50 transition-transform transform ${
                isVisible ? "translate-x-0" : "translate-x-full"
            } duration-300 ease-in-out`}>
            <div
                ref={cartRef}
                className="bg-secondary shadow-lg w-[320px] max-w-full h-2/1 m-4 rounded-lg overflow-hidden flex flex-col relative">
                {loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                        <LoadingSpinner />
                    </div>
                )}
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-primary">
                        Shopping Cart
                    </h2>
                    <button
                        className="text-gray-400 hover:text-primary"
                        onClick={handleClose}>
                        ✕
                    </button>
                </div>
                <div className="p-4 flex-1 overflow-auto">
                    {cartItems.length === 0 ? (
                        <p className="text-gray-400">Your cart is empty.</p>
                    ) : (
                        <ul className="space-y-4">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onIncrement={() =>
                                        dispatch(incrementQuantity(item.id))
                                    }
                                    onDecrement={() =>
                                        dispatch(decrementQuantity(item.id))
                                    }
                                    onRemove={() =>
                                        dispatch(removeFromCart(item.id))
                                    }
                                />
                            ))}
                        </ul>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-primary">
                                Total
                            </span>
                            <span className="text-lg font-medium text-primary">
                                ${totalAmount}
                            </span>
                        </div>
                        <button
                            className="w-full bg-primary hover:bg-hover text-black font-bold py-2 px-4 rounded-lg"
                            onClick={handleCheckoutClick}
                            disabled={loading} // Deshabilitar el botón durante la carga
                        >
                            {loading ? "Processing..." : "Checkout"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
