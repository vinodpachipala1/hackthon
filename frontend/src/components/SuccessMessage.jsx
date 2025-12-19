import React from "react";

const SuccessMessage = ({ message, onClose }) => {
  if (!message) return null;

  const isSuccess = message.includes("successfully");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className={`p-6 text-white ${
          isSuccess 
            ? "bg-gradient-to-r from-green-600 to-green-700" 
            : "bg-gradient-to-r from-red-600 to-red-700"
        }`}>
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              {isSuccess ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isSuccess ? "Complaint Registered Successfully!" : "Attention Required"}
              </h2>
              <p className="opacity-90 text-sm mt-1">
                {isSuccess ? "Your complaint has been submitted" : "Please check the details"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isSuccess ? "bg-green-100" : "bg-red-100"
            }`}>
              {isSuccess ? (
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            
            <p className="text-gray-700 mb-4">
              {message}
            </p>

            {isSuccess && message.includes("ID:") && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                <p className="text-sm text-gray-600 mb-1">Your Complaint ID:</p>
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg px-4 py-2 rounded-lg inline-block">
                  {message.split("ID: ")[1]}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Save this ID for future reference and tracking
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={onClose}
              className={`w-full font-semibold py-3.5 rounded-xl transition-all duration-300 ${
                isSuccess
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                  : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
              }`}
            >
              {isSuccess ? "Got it, thanks!" : "Try Again"}
            </button>

            {isSuccess && (
              <button
                onClick={() => window.print()}
                className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Receipt
              </button>
            )}
          </div>

          {isSuccess && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-start space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>We've sent a confirmation email with your complaint details and next steps.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;