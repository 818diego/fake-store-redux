"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCartItems } from "@/store/slices/cartSlices";

const Checkout = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const totalAmount = cartItems
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);
    const router = useRouter();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        paymentMethod: "",
        cardType: "",
        cardNumber: "",
        expirationDate: "",
        cvv: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateCardNumber = (number) => /^\d{16}$/.test(number);

    const validateExpirationDate = (expDate) => {
        const [month, year] = expDate.split("/").map(Number);
        if (!month || !year || month < 1 || month > 12) return false;

        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        return (
            year > currentYear ||
            (year === currentYear && month >= currentMonth)
        );
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name) errors.name = "Por favor, ingresa tu nombre.";
        if (!formData.address)
            errors.address = "Por favor, ingresa tu dirección.";
        if (!formData.paymentMethod)
            errors.paymentMethod = "Selecciona un método de pago.";

        if (formData.paymentMethod === "credit-card") {
            if (!formData.cardType)
                errors.cardType = "Selecciona el tipo de tarjeta.";
            if (!validateCardNumber(formData.cardNumber)) {
                errors.cardNumber =
                    "Número de tarjeta inválido. Debe contener 16 dígitos.";
            }
            if (!validateExpirationDate(formData.expirationDate)) {
                errors.expirationDate =
                    "Fecha de expiración inválida o vencida.";
            }
            if (!/^\d{3,4}$/.test(formData.cvv)) {
                errors.cvv = "CVV inválido. Debe tener 3 o 4 dígitos.";
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError("");
    
        if (!validateForm()) return;
    
        setIsLoading(true);
    
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: cartItems,
                    totalAmount,
                    name: formData.name,
                    address: formData.address,
                    paymentMethod: formData.paymentMethod,
                    cardType: formData.cardType,
                    cardNumber: `**** **** **** ${formData.cardNumber.slice(-4)}`,
                }),
            });
    
            if (!response.ok) {
                const { error } = await response.json();
                setError(error || "Error al procesar el pago.");
            } else {
                localStorage.setItem(
                    "orderSummary",
                    JSON.stringify({
                        items: cartItems,
                        totalAmount,
                        name: formData.name,
                        address: formData.address,
                        paymentMethod: formData.paymentMethod,
                        cardType: formData.cardType,
                        cardNumber: `**** **** **** ${formData.cardNumber.slice(-4)}`,
                    })
                );
    
                // Llama a clearCartItems y espera su finalización
                await dispatch(clearCartItems()).unwrap();  // Asegúrate de que clearCartItems se complete
                router.push("/thank-you");
            }
        } catch (err) {
            setError("Hubo un error al procesar el pago. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

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
                    {fieldErrors.name && (
                        <p className="text-red-500 text-sm">
                            {fieldErrors.name}
                        </p>
                    )}

                    <input
                        type="text"
                        name="address"
                        placeholder="Dirección de envío"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-4 bg-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                        required
                    />
                    {fieldErrors.address && (
                        <p className="text-red-500 text-sm">
                            {fieldErrors.address}
                        </p>
                    )}

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
                    {fieldErrors.paymentMethod && (
                        <p className="text-red-500 text-sm">
                            {fieldErrors.paymentMethod}
                        </p>
                    )}

                    {formData.paymentMethod === "credit-card" && (
                        <>
                            <select
                                name="cardType"
                                value={formData.cardType}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                                required>
                                <option value="">Tipo de tarjeta</option>
                                <option value="visa">Visa</option>
                                <option value="mastercard">MasterCard</option>
                            </select>
                            {fieldErrors.cardType && (
                                <p className="text-red-500 text-sm">
                                    {fieldErrors.cardType}
                                </p>
                            )}

                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="Número de tarjeta (16 dígitos)"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                                required
                            />
                            {fieldErrors.cardNumber && (
                                <p className="text-red-500 text-sm">
                                    {fieldErrors.cardNumber}
                                </p>
                            )}

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
                            {fieldErrors.expirationDate && (
                                <p className="text-red-500 text-sm">
                                    {fieldErrors.expirationDate}
                                </p>
                            )}
                            {fieldErrors.cvv && (
                                <p className="text-red-500 text-sm">
                                    {fieldErrors.cvv}
                                </p>
                            )}
                        </>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}
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
                </form>
            </div>
        </div>
    );
};

export default Checkout;
