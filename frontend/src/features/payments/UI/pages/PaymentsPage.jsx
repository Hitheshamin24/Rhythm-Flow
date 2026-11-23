import { usePayments } from "../../hooks/usePayments";
import {
  CreditCard,
  Check,
  X,
  Users,
  Wallet,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PaymentsPage = () => {
  const {
    viewYear,
    viewMonth,
    isCurrentMonth,
    toLabel,
    goToPrevMonth,
    goToNextMonth,
    loading,
    payments,
    error,
    savingId,
    query,
    setQuery,
    searchRef,
    batches,
    selectedBatchId,
    setSelectedBatchId,
    filteredUnpaid,
    filteredPaid,
    handleToggle,
    isNewThisMonth,
  } = usePayments();
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-[#f3dde7]">Fee Payments</h2>
          <p className="text-sm text-slate-500 dark:text-[#e0bec6] mt-1">
            Track monthly fee status per month.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search */}
          <div className="relative">
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or phone..."
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-outline-variant/30 bg-white dark:bg-surface-container text-sm text-slate-800 dark:text-on-surface placeholder:text-slate-400 dark:placeholder:text-outline w-64 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-primary-container/20"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-on-surface-variant">
              <Search size={16} />
            </div>
          </div>

          {/* Batch filter */}
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-outline-variant/30 bg-white dark:bg-surface-container text-xs md:text-sm text-slate-800 dark:text-on-surface min-w-[180px] focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-primary-container/20"
          >
            <option value="">All batches</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name} {b.timing ? `(${b.timing})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Month Navigator */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goToPrevMonth}
          className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-outline-variant/30 bg-white dark:bg-surface-container hover:bg-slate-50 dark:hover:bg-surface-container-high text-slate-600 dark:text-on-surface transition"
          title="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-center min-w-[180px]">
          <p className="text-lg font-bold text-slate-800 dark:text-[#f3dde7]">
            {toLabel(viewYear, viewMonth)}
          </p>
          {!isCurrentMonth && (
            <p className="text-[11px] text-amber-500 font-semibold mt-0.5">
              Viewing past month
            </p>
          )}
          {isCurrentMonth && (
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">
              Current month
            </p>
          )}
        </div>

        <button
          onClick={goToNextMonth}
          disabled={isCurrentMonth}
          className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-outline-variant/30 bg-white dark:bg-surface-container hover:bg-slate-50 dark:hover:bg-surface-container-high text-slate-600 dark:text-on-surface transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total */}
        <div className="bg-white dark:bg-surface-container-low p-5 rounded-3xl border border-slate-100 dark:border-outline-variant/20 shadow-sm flex items-center justify-between hover:shadow-md dark:hover:bg-surface-container dark:hover:border-outline-variant/40 hover:-translate-y-0.5 transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-on-surface-variant uppercase tracking-wider">
              Total Students
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-[#f3dde7] mt-1">
              {filteredPaid.length + filteredUnpaid.length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-surface-container text-slate-400 dark:text-on-surface-variant flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        {/* Paid */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm flex items-center justify-between hover:shadow-md dark:hover:bg-emerald-950/35 dark:hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Paid
            </p>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-200 mt-1">
              {filteredPaid.length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Unpaid */}
        <div className="bg-amber-50/50 dark:bg-amber-950/20 p-5 rounded-3xl border border-amber-100 dark:border-amber-500/20 shadow-sm flex items-center justify-between hover:shadow-md dark:hover:bg-amber-950/35 dark:hover:border-amber-500/40 hover:-translate-y-0.5 transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Pending
            </p>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-200 mt-1">
              {filteredUnpaid.length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Student Lists */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-rose-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PENDING FEES */}
          <div className="bg-white dark:bg-surface-container-low rounded-3xl shadow-sm border border-slate-100 dark:border-outline-variant/20 overflow-hidden flex flex-col h-fit">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-outline-variant/20 bg-amber-50/30 dark:bg-amber-950/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 dark:bg-amber-500/20 p-1.5 rounded-lg text-amber-600 dark:text-amber-400">
                  <Wallet size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-[#f3dde7]">
                  Pending Fees
                </h3>
              </div>
              <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md">
                {filteredUnpaid.length}
              </span>
            </div>

            <div className="p-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {filteredUnpaid.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-bold text-slate-700 dark:text-[#f3dde7]">
                    All caught up! 🎉
                  </p>
                  <p className="text-xs text-slate-400 dark:text-on-surface-variant">
                    No pending payments for {toLabel(viewYear, viewMonth)}.
                  </p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {filteredUnpaid.map((s) => (
                    <li
                      key={s._id}
                      className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-surface-container-high/60 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-outline-variant/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-200 dark:border-amber-500/30">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-slate-800 dark:text-[#f3dde7]">
                              {s.name}
                            </p>
                            {isNewThisMonth(s, viewYear, viewMonth) && (
                              <span className="text-[9px] font-bold bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 dark:text-on-surface-variant">
                            {s.phone || "No contact"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle(s)}
                        disabled={savingId === s._id}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all disabled:opacity-50 flex items-center gap-1 shadow-sm border border-emerald-100 dark:border-emerald-500/20"
                      >
                        {savingId === s._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        Mark Paid
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* PAID STUDENTS */}
          <div className="bg-white dark:bg-surface-container-low rounded-3xl shadow-sm border border-slate-100 dark:border-outline-variant/20 overflow-hidden flex flex-col h-fit">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-outline-variant/20 bg-emerald-50/30 dark:bg-emerald-950/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-500/20 p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-[#f3dde7]">
                  Paid Students
                </h3>
              </div>
              <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                {filteredPaid.length}
              </span>
            </div>

            <div className="p-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {filteredPaid.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xs text-slate-400 dark:text-on-surface-variant">
                    No payments received yet for {toLabel(viewYear, viewMonth)}.
                  </p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {filteredPaid.map((s) => (
                    <li
                      key={s._id}
                      className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-surface-container-high/60 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-outline-variant/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-200 dark:border-emerald-500/30">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-slate-800 dark:text-[#f3dde7]">
                              {s.name}
                            </p>
                            {isNewThisMonth(s, viewYear, viewMonth) && (
                              <span className="text-[9px] font-bold bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 dark:text-on-surface-variant">
                            {s.phone || "No contact"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle(s)}
                        disabled={savingId === s._id}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-surface-container-high/80 text-slate-500 dark:text-on-surface-variant text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-500/20 hover:text-amber-700 dark:hover:text-amber-300 transition-all disabled:opacity-50 flex items-center gap-1 border border-transparent hover:border-amber-200 dark:hover:border-amber-500/30"
                      >
                        {savingId === s._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <X size={14} />
                        )}
                        Undo
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;

