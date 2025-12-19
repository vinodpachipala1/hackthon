import React, { useState, useEffect } from "react";

const OTPModal = ({ email, otp, setOtp, onVerify, onResend, onCancel }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [initialCooldown, setInitialCooldown] = useState(300); // 5 minutes for first OTP
  const [isInitialOtp, setIsInitialOtp] = useState(true);

  // Timer for resend cooldown
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);

  // Timer for initial OTP validity (5 minutes)
  useEffect(() => {
    let timer;
    if (initialCooldown > 0) {
      timer = setInterval(() => {
        setInitialCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [initialCooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6 || isVerifying) return;
    
    setIsVerifying(true);
    try {
      await onVerify();
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (isResending || resendCooldown > 0) return;
    
    setIsResending(true);
    try {
      await onResend();
      // After resend, set 2 minutes cooldown (120 seconds) for subsequent OTPs
      setResendCooldown(120);
      setIsInitialOtp(false);
      // Reset initial cooldown timer for the new OTP
      setInitialCooldown(300);
    } catch (error) {
      console.error("Resend failed:", error);
    } finally {
      setIsResending(false);
    }
  };

  const handleCancel = () => {
    if (isVerifying || isResending) return;
    onCancel();
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Check if resend button should be disabled
  const isResendDisabled = isResending || resendCooldown > 0 || isVerifying;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Email Verification Required</h2>
              <p className="text-red-100 text-sm mt-1">
                OTP sent to <span className="font-semibold">{email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                6-digit
              </div>
            </div>
            <p className="text-gray-700 mb-2">
              Enter verification code sent to your email
            </p>
            <p className="text-gray-500 text-sm">
              This helps us verify your identity securely
            </p>
          </div>

          {/* Timers Display */}
          <div className="mb-6 space-y-3">
            {/* Initial OTP Validity Timer */}
            <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-100">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-700">OTP valid for:</span>
              </div>
              <div className={`text-sm font-semibold ${initialCooldown > 60 ? 'text-green-600' : 'text-red-600'}`}>
                {formatTime(initialCooldown)}
              </div>
            </div>

            {/* Resend Cooldown Timer */}
            {resendCooldown > 0 && (
              <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-700">Next OTP available in:</span>
                </div>
                <div className="text-sm font-semibold text-yellow-600">
                  {formatTime(resendCooldown)}
                </div>
              </div>
            )}
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              className="w-full text-center text-3xl tracking-widest font-semibold border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-200"
              disabled={isVerifying || isResending}
            />
            <div className="flex justify-between mt-3">
              <span className="text-sm text-gray-500">Format: 123456</span>
              <span className="text-sm text-gray-500">{otp.length}/6</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying || isResending}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3.5 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10">Verify & Submit Complaint</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleResend}
                disabled={isResendDisabled}
                className="border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group relative"
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </div>
                ) : resendCooldown > 0 ? (
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTime(resendCooldown)}</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Resend OTP</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCancel}
                disabled={isVerifying || isResending}
                className="border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
              >
                <svg className="w-5 h-5 mr-2 text-gray-600 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-start space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p>First OTP valid for 5 minutes</p>
                <p className="mt-1 text-xs text-gray-400">
                  After first OTP expires, wait 2 minutes before requesting new OTP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar for Verification */}
        {(isVerifying || isResending) && (
          <div className="px-6 pb-6">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full w-full animate-pulse ${
                isVerifying ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
              }`}></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2 animate-pulse">
              {isVerifying ? 'Verifying OTP with India Post servers...' : 'Sending new OTP...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPModal;