"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const validateForm = () => {
        const errors = {};

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Por favor, ingresa un correo electrónico válido.";
        }
        if (!formData.password || formData.password.length < 8) {
            errors.password = "La contraseña debe tener al menos 8 caracteres.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setFieldErrors({
            ...fieldErrors,
            [name]: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const { error } = await response.json();
                setError(error);
                toast.error("Credenciales incorrectas. Inténtalo de nuevo.");
            } else {
                const data = await response.json();
                const token = data.token;

                localStorage.setItem("token", token);

                dispatch(login(token));

                toast.success("Inicio de sesión exitoso. Bienvenido!");
                router.push("/");
            }
        } catch (error) {
            setError("Ocurrió un error al iniciar sesión.");
            toast.error("Error en el servidor. Inténtalo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-64 flex justify-center items-center bg-secondary">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-tertiary p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl text-primary text-center font-bold mb-6">
                    Iniciar sesión
                </h1>

                {/* Campo de correo electrónico */}
                <div className="flex items-center border border-primary rounded-lg mb-4 relative">
                    <FaEnvelope className="text-gray-400 ml-3" />
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Correo electrónico"
                        className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                </div>
                {fieldErrors.email && (
                    <p className="text-red-500 text-sm mb-4">
                        {fieldErrors.email}
                    </p>
                )}

                {/* Campo de contraseña */}
                <div className="flex items-center border border-primary rounded-lg mb-4 relative">
                    <FaLock className="text-gray-400 ml-3" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-gray-400 focus:outline-none">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {fieldErrors.password && (
                    <p className="text-red-500 text-sm mb-4">
                        {fieldErrors.password}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-3 ${
                        loading ? "bg-gray-400" : "bg-primary"
                    } text-black rounded-lg font-bold hover:bg-hover transition-all duration-300`}>
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>

                {error && (
                    <p className="text-red-500 mt-4 text-center">{error}</p>
                )}
            </form>
        </div>
    );
}

export default LoginPage;
