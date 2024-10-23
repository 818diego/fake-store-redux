"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  HomeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";

const ThankYou = () => {
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    setCustomerName(storedName);
  }, []);

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <CheckCircleIcon className="w-10 h-10 text-green-500" />
          <h2 className="text-3xl font-semibold text-gray-800">
            ¡Gracias por tu compra, {customerName}!
          </h2>
        </div>
        <p className="text-gray-600 mb-6">
          Tu pedido ha sido procesado exitosamente y pronto recibirás la
          confirmación en tu correo electrónico.
        </p>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ShoppingCartIcon className="w-6 h-6 mr-2 text-blue-500" />
            Resumen de tu pedido:
          </h3>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center py-3"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="text-gray-500">
                  {item.quantity} x ${item.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center border-t pt-4 mt-4">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <span className="text-lg font-semibold text-blue-600">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handleBackToHome}
          className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
