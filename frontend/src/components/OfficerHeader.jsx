import React from "react";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white shadow-xl sticky top-0 z-50">
      {/* Top Info Bar */}
      <div className="bg-yellow-400 text-gray-900 py-1 px-4">
        <div className="container mx-auto flex justify-between items-center text-xs">
          <span>🔒 सुरक्षित - Secure Officer Portal</span>
          <div className="flex gap-4">
            <span>📊 Real-time Dashboard</span>
            <span>🛡️ Authorized Access Only</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left - Branding */}
          <div className="flex items-center mb-4 lg:mb-0">
            <div className="relative">
              <div className="relative bg-white rounded-full p-2 mr-4 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-full opacity-90"></div>
                <svg
                  className="relative w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="absolute -right-1 -top-1 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center">
                <span className="text-xs font-bold text-red-800">OF</span>
              </div>
            </div>

            <div className="ml-2">
              <div className="flex items-baseline">
                <h1 className="text-xl font-bold tracking-wide">
                  Officer Dashboard
                </h1>
                <div className="ml-3 bg-white text-red-700 px-2 py-1 rounded text-xs font-bold">
                  भारतीय डाक
                </div>
              </div>
              <div className="flex items-center mt-1">
                <div className="w-12 h-1 bg-yellow-400 mr-2"></div>
                <p className="text-xs text-yellow-100 font-medium">
                  Complaint Management Portal
                </p>
              </div>
            </div>
          </div>

          {/* Center - Welcome Message */}
          <div className="text-center mb-4 lg:mb-0 lg:mx-8">
            <div className="relative inline-block">
              <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Welcome, Officer
              </h2>
              <p className="text-sm text-yellow-100 mt-1">
                {localStorage.getItem("officer_email") || "Officer"}
              </p>
            </div>
          </div>

          {/* Right - Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Back to Home */}
            <button
              onClick={() => navigate("/")}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2.5 hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 mr-2 text-yellow-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="relative font-medium text-sm">Home</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/officer/login");
              }}
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl px-5 py-2.5 font-semibold hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 flex items-center justify-center hover:scale-[1.02] text-sm"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="relative">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
