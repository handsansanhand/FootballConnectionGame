function InfoModal({ text, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Information
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 text-gray-700 dark:text-gray-300">
          {text || (
            <>
              <p className="mb-2">
                This is an example of an informational modal controlled by React
                state rather than Flowbite’s data attributes.
              </p>
              <p>
                You can put any text or UI here — rules, instructions, or
                credits, for example.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t dark:border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
