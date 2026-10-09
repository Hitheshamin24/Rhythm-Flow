import { useState, useEffect } from "react";
import { getPendingStaff, approveStaff, rejectStaff } from "../api/staff";
import { Loader2, UserCheck, UserX, Clock, Users } from "lucide-react";

const TrainerApprovalsPage = () => {
  const [pendingTrainers, setPendingTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // id of trainer being actioned

  const fetchPending = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getPendingStaff();
      setPendingTrainers(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pending trainers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveStaff(id);
      setPendingTrainers((prev) => prev.filter((t) => t._id !== id));
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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject trainer.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Trainer Approvals</h2>
          <p className="text-slate-500 text-sm mt-1">
            Review and approve or reject pending trainer requests for your studio.
          </p>
        </div>
        <button
          onClick={fetchPending}
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
          <p className="text-sm font-medium">Loading pending requests…</p>
        </div>
      ) : pendingTrainers.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
            <Users size={28} className="text-rose-400" />
          </div>
          <div className="text-center">
            <p className="text-slate-700 font-semibold">No pending requests</p>
            <p className="text-sm text-slate-400 mt-1">
              All trainer requests have been processed.
            </p>
          </div>
        </div>
      ) : (
        /* Trainer Cards */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pendingTrainers.map((trainer) => (
            <div
              key={trainer._id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              {/* Avatar + Info */}
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-lg shrink-0">
                  {trainer.name?.charAt(0).toUpperCase() || "T"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{trainer.name}</p>
                  <p className="text-xs text-slate-500 truncate">{trainer.email}</p>
                </div>
              </div>

              {/* Status Badge + Date */}
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

              {/* Action Buttons */}
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
  );
};

export default TrainerApprovalsPage;
