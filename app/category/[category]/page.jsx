"use client";

import React, { useEffect } from "react";
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
            <LoadingScreen message={`Loading products for ${category}...`} />
        );
    }

    if (categoryStatus === "failed") {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-bold text-primary mb-6 capitalize">
                Category: {category}
            </h1>
            {filteredItems.length === 0 ? (
                <p className="text-gray-400">
                    No products found in this category.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredItems.map((product) => (
                        <div
                            key={product.id}
                            className=" rounded-lg transition-shadow">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function LoadingScreen({ message }) {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <LoadingSpinner />
            {/* <p className="text-gray-400 text-lg mt-4">{message}</p> */}
        </div>
    );
}

function ErrorMessage({ message }) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-red-500 text-lg">{message}</p>
        </div>
    );
}
