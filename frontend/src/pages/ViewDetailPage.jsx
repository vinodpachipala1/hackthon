import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Base_url from "../components/Base_url";

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [finalResponse, setFinalResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAiFeedback, setShowAiFeedback] = useState(false);
  const [aiHelpful, setAiHelpful] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("officer_token");

        const res = await fetch(
          `${Base_url}/complaints/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch complaint");
        }

        const data = await res.json();

        setComplaint(data);
        setFinalResponse(data.auto_response || "");
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const updateComplaintStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("officer_token");

      const res = await fetch(
        `${Base_url}/complaints/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();

      setComplaint(updated);
      setSuccess(`Status updated to ${newStatus.replace("_", " ")}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("officer_token");
    localStorage.removeItem("officer_email");
    localStorage.removeItem("officer_role");
    navigate("/officer/login");
  };

  const getSentimentColor = (score) => {
    if (score >= 0.7) return "text-red-600";
    if (score >= 0.4) return "text-orange-600";
    return "text-green-600";
  };


  const submitResponse = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("officer_token");

      const res = await fetch(
        `${Base_url}/complaints/${id}/resolve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ final_response: finalResponse }),
        }
      );

      if (!res.ok) throw new Error("Failed to resolve complaint");

      const updated = await res.json();

      setComplaint(updated);
      setSuccess("✅ Response sent and complaint resolved");
      setShowAiFeedback(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAiFeedback = (helpful) => {
    setAiHelpful(helpful);

    // Mock API call
    setTimeout(() => {
      setSuccess(
        (prev) =>
          prev +
          ` AI feedback recorded: ${helpful ? "Helpful" : "Not helpful"}.`
      );
      setShowAiFeedback(false);
    }, 800);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4"
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
            <p className="text-gray-600">Loading complaint details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.history.back()}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Same as Dashboard */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/officer/dashboard")}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div className="bg-gradient-to-br from-red-600 to-red-800 p-2 rounded-lg mr-3">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Complaint Details
                </h1>
                <p className="text-sm text-gray-600">
                  Officer:{" "}
                  <span className="font-medium">
                    {localStorage.getItem("officer_email") || "Officer"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/officer/dashboard")}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-700 font-medium">{success}</span>
            </div>
          </div>
        )}

        {/* Complaint Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <div className="flex items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-900 mr-4">
                  {complaint.complaint_id}
                </h2>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    complaint.priority_level
                  )}`}
                >
                  {complaint.priority_level}
                </span>
              </div>
              <p className="text-gray-600">
                Registered on {new Date(complaint.created_at).toLocaleString()}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(
                  complaint.status
                )}`}
              >
                <div className="w-2 h-2 rounded-full bg-current mr-2 opacity-70"></div>
                {complaint.status.replace("_", " ")}
              </div>
            </div>
          </div>

          {/* Status Update Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {complaint.status === "ACTIVE" && (
              <button
                onClick={() => updateComplaintStatus("IN_PROGRESS")}
                className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Start Investigation
              </button>
            )}

            {complaint.status === "IN_PROGRESS" && (
              <button
                onClick={() => updateComplaintStatus("RESOLVED")}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Mark as Resolved
              </button>
            )}

            <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Download Attachment
            </button>

            <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Print Details
            </button>
          </div>

          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">
                Complainant Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{complaint.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">
                    {complaint.city}, {complaint.pincode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Incident Date:</span>
                  <span className="font-medium">{complaint.incident_date}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">
                Service Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type:</span>
                  <span className="font-medium">{complaint.service_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking Number:</span>
                  <span className="font-mono font-medium">
                    {complaint.tracking_number || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{complaint.department}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Complaint Details */}
          <div className="space-y-6">
            {/* Complaint Text */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Original Complaint
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {complaint.complaint_text}
                </p>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                AI Analysis
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Sentiment Analysis:</span>
                  <div className="flex items-center">
                    <span
                      className={`font-bold mr-2 ${getSentimentColor(
                        complaint.sentiment_score
                      )}`}
                    >
                      {(complaint.sentiment_score * 100).toFixed(0)}%
                    </span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getSentimentColor(
                          complaint.sentiment_score
                        ).replace("text-", "bg-")}`}
                        style={{
                          width: `${
                            Math.abs(complaint.sentiment_score) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-gray-700 mb-2 block">Category:</span>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {complaint.ai_category}
                  </span>
                </div>

                <div>
                  <span className="text-gray-700 mb-2 block">
                    Priority Reasons:
                  </span>
                  <ul className="space-y-2">
                    {complaint.priority_reasons?.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <span className="text-gray-600">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Response & Actions */}
          <div className="space-y-6">
            {/* AI Suggested Response */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg border border-purple-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
                  />
                </svg>
                AI Suggested Response
              </h3>

              <div className="bg-white p-4 rounded-lg border border-purple-200 mb-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {complaint.auto_response}
                </p>
              </div>

              <div className="text-sm text-purple-600 mb-4 flex items-center">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                This response was generated by AI based on complaint analysis
              </div>
            </div>

            {/* Officer Response */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Final Response
              </h3>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Edit and finalize response
                </label>
                <textarea
                  value={finalResponse}
                  onChange={(e) => setFinalResponse(e.target.value)}
                  rows="8"
                  className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Edit the AI-suggested response or write your own..."
                />
              </div>

              <div className="space-y-4">
                <button
                  onClick={submitResponse}
                  disabled={isSubmitting || !finalResponse.trim()}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  {isSubmitting ? (
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
                      Sending Response...
                    </>
                  ) : (
                    "Approve & Send Response"
                  )}
                </button>

                <div className="text-sm text-gray-600">
                  This will:
                  <ul className="list-disc ml-5 mt-1 space-y-1">
                    <li>Mark the complaint as RESOLVED</li>
                    <li>Send email response to complainant</li>
                    <li>Close this case</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Feedback Modal */}
            {showAiFeedback && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  AI Feedback
                </h3>
                <p className="text-gray-600 mb-4">
                  Was the AI-suggested response helpful for resolving this
                  complaint?
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => submitAiFeedback(true)}
                    disabled={aiHelpful !== null}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      aiHelpful === true
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    👍 Yes, very helpful
                  </button>
                  <button
                    onClick={() => submitAiFeedback(false)}
                    disabled={aiHelpful !== null}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      aiHelpful === false
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    👎 Could be better
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailPage;
