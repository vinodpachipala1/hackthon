import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Base_url from "../components/Base_url";

const OfficerDashboardPage = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
  });

  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
  });

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("officer_token");
    if (!token) navigate("/officer/login");
  }, [navigate]);

  /* ---------------- FETCH COMPLAINTS ---------------- */
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("officer_token");

        const { data } = await axios.get(`${Base_url}/complaints`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setComplaints(data);
        setFilteredComplaints(data);
        calculateStats(data);
      } catch (err) {
        setError("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  /* ---------------- FILTER LOGIC ---------------- */
  useEffect(() => {
    let result = complaints;

    if (filters.status !== "all") {
      result = result.filter((c) => c.status === filters.status);
    }

    if (filters.priority !== "all") {
      result = result.filter((c) => c.priority_level === filters.priority);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.complaint_id.toLowerCase().includes(q) ||
          c.service_type.toLowerCase().includes(q) ||
          c.ai_category?.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    setFilteredComplaints(result);
  }, [filters, complaints]);

  /* ---------------- HELPERS ---------------- */
  const calculateStats = (data) => {
    setStats({
      total: data.length,
      pending: data.filter((c) => c.status === "ACTIVE").length,
      inProgress: data.filter((c) => c.status === "IN_PROGRESS").length,
      resolved: data.filter((c) => c.status === "RESOLVED").length,
      critical: data.filter((c) => c.priority_level === "CRITICAL").length,
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/officer/login");
  };

  /* ---------------- STATUS UPDATE ---------------- */
  const handleUpdateStatus = async (complaintId, status) => {
    try {
      const token = localStorage.getItem("officer_token");

      await axios.patch(
        `${Base_url}/complaints/${complaintId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = complaints.map((c) =>
        c.complaint_id === complaintId ? { ...c, status } : c
      );

      setComplaints(updated);
      calculateStats(updated);
    } catch {
      alert("Failed to update complaint status");
    }
  };

  /* ---------------- UI HELPERS ---------------- */
  const getPriorityColor = (p) =>
    p === "CRITICAL"
      ? "bg-red-100 text-red-800"
      : p === "HIGH"
      ? "bg-orange-100 text-orange-800"
      : p === "MEDIUM"
      ? "bg-yellow-100 text-yellow-800"
      : p === "LOW"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

  const getStatusColor = (s) =>
    s === "ACTIVE"
      ? "bg-blue-100 text-blue-800"
      : s === "IN_PROGRESS"
      ? "bg-purple-100 text-purple-800"
      : s === "RESOLVED"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

  /* ---------------- JSX ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
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
                <h1 className="text-2xl font-bold text-gray-900">
                  Officer Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome,{" "}
                  <span className="font-medium">
                    {localStorage.getItem("officer_email") || "Officer"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Back to Home
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Complaints</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-orange-600"
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
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.inProgress}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-600"
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
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.resolved}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Issues</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.critical}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                <input
                  type="text"
                  placeholder="Search by ID, service, category, or email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-10 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Priority</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">
              {filteredComplaints.length} complaints found
            </span>
            {(filters.status !== "all" ||
              filters.priority !== "all" ||
              filters.search) && (
              <button
                onClick={() =>
                  setFilters({ status: "all", priority: "all", search: "" })
                }
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-red-600 to-red-800"></div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
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
                <p className="text-gray-600">Loading complaints...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={() => window.location.reload()}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Complaint ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Service Type
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Category
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Priority
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Created
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-8 text-gray-500"
                          >
                            <svg
                              className="w-12 h-12 text-gray-300 mx-auto mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            No complaints found matching your filters
                          </td>
                        </tr>
                      ) : (
                        filteredComplaints.map((complaint) => (
                          <tr
                            key={complaint.complaint_id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-4 px-4">
                              <div className="font-mono font-medium text-gray-900">
                                {complaint.complaint_id}
                              </div>
                              <div className="text-xs text-gray-500">
                                {complaint.email}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium text-gray-900">
                                {complaint.service_type}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-gray-900">
                                {complaint.ai_category}
                              </div>
                              
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                  complaint.priority_level
                                )}`}
                              >
                                {complaint.priority_level}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  complaint.status
                                )}`}
                              >
                                {complaint.status.replace("_", " ")}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {new Date(
                                complaint.created_at
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-col space-y-2">
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/officer/complaints/${complaint.complaint_id}`
                                    )
                                  }
                                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                                >
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
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  View Details
                                </button>

                                {complaint.status === "ACTIVE" && (
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        complaint.complaint_id,
                                        "IN_PROGRESS"
                                      )
                                    }
                                    className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center"
                                  >
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
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                      />
                                    </svg>
                                    Start Investigation
                                  </button>
                                )}

                                {complaint.status === "IN_PROGRESS" && (
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        complaint.complaint_id,
                                        "RESOLVED"
                                      )
                                    }
                                    className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center"
                                  >
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
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    Mark Resolved
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination (Optional) */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {filteredComplaints.length}
                    </span>{" "}
                    of <span className="font-medium">{complaints.length}</span>{" "}
                    complaints
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-3">
              📊 Priority Distribution
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Critical</span>
                <span className="font-medium">{stats.critical}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">High</span>
                <span className="font-medium">
                  {complaints.filter((c) => c.priority_level === "HIGH").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Medium</span>
                <span className="font-medium">
                  {
                    complaints.filter((c) => c.priority_level === "MEDIUM")
                      .length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Low</span>
                <span className="font-medium">
                  {
                    complaints.filter((c) => c.priority_level === "LOW")
                      .length
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <h3 className="font-bold text-gray-900 mb-3">🚀 Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/officer/analytics")}
                className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                📈 View Analytics Dashboard
              </button>
              <button
                onClick={() => alert("Export feature coming soon!")}
                className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                📥 Export Complaints Report
              </button>
              <button
                onClick={() => alert("Settings feature coming soon!")}
                className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                ⚙️ Officer Settings
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
            <h3 className="font-bold text-gray-900 mb-3">ℹ️ System Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Officer Role:</span>
                <span className="font-medium">Complaint Handler</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Last Login:</span>
                <span className="font-medium">Today, 09:45 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Session Expires:</span>
                <span className="font-medium">In 2 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">AI Accuracy:</span>
                <span className="font-medium text-green-600">94.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboardPage;