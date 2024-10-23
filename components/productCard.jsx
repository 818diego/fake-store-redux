/* eslint-disable @next/next/no-img-element */
"use client";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlices";
import Link from "next/link";

export default function ProductCard({ product }) {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart(product));
    };

    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white p-6">
            <img
                className="w-full h-48 object-cover rounded-t-lg"
                src={product.image}
                alt={product.title}
            />
            <div className="p-4">
                <h2 className="font-semibold text-xl text-gray-800 mb-2">
                    {product.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                    {product.description.length > 100
                        ? `${product.description.substring(0, 100)}...`
                        : product.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-900 font-bold text-lg">
                        ${product.price}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-full"
                        onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                    <Link
                        href={`/product/${product.id}`}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg w-full text-center">
                        Ver Producto
                    </Link>
                </div>
            </div>
        </div>
    );
}
