import { useState } from "react";
import axios from "axios";
import ComplaintForm from "../components/ComplaintForm";
import OTPModal from "../components/OTPModal";
import InfoCards from "../components/InfoCards";
import SuccessMessage from "../components/SuccessMessage";
import Base_url from "../components/Base_url";

const ComplaintPage = () => {
  const [formData, setFormData] = useState({
    serviceType: "",
    complaintType: "",
    complaintText: "",
    email: "",
    trackingNumber: "",
    incidentDate: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [successComplaintId, setSuccessComplaintId] = useState(null);

  /* =========================
     STEP 1: SEND OTP (EMAIL)
  ========================== */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${Base_url}/registration/send`, {
        email: formData.email,
      });

      setShowOtpModal(true);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STEP 2: VERIFY OTP + CREATE COMPLAINT
  ========================== */
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(
        `${Base_url}/registration/verify`,
        {
          email: formData.email,
          otp,
          complaintData: {
            service_type: formData.serviceType,
            complaint_type: formData.complaintType,
            complaint_text: formData.complaintText,
            tracking_number: formData.trackingNumber,
            incident_date: formData.incidentDate,
            city: formData.city,
            pincode: formData.pincode,
          },
        }
      );

      setSuccessComplaintId(res.data.complaintId);
      setShowOtpModal(false);
      setMessage(
        `Complaint registered successfully. ID: ${res.data.complaintId}`
      );

      // Reset form
      setFormData({
        serviceType: "",
        complaintType: "",
        complaintText: "",
        email: "",
        trackingNumber: "",
        incidentDate: "",
        city: "",
        pincode: "",
      });
      setOtp("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  };

  /* =========================
     RESEND OTP
  ========================== */
  const handleResendOtp = async () => {
    try {
      await axios.post(`${Base_url}/registration/send`, {
        email: formData.email,
      });
      setMessage("OTP resent successfully");
    } catch {
      setMessage("Failed to resend OTP");
    }
  };

  const handleCancelOtp = () => {
    setShowOtpModal(false);
    setOtp("");
  };

  const handleCloseMessage = () => {
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-2">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-6 shadow-xl ring-4 ring-red-100">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Register <span className="text-red-700">Complaint</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Submit your complaint regarding postal services with secure OTP verification
          </p>
          <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold mt-4">
            भारतीय डाक | India Post
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <ComplaintForm
              formData={formData}
              setFormData={setFormData}
              loading={loading}
              onSubmit={handleFormSubmit}
            />
            
            <InfoCards />
          </div>

          {/* Sidebar Help Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Process Steps */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="bg-red-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  Registration Process
                </h3>
                <div className="space-y-4">
                  {[
                    { num: "1", title: "Fill Form", desc: "Provide complaint details" },
                    { num: "2", title: "OTP Verification", desc: "Verify email with OTP" },
                    { num: "3", title: "Confirmation", desc: "Receive complaint ID" },
                  ].map((step) => (
                    <div key={step.num} className="flex items-start">
                      <div className="bg-gradient-to-r from-red-100 to-red-50 text-red-700 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
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

              {/* Help Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Helpful Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Provide accurate email for OTP verification
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Include tracking number if available
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Be specific in complaint description
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save your complaint ID for tracking
                  </li>
                </ul>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/70 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">24h</div>
                    <div className="text-xs text-gray-600">Avg. Response</div>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">98%</div>
                    <div className="text-xs text-gray-600">Resolution Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <OTPModal
          email={formData.email}
          otp={otp}
          setOtp={setOtp}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          onCancel={handleCancelOtp}
        />
      )}

      {message && (
        <SuccessMessage message={message} onClose={handleCloseMessage} />
      )}
    </div>
  );
};

export default ComplaintPage;