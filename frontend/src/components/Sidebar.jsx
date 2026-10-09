import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  Settings,
  UserCheck,
} from "lucide-react";
import image from "../assets/danceapp.png";

// Full nav items – owners see everything
const ownerNavItems = [
  { label: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
  { label: "Students", path: "/dashboard/students", icon: <Users size={20} /> },
  { label: "Batches", path: "/dashboard/batches", icon: <Layers size={20} /> },
  { label: "Attendance", path: "/dashboard/attendance", icon: <Calendar size={20} /> },
  { label: "Payments", path: "/dashboard/payments", icon: <CreditCard size={20} /> },
  { label: "Finances", path: "/dashboard/finances", icon: <TrendingUp size={20} /> },
  { label: "Approvals", path: "/dashboard/trainer-approvals", icon: <UserCheck size={20} /> },
  { label: "Settings", path: "/dashboard/settings", icon: <Settings size={20} /> },
];

// Trainer nav items – Finance and Settings are completely hidden
const trainerNavItems = [
  { label: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
  { label: "Students", path: "/dashboard/students", icon: <Users size={20} /> },
  { label: "Attendance", path: "/dashboard/attendance", icon: <Calendar size={20} /> },
  { label: "Payments", path: "/dashboard/payments", icon: <CreditCard size={20} /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const studioName = localStorage.getItem("studioName") || "DanceFlow";
  const role = localStorage.getItem("role") || "owner";
  const navItems = role === "trainer" ? trainerNavItems : ownerNavItems;

  const handleLinkClick = () => setMobileOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studioName");
    localStorage.removeItem("role");
    navigate("/auth");
  };

  return (
    <>
      {/* ── Mobile Hamburger ──────────────────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="fixed top-4 left-4 z-40 p-2.5 bg-[#1F1216] text-rose-500 rounded-xl shadow-lg border border-white/10 md:hidden"
      >
        <Menu size={22} />
      </button>

      {/* ── Mobile Backdrop ───────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside
        className={`
          /* Base: fixed full-height panel, flex column */
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-[#1F1216] border-r border-white/5 text-pink-50
          transition-transform duration-300 ease-in-out

          /* Mobile: slide in/out, fixed width that fits any phone */
          w-[80vw] max-w-[280px]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

          /* Desktop: always visible, collapsible */
          md:relative md:inset-auto md:translate-x-0
          ${collapsed ? "md:w-20" : "md:w-64"}
        `}
      >
        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-9 z-50 bg-rose-600 hover:bg-rose-500 text-white p-1 rounded-full shadow-lg border-2 border-[#1F1216] transition-transform hover:scale-110 items-center justify-center"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* ── Logo / Header ─────────────────────────────────────────── */}
        <div className={`flex items-center gap-3 px-5 py-5 shrink-0 ${collapsed ? "md:justify-center" : ""}`}>
          {/* Close button – mobile only, inside header row */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden mr-1 text-pink-200/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

          <div className="h-10 w-10 min-w-[40px] rounded-xl bg-gradient-to from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-900/20 overflow-hidden">
            <img src={image} alt="Logo" className="w-full h-full object-contain" />
          </div>

          <div
            className={`flex flex-col overflow-hidden transition-all duration-300
              ${collapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"}`}
          >
            <span className="text-base font-bold tracking-widest text-white leading-tight">
              D N C R
            </span>
            <span className="text-[10px] uppercase tracking-wider text-pink-200/50 truncate max-w-[140px]">
              {studioName}
              {role === "trainer" && (
                <span className="ml-1 text-rose-400/80">· Trainer</span>
              )}
            </span>
          </div>
        </div>

        {/* ── Navigation ────────────────────────────────────────────── */}
        {/*
          flex-1 + overflow-y-auto lets the nav scroll independently
          so the logout button is ALWAYS pinned at the bottom.
        */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto overscroll-contain">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-rose-500/10 text-rose-400"
                    : "text-pink-100/60 hover:bg-white/5 hover:text-pink-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-rose-500" />
                  )}

                  <span
                    className={`shrink-0 transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    } ${collapsed ? "md:mx-auto" : ""}`}
                  >
                    {item.icon}
                  </span>

                  <span
                    className={`whitespace-nowrap font-medium text-sm transition-all duration-300
                      ${collapsed ? "md:w-0 md:overflow-hidden md:opacity-0" : "opacity-100"}`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Logout – always pinned at bottom ──────────────────────── */}
        <div className="shrink-0 p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full rounded-xl py-3 transition-colors duration-200
              bg-white/5 hover:bg-rose-600 text-pink-200 hover:text-white
              ${collapsed ? "md:justify-center md:px-2" : "px-4"}`}
          >
            <LogOut size={20} className="shrink-0" />
            <span
              className={`text-sm font-semibold whitespace-nowrap transition-all duration-300
                ${collapsed ? "md:w-0 md:overflow-hidden md:opacity-0" : "opacity-100"}`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;