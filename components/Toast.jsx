import { useEffect, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
  AiOutlineCloseCircle,
} from "react-icons/ai";

export default function Toast({
  type = "info",
  message,
  show,
  onClose,
  position = "top-right", // Default position
}) {
  const [visible, setVisible] = useState(show);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setProgress(100);

      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev > 0 ? prev - 1 : 0));
      }, 30);

      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 3000);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(timer);
      };
    }
  }, [show, onClose]);

  // Define the color styles based on the type of toast
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-black";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Define the icon based on the type of toast
  const getTypeIcon = () => {
    switch (type) {
      case "success":
        return <AiOutlineCheckCircle className="text-2xl" />;
      case "error":
        return <AiOutlineCloseCircle className="text-2xl" />;
      case "warning":
        return <AiOutlineWarning className="text-2xl" />;
      case "info":
        return <AiOutlineInfoCircle className="text-2xl" />;
      default:
        return <AiOutlineInfoCircle className="text-2xl" />;
    }
  };

  // Define position styles for the whole screen
  const getPositionStyles = () => {
    switch (position) {
      case "top-right":
        return "top-0 right-0";
      case "top-center":
        return "top-0 left-1/2 transform -translate-x-1/2";
      case "top-left":
        return "top-0 left-0";
      case "center":
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
      case "bottom-right":
        return "bottom-0 right-0";
      case "bottom-center":
        return "bottom-0 left-1/2 transform -translate-x-1/2";
      case "bottom-left":
        return "bottom-0 left-0";
      default:
        return "top-0 right-0"; // Default to top-right
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed z-50 px-4 py-2 rounded-lg shadow-lg max-w-sm w-full md:w-96 animate-slideIn ${getTypeStyles()} ${getPositionStyles()}`}
    >
      <div className="flex items-start">
        <div className="mr-3">{getTypeIcon()}</div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{message}</p>
        </div>
      </div>
      <div className="relative mt-2 h-1.5 w-full bg-gray-200 rounded">
        <div
          className="absolute top-0 left-0 h-full bg-opacity-50 rounded"
          style={{
            width: `${progress}%`,
            backgroundColor:
              type === "error"
                ? "#f87171"
                : type === "success"
                ? "#34d399"
                : type === "warning"
                ? "#fbbf24"
                : "#60a5fa",
            transition: "width 0.3s linear",
          }}
        ></div>
      </div>

      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.5s ease-in-out forwards;
        }
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
