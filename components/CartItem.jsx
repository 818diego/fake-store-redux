import React from "react";
import { toast } from "react-toastify";

export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
    const handleRemove = () => {
        onRemove(item.productId); // Llama a la acción para eliminar el item
        toast.info("Producto eliminado del carrito.");
    };

    return (
        <li className="flex justify-between items-center py-2 border-b border-gray-700">
            <div className="flex items-center">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="ml-4">
                    <p className="text-primary font-medium">{item.title}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onDecrement(item.productId)} // Llama a la acción para decrementar la cantidad
                    className="text-black hover:text-primary bg-tercery px-2 rounded">
                    -
                </button>
                <p className="text-sm font-medium text-primary">
                    {item.quantity ?? 1}
                </p>
                <button
                    onClick={() => onIncrement(item.productId)} // Llama a la acción para incrementar la cantidad
                    className="text-black hover:text-primary bg-tercery px-2 rounded">
                    +
                </button>
                <button
                    onClick={handleRemove} // Llama a la acción para eliminar el item
                    className="text-red-500 hover:text-red-700">
                    🗑️
                </button>
            </div>
        </li>
    );
}
