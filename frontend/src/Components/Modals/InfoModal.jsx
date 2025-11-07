function InfoModal({ text, title, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg border-4 border-black text-black shadow-lg w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b dark:border-gray-600">
          <h3 className="text-2xl font-semibold text-center w-full">{title}</h3>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {Array.isArray(text) ? (
            text.map((line, i) => <p key={i}>{line}</p>)
          ) : (
            <p>{text}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t dark:border-gray-600">
          <button
            onClick={onClose}
            className="inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-4 border-black rounded-none focus:outline-none"
            > Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
