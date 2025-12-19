import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white shadow-xl">
      {/* Top Bar */}
      <div className="bg-yellow-400 text-gray-900 py-1 px-4">
        <div className="container mx-auto flex justify-between items-center text-xs">
          <span>🔒 सुरक्षित - Secure Platform</span>
          <div className="flex gap-4">
            <span>📞 Helpline: 1800-266-6868</span>
            <span>🕒 24x7 Support</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left - Branding with India Post Logo */}
          <div className="flex items-center mb-4 lg:mb-0">
            <div className="relative">
              {/* India Post Emblem */}
              <div className="relative bg-white rounded-full p-3 mr-4 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-full opacity-90"></div>
                <svg className="relative w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="absolute -right-1 -top-1 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-xs font-bold text-red-800">IN</span>
              </div>
            </div>
            
            <div className="ml-2">
              <div className="flex items-baseline">
                <h1 className="text-2xl font-bold tracking-wide">भारतीय डाक</h1>
                <div className="ml-3 bg-white text-red-700 px-2 py-1 rounded text-xs font-bold">
                  INDIA POST
                </div>
              </div>
              <div className="flex items-center mt-1">
                <div className="w-16 h-1 bg-yellow-400 mr-2"></div>
                <p className="text-sm text-yellow-100 font-medium">
                  Ministry of Communications
                </p>
              </div>
            </div>
          </div>
          
          {/* Center - System Title */}
          <div className="text-center mb-4 lg:mb-0 lg:mx-8">
            <div className="relative inline-block">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Complaint Management System
              </h2>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-blue-500 rounded-full"></div>
            </div>
            <p className="text-sm text-yellow-100 mt-3 font-medium">
              AI-Powered Grievance Redressal Platform
            </p>
          </div>
          
          {/* Right - Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Track Complaint Button */}
            <a 
              href="/track-complaint"
              className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-5 py-2.5 hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/30 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="relative font-semibold">Track Complaint</span>
            </a>
            
            {/* Officer Login Button */}
            <a 
              href="/officer/login"
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl px-6 py-3 font-bold hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 flex items-center justify-center hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="relative">Officer Login</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-t border-red-700/50 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center py-2 gap-1 md:gap-0">
            
            {/* Navigation Items */}
            <a 
              href="/" 
              className="group relative px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center mx-1"
            >
              <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Home</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-yellow-400 transition-all duration-300"></div>
            </a>
            
            <div className="w-px h-6 bg-red-600/50 mx-2 hidden md:block"></div>
            
            <a 
              href="/register-complaint" 
              className="group relative px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center mx-1"
            >
              <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Register Complaint</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-yellow-400 transition-all duration-300"></div>
            </a>
            
            <div className="w-px h-6 bg-red-600/50 mx-2 hidden md:block"></div>
            
            <a 
              href="/track-complaint" 
              className="group relative px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center mx-1"
            >
              <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">Track Status</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-yellow-400 transition-all duration-300"></div>
            </a>
            
            <div className="w-px h-6 bg-red-600/50 mx-2 hidden md:block"></div>
            
            <a 
              href="/faq" 
              className="group relative px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center mx-1"
            >
              <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">FAQ / Help</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-yellow-400 transition-all duration-300"></div>
            </a>
            
            <div className="w-px h-6 bg-red-600/50 mx-2 hidden md:block"></div>
            
            <a 
              href="/contact" 
              className="group relative px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center mx-1"
            >
              <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Contact Support</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-yellow-400 transition-all duration-300"></div>
            </a>
            
            {/* Language Selector */}
            
          </div>
        </div>
      </nav>

    
    </header>
  );
};

export default Header;