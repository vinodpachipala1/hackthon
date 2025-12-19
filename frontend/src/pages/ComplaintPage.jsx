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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Register a Complaint
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Submit your complaint regarding postal services. We'll respond within
          24–48 hours.
        </p>
      </div>

      {/* Complaint Form */}
      <ComplaintForm
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        onSubmit={handleFormSubmit}
      />

      <InfoCards />

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
