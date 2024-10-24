import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlices";
import Link from "next/link";
import Image from "next/image";
import Toast from "@/components/Toast";

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [toastPosition, setToastPosition] = useState("top-right");

    const handleAddToCart = () => {
        setIsLoading(true);

        setTimeout(() => {
            dispatch(addToCart(product));
            setIsLoading(false);

            setToastMessage("Product added to cart successfully!");
            setToastType("success");
            setToastPosition("top-center");
            setShowToast(true);
        }, 1000);
    };

    return (
        <>
            <Toast
                type={toastType}
                message={toastMessage}
                show={showToast}
                position={toastPosition}
                onClose={() => setShowToast(false)}
            />

            <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-tercery dark:bg-gray-800 p-6">
                <div className="relative">
                    <Image
                        className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
                        src={product.image}
                        alt={product.title}
                        width={500}
                        height={300}
                        loading="lazy"
                    />
                </div>
                <div className="p-4">
                    <h2 className="font-semibold text-xl text-primary dark:text-white mb-2">
                        {product.title}
                    </h2>
                    <p className="text-white dark:text-gray-300 text-sm mb-4">
                        {product.description.length > 100
                            ? `${product.description.substring(0, 100)}...`
                            : product.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-primary dark:text-gray-100 font-bold text-lg">
                            ${product.price}
                        </span>
                    </div>

                    <div className="flex space-x-2 mb-2">
                        {product.tags && product.tags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-gray-200 dark:bg-gray-700 text-xs text-black dark:text-white font-semibold py-1 px-3 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex space-x-2">
                        <button
                            className={`bg-primary hover:bg-hover text-black dark:text-white font-bold py-2 px-4 rounded-2xl w-full ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={handleAddToCart}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full"></div>
                            ) : (
                                "Add to Cart"
                            )}
                        </button>
                        <Link
                            href={`/product/${product.id}`}
                            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-2xl w-full text-center"
                        >
                            Show Product
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
