import React from "react";

const SuccessMessage = ({ message, onClose }) => {
  if (!message) return null;

  const isSuccess = message.includes("successfully");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className={`p-6 text-white ${
          isSuccess 
            ? "bg-gradient-to-r from-green-600 to-green-700" 
            : "bg-gradient-to-r from-red-600 to-red-700"
        }`}>
          <h2 className="text-xl font-bold">
            {isSuccess ? "🎉 Complaint Registered Successfully!" : "⚠️ Something Went Wrong"}
          </h2>
          <p className="opacity-90 text-sm mt-1">
            {isSuccess ? "Your complaint has been submitted" : "Please check the details"}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isSuccess ? "bg-green-100" : "bg-red-100"
            }`}>
              {isSuccess ? (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            
            <p className="text-gray-700 mb-4">
              {message}
            </p>

            {isSuccess && message.includes("ID:") && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                <p className="text-sm text-gray-600 mb-1">Complaint ID:</p>
                <code className="text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded">
                  {message.split("ID: ")[1]}
                </code>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={onClose}
              className={`w-full font-semibold py-3 rounded-lg transition-colors ${
                isSuccess
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isSuccess ? "Got it, thanks!" : "Try Again"}
            </button>

            {isSuccess && (
              <button
                onClick={() => window.print()}
                className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Print Receipt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;