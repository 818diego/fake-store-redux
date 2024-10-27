import React from "react";
import { toast } from "react-toastify";

export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
    const handleRemove = () => {
        onRemove();
        toast.info("Producto eliminado del carrito.");
    };

    return (
        <li className="flex justify-between items-center">
            <div className="flex items-center">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="ml-4">
                    <p className="text-primary font-medium">{item.title}</p>
                    <p className="text-gray-400">{`$${item.price.toFixed(
                        2
                    )}`}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={onDecrement}
                    className="text-black hover:text-primary bg-tercery px-2 rounded">
                    -
                </button>
                <p className="text-sm font-medium text-primary">
                    {item.quantity}
                </p>
                <button
                    onClick={onIncrement}
                    className="text-black hover:text-primary bg-tercery px-2 rounded">
                    +
                </button>
                <button
                    onClick={handleRemove}
                    className="text-red-500 hover:text-red-700">
                    🗑️
                </button>
            </div>
        </li>
    );
}
