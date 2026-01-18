import React from "react";
import { useAppContext } from "../contexts/AppContext";

const CustomAlert = () => {
  const { showAlert, setShowAlert, alertMessage } = useAppContext();

  if (!showAlert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4 transform animate-scale-in">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <svg
                className="h-6 w-6 text-gray-700"
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
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
          <p className="text-sm text-gray-600 mb-6">{alertMessage}</p>
          <button
            onClick={() => setShowAlert(false)}
            className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
