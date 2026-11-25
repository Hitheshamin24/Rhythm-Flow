import { useDashboard } from "../../hooks/useDashboard";
import StatCard from "../components/StatCard";
import {
  Users, Banknote, Calendar, Activity,
  ArrowUpRight, Clock, Briefcase, CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
} from "recharts";

const DashboardPage = () => {
  const {
    role, loading, error,
    totalStudents, activeStudents, feePercentage, monthlyRevenue,
    payments, weeklyAttendance, recentPayments, upcomingClasses,
    currentRate, diff, diffLabel,
  } = useDashboard();

  return (    // Applied Warm Background: bg-[#FFFBF7] matches the image's cream background
    <div className="space-y-8 pb-10 bg-[#FFFBF7] dark:bg-[#1b1017] min-h-screen p-6 md:p-8 text-stone-800 dark:text-[#f3dde7]">
      {/* Header */}
   

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <Activity size={16} /> {error}
        </div>
      )}

      {/* --- Top Stats Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Students: Pink Theme */}
        <StatCard
          label="Total Students"
          value={String(totalStudents)}
          icon={<Users size={22} className="text-rose-500" />}
          subtext={`${activeStudents} active this month`}
          trend={activeStudents >= totalStudents / 2 ? "up" : "down"}
          iconBg="bg-rose-50"
        />
        {/* Revenue: Amber/Gold Theme – Owner only */}
        {role === "owner" && (
          <StatCard
            label="Monthly Revenue"
            value={`₹${monthlyRevenue.toLocaleString("en-IN")}`}
            icon={<Banknote size={22} className="text-amber-600" />}
            subtext={`${payments.paidCount || 0} paid / ${payments.total || 0} students`}
            trend="up"
            iconBg="bg-amber-50"
          />
        )}
        {/* Classes: Stone/Neutral Theme */}
        <StatCard
          label="Classes Today"
          value={String(upcomingClasses.length)}
          icon={<Calendar size={22} className="text-stone-600" />}
          subtext="Scheduled for today"
          trend="neutral"
          iconBg="bg-stone-100"
        />
        {/* Attendance: Stone/Rose Theme */}
        <StatCard
          label="Attendance Rate"
          value={`${currentRate.toFixed(1)}%`}
          icon={<Activity size={22} className="text-stone-600" />}
          subtext={diffLabel}
          trend={diff >= 0 ? "up" : "down"}
          iconBg="bg-stone-100"
        />
      </div>

      {/* --- Charts Row --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Weekly Attendance */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-container-low rounded-3xl p-6 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-stone-100 dark:border-outline-variant/20 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-headline-sm text-[#2C1810] dark:text-[#f3dde7] flex items-center gap-2">
                Weekly Attendance
              </h2>
            </div>
            <button className="text-xs font-semibold text-stone-400 dark:text-on-surface-variant hover:text-stone-600 dark:hover:text-on-surface">
               This Week
            </button>
          </div>

          <div className="w-full">
            <ResponsiveContainer width="100%" height={288}>
              <BarChart data={weeklyAttendance} barGap={8}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-on-surface-variant)", fontWeight: 500 }}
                  dy={15}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-on-surface-variant)", fontWeight: 500 }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: "#FFF1F2", opacity: 0.8 }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                    padding: "12px 16px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    backgroundColor: "var(--color-surface-container-high)",
                    color: "var(--color-on-surface)"
                  }}
                />
                {/* Updated to Rose color to match the area chart in your image */}
                <Bar 
                  dataKey="present" 
                  radius={[6, 6, 6, 6]} 
                  fill="#E11D48" 
                  fillOpacity={0.8}
                  maxBarSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Finances Card (Donut) */}
        <div className="bg-white dark:bg-surface-container-low rounded-3xl p-6 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-stone-100 dark:border-outline-variant/20 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-headline-sm text-[#2C1810] dark:text-[#f3dde7]">Finances</h2>
              <p className="text-xs text-stone-400 dark:text-on-surface-variant font-bold uppercase tracking-wider mt-1">
                Collection Rate
              </p>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="flex-1 flex items-center justify-center relative py-6">
            {/* Outer Ring */}
            <div className="relative w-52 h-52 flex items-center justify-center">
              {/* Progress Ring with Rose Gradient */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    #E11D48 ${feePercentage * 3.6}deg,
                    var(--color-surface-container-high) ${feePercentage * 3.6}deg
                  )`,
                  transform: 'rotate(-90deg)', 
                  transition: 'background 1s ease-in-out'
                }}
              ></div>

              {/* Inner cut-out */}
              <div className="absolute w-40 h-40 bg-white dark:bg-surface-container-low rounded-full flex items-center justify-center"></div>

              {/* Center Text */}
              <div className="relative flex flex-col items-center z-10">
                <span className="text-4xl font-black text-[#2C1810] dark:text-[#f3dde7] tracking-tight">
                  {feePercentage}%
                </span>
                <span className="text-[10px] font-bold text-stone-400 dark:text-on-surface-variant uppercase tracking-wide mt-1">
                  Collected
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              <span className="text-xs text-stone-600 dark:text-on-surface-variant font-bold uppercase tracking-wide">
                Paid
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-200 dark:bg-outline-variant"></span>
              <span className="text-xs text-stone-600 dark:text-on-surface-variant font-bold uppercase tracking-wide">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Row --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Payments */}
        <div className="bg-white dark:bg-surface-container-low rounded-3xl p-6 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-stone-100 dark:border-outline-variant/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline-sm text-[#2C1810] dark:text-[#f3dde7] flex items-center gap-2">
              Recent Payments
            </h2>
            <ArrowUpRight
              className="text-stone-300 dark:text-on-surface-variant/40 cursor-pointer hover:text-rose-500 hover:scale-110 transition-all"
              size={20}
            />
          </div>

          <div className="space-y-3">
            {recentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-stone-400 dark:text-on-surface-variant">
                <Banknote size={32} className="opacity-20 mb-2" />
                <p className="text-xs font-medium">No recent payments recorded.</p>
              </div>
            ) : (
              recentPayments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-surface-container rounded-2xl transition-all duration-200 group border border-transparent hover:border-stone-100 dark:hover:border-outline-variant/20"
                >
                  <div className="flex items-center gap-4">
                    {/* Rose Icon Background */}
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-primary-container/20 flex items-center justify-center text-rose-600 dark:text-primary font-bold text-lg group-hover:bg-white dark:group-hover:bg-surface-container group-hover:shadow-sm transition-all">
                      {payment.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2C1810] dark:text-[#f3dde7] group-hover:text-rose-700 dark:group-hover:text-primary transition-colors">
                        {payment.name}
                      </p>
                      <p className="text-xs font-semibold text-stone-400 dark:text-on-surface-variant mt-0.5">{payment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`block text-sm font-black ${
                        payment.status === "success"
                          ? "text-emerald-600"
                          : "text-amber-500"
                      }`}
                    >
                      {payment.amount}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400 dark:text-on-surface-variant uppercase tracking-wider">
                       Received
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white dark:bg-surface-container-low rounded-3xl p-6 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-stone-100 dark:border-outline-variant/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline-sm text-[#2C1810] dark:text-[#f3dde7] flex items-center gap-2">
              Today's Schedule
            </h2>
            <button className="text-xs font-bold text-stone-500 dark:text-on-surface-variant bg-stone-100 dark:bg-surface-container px-3 py-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-surface-container-high transition-colors uppercase tracking-wide">
              See All
            </button>
          </div>

          <div className="space-y-4">
            {upcomingClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-stone-400 dark:text-on-surface-variant">
                <Briefcase size={32} className="opacity-20 mb-2" />
                <p className="text-xs font-medium">No batches scheduled today.</p>
              </div>
            ) : (
              upcomingClasses.map((cls, index) => (
                <div
                  key={index}
                  className="relative flex gap-5 p-5 rounded-2xl border border-stone-100 dark:border-outline-variant/20 bg-stone-50/30 dark:bg-surface-container/30 hover:bg-white dark:hover:bg-surface-container hover:shadow-md hover:border-rose-100 dark:hover:border-primary/20 transition-all duration-300 group overflow-hidden"
                >
                  {/* Left Accent Bar - Rose */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-stone-200 dark:bg-outline-variant/30 group-hover:bg-rose-500 dark:group-hover:bg-primary transition-colors duration-300"></div>

                  <div className="min-w-20 flex flex-col justify-center">
                    <p className="text-sm font-black text-[#2C1810] dark:text-[#f3dde7] group-hover:text-rose-600 dark:group-hover:text-primary transition-colors">
                      {cls.time}
                    </p>
                    <p className="text-[10px] font-bold text-stone-400 dark:text-on-surface-variant uppercase tracking-wide mt-1">
                      Time
                    </p>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#2C1810] dark:text-[#f3dde7] mb-2">
                      {cls.title}
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-stone-500 dark:text-on-surface-variant flex items-center gap-1.5 bg-white dark:bg-surface-container px-2 py-1 rounded-md border border-stone-100 dark:border-outline-variant/20 shadow-sm">
                        <Users size={12} className="text-stone-400 dark:text-on-surface-variant" /> {cls.students}
                      </span>
                      <span className="text-[10px] font-bold text-rose-600 dark:text-primary bg-rose-50 dark:bg-primary-container/20 px-2.5 py-1 rounded-md border border-rose-100 dark:border-primary/20">
                        {cls.instructor}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-stone-300 dark:text-on-surface-variant/40 group-hover:text-rose-400 dark:group-hover:text-primary transition-colors">
                      <CheckCircle2 size={18} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


