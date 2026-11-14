import { useState, useEffect } from "react";
import { getPendingStaff, approveStaff, rejectStaff, getAllStaff } from "../api/staff";

export const useStaff = () => {
  const [pendingTrainers, setPendingTrainers] = useState([]);
  const [approvedTrainers, setApprovedTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = async () => {
    setLoading(true); setError("");
    try {
      const [pendingRes, approvedRes] = await Promise.all([getPendingStaff(), getAllStaff()]);
      setPendingTrainers(pendingRes.data || []);
      setApprovedTrainers(approvedRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load trainers.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveStaff(id);
      setPendingTrainers((prev) => prev.filter((t) => t._id !== id));
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve trainer.");
    } finally { setActionLoading(null); }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await rejectStaff(id);
      setPendingTrainers((prev) => prev.filter((t) => t._id !== id));
      setApprovedTrainers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject/remove trainer.");
    } finally { setActionLoading(null); }
  };

  return { pendingTrainers, approvedTrainers, loading, error, actionLoading, fetchData, handleApprove, handleReject };
};
