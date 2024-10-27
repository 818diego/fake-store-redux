import React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "@/store/slices/cartSlices";

export default function RelatedProductCard({ product }) {
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
        <div className="bg-tercery rounded-lg shadow-sm hover:shadow-lg transition-shadow p-4">
            <Link href={`/product/${product.id}`}>
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-md font-semibold text-primary">
                    {product.title}
                </h3>
            </Link>
            <p className="text-sm text-gray-400 mb-3">
                ${product.price.toFixed(2)}
            </p>
            <button
                className="bg-primary hover:bg-hover text-black py-1 px-3 rounded-md font-medium w-full transition-all"
                onClick={handleAddToCart}>
                Añadir al Carrito
            </button>
        </div>
    );
}
