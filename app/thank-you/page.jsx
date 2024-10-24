"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
    CheckCircleIcon,
    HomeIcon,
    ShoppingCartIcon,
} from "@heroicons/react/24/solid";

const ThankYou = () => {
    const router = useRouter();
    const cartItems = useSelector((state) => state.cart.items);
    const totalAmount = cartItems
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);
    const [customerName, setCustomerName] = useState("");

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        setCustomerName(storedName || "Cliente");
    }, []);

    const handleBackToHome = () => {
        router.push("/");
    };

    return (
        <div className="flex items-center justify-center mt-48 p-6">
            <div className="w-full max-w-2xl bg-tercery text-primary shadow-lg rounded-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                    <CheckCircleIcon className="w-10 h-10 text-primary" />
                    <h2 className="text-3xl font-semibold">
                        ¡Gracias por tu compra
                        {customerName ? `, ${customerName}` : ""}!
                    </h2>
                </div>
                <p className="text-gray-300 mb-6">
                    Tu pedido ha sido procesado exitosamente y pronto recibirás
                    la confirmación en tu correo electrónico.
                </p>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <ShoppingCartIcon className="w-6 h-6 mr-2 text-primary" />
                        Resumen de tu pedido:
                    </h3>
                    <ul className="divide-y divide-gray-700">
                        {cartItems.map((item) => (
                            <li
                                key={item.id}
                                className="flex justify-between items-center py-3">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                    <span className="text-primary">
                                        {item.title}
                                    </span>
                                </div>
                                <span className="text-gray-400">
                                    {item.quantity} x ${item.price.toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-lg font-semibold">
                            ${totalAmount}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleBackToHome}
                    className="flex items-center justify-center w-full bg-primary hover:bg-hover text-black font-bold py-3 rounded-lg transition duration-300">
                    <HomeIcon className="w-5 h-5 mr-2" />
                    Volver al inicio
                </button>
            </div>
        </div>
    );
};

export default ThankYou;
