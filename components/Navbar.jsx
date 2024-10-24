"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BsCart2 } from "react-icons/bs";
import Cart from "./Cart";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "@/store/slices/categorySlices";
import { fetchProductsByCategory } from "@/store/slices/productSlices";

export default function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dispatch = useDispatch();

    // Obtener las categorías y los productos desde el estado de Redux
    const cartItems = useSelector((state) => state.cart.items);
    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );
    const categories = useSelector((state) => state.categories.items);
    const categoriesStatus = useSelector((state) => state.categories.status);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (categoriesStatus === "idle") {
            dispatch(fetchCategories());
        }
    }, [categoriesStatus, dispatch]);

    const handleCategoryClick = (category) => {
        dispatch(fetchProductsByCategory(category));
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <div
                className={`bg-secondary fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                    isScrolled ? "backdrop-blur-md" : ""
                }`}>
                <div className="container mx-auto p-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">
                        <Link
                            href="/"
                            className="text-primary hover:text-hover">
                            Fake Store
                        </Link>
                    </h1>
                    <div className="flex space-x-6">
                        {categories.map((category) => (
                            <span key={category} className="text-primary hover:text-hover">
                                <Link href={`/category/${category}`}>
                                    {category}
                                </Link>
                            </span>
                        ))}
                        <button
                            onClick={toggleModal}
                            className="relative text-primary hover:text-hover">
                            <BsCart2 size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <Cart onClose={() => setIsModalOpen(false)} />
                </div>
            )}
        </>
    );
}
