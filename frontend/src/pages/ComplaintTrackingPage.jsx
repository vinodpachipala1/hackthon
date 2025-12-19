import { useState } from "react";
import Base_url from "../components/Base_url";
import axios from "axios";

const ComplaintTrackingPage = () => {
  const [complaintId, setComplaintId] = useState("");
  const [email, setEmail] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const [isVerified, setIsVerified] = useState(false);

  // OTP input handlers
  const handleOtpInput = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const startOtpTimer = () => {
    const timer = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Track complaint function
  const trackComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${Base_url}/otp/tracking/send`, {
        complaintId,
        email,
      });

      setShowOtpModal(true);
      setOtpTimer(300);
      startOtpTimer();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP function
  const verifyOtp = async () => {
    const otpString = otp.join("");

    try {
      await axios.post(`${Base_url}/otp/tracking/verify`, {
        complaintId,
        otp: otpString,
      });

      const { data } = await axios.get(`${Base_url}/complaints/${complaintId}`);

      setResult({
        complaintId: data.complaint_id,
        status: data.status,
        category: data.complaint_type,
        priority: data.priority_level || "MEDIUM",
        updatedAt: new Date(data.created_at).toLocaleString("en-IN"),
        assignedTo: "India Post Officer",
        estimatedResolution: "Within 48 hours",
        lastComment: data.auto_response || "Under processing",
        history: [
          {
            date: new Date(data.created_at).toLocaleString("en-IN"),
            status: "Registered",
            description: "Complaint registered successfully",
          },
        ],
      });

      setIsVerified(true);
      setShowOtpModal(false);
    } catch (err) {
      setOtpError(err.response?.data?.message || "OTP verification failed");
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post(`${Base_url}/otp/tracking/send`, {
        complaintId,
        email,
      });

      setOtpTimer(300);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  const cancelOtp = () => {
    setShowOtpModal(false);
    setOtp(["", "", "", "", "", ""]);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Registered: "bg-blue-100 text-blue-800",
      "Under Review": "bg-yellow-100 text-yellow-800",
      "Under Investigation": "bg-orange-100 text-orange-800",
      Resolved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Escalated: "bg-purple-100 text-purple-800",
      Pending: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const priorityColors = {
      High: "bg-red-100 text-red-800 border-red-200",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Low: "bg-green-100 text-green-800 border-green-200",
    };
    return priorityColors[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your <span className="text-red-700">Complaint</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your Complaint ID and registered email to check the current
            status and updates
          </p>
          <p className="text-sm text-red-600 mt-2">
            🔐 Secure verification required to access complaint details
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
          <div className="p-1 bg-gradient-to-r from-red-600 to-red-800"></div>

          <div className="p-8 md:p-10">
            <form onSubmit={trackComplaint} className="space-y-6">
              {/* Complaint ID */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Complaint ID <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="e.g., IP-CMP-1021"
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can find this ID in your confirmation email
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Registered Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the email used during complaint registration
                </p>
              </div>

              {/* Security Note */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <div>
                    <p className="text-blue-700 font-medium mb-1">
                      Security Notice
                    </p>
                    <p className="text-sm text-blue-600">
                      For security, we'll send an OTP to your registered email.
                      You need to verify before accessing complaint details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP to Track"
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                <h2 className="text-xl font-bold">Verify Your Identity</h2>
                <p className="text-red-100 text-sm mt-1">
                  Enter OTP sent to <strong>{email}</strong>
                </p>
                <p className="text-xs text-red-200 mt-1">(Demo: Use 123456)</p>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Enter the 6-digit verification code
                  </p>
                  <p className="text-sm text-gray-500">
                    For security, please verify your email before accessing
                    complaint details.
                  </p>
                </div>

                {/* OTP Inputs */}
                <div className="mb-6">
                  <div className="flex justify-center space-x-2 mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpInput(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    ))}
                  </div>
                  {otpError && (
                    <p className="text-red-500 text-sm text-center">
                      {otpError}
                    </p>
                  )}
                </div>

                {/* Timer */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span
                      className={`font-mono ${
                        otpTimer < 60 ? "text-red-600" : "text-gray-700"
                      }`}
                    >
                      {formatTime(otpTimer)}
                    </span>
                  </div>
                  {otpTimer === 0 && (
                    <p className="text-red-500 text-sm mt-2">
                      OTP expired. Please request a new one.
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={verifyOtp}
                    disabled={otp.some((d) => !d)}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Verify & View Details
                  </button>

                  <button
                    onClick={resendOtp}
                    disabled={otpTimer > 0}
                    className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {otpTimer > 0
                      ? `Resend OTP in ${formatTime(otpTimer)}`
                      : "Resend OTP"}
                  </button>

                  <button
                    onClick={cancelOtp}
                    className="w-full text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section (Only shows after OTP verification) */}
        {result && isVerified && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-green-600 to-green-800"></div>

            <div className="p-8 md:p-10">
              {/* Verified Banner */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-green-700 font-medium">
                    Identity verified successfully. Showing protected complaint
                    details.
                  </span>
                </div>
              </div>

              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Complaint Details
                  </h2>
                  <p className="text-gray-600">
                    Last updated: {result.updatedAt}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full ${getStatusColor(
                    result.status
                  )} font-medium mt-4 md:mt-0`}
                >
                  <div className="w-2 h-2 rounded-full bg-current mr-2 opacity-70"></div>
                  {result.status}
                </div>
              </div>

              {/* Main Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Complaint ID */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Complaint ID</p>
                  <p className="text-lg font-bold text-gray-900">
                    {result.complaintId}
                  </p>
                </div>

                {/* Priority */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Priority</p>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full ${getPriorityColor(
                      result.priority
                    )} font-medium`}
                  >
                    {result.priority}
                  </div>
                </div>

                {/* Category */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="text-lg font-medium text-gray-900">
                    {result.category}
                  </p>
                </div>

                {/* Assigned To */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Assigned Officer</p>
                  <p className="text-lg font-medium text-gray-900">
                    {result.assignedTo}
                  </p>
                </div>
              </div>

              {/* Estimated Resolution */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-8">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Estimated Resolution
                  </h3>
                </div>
                <p className="text-lg font-medium text-blue-700">
                  {result.estimatedResolution}
                </p>
              </div>

              {/* Latest Update */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Latest Update
                </h3>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <p className="text-gray-700">{result.lastComment}</p>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Updated on {result.updatedAt}
                  </div>
                </div>
              </div>

              {/* Status History */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Status History
                </h3>
                <div className="space-y-4">
                  {result.history &&
                    result.history.map((item, index) => (
                      <div key={index} className="flex items-start">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center mr-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              index === 0 ? "bg-green-500" : "bg-gray-300"
                            }`}
                          ></div>
                          {index < result.history.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-300 mt-1"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4 border-b border-gray-200 last:border-b-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-gray-900">
                              {item.status}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {item.date}
                            </span>
                          </div>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-100 p-2 rounded-lg mr-3">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800">Need Help?</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    If you have any questions about your complaint status,
                    contact our support team:
                  </p>
                  <p className="font-bold text-lg text-red-700">
                    1800-XXX-XXXX
                  </p>
                  <p className="text-xs text-gray-500">
                    Available 24/7 for complaint-related queries
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information for First-time Users */}
        {!isVerified && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🔐 Secure Tracking Process
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <span className="text-red-600 font-bold">1</span>
                  </div>
                  <h4 className="font-bold text-gray-800">Enter Details</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Provide your Complaint ID and registered email address for
                  verification.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <span className="text-red-600 font-bold">2</span>
                  </div>
                  <h4 className="font-bold text-gray-800">Verify OTP</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit OTP sent to your email for identity
                  verification.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <span className="text-red-600 font-bold">3</span>
                  </div>
                  <h4 className="font-bold text-gray-800">View Details</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Access complete complaint status, history, and estimated
                  resolution time.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-blue-600 mt-1 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Why OTP Verification?
                  </h4>
                  <p className="text-sm text-gray-600">
                    We use OTP verification to protect your privacy and ensure
                    that only authorized persons can access complaint details.
                    This prevents unauthorized access to sensitive information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintTrackingPage;
