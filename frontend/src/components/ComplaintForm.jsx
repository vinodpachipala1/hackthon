import React from "react";

const ComplaintForm = ({ formData, setFormData, loading, onSubmit }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
      <div className="p-1 bg-gradient-to-r from-red-600 to-red-800"></div>
      
      <div className="p-8 md:p-10">
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Service Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select 
              name="serviceType" 
              onChange={handleChange}
              value={formData.serviceType}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            >
              <option value="">Select Service Type</option>
              <option value="Speed Post">Speed Post</option>
              <option value="Registered Post">Registered Post</option>
              <option value="Parcel">Parcel</option>
              <option value="Money Order">Money Order</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Complaint Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nature of Complaint <span className="text-red-500">*</span>
            </label>
            <select 
              name="complaintType" 
              onChange={handleChange}
              value={formData.complaintType}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            >
              <option value="">Select Nature of Complaint</option>
              <option value="Delay in delivery">Delay in delivery</option>
              <option value="Lost / Non-delivery">Lost / Non-delivery</option>
              <option value="Wrong delivery">Wrong delivery</option>
              <option value="Staff behavior">Staff behavior</option>
              <option value="Refund / Payment issue">Refund / Payment issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Complaint Details */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Details of the Complaint <span className="text-red-500">*</span>
            </label>
            <textarea
              name="complaintText"
              value={formData.complaintText}
              onChange={handleChange}
              placeholder="Please describe your complaint in detail..."
              required
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Tracking Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tracking / Reference Number <span className="text-gray-400 text-sm font-normal">(Optional)</span>
            </label>
            <input
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              placeholder="e.g., EI123456789IN"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Two Column Layout for Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Incident Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Incident Date <span className="text-gray-400 text-sm font-normal">(Optional)</span>
              </label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                City <span className="text-gray-400 text-sm font-normal">(Optional)</span>
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Mumbai"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* PIN Code */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              PIN Code <span className="text-gray-400 text-sm font-normal">(Optional)</span>
            </label>
            <input
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="e.g., 400001"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Terms and Conditions */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-start mb-6">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 mt-1"
              />
              <label htmlFor="terms" className="ml-2 text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-red-600 hover:underline font-medium">
                  Terms of Service
                </a>{" "}
                and confirm that all information provided is accurate.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting Complaint...
                </>
              ) : (
                "Register Complaint"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;