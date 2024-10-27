import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCardCategory({ product }) {
    return (
        <div className="max-w-sm rounded-lg bg-tercery overflow-hidden shadow-lg bg-tertiary p-6 ">
            <div className="relative mb-4">
                <Image
                    className="w-full h-48 object-cover rounded-lg"
                    src={product.image}
                    alt={product.title}
                    width={500}
                    height={300}
                    loading="lazy"
                />
            </div>
            <div className="p-2">
                <h3 className="font-semibold text-lg text-primary mb-2 leading-tight">
                    {product.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {product.description.length > 90
                        ? `${product.description.substring(0, 90)}...`
                        : product.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-primary font-bold text-xl">
                        ${product.price}
                    </span>
                    <Link href={`/product/${product.id}`}>
                        <button className="bg-primary hover:bg-hover text-black font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300">
                            Ver producto
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
