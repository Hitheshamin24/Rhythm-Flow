import { useEffect, useState, useRef, useMemo } from "react";
import {
  getPayments,
  markPaid,
  markUnpaid,
} from "../api/payments";
import client from "../api/client";
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

// ── helpers ────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const toLabel = (year, month) =>
  `${MONTH_NAMES[month - 1]} ${year}`;

/** Returns true if the student joined during the given year/month */
const isNewThisMonth = (student, year, month) => {
  if (!student.createdAt) return false;
  const d = new Date(student.createdAt);
  return (
    d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month
  );
};

// ──────────────────────────────────────────────────────────────────────────

const PaymentsPage = () => {
  // ── month navigator state ─────────────────────────────────────────────
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1); // 1-based

  const isCurrentMonth =
    viewYear === now.getFullYear() && viewMonth === now.getMonth() + 1;

  const goToPrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    // Don't allow navigating into the future
    if (isCurrentMonth) return;
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // ── data state ────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState({
    total: 0,
    paidCount: 0,
    unpaidCount: 0,
    paid: [],
    unpaid: [],
  });
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef(null);

  // Batches + selected batch filter
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(""); // "" = all

  // ── helpers ───────────────────────────────────────────────────────────
  const matchesQuery = (s, q) => {
    const query = String(q || "").toLowerCase().trim();
    if (!query) return true;
    const name = String(s.name || "").toLowerCase();
    const phone = String(s.phone || "").toLowerCase();
    return name.includes(query) || phone.includes(query);
  };

  const matchesBatch = (s) => {
    if (!selectedBatchId) return true;
    return String(s.batch || "") === String(selectedBatchId);
  };

  const sortByNameAsc = (a, b) =>
    String(a.name || "").toLowerCase().trim()
      .localeCompare(String(b.name || "").toLowerCase().trim());

  const filteredUnpaid = useMemo(
    () =>
      payments.unpaid
        .filter((s) => matchesQuery(s, debouncedQuery) && matchesBatch(s))
        .sort(sortByNameAsc),
    [payments.unpaid, debouncedQuery, selectedBatchId]
  );

  const filteredPaid = useMemo(
    () =>
      payments.paid
        .filter((s) => matchesQuery(s, debouncedQuery) && matchesBatch(s))
        .sort(sortByNameAsc),
    [payments.paid, debouncedQuery, selectedBatchId]
  );

  // ── fetch ─────────────────────────────────────────────────────────────
  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPayments(viewYear, viewMonth);
      setPayments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  const loadBatches = async () => {
    try {
      const res = await client.get("/batches");
      setBatches(res.data || []);
    } catch (err) {
      console.error("Failed to load batches", err);
    }
  };

  useEffect(() => {
    load();
  }, [viewYear, viewMonth]);

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    const id = setTimeout(
      () => setDebouncedQuery(query.trim().toLowerCase()),
      300
    );
    return () => clearTimeout(id);
  }, [query]);

  // ── actions ───────────────────────────────────────────────────────────
  const handleToggle = async (student) => {
    try {
      setSavingId(student._id);
      // Determine if the student is "paid" for the currently viewed month
      const isPaidThisMonth = payments.paid.some(
        (s) => String(s._id) === String(student._id)
      );
      if (isPaidThisMonth) {
        await markUnpaid(student._id, viewYear, viewMonth);
      } else {
        await markPaid(student._id, viewYear, viewMonth);
      }
      await load();
    } catch (err) {
      setError("Failed to update payment status.");
    } finally {
      setSavingId(null);
    }
  };

  // ── render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 pb-10">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fee Payments</h2>
          <p className="text-sm text-slate-500 mt-1">
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
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm w-64 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </div>
          </div>

          {/* Batch filter */}
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs md:text-sm min-w-[180px] focus:outline-none focus:ring-2 focus:ring-rose-200"
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

      {/* ── Month Navigator ──────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goToPrevMonth}
          className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
          title="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-center min-w-[180px]">
          <p className="text-lg font-bold text-slate-800">
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
          className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Error ────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* ── Summary Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Students
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {filteredPaid.length + filteredUnpaid.length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        {/* Paid */}
        <div className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Paid
            </p>
            <p className="text-2xl font-bold text-emerald-900 mt-1">
              {filteredPaid.length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Unpaid */}
        <div className="bg-amber-50/50 p-5 rounded-3xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Pending
            </p>
            <p className="text-2xl font-bold text-amber-900 mt-1">
              {filteredUnpaid.length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* ── Student Lists ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-rose-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PENDING FEES */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-fit">
            <div className="px-6 py-4 border-b border-slate-100 bg-amber-50/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600">
                  <Wallet size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Pending Fees
                </h3>
              </div>
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">
                {filteredUnpaid.length}
              </span>
            </div>

            <div className="p-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {filteredUnpaid.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-bold text-slate-700">
                    All caught up! 🎉
                  </p>
                  <p className="text-xs text-slate-400">
                    No pending payments for {toLabel(viewYear, viewMonth)}.
                  </p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {filteredUnpaid.map((s) => (
                    <li
                      key={s._id}
                      className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold border border-amber-200">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-slate-800">
                              {s.name}
                            </p>
                            {isNewThisMonth(s, viewYear, viewMonth) && (
                              <span className="text-[9px] font-bold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {s.phone || "No contact"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle(s)}
                        disabled={savingId === s._id}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50 flex items-center gap-1 shadow-sm"
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
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-fit">
            <div className="px-6 py-4 border-b border-slate-100 bg-emerald-50/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
                  <CheckCircle2 size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Paid Students
                </h3>
              </div>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                {filteredPaid.length}
              </span>
            </div>

            <div className="p-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {filteredPaid.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xs text-slate-400">
                    No payments received yet for {toLabel(viewYear, viewMonth)}.
                  </p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {filteredPaid.map((s) => (
                    <li
                      key={s._id}
                      className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold border border-emerald-200">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-slate-800">
                              {s.name}
                            </p>
                            {isNewThisMonth(s, viewYear, viewMonth) && (
                              <span className="text-[9px] font-bold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {s.phone || "No contact"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle(s)}
                        disabled={savingId === s._id}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold hover:bg-amber-100 hover:text-amber-700 transition-all disabled:opacity-50 flex items-center gap-1"
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
