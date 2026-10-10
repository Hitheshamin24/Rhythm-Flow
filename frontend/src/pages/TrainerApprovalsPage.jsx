import { useState, useEffect } from "react";
import { getPendingStaff, approveStaff, rejectStaff, getAllStaff } from "../api/staff";
import { Loader2, UserCheck, UserX, Clock, Users, Trash2 } from "lucide-react";

const TrainerApprovalsPage = () => {
  const [pendingTrainers, setPendingTrainers] = useState([]);
  const [approvedTrainers, setApprovedTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // id of trainer being actioned

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        getPendingStaff(),
        getAllStaff()
      ]);
      setPendingTrainers(pendingRes.data || []);
      setApprovedTrainers(approvedRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveStaff(id);
      setPendingTrainers((prev) => prev.filter((t) => t._id !== id));
      fetchData(); // Refresh to move it to approved
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve trainer.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await rejectStaff(id);
      setPendingTrainers((prev) => prev.filter((t) => t._id !== id));
      setApprovedTrainers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject/remove trainer.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Trainers</h2>
          <p className="text-slate-500 text-sm mt-1">
            Review pending requests and manage approved trainers for your studio.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors px-3 py-1.5 border border-rose-200 rounded-lg hover:bg-rose-50"
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4">
          <span className="text-lg leading-none">⚠️</span>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-sm font-medium">Loading trainers...</p>
        </div>
      ) : (
        <>
          {/* Pending Requests Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-amber-500" />
              Pending Requests ({pendingTrainers.length})
            </h3>
            
            {pendingTrainers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Users size={24} className="text-slate-300" />
                <p className="text-sm">No pending requests</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pendingTrainers.map((trainer) => (
                  <div
                    key={trainer._id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-lg shrink-0">
                        {trainer.name?.charAt(0).toUpperCase() || "T"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{trainer.name}</p>
                        <p className="text-xs text-slate-500 truncate">{trainer.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                        <Clock size={11} />
                        Pending
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(trainer.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-auto pt-2 border-t border-slate-50">
                      <button
                        onClick={() => handleApprove(trainer._id)}
                        disabled={actionLoading === trainer._id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
                      >
                        {actionLoading === trainer._id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <UserCheck size={13} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(trainer._id)}
                        disabled={actionLoading === trainer._id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold transition-colors disabled:opacity-60"
                      >
                        {actionLoading === trainer._id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <UserX size={13} />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Trainers Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <UserCheck size={18} className="text-emerald-500" />
              Approved Trainers ({approvedTrainers.length})
            </h3>
            
            {approvedTrainers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Users size={24} className="text-slate-300" />
                <p className="text-sm">No approved trainers yet</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {approvedTrainers.map((trainer) => (
                  <div
                    key={trainer._id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg shrink-0">
                        {trainer.name?.charAt(0).toUpperCase() || "T"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{trainer.name}</p>
                        <p className="text-xs text-slate-500 truncate">{trainer.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        <UserCheck size={11} />
                        Approved
                      </span>
                      <span className="text-xs text-slate-400">
                        Joined {new Date(trainer.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-auto pt-2 border-t border-slate-50">
                      <button
                        onClick={() => handleReject(trainer._id)}
                        disabled={actionLoading === trainer._id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold transition-colors disabled:opacity-60"
                      >
                        {actionLoading === trainer._id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TrainerApprovalsPage;
