import { useState, useEffect, useMemo } from "react";
import client from "../../../shared/api/client";
import { getSettings } from "../../settings/api/settings";

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [updatingBatch, setUpdatingBatch] = useState(false);
  const [form, setForm] = useState({ name: "", parentName: "", phone: "", email: "", monthlyFee: "", batch: "" });

  const loadStudents = async () => {
    try {
      setLoading(true); setError("");
      const res = await client.get("/students");
      setStudents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load students.");
    } finally { setLoading(false); }
  };

  const loadBatches = async () => {
    try {
      const res = await client.get("/batches");
      setBatches(res.data);
    } catch (err) { console.error("Failed to load batches", err); }
  };

  const loadDefaultFee = async () => {
    try {
      const res = await getSettings();
      const defaultFee = res.data?.defaultMonthlyFee || 0;
      setForm((prev) => ({ ...prev, monthlyFee: defaultFee ? String(defaultFee) : "" }));
    } catch (err) { console.log("Default fee not loaded"); }
  };

  useEffect(() => { loadStudents(); loadBatches(); loadDefaultFee(); }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      setSaving(true); setError("");
      await client.post("/students", { ...form, monthlyFee: form.monthlyFee ? Number(form.monthlyFee) : 0, batch: form.batch || undefined });
      setForm((prev) => ({ name: "", parentName: "", phone: "", email: "", monthlyFee: prev.monthlyFee, batch: "" }));
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student.");
    } finally { setSaving(false); }
  };

  const handleToggleisActive = async (student) => {
    try {
      setTogglingId(student._id); setError("");
      setStudents((prev) => prev.map((s) => s._id === student._id ? { ...s, isActive: !Boolean(s.isActive) } : s));
      await client.put(`/students/${student._id}`, { isActive: !Boolean(student.isActive) });
    } catch (err) {
      setStudents((prev) => prev.map((s) => s._id === student._id ? { ...s, isActive: Boolean(student.isActive) } : s));
      setError(err.response?.data?.message || "Failed to update status.");
    } finally { setTogglingId(null); }
  };

  const handleDeleteStudent = async () => {
    setDeletingId(selectedStudent._id);
    try {
      await client.delete(`/students/${selectedStudent._id}`);
      setStudents((prev) => prev.filter((s) => s._id !== selectedStudent._id));
    } catch (err) {
      setError("Failed to delete.");
    } finally {
      setShowDeleteModal(false); setDeletingId(null); setSelectedStudent(null);
    }
  };

  const toggleSelectStudent = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleSelectAllVisible = (sortedStudents) => {
    const visibleIds = sortedStudents.map((s) => s._id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    else setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])]);
  };

  const handleApplyBatch = async () => {
    if (!selectedBatch || selectedIds.length === 0) return;
    try {
      setUpdatingBatch(true); setError("");
      setStudents((prev) => prev.map((s) => selectedIds.includes(s._id) ? { ...s, batch: selectedBatch } : s));
      for (const id of selectedIds) { await client.put(`/students/${id}`, { batch: selectedBatch }); }
      setSelectedIds([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update batch.");
      loadStudents();
    } finally { setUpdatingBatch(false); }
  };

  const getBatchLabel = (batchId) => {
    if (!batchId) return "No batch";
    const b = batches.find((x) => x._id === batchId);
    return b ? (b.timing ? `${b.name} (${b.timing})` : b.name) : "No batch";
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.parentName && s.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const sortedStudents = [...filteredStudents].sort((a, b) => a.name.localeCompare(b.name));
  const activeCount = useMemo(() => students.filter((s) => Boolean(s.isActive)).length, [students]);
  const inactiveCount = useMemo(() => students.length - activeCount, [students, activeCount]);
  const allVisibleSelected = sortedStudents.length > 0 && sortedStudents.every((s) => selectedIds.includes(s._id));

  return {
    students, batches, loading, saving, deletingId, togglingId, error,
    searchTerm, setSearchTerm, form, handleChange, handleSubmit,
    showDeleteModal, setShowDeleteModal, selectedStudent, setSelectedStudent,
    selectedBatch, setSelectedBatch, selectedIds, updatingBatch,
    sortedStudents, activeCount, inactiveCount, allVisibleSelected,
    handleToggleisActive, handleDeleteStudent,
    toggleSelectStudent, toggleSelectAllVisible: () => toggleSelectAllVisible(sortedStudents),
    handleApplyBatch, getBatchLabel,
  };
};

