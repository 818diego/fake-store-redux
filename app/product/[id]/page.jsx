"use client";
import { useEffect } from "react";
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
  const product = useSelector((state) => state.productDetail.product);
  const relatedProducts = useSelector(
    (state) => state.productDetail.relatedProducts
  );
  const status = useSelector((state) => state.productDetail.status);
  const relatedStatus = useSelector(
    (state) => state.productDetail.relatedStatus
  );
  const error = useSelector((state) => state.productDetail.error);

  useEffect(() => {
    dispatch(resetProductDetail());
    dispatch(fetchProductById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.category) {
      dispatch(fetchRelatedProducts(product.category));
    }
  }, [product, dispatch]);

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full max-h-[400px] object-contain rounded-lg"
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {product.title}
            </h1>
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </p>
            <p className="text-lg text-gray-600 mb-6">{product.description}</p>
            <p className="text-2xl font-semibold text-gray-900 mb-4">{`$${product.price.toFixed(
              2
            )}`}</p>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md mt-4 w-full"
            onClick={() => dispatch(addToCart(product))}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Related Products
        </h2>
        {relatedStatus === "loading" && (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        )}
        {relatedStatus === "succeeded" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts
              .filter((related) => related.id !== product.id)
              .map((related) => (
                <div
                  key={related.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <Link href={`/product/${related.id}`}>
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <h3 className="mt-2 text-md font-semibold text-gray-800">
                      {related.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500">
                    ${related.price.toFixed(2)}
                  </p>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md font-medium mt-3 w-full"
                    onClick={() => dispatch(addToCart(related))}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        )}
        {relatedStatus === "failed" && (
          <p className="text-red-500">Failed to load related products.</p>
        )}
      </div>
    </div>
  );
}
