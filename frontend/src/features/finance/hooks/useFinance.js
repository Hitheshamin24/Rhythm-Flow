import { useState, useEffect } from "react";
import {
  getFinanceSummary,
  getMonthlyFinance,
  addExpense,
  deleteExpense,
} from "../api/finance";

export const useFinance = () => {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);

  // Loading States
  const [initialLoading, setInitialLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(false);

  // Add Expense State
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", category: "" });
  const [showAddModal, setShowAddModal] = useState(false);

  // Delete Expense State
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [toggleConfirm, setToggleConfirm] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [error, setError] = useState("");
  const [monthsRange, setMonthsRange] = useState(6);

  const updateGraph = async (range) => {
    setGraphLoading(true);
    try {
      const m = await getMonthlyFinance(range);
      const months = m.data?.months || [];
      setMonthly(months);

      // Default: last month = current month
      if (months.length > 0) {
        setSelectedMonth(months[months.length - 1]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setGraphLoading(false), 300);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getFinanceSummary();
        setSummary(res.data);
        await updateGraph(6);
      } catch (err) {
        setError("Failed to load finance data");
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, []);

  const handleMonthChange = (range) => {
    if (range === monthsRange) return;
    setMonthsRange(range);
    updateGraph(range);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      setAdding(true);
      await addExpense({
        title: form.title,
        amount: Number(form.amount),
        category: form.category || "General",
      });
      setForm({ title: "", amount: "", category: "" });
      setShowAddModal(false);
      const res = await getFinanceSummary();
      setSummary(res.data);
      await updateGraph(monthsRange);
    } catch (err) {
      setError("Failed to add expense.");
    } finally {
      setAdding(false);
    }
  };

  const openDeleteModal = (expense) => {
    setSelectedExpense(expense);
    setToggleConfirm(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExpense) return;
    try {
      setDeleting(true);
      await deleteExpense(selectedExpense._id);
      const res = await getFinanceSummary();
      setSummary(res.data);
      await updateGraph(monthsRange);
      setShowDeleteModal(false);
    } catch (err) {
      setError("Failed to delete expense");
    } finally {
      setDeleting(false);
      setSelectedExpense(null);
    }
  };

  const chartDataMulti = monthly.map((m) => ({
    name: m.label,
    Income: m.income,
    Expenses: m.expenses,
    Profit: m.profit,
  }));
  const monthIncome = selectedMonth?.income || 0;
  const monthExpenses = selectedMonth?.expenses || 0;
  const monthProfit = selectedMonth?.profit || 0;

  const monthOptions = [3, 6, 12];
  const activeIndex = monthOptions.indexOf(monthsRange);

  const profitPercent =
    monthIncome > 0 ? Math.round((monthProfit / monthIncome) * 100) : 0;

  return {
    summary,
    monthly,
    initialLoading,
    graphLoading,
    adding,
    form,
    setForm,
    showAddModal,
    setShowAddModal,
    deleting,
    showDeleteModal,
    setShowDeleteModal,
    selectedExpense,
    setSelectedExpense,
    toggleConfirm,
    setToggleConfirm,
    selectedMonth,
    setSelectedMonth,
    error,
    monthsRange,
    handleMonthChange,
    handleAddExpense,
    openDeleteModal,
    handleConfirmDelete,
    chartDataMulti,
    monthIncome,
    monthExpenses,
    monthProfit,
    monthOptions,
    activeIndex,
    profitPercent,
  };
};
