"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "@/store/slices/productSlices";
import ProductCard from "@/components/productCard";
import LoadingSpinner from "@/components/loadingSpinner";

export default function CategoryPage({ params }) {
    const { category } = params;
    const dispatch = useDispatch();
    const { filteredItems, categoryStatus, error } = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        if (category) {
            dispatch(fetchProductsByCategory(category));
        }
    }, [category, dispatch]);

    if (categoryStatus === "loading") {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <LoadingSpinner />
                <p className="text-gray-600 text-lg mt-4">
                    Loading products for {category}...
                </p>
            </div>
        );
    }

    if (categoryStatus === "failed") {
        return <p className="text-red-500 text-lg">{error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 capitalize">
                Category: {category}
            </h1>
            {filteredItems.length === 0 ? (
                <p className="text-gray-500">
                    No products found in this category.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
