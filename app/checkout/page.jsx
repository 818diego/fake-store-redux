"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Checkout = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const totalAmount = cartItems
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        paymentMethod: "",
        cardNumber: "",
        expirationDate: "",
        cvv: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.address || !formData.paymentMethod) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (formData.paymentMethod === "credit-card") {
            if (
                !formData.cardNumber ||
                !formData.expirationDate ||
                !formData.cvv
            ) {
                setError("Por favor, complete los datos de su tarjeta.");
                return;
            }
        }

        setIsLoading(true);

        try {
            console.log("Datos del cliente:", formData);
            console.log("Productos:", cartItems);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            router.push("/thank-you");
        } catch (err) {
            setError("Hubo un error al procesar el pago. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center p-6">
                <div className="bg-tercery text-primary p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">
                        Tu carrito está vacío
                    </h2>
                    <button
                        className="bg-primary hover:bg-hover text-black font-bold py-2 px-4 rounded"
                        onClick={() => router.push("/products")}>
                        Volver a la tienda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-tercery text-primary shadow-lg rounded-lg p-8">
                <h2 className="text-3xl font-semibold mb-6">
                    Resumen de la Orden
                </h2>
                <ul className="divide-y divide-gray-700 mb-6">
                    {cartItems.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center py-4 space-x-4">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h4 className="text-lg font-medium">
                                    {item.title}
                                </h4>
                                <p className="text-gray-400">
                                    {item.quantity} x ${item.price.toFixed(2)}
                                </p>
                            </div>
                            <div className="text-lg font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between items-center border-t border-gray-700 pt-4 mb-8">
                    <span className="text-xl font-semibold">Total:</span>
                    <span className="text-xl font-semibold">
                        ${totalAmount}
                    </span>
                </div>

                <h3 className="text-2xl font-semibold mb-4">
                    Información de Envío y Pago
                </h3>
                <form onSubmit={handleCheckout} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre completo"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-4 bg-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Dirección de envío"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-4 bg-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                        required
                    />
                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full p-4 bg-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                        required>
                        <option value="">Método de pago</option>
                        <option value="credit-card">Tarjeta de Crédito</option>
                        <option value="paypal">PayPal</option>
                    </select>

                    {formData.paymentMethod === "credit-card" && (
                        <>
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="Número de tarjeta"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                                required
                            />
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    name="expirationDate"
                                    placeholder="Fecha de expiración (MM/AA)"
                                    value={formData.expirationDate}
                                    onChange={handleInputChange}
                                    className="w-1/2 p-4 bg-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                                    required
                                />
                                <input
                                    type="text"
                                    name="cvv"
                                    placeholder="CVV"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    className="w-1/2 p-4 bg-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {formData.paymentMethod === "paypal" && (
                        <button
                            type="button"
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-lg font-semibold text-black ${
                                isLoading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-primary hover:bg-hover"
                            } transition duration-300`}>
                            {isLoading ? "Procesando..." : "Pagar con PayPal"}
                        </button>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    {formData.paymentMethod === "credit-card" && (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-lg font-semibold text-black ${
                                isLoading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-primary hover:bg-hover"
                            } transition duration-300`}>
                            {isLoading ? "Procesando..." : "Realizar Pago"}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Checkout;
