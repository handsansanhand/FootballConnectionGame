import React from "react";

function LoadingPopup({ message = "Loading..." }) {
  return (
    <div
      className="
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%]
        z-50 
        flex flex-col items-center justify-center gap-3
        px-8 py-4 
        bg-black/70 text-white 
        rounded-lg border-2 border-white
      "
    >
      <span className="font-medium text-center">{message}</span>
    </div>
  );
}

export default LoadingPopup;
