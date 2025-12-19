const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with subtle pattern */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#dc2626_0.5px,transparent_0.5px)] [background-size:20px_20px]"></div>
        
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-center relative z-10">
          {/* Logo/Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-6 shadow-xl ring-4 ring-red-100">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              भारतीय डाक | India Post
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Complaint Management <span className="text-red-700">System</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            AI-powered platform for efficient postal service grievance redressal with complete transparency
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <a
              href="/register-complaint"
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center min-w-[220px] text-lg"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Register Complaint
            </a>

            <a
              href="/track-complaint"
              className="group px-8 py-4 bg-white border-2 border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center min-w-[220px] text-lg shadow-lg"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Track Complaint
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-red-600 mb-2 text-center">24/7</div>
            <p className="text-lg font-semibold text-gray-800 text-center mb-2">Complaint Registration</p>
            <p className="text-gray-600 text-center text-sm">Submit complaints anytime, from anywhere</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-red-600 mb-2 text-center">AI-Powered</div>
            <p className="text-lg font-semibold text-gray-800 text-center mb-2">Smart Analysis</p>
            <p className="text-gray-600 text-center text-sm">Intelligent complaint categorization & priority</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-red-600 mb-2 text-center">Real-time</div>
            <p className="text-lg font-semibold text-gray-800 text-center mb-2">Live Tracking</p>
            <p className="text-gray-600 text-center text-sm">Instant updates on resolution progress</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It <span className="text-red-700">Works</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple three-step process to get your postal service issues resolved
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative group">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
              1
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 pt-12 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Register Complaint</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Fill the simple form with your postal service issue details. Our AI will categorize it automatically.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
              2
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 pt-12 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Verify Email</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Receive OTP on your registered email. Verify to ensure secure and authenticated complaint submission.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
              3
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 pt-12 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Track Resolution</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Get real-time updates from postal officials. Track every step of your complaint resolution journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-red-50 via-white to-red-50 rounded-2xl p-8 md:p-12 border border-red-100 shadow-xl">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              System <span className="text-red-700">Features</span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced capabilities for efficient complaint management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "AI-based complaint priority analysis",
              "Real-time status updates & notifications",
              "Secure OTP verification system",
              "Multi-language support",
              "Automated escalation for delayed cases",
              "Comprehensive reporting & analytics"
            ].map((feature, index) => (
              <div key={index} className="flex items-center group">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-red-100 to-red-50 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium group-hover:text-red-700 transition-colors duration-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
          
          {/* Officer Login */}
          <div className="mt-10 pt-8 border-t border-red-100 text-center">
            <a
              href="/officer/login"
              className="inline-flex items-center text-gray-700 hover:text-red-700 transition-colors group font-medium"
            >
              <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="border-b border-transparent group-hover:border-red-700">
                Officer Login Portal
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="text-center text-gray-500">
          <p className="mb-2">© {new Date().getFullYear()} India Post. Ministry of Communications, Government of India</p>
          <p className="text-sm">
            Need assistance? Call our support helpline: <span className="text-red-600 font-semibold">1800-266-6868</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;