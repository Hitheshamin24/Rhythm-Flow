import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar, Check, Save, Users, Clock, Loader2,
  CheckCircle2, XCircle, Layers, ChevronDown, AlertCircle,
} from "lucide-react";
import { useAttendance } from "../../hooks/useAttendance";

const AttendancePage = () => {
  const {
    selectedDate, setSelectedDate,
    batches, selectedBatchId, setSelectedBatchId,
    filteredStudents, computedAbsentees, absentIds,
    isLoading, saving, error, info,
    isDateAllowed, toggleAbsent, markAllAbsent, clearAll, handleSave,
  } = useAttendance();

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <div onClick={onClick} ref={ref}
      className="bg-white dark:bg-surface-container-low p-2 rounded-2xl border border-slate-200 dark:border-outline-variant/30 shadow-sm flex items-center gap-3 cursor-pointer group hover:border-rose-300 dark:hover:border-primary transition-all select-none min-w-[200px]">
      <div className="bg-rose-50 dark:bg-primary-container/20 h-9 w-9 rounded-xl flex items-center justify-center text-rose-500 dark:text-primary group-hover:bg-rose-100 dark:group-hover:bg-primary-container/30 transition-colors">
        <Calendar size={18} />
      </div>
      <div className="flex flex-col">
        <label className="text-[10px] font-bold text-slate-400 dark:text-on-surface-variant uppercase tracking-wider cursor-pointer leading-tight">Date</label>
        <p className="text-sm font-bold text-slate-800 dark:text-[#f3dde7] whitespace-nowrap leading-tight">{value}</p>
      </div>
    </div>
  ));
  CustomDateInput.displayName = "CustomDateInput";

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-[#f3dde7]">Attendance</h2>
          <p className="text-sm text-slate-500 dark:text-[#e0bec6] mt-1">Select a batch and date to mark attendance.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group min-w-[220px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none z-10"><Layers size={18} /></div>
            <select value={selectedBatchId}
              onChange={(e) => { setSelectedBatchId(e.target.value); }}
              className="w-full appearance-none bg-white dark:bg-surface-container-low pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-outline-variant/30 shadow-sm text-sm font-semibold text-slate-700 dark:text-on-surface outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 hover:border-rose-300 dark:hover:border-primary transition-all cursor-pointer">
              <option value="">Select Batch</option>
              {batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><ChevronDown size={16} /></div>
          </div>
          <div className="relative z-20">
            <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)}
              dateFormat="EEE, MMM d, yyyy" customInput={<CustomDateInput />}
              popperPlacement="bottom-end" filterDate={(date) => isDateAllowed(date)} disabled={!selectedBatchId} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Attendance Marking */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-container-low rounded-3xl shadow-sm border border-slate-100 dark:border-outline-variant/20 flex flex-col overflow-hidden h-[600px]">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-surface-container/60">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white dark:bg-surface-container border border-slate-200 dark:border-outline-variant/30 text-indigo-600 dark:text-primary flex items-center justify-center shadow-sm"><Clock size={16} /></div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-[#f3dde7]">Mark Attendance</h3>
                <p className="text-xs text-slate-500 dark:text-[#e0bec6] hidden sm:block">Tap row to mark <span className="text-rose-600 dark:text-rose-400 font-bold">Absent</span></p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={markAllAbsent} disabled={!selectedBatchId || filteredStudents.length === 0}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-error/15 text-rose-600 dark:text-error hover:bg-rose-100 dark:hover:bg-error/25 border border-rose-100 dark:border-error/20 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <XCircle size={14} /> Mark All Absent
              </button>
              <button onClick={clearAll} disabled={!selectedBatchId || filteredStudents.length === 0}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 border border-emerald-100 dark:border-emerald-500/20 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <CheckCircle2 size={14} /> All Present
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-white dark:bg-surface-container-low">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-surface-container-low/90 z-10">
                <Loader2 size={32} className="animate-spin text-rose-500 mb-2" />
                <p className="text-xs text-slate-500 dark:text-on-surface-variant font-medium">Loading roster...</p>
              </div>
            ) : !selectedBatchId ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-on-surface-variant p-8 text-center">
                <div className="bg-slate-50 dark:bg-surface-container p-4 rounded-full mb-3"><Layers size={32} className="opacity-40" /></div>
                <p className="text-sm font-semibold text-slate-600 dark:text-on-surface">No Batch Selected</p>
                <p className="text-xs mt-1">Please select a batch above to start.</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-on-surface-variant p-8 text-center">
                <Users size={40} className="mb-3 opacity-20" />
                <p className="text-sm">No students found in this batch.</p>
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-surface-container-low z-10 shadow-sm">
                  <tr className="text-left text-[11px] font-bold text-slate-400 dark:text-on-surface-variant uppercase tracking-wider border-b border-slate-100 dark:border-outline-variant/20">
                    <th className="py-3 px-6 w-20 text-center">Status</th>
                    <th className="py-3 px-6">Student Name</th>
                    <th className="py-3 px-6">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-outline-variant/10">
                  {filteredStudents.map((s) => {
                    const isAbsent = absentIds.has(s._id);
                    return (
                      <tr key={s._id} onClick={() => toggleAbsent(s._id)}
                        className={`cursor-pointer transition-all duration-200 group border-l-4 ${isAbsent ? "bg-rose-50/40 dark:bg-rose-950/20 border-l-rose-500" : "hover:bg-slate-50 dark:hover:bg-surface-container-high/60 border-l-transparent"}`}>
                        <td className="py-3 px-6 text-center">
                          <div className={`w-7 h-7 rounded-lg mx-auto flex items-center justify-center border transition-all duration-200 shadow-sm ${isAbsent ? "bg-rose-500 border-rose-500 text-white scale-110" : "bg-white dark:bg-surface-container border-slate-200 dark:border-outline-variant/30 text-slate-300 dark:text-on-surface-variant group-hover:border-rose-200"}`}>
                            {isAbsent ? <XCircle size={16} /> : <Check size={16} />}
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors border ${isAbsent ? "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800" : "bg-slate-100 dark:bg-surface-container text-slate-500 dark:text-on-surface-variant border-slate-200 dark:border-outline-variant/30"}`}>
                              {s.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className={`font-semibold transition-colors ${isAbsent ? "text-rose-700 dark:text-rose-400" : "text-slate-700 dark:text-on-surface"}`}>{s.name}</p>
                              {s.parentName && <p className="text-[10px] text-slate-400 dark:text-on-surface-variant leading-none mt-0.5">p: {s.parentName}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-slate-500 dark:text-on-surface-variant text-xs font-mono">{s.phone || <span className="text-slate-300 dark:text-on-surface-variant/40">-</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-outline-variant/20 bg-white dark:bg-surface-container-low flex items-center justify-between gap-4">
            <div className="flex-1 min-h-1">
              {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-900/30 inline-flex items-center gap-2 animate-in fade-in"><AlertCircle size={14} /> {error}</p>}
              {info && !error && <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30 inline-flex items-center gap-2 animate-in fade-in"><CheckCircle2 size={14} /> {info}</p>}
            </div>
            <button onClick={handleSave} disabled={saving || !selectedBatchId || filteredStudents.length === 0}
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-rose-500 to-pink-600 text-white text-sm font-bold shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>

        {/* RIGHT: Absentees */}
        <div className="bg-white dark:bg-surface-container-low rounded-3xl shadow-sm border border-slate-100 dark:border-outline-variant/20 overflow-hidden flex flex-col h-fit">
          <div className="p-5 border-b border-slate-100 dark:border-outline-variant/20 bg-slate-50/50 dark:bg-surface-container/60">
            <h3 className="text-sm font-bold text-slate-800 dark:text-[#f3dde7]">Absentees List</h3>
            <p className="text-xs text-slate-500 dark:text-on-surface-variant mt-0.5">{selectedBatchId ? `${computedAbsentees.length} student(s) marked absent` : "Select a batch to view"}</p>
          </div>
          <div className="p-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {!selectedBatchId ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4 text-slate-400 dark:text-on-surface-variant">
                <Users size={32} className="mb-3 opacity-30" />
                <p className="text-xs">Choose a batch to manage attendance.</p>
              </div>
            ) : computedAbsentees.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3 border border-emerald-100 dark:border-emerald-500/30"><Check size={24} /></div>
                <p className="text-sm font-bold text-slate-800 dark:text-[#f3dde7]">100% Attendance</p>
                <p className="text-xs text-slate-500 dark:text-on-surface-variant mt-1">Everyone is present!</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {computedAbsentees.map((s) => (
                  <li key={s._id} className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 hover:border-rose-200 dark:hover:border-rose-500/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold border border-rose-200 dark:border-rose-800/50">{s.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-[#f3dde7]">{s.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-on-surface-variant">{s.phone ? `Ph: ${s.phone}` : s.parentName || "No info"}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-surface-container px-2 py-1 rounded border border-rose-100 dark:border-rose-900/40 shadow-sm">Absent</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
