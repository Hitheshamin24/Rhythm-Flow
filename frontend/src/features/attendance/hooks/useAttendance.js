import { useState, useEffect } from "react";
import {
  getStudentsForAttendance,
  getBatchesForAttendance,
  getAttendance,
  saveAttendance,
} from "../api/attendanceApi";

const DAY_TO_INDEX = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

const formatDateForBackend = (date) => date.toISOString().slice(0, 10);

export const useAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [absentIds, setAbsentIds] = useState(new Set());
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const selectedBatch = batches.find((b) => b._id === selectedBatchId);

  const isDateAllowed = (date) => {
    if (!selectedBatch?.days?.length) return false;
    const allowedIndexes = selectedBatch.days
      .map((d) => DAY_TO_INDEX[d.toLowerCase()])
      .filter((d) => d !== undefined);
    return allowedIndexes.includes(date.getDay());
  };

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      const res = await getStudentsForAttendance();
      const activeStudents = (res.data || [])
        .filter((s) => s.isActive)
        .sort((a, b) => a.name.localeCompare(b.name));
      setStudents(activeStudents);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load students.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const loadBatches = async () => {
    try {
      const res = await getBatchesForAttendance();
      setBatches(res.data || []);
    } catch (err) {
      console.error("Failed to load batches", err);
    }
  };

  const loadAttendance = async (dateObj = selectedDate, batchId = selectedBatchId) => {
    if (!dateObj || !batchId) { setAbsentIds(new Set()); return; }
    try {
      setLoadingAttendance(true);
      setError(""); setInfo("");
      const dateString = formatDateForBackend(dateObj);
      const res = await getAttendance(dateString, batchId);
      if (res.status === 404) {
        setAbsentIds(new Set());
        setInfo("No record found. Defaulting to all present.");
        return;
      }
      const present = res.data?.presentStudents;
      const batchStudents = students.filter((s) => s.batch === batchId);
      const presentSet = new Set((present || []).map((id) => id.toString()));
      const newAbsentIds = new Set(
        batchStudents.filter((s) => !presentSet.has(s._id.toString())).map((s) => s._id)
      );
      setAbsentIds(newAbsentIds);
      setInfo(`Loaded: ${(present || []).length} Present, ${batchStudents.length - (present || []).length} Absent`);
    } catch (err) {
      console.error("loadAttendance error:", err);
      setAbsentIds(new Set());
      setError("Failed to load attendance.");
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => { loadStudents(); loadBatches(); }, []);

  useEffect(() => {
    if (students.length > 0 && selectedBatchId) {
      loadAttendance(selectedDate, selectedBatchId);
    }
    // eslint-disable-next-line
  }, [selectedDate, students.length, selectedBatchId]);

  useEffect(() => {
    if (!selectedBatch) return;
    if (!isDateAllowed(selectedDate)) {
      let d = new Date();
      for (let i = 0; i < 7; i++) {
        if (isDateAllowed(d)) { setSelectedDate(new Date(d)); break; }
        d.setDate(d.getDate() + 1);
      }
    }
    // eslint-disable-next-line
  }, [selectedBatchId, batches.length]);

  const toggleAbsent = (id) => {
    setAbsentIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id); else copy.add(id);
      return copy;
    });
  };

  const markAllAbsent = () => {
    const list = selectedBatchId ? students.filter((s) => s.batch === selectedBatchId) : [];
    setAbsentIds(new Set(list.map((s) => s._id)));
  };

  const clearAll = () => setAbsentIds(new Set());

  const handleSave = async () => {
    if (!selectedBatchId) { setError("Please select a batch before saving."); return; }
    try {
      setSaving(true); setError(""); setInfo("");
      const batchStudents = students.filter((s) => s.batch === selectedBatchId);
      const presentStudents = batchStudents.filter((s) => !absentIds.has(s._id)).map((s) => s._id);
      await saveAttendance({ date: formatDateForBackend(selectedDate), batch: selectedBatchId, presentStudents });
      await loadAttendance(selectedDate, selectedBatchId);
      setInfo("Attendance saved successfully.");
      setTimeout(() => setInfo(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = selectedBatchId ? students.filter((s) => s.batch === selectedBatchId) : [];
  const computedAbsentees = filteredStudents.filter((s) => absentIds.has(s._id));
  const isLoading = loadingStudents || loadingAttendance;

  return {
    selectedDate, setSelectedDate,
    students, batches,
    selectedBatchId, setSelectedBatchId,
    absentIds, filteredStudents, computedAbsentees,
    isLoading, saving, error, info,
    isDateAllowed, toggleAbsent, markAllAbsent, clearAll, handleSave,
  };
};
