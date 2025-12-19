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
        status: data.status || "ACTIVE",
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
          {
            date: new Date(Date.now() - 86400000).toLocaleString("en-IN"),
            status: "Assigned",
            description: "Complaint assigned to concerned department",
          },
          {
            date: new Date().toLocaleString("en-IN"),
            status: "Processing",
            description: "Officer is investigating the issue",
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

  // Status mapping to our 3 states
  const getMappedStatus = (status) => {
    const statusMap = {
      'Registered': 'ACTIVE',
      'Under Review': 'IN_PROGRESS',
      'Under Investigation': 'IN_PROGRESS',
      'Resolved': 'RESOLVED',
      'Rejected': 'ACTIVE',
      'Escalated': 'IN_PROGRESS',
      'Pending': 'ACTIVE',
      'ACTIVE': 'ACTIVE',
      'IN_PROGRESS': 'IN_PROGRESS',
      'RESOLVED': 'RESOLVED'
    };
    return statusMap[status] || 'ACTIVE';
  };

  const getStatusColor = (status) => {
    const mappedStatus = getMappedStatus(status);
    const statusColors = {
      ACTIVE: "bg-gradient-to-r from-red-500 to-red-600",
      IN_PROGRESS: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      RESOLVED: "bg-gradient-to-r from-green-500 to-green-600",
    };
    return statusColors[mappedStatus] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  const getStatusTextColor = (status) => {
    const mappedStatus = getMappedStatus(status);
    const statusColors = {
      ACTIVE: "text-red-700",
      IN_PROGRESS: "text-yellow-700",
      RESOLVED: "text-green-700",
    };
    return statusColors[mappedStatus] || "text-gray-700";
  };

  const getStatusBgColor = (status) => {
    const mappedStatus = getMappedStatus(status);
    const statusColors = {
      ACTIVE: "bg-red-50",
      IN_PROGRESS: "bg-yellow-50",
      RESOLVED: "bg-green-50",
    };
    return statusColors[mappedStatus] || "bg-gray-50";
  };

  const getStatusBorderColor = (status) => {
    const mappedStatus = getMappedStatus(status);
    const statusColors = {
      ACTIVE: "border-red-200",
      IN_PROGRESS: "border-yellow-200",
      RESOLVED: "border-green-200",
    };
    return statusColors[mappedStatus] || "border-gray-200";
  };

  const getStatusIcon = (status) => {
    const mappedStatus = getMappedStatus(status);
    const icons = {
      ACTIVE: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      IN_PROGRESS: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      RESOLVED: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[mappedStatus];
  };

  const getStatusSteps = () => {
    const mappedStatus = result ? getMappedStatus(result.status) : 'ACTIVE';
    
    const steps = [
      { id: 1, title: "ACTIVE", description: "Complaint Registered" },
      { id: 2, title: "IN_PROGRESS", description: "Under Investigation" },
      { id: 3, title: "RESOLVED", description: "Issue Resolved" },
    ];

    let activeStep = 1;
    if (mappedStatus === 'IN_PROGRESS') activeStep = 2;
    if (mappedStatus === 'RESOLVED') activeStep = 3;

    return { steps, activeStep };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-2">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-6 shadow-xl ring-4 ring-red-100">
            <svg
              className="w-10 h-10 text-white"
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Track Your <span className="text-red-700">Complaint</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your Complaint ID and registered email to securely access complaint status
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tracking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
              <div className="p-1 bg-gradient-to-r from-red-600 to-red-800"></div>

              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Track Complaint</h2>
                </div>

                <form onSubmit={trackComplaint} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Complaint ID */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        Complaint ID <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                        </div>
                        <input
                          placeholder="IP-CMP-XXXXXX"
                          value={complaintId}
                          onChange={(e) => setComplaintId(e.target.value)}
                          required
                          className="w-full pl-10 border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        Registered Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-10 border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-blue-800 font-medium mb-1">Secure Verification Required</p>
                        <p className="text-sm text-blue-600">
                          We'll send an OTP to your registered email for identity verification before showing complaint details.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
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
                      <>
                        <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Track Complaint
                      </>
                    )}
                  </button>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-700 font-medium">{error}</span>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Results Section */}
            {result && isVerified && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-1 bg-gradient-to-r from-green-600 to-green-800"></div>

                <div className="p-8">
                  {/* Status Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Complaint Details</h2>
                      <p className="text-gray-600 mt-1">ID: {result.complaintId}</p>
                    </div>
                    <div className={`mt-4 md:mt-0 px-5 py-2.5 rounded-xl ${getStatusBgColor(result.status)} border ${getStatusBorderColor(result.status)} ${getStatusTextColor(result.status)} font-semibold flex items-center`}>
                      {getStatusIcon(result.status)}
                      <span className="ml-2">{result.status}</span>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="mb-10">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Complaint Status Progress</h3>
                    <div className="relative">
                      {/* Progress line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
                      <div className={`absolute top-1/2 left-0 h-1 ${getStatusColor(result.status)} -translate-y-1/2 transition-all duration-500`} 
                           style={{ 
                             width: result.status === 'ACTIVE' ? '33%' : 
                                    result.status === 'IN_PROGRESS' ? '66%' : '100%' 
                           }}>
                      </div>
                      
                      {/* Steps */}
                      <div className="relative flex justify-between">
                        {getStatusSteps().steps.map((step, index) => {
                          const isCompleted = step.id <= getStatusSteps().activeStep;
                          const isActive = step.id === getStatusSteps().activeStep;
                          
                          return (
                            <div key={step.id} className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isCompleted ? getStatusColor(result.status) : 'bg-gray-200'} ${isActive ? 'ring-4 ring-opacity-30 ring-current' : ''}`}>
                                <span className={`font-semibold ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                                  {isCompleted ? '✓' : step.id}
                                </span>
                              </div>
                              <span className={`text-sm font-medium ${isCompleted ? getStatusTextColor(result.status) : 'text-gray-500'}`}>
                                {step.title}
                              </span>
                              <span className="text-xs text-gray-500 mt-1 text-center">{step.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Category</p>
                      <p className="text-lg font-semibold text-gray-900">{result.category}</p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Priority</p>
                      <div className="inline-flex items-center px-3 py-1 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-full text-sm font-medium">
                        {result.priority}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Assigned To</p>
                      <p className="text-lg font-semibold text-gray-900">{result.assignedTo}</p>
                    </div>
                  </div>

                  {/* Latest Update */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Update</h3>
                    <div className={`p-5 rounded-xl border ${getStatusBorderColor(result.status)} ${getStatusBgColor(result.status)}`}>
                      <p className="text-gray-700">{result.lastComment}</p>
                      <div className="flex items-center mt-3 text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Updated on {result.updatedAt}
                      </div>
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                    <div className="flex items-start">
                      <div className="bg-red-100 p-3 rounded-lg mr-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">Need Assistance?</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Contact our customer support for any queries regarding your complaint
                        </p>
                        <p className="font-bold text-lg text-red-700">1800-266-6868</p>
                        <p className="text-xs text-gray-500">24/7 Complaint Support</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Info & Help */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Process Steps */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="bg-red-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  Tracking Process
                </h3>
                <div className="space-y-4">
                  {[
                    { num: "1", title: "Enter Details", desc: "Provide Complaint ID & Email" },
                    { num: "2", title: "Verify OTP", desc: "Enter 6-digit code from email" },
                    { num: "3", title: "View Status", desc: "See detailed complaint progress" }
                  ].map((step) => (
                    <div key={step.num} className="flex items-start">
                      <div className="bg-red-100 text-red-700 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        {step.num}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{step.title}</p>
                        <p className="text-sm text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Guide */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Status Guide
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">ACTIVE</span>
                    <span className="text-xs text-gray-500 ml-auto">Complaint registered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">IN_PROGRESS</span>
                    <span className="text-xs text-gray-500 ml-auto">Under investigation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">RESOLVED</span>
                    <span className="text-xs text-gray-500 ml-auto">Issue resolved</span>
                  </div>
                </div>
              </div>

              {/* Quick Help */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Help</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Find Complaint ID in your confirmation email
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    OTP is valid for 5 minutes
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Check spam folder if OTP not received
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Verify Your Identity</h2>
                  <p className="text-red-100 text-sm mt-1">
                    OTP sent to <strong>{email}</strong>
                  </p>
                </div>
              </div>
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
                  For security, please verify your email before accessing complaint details.
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
                      className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
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
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3.5 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Verify & View Details
                </button>

                <button
                  onClick={resendOtp}
                  disabled={otpTimer > 0}
                  className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {otpTimer > 0
                    ? `Resend OTP in ${formatTime(otpTimer)}`
                    : "Resend OTP"}
                </button>

                <button
                  onClick={cancelOtp}
                  className="w-full text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-100 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintTrackingPage;