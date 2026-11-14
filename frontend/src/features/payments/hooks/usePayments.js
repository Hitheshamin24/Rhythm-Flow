import { useState, useEffect, useRef, useMemo } from "react";
import { getPayments, markPaid, markUnpaid } from "../api/payments";
import client from "../../../shared/api/client";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const toLabel = (year, month) => `${MONTH_NAMES[month - 1]} ${year}`;

export const usePayments = () => {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth() + 1;

  const goToPrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (isCurrentMonth) return;
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

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
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const searchRef = useRef(null);

  const matchesQuery = (s, q) => {
    const qStr = String(q || "").toLowerCase().trim();
    if (!qStr) return true;
    return (
      String(s.name || "").toLowerCase().includes(qStr) ||
      String(s.phone || "").toLowerCase().includes(qStr)
    );
  };

  const matchesBatch = (s) =>
    !selectedBatchId || String(s.batch || "") === String(selectedBatchId);

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

  const handleToggle = async (student) => {
    try {
      setSavingId(student._id);
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

  const isNewThisMonth = (student, year = viewYear, month = viewMonth) => {
    if (!student.createdAt) return false;
    const d = new Date(student.createdAt);
    return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month;
  };

  return {
    viewYear,
    viewMonth,
    isCurrentMonth,
    monthLabel: toLabel(viewYear, viewMonth),
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
  };
};

