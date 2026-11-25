import { useStaff } from "../../hooks/useStaff";
import { Loader2, UserCheck, UserX, Clock, Users, Trash2 } from "lucide-react";

const TrainerApprovalsPage = () => {
  const { pendingTrainers, approvedTrainers, loading, error, actionLoading, fetchData, handleApprove, handleReject } = useStaff();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline-lg text-slate-900 dark:text-[#f3dde7]">Manage Trainers</h2>
          <p className="text-slate-500 dark:text-[#e0bec6] text-sm mt-1">Review pending requests and manage approved trainers for your studio.</p>
        </div>
        <button onClick={fetchData} className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-colors px-3 py-1.5 border border-rose-200 dark:border-rose-900/40 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30">Refresh</button>
      </div>

      {error && (
        <div className="flex items-start gap-3 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-4">
          <span className="text-lg leading-none">⚠️</span>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-on-surface-variant gap-3">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-sm font-medium">Loading trainers...</p>
        </div>
      ) : (
        <>
          {/* Pending */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-[#f3dde7] flex items-center gap-2"><Clock size={18} className="text-amber-500" /> Pending Requests ({pendingTrainers.length})</h3>
            {pendingTrainers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-on-surface-variant gap-3 bg-white dark:bg-surface-container-low rounded-2xl border border-slate-100 dark:border-outline-variant/20 shadow-sm">
                <Users size={24} className="text-slate-300 dark:text-outline" /><p className="text-sm">No pending requests</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pendingTrainers.map((trainer) => (
                  <div key={trainer._id} className="bg-white dark:bg-surface-container-low rounded-2xl border border-slate-100 dark:border-outline-variant/20 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md dark:hover:border-outline-variant/40 dark:hover:bg-surface-container hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-lg shrink-0 border border-amber-200 dark:border-amber-500/30">{trainer.name?.charAt(0).toUpperCase() || "T"}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-[#f3dde7] truncate">{trainer.name}</p>
                        <p className="text-xs text-slate-500 dark:text-on-surface-variant truncate">{trainer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"><Clock size={11} /> Pending</span>
                      <span className="text-xs text-slate-400 dark:text-on-surface-variant">{new Date(trainer.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2 border-t border-slate-50 dark:border-outline-variant/10">
                      <button onClick={() => handleApprove(trainer._id)} disabled={actionLoading === trainer._id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors disabled:opacity-60">
                        {actionLoading === trainer._id ? <Loader2 size={13} className="animate-spin" /> : <UserCheck size={13} />} Approve
                      </button>
                      <button onClick={() => handleReject(trainer._id)} disabled={actionLoading === trainer._id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-100 dark:bg-rose-950/40 hover:bg-rose-600 dark:hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white dark:hover:text-white text-xs font-bold transition-colors disabled:opacity-60 border border-rose-200 dark:border-rose-900/30">
                        {actionLoading === trainer._id ? <Loader2 size={13} className="animate-spin" /> : <UserX size={13} />} Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-[#f3dde7] flex items-center gap-2"><UserCheck size={18} className="text-emerald-500" /> Approved Trainers ({approvedTrainers.length})</h3>
            {approvedTrainers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-on-surface-variant gap-3 bg-white dark:bg-surface-container-low rounded-2xl border border-slate-100 dark:border-outline-variant/20 shadow-sm">
                <Users size={24} className="text-slate-300 dark:text-outline" /><p className="text-sm">No approved trainers yet</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {approvedTrainers.map((trainer) => (
                  <div key={trainer._id} className="bg-white dark:bg-surface-container-low rounded-2xl border border-slate-100 dark:border-outline-variant/20 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md dark:hover:border-outline-variant/40 dark:hover:bg-surface-container hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg shrink-0 border border-emerald-200 dark:border-emerald-500/30">{trainer.name?.charAt(0).toUpperCase() || "T"}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-[#f3dde7] truncate">{trainer.name}</p>
                        <p className="text-xs text-slate-500 dark:text-on-surface-variant truncate">{trainer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"><UserCheck size={11} /> Approved</span>
                      <span className="text-xs text-slate-400 dark:text-on-surface-variant">Joined {new Date(trainer.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2 border-t border-slate-50 dark:border-outline-variant/10">
                      <button onClick={() => handleReject(trainer._id)} disabled={actionLoading === trainer._id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-600 dark:hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white dark:hover:text-white text-xs font-bold transition-colors disabled:opacity-60 border border-rose-200 dark:border-rose-900/30">
                        {actionLoading === trainer._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Remove
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
