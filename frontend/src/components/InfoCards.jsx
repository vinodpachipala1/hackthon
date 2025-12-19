import React from "react";

const InfoCards = () => {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-red-50 p-6 rounded-xl border border-red-100">
        <div className="flex items-center mb-3">
          <div className="bg-red-100 p-2 rounded-lg mr-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800">What Happens Next?</h3>
        </div>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>✓ Complaint acknowledgment within 2 hours</li>
          <li>✓ Assigned to relevant department</li>
          <li>✓ Initial response within 24 hours</li>
          <li>✓ Regular updates via email</li>
        </ul>
      </div>

      <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
        <div className="flex items-center mb-3">
          <div className="bg-orange-100 p-2 rounded-lg mr-3">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800">Information Required</h3>
        </div>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Valid email address for OTP</li>
          <li>• Clear description of the issue</li>
          <li>• Tracking number (if available)</li>
          <li>• Incident date and location</li>
        </ul>
      </div>

      <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
        <div className="flex items-center mb-3">
          <div className="bg-amber-100 p-2 rounded-lg mr-3">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800">Need Help?</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Contact our customer support:
        </p>
        <p className="font-bold text-lg text-amber-700">1800-XXX-XXXX</p>
        <p className="text-xs text-gray-500">Available 24/7</p>
      </div>
    </div>
  );
};

export default InfoCards;