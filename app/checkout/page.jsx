"use client";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    paymentMethod: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.name || !formData.address || !formData.paymentMethod) {
      setError("Todos los campos son obligatorios.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Datos del cliente:", formData);
      console.log("Productos:", cartItems);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push("/thank-you");
    } catch (err) {
      setError("Hubo un error al procesar el pago. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Resumen de la Orden
        </h2>
        <ul className="divide-y divide-gray-200 mb-6">
          {cartItems.map((item) => (
            <li key={item.id} className="flex items-center py-4 space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-800">
                  {item.name}
                </h4>
                <p className="text-gray-500">
                  {item.quantity} x ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="text-lg font-medium text-gray-800">
                ${item.price * item.quantity}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center border-t pt-4 mb-8">
          <span className="text-xl font-semibold text-gray-800">Total:</span>
          <span className="text-xl font-semibold text-blue-600">
            ${totalAmount.toFixed(2)}
          </span>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Información de Envío y Pago
        </h3>
        <form onSubmit={handleCheckout} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Dirección de envío"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Método de pago</option>
            <option value="credit-card">Tarjeta de Crédito</option>
            <option value="paypal">PayPal</option>
          </select>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-lg font-semibold text-white ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition duration-300`}
          >
            {isLoading ? "Procesando..." : "Realizar Pago"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
