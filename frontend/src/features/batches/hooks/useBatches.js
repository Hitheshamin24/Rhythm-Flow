import { useState, useEffect } from "react";
import { getBatches, createBatch, updateBatch, deleteBatch } from "../api/batches";

export const useBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(null);
  const [form, setForm] = useState({ name: "", timing: "", days: [] });
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getBatches();
      setBatches(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load batches");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreateModal = () => { setEditMode(false); setForm({ name: "", timing: "", days: [] }); setError(""); setShowModal(true); };
  const openEditModal = (batch) => { setEditMode(true); setCurrentBatch(batch); setForm({ name: batch.name, timing: batch.timing, days: batch.days || [] }); setError(""); setShowModal(true); };

  const toggleDay = (day) => setForm((prev) => ({ ...prev, days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day] }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    if (!form.name.trim()) { setError("Batch name is required"); setSaving(false); return; }
    if (!form.days?.length) { setError("Select at least one day for this batch."); setSaving(false); return; }
    try {
      const payload = { name: form.name.trim(), timing: form.timing, days: form.days };
      if (editMode) await updateBatch(currentBatch._id, payload);
      else await createBatch(payload);
      setShowModal(false); setForm({ name: "", timing: "", days: [] }); await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save batch");
    } finally { setSaving(false); }
  };

  const confirmDelete = (batch) => { setSelectedDelete(batch); setShowDeleteModal(true); };
  const handleDelete = async () => {
    try {
      await deleteBatch(selectedDelete._id); setShowDeleteModal(false); await load();
    } catch (err) {
      console.error(err); setError("Failed to delete batch");
    }
  };

  const formatDays = (days = []) => days.length ? days.join(" · ") : "No days set";

  return {
    batches, loading, saving, showModal, setShowModal, editMode, form, setForm, error,
    showDeleteModal, setShowDeleteModal, selectedDelete,
    openCreateModal, openEditModal, toggleDay, handleSave, confirmDelete, handleDelete, formatDays,
  };
};
