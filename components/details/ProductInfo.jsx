import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "@/store/slices/cartSlices";

export default function ProductInfo({ product }) {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error(
                "Por favor, inicia sesión para añadir productos al carrito."
            );
            return;
        }

        dispatch(addToCart(product));
        toast.success("Producto añadido al carrito.");
    };

    return (
        <div className="md:w-1/2 flex flex-col justify-between">
            <div>
                <h1 className="text-3xl font-bold text-primary mb-4">
                    {product.title}
                </h1>
                <p className="text-sm text-gray-400 mb-2">
                    <span className="font-semibold text-primary">
                        Categoría:
                    </span>{" "}
                    {product.category}
                </p>
                <p className="text-lg text-gray-300 mb-4">
                    {product.description}
                </p>
                <p className="text-3xl font-semibold text-primary mb-6">
                    ${product.price.toFixed(2)}
                </p>
            </div>
            <button
                className="bg-primary hover:bg-hover text-black py-3 px-4 rounded-md font-bold shadow-md w-full mt-4 md:mt-0 transition-all"
                onClick={handleAddToCart}>
                Añadir al Carrito
            </button>
        </div>
    );
}
