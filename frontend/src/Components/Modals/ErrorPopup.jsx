import React, { useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
function ErrorPopup({ message, onClose, duration = 5000 }) {
  // auto-hide after default 3s
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className="
    fixed top-3 left-1/2 -translate-x-1/2 z-50
    bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg
    flex items-center gap-3
    flex-col
  "
    >
      <div className="flex items-center gap-2">
        <MdErrorOutline className="text-xl" />
        <span className="font-semibold">ERROR</span>
        <MdErrorOutline className="text-xl" />
      </div>

      <div className="text-sm">{message}</div>
    </div>
  );
}

export default ErrorPopup;
