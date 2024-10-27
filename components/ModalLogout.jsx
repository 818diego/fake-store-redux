import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ModalLogout({ onConfirm, onCancel }) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onCancel, 300);
    };

    const handleConfirmLogout = () => {
        onConfirm();
        toast.success("Has cerrado sesión correctamente.");
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
                isVisible ? "modal-overlay-fade-in" : "modal-overlay-fade-out"
            }`}>
            <div
                className={`bg-tercery p-8 rounded-lg shadow-lg text-center max-w-sm w-full ${
                    isVisible ? "modal-fade-in" : "modal-fade-out"
                }`}>
                <h2 className="text-xl font-bold mb-4 text-primary">
                    ¿Cerrar sesión?
                </h2>
                <p className="mb-6 text-white">
                    ¿Estás seguro de que deseas cerrar sesión?
                </p>
                <button
                    onClick={handleConfirmLogout}
                    className="w-full p-3 mb-2 bg-primary text-black rounded-lg font-bold hover:bg-hover transition-all duration-300">
                    Sí, cerrar sesión
                </button>
                <button
                    onClick={handleClose}
                    className="w-full p-3 bg-gray-300 text-black rounded-lg font-bold hover:bg-gray-400 transition-all duration-300">
                    Cancelar
                </button>
            </div>
        </div>
    );
}
