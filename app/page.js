"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/slices/productSlices";
import ProductCard from "@/components/productCard";
import LoadingSpinner from "@/components/loadingSpinner";

export default function Page() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [animationDirection, setAnimationDirection] = useState("none");
  const [isSliding, setIsSliding] = useState(false);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const paginate = (pageNumber) => {
    if (pageNumber !== currentPage && !isSliding) {
      setAnimationDirection(pageNumber > currentPage ? "right" : "left");
      setIsSliding(true);

      setTimeout(() => {
        setCurrentPage(pageNumber);
        setIsSliding(false);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 500);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-primary justify-center text-center font-bold mb-4 mt-8">
        Products Available
      </h1>
      {status === "loading" && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      )}
      {status === "failed" && <p>Error: {error}</p>}

      {status === "succeeded" && (
        <div className="overflow-hidden relative">
          <div
            className={`flex transition-transform duration-500 ease-in-out`}
            style={{
              transform: `translateX(-${(currentPage - 1) * 100}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-[100%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[25%] p-2"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {status === "succeeded" && totalPages > 1 && (
        <div className="flex justify-center mb-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-primary text-black"
                  : "bg-transparent text-primary"
              } hover:bg-hover hover:text-black transition-all duration-300`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
