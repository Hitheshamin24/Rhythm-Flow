import { useState, useEffect, useMemo } from "react";
import {
  getDashboardStudents,
  getDashboardBatches,
  getAttendanceSummary,
  getWeeklyAttendance,
} from "../api/dashboardApi";
import { getPayments } from "../../payments/api/payments";

export const useDashboard = () => {
  const role = localStorage.getItem("role") || "owner";
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [payments, setPayments] = useState({ total: 0, paidCount: 0, unpaidCount: 0, paid: [], unpaid: [] });
  const [attendanceStats, setAttendanceStats] = useState({ currentRate: 0, lastRate: 0 });
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true); setError("");
        const [studRes, batRes, payRes, attRes, weekRes] = await Promise.all([
          getDashboardStudents(),
          getDashboardBatches(),
          getPayments(),
          getAttendanceSummary(),
          getWeeklyAttendance(),
        ]);
        setStudents(studRes.data || []);
        setBatches(batRes.data || []);
        setPayments(payRes.data || {});
        setAttendanceStats({ currentRate: attRes.data?.currentRate || 0, lastRate: attRes.data?.lastRate || 0 });
        setWeeklyAttendance(weekRes.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const feePercentage = payments.total ? Math.round((payments.paidCount / payments.total) * 100) : 0;
  const totalStudents = students.length;
  const activeStudents = useMemo(() => students.filter((s) => s.isActive).length, [students]);
  const monthlyRevenue = useMemo(() => (payments.paid || []).reduce((sum, s) => sum + (s.monthlyFee ? Number(s.monthlyFee) : 0), 0), [payments]);

  const recentPayments = useMemo(() => {
    const sorted = [...(payments.paid || [])].sort((a, b) => {
      const da = a.lastPaidDate ? new Date(a.lastPaidDate) : 0;
      const db = b.lastPaidDate ? new Date(b.lastPaidDate) : 0;
      return db - da;
    });
    return sorted.slice(0, 3).map((s) => ({
      name: s.name,
      amount: s.monthlyFee ? `+ ₹${Number(s.monthlyFee).toLocaleString("en-IN")}` : "Paid",
      date: s.lastPaidDate ? new Date(s.lastPaidDate).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "Date not set",
      status: "success",
    }));
  }, [payments]);

  const upcomingClasses = useMemo(() => {
    if (!batches.length) return [];
    const todayStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
    return batches
      .filter((b) => b.days?.includes(todayStr))
      .map((b) => ({ time: b.timing || "—", title: b.name, instructor: "Studio Batch", students: students.filter((s) => String(s.batch || "") === String(b._id)).length }))
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 4);
  }, [batches, students]);

  const { currentRate, lastRate } = attendanceStats;
  const diff = currentRate - lastRate;
  const diffLabel = diff === 0 ? "No change vs last month" : `${diff > 0 ? "+" : ""}${diff.toFixed(1)}% vs last month`;

  return {
    role, loading, error,
    totalStudents, activeStudents, feePercentage, monthlyRevenue,
    payments, weeklyAttendance, recentPayments, upcomingClasses,
    currentRate, diff, diffLabel,
  };
};
