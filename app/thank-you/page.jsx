"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircleIcon,
    HomeIcon,
    ShoppingCartIcon,
} from "@heroicons/react/24/solid";

const ThankYou = () => {
    const router = useRouter();
    const [orderSummary, setOrderSummary] = useState(null);

    useEffect(() => {
        // Leer los detalles del pedido de localStorage
        const storedOrder = localStorage.getItem("orderSummary");
        if (storedOrder) {
            setOrderSummary(JSON.parse(storedOrder));
        }
        // Limpiar el resumen de la compra de localStorage después de cargarlo
        return () => localStorage.removeItem("orderSummary");
    }, []);

    const handleBackToHome = () => {
        router.push("/");
    };

    if (!orderSummary) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500 text-lg">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center mt-24 p-6">
            <div className="w-full max-w-3xl bg-tercery text-primary shadow-lg rounded-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                    <CheckCircleIcon className="w-10 h-10 text-primary" />
                    <h2 className="text-3xl font-semibold">
                        ¡Gracias por tu compra, {orderSummary.name}!
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
                    <ul className="divide-y divide-gray-700 mb-4">
                        {orderSummary.items.map((item) => (
                            <li
                                key={item.id}
                                className="flex justify-between items-center py-3">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                    <div>
                                        <p className="text-primary font-semibold">
                                            {item.title}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {item.quantity} x $
                                            {item.price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-gray-400 font-semibold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t border-gray-700 pt-4 mt-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total:</span>
                            <span className="text-primary">
                                ${orderSummary.totalAmount}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <span>Método de Pago:</span>
                            <span className="text-primary">
                                {orderSummary.paymentMethod === "credit-card"
                                    ? `${
                                          orderSummary.cardType
                                      } **** **** **** ${orderSummary.cardNumber.slice(
                                          -4
                                      )}`
                                    : "PayPal"}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleBackToHome}
                    className="flex items-center justify-center w-full bg-primary hover:bg-hover text-black font-bold py-3 rounded-lg transition duration-300 mt-4">
                    <HomeIcon className="w-5 h-5 mr-2" />
                    Volver al inicio
                </button>
            </div>
        </div>
    );
};

export default ThankYou;
