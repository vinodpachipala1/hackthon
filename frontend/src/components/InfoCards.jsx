import React from "react";

const InfoCards = () => {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Process Timeline */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="bg-white p-2.5 rounded-xl mr-3 shadow-sm">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Process Timeline</h3>
        </div>
        <ul className="space-y-2.5">
          {[
            { text: "Complaint acknowledgment within 2 hours", icon: "✓" },
            { text: "Assigned to relevant department", icon: "→" },
            { text: "Initial response within 24 hours", icon: "⏰" },
            { text: "Regular updates via email", icon: "📧" },
          ].map((item, index) => (
            <li key={index} className="flex items-center text-sm text-gray-700">
              <span className="bg-white w-5 h-5 rounded-full flex items-center justify-center text-red-600 font-bold mr-2.5 text-xs">
                {item.icon}
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Required Information */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="bg-white p-2.5 rounded-xl mr-3 shadow-sm">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Required Information</h3>
        </div>
        <ul className="space-y-2.5">
          {[
            "Valid email address for OTP verification",
            "Clear description of the issue",
            "Tracking number (if available)",
            "Incident date and location",
          ].map((item, index) => (
            <li key={index} className="flex items-start text-sm text-gray-700">
              <span className="text-yellow-600 font-bold mr-2.5 mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Customer Support */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="bg-white p-2.5 rounded-xl mr-3 shadow-sm">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Customer Support</h3>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Need assistance with your complaint?
          </p>
          <div className="bg-white p-3 rounded-xl border border-blue-200">
            <p className="font-bold text-lg text-blue-700 text-center">1800-266-6868</p>
            <p className="text-xs text-gray-500 text-center mt-1">24/7 Complaint Helpline</p>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Email: support@indiapost.gov.in
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;