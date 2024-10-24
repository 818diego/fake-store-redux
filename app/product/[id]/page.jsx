"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  fetchRelatedProducts,
  resetProductDetail,
} from "@/store/slices/productDetailSlice";
import { addToCart } from "@/store/slices/cartSlices";
import Link from "next/link";
import LoadingSpinner from "@/components/loadingSpinner";

export default function ProductDetail({ params }) {
  const dispatch = useDispatch();
  const { id } = params;

  const {
    product,
    relatedProducts,
    status,
    relatedStatus,
    error,
  } = useSelector((state) => state.productDetail);

  useEffect(() => {
    dispatch(resetProductDetail());
    dispatch(fetchProductById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.category) {
      dispatch(fetchRelatedProducts(product.category));
    }
  }, [product?.category, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="bg-tercery rounded-lg shadow-lg p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        <ProductImage image={product.image} title={product.title} />
        <ProductInfo product={product} onAddToCart={() => dispatch(addToCart(product))} />
      </div>

      <RelatedProducts
        products={relatedProducts}
        status={relatedStatus}
        currentProductId={product.id}
        onAddToCart={(relatedProduct) => dispatch(addToCart(relatedProduct))}
      />
    </div>
  );
}

function ProductImage({ image, title }) {
  return (
    <div className="md:w-1/2 flex justify-center">
      <img
        src={image}
        alt={title}
        className="w-full h-full max-h-[400px] object-contain rounded-lg"
      />
    </div>
  );
}

function ProductInfo({ product, onAddToCart }) {
  return (
    <div className="md:w-1/2 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          {product.title}
        </h1>
        <p className="text-sm text-gray-400 mb-4">
          <span className="font-semibold text-primary">Category:</span>{" "}
          {product.category}
        </p>
        <p className="text-lg text-gray-300 mb-6">{product.description}</p>
        <p className="text-2xl font-semibold text-primary mb-4">
          ${product.price.toFixed(2)}
        </p>
      </div>
      <button
        className="bg-primary hover:bg-hover text-black py-2 px-4 rounded-md shadow-md mt-4 w-full"
        onClick={onAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}

function RelatedProducts({ products, status, currentProductId, onAddToCart }) {
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center mt-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <p className="text-red-500 mt-12">Failed to load related products.</p>
    );
  }

  const filteredProducts = products.filter((p) => p.id !== currentProductId);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-primary mb-4">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <RelatedProductCard
            key={product.id}
            product={product}
            onAddToCart={() => onAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
}

function RelatedProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-tercery rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <Link href={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-40 object-cover rounded-md"
        />
        <h3 className="mt-2 text-md font-semibold text-primary">
          {product.title}
        </h3>
      </Link>
      <p className="text-sm text-gray-400">${product.price.toFixed(2)}</p>
      <button
        className="bg-primary hover:bg-hover text-black py-1 px-3 rounded-md font-medium mt-3 w-full"
        onClick={onAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
