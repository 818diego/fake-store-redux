"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
} from "@/store/slices/cartSlices";

export default function Cart({ onClose }) {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const cartRef = useRef(null);

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
            router.push("/checkout");
        }
    };

    return (
        <div
            className={`fixed inset-0 flex justify-end z-50 transition-transform transform ${
                isVisible ? "translate-x-0" : "translate-x-full"
            } duration-300 ease-in-out`}>
            <div
                ref={cartRef}
                className="bg-white shadow-lg shadow-gray-400 w-[320px] max-w-full h-full max-h-[95vh] m-4 rounded-lg overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Shopping Cart
                    </h2>
                    <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={handleClose}>
                        ✕
                    </button>
                </div>
                <div className="p-4 flex-1 overflow-auto">
                    {cartItems.length === 0 ? (
                        <p className="text-gray-500">Your cart is empty.</p>
                    ) : (
                        <ul className="space-y-4">
                            {cartItems.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                        <div className="ml-4">
                                            <p className="text-gray-800 font-medium">
                                                {item.title}
                                            </p>
                                            <p className="text-gray-500">{`$${item.price.toFixed(
                                                2
                                            )}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    decrementQuantity(item.id)
                                                )
                                            }
                                            className="text-gray-700 hover:text-gray-900 bg-gray-200 px-2 rounded">
                                            -
                                        </button>
                                        <p className="text-sm font-medium text-gray-700">
                                            {item.quantity}
                                        </p>
                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    incrementQuantity(item.id)
                                                )
                                            }
                                            className="text-gray-700 hover:text-gray-900 bg-gray-200 px-2 rounded">
                                            +
                                        </button>
                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    removeFromCart(item.id)
                                                )
                                            }
                                            className="text-red-600 hover:text-red-800">
                                            🗑️
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-gray-800">
                                Total
                            </span>
                            <span className="text-lg font-medium text-gray-800">
                                {`$${cartItems
                                    .reduce(
                                        (total, item) =>
                                            total + item.price * item.quantity,
                                        0
                                    )
                                    .toFixed(2)}`}
                            </span>
                        </div>
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                            onClick={handleCheckoutClick}>
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
