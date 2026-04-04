import React from "react";
import useUIStore from "../store/useUIStore";

const CustomAlert = () => {
  const { showAlert, setShowAlert, alertMessage, alertType } = useUIStore();

  if (!showAlert) return null;

  const isError = alertType === "error";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4 transform animate-scale-in">
        <div className="text-center">
          <div className="mb-4">
            <div
              className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                isError ? "bg-red-100" : "bg-green-100"
              }`}
            >
              {isError ? (
                /* X icon for errors */
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                /* Checkmark icon for success */
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
          <h3
            className={`text-lg font-medium mb-2 ${
              isError ? "text-red-700" : "text-gray-900"
            }`}
          >
            {isError ? "Error!" : "Success!"}
          </h3>
          <p className="text-sm text-gray-600 mb-6">{alertMessage}</p>
          <button
            onClick={() => setShowAlert(false)}
            className={`w-full px-4 py-2 text-white rounded-md transition-colors font-medium ${
              isError
                ? "bg-red-600 hover:bg-red-700"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
