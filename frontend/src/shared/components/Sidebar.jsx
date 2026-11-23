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
  Sun,
  Moon,
} from "lucide-react";
import image from "../../assets/danceapp.png";
import { useTheme } from "../../context/ThemeContext";

const ownerNavItems = [
  { label: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
  { label: "Students", path: "/dashboard/students", icon: <Users size={20} /> },
  { label: "Batches", path: "/dashboard/batches", icon: <Layers size={20} /> },
  { label: "Attendance", path: "/dashboard/attendance", icon: <Calendar size={20} /> },
  { label: "Payments", path: "/dashboard/payments", icon: <CreditCard size={20} /> },
  { label: "Finances", path: "/dashboard/finances", icon: <TrendingUp size={20} /> },
  { label: "Trainers", path: "/dashboard/trainer-approvals", icon: <UserCheck size={20} /> },
  { label: "Settings", path: "/dashboard/settings", icon: <Settings size={20} /> },
];

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
  const { theme, toggleTheme } = useTheme();

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

  const isDark = theme === "dark";

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="fixed top-4 left-4 z-40 p-2.5 bg-surface-container text-primary rounded-xl shadow-lg border border-outline-variant/20 md:hidden"
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-surface-container-lowest border-r border-outline-variant/20 text-on-surface
          transition-all duration-300 ease-in-out
          w-[80vw] max-w-[280px]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:inset-auto md:translate-x-0
          ${collapsed ? "md:w-20" : "md:w-64"}
        `}
      >
        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-9 z-50 bg-primary-container hover:opacity-90 text-on-primary-container p-1 rounded-full shadow-lg border-2 border-surface-container-lowest transition-transform hover:scale-110 items-center justify-center"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`flex items-center gap-3 px-5 py-5 shrink-0 ${collapsed ? "md:justify-center" : ""}`}>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden mr-1 text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-high transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

          <div className="h-10 w-10 min-w-[40px] rounded-xl bg-primary-container/20 flex items-center justify-center shadow-lg overflow-hidden">
            <img src={image} alt="Logo" className="w-full h-full object-contain" />
          </div>

          <div
            className={`flex flex-col overflow-hidden transition-all duration-300
              ${collapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"}`}
          >
            <span className="text-base font-bold tracking-widest text-on-surface leading-tight">
              D N C R
            </span>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant truncate max-w-[140px]">
              {studioName}
              {role === "trainer" && (
                <span className="ml-1 text-primary/80">· Trainer</span>
              )}
            </span>
          </div>
        </div>

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
                    ? "bg-primary-container/20 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-primary" />
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

        <div className="shrink-0 p-3 border-t border-outline-variant/20 flex flex-col gap-2">
          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center w-full rounded-xl py-2.5 transition-all duration-300 hover:bg-surface-container-high
              ${collapsed ? "md:justify-center md:px-2" : "px-3 gap-3"}`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className={`shrink-0 transition-transform duration-300 ${isDark ? "text-primary rotate-0" : "text-on-surface-variant rotate-180"}`}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </span>

            {/* Toggle pill — only shown when not collapsed */}
            <div
              className={`flex-1 flex items-center justify-between transition-all duration-300
                ${collapsed ? "md:w-0 md:overflow-hidden md:opacity-0" : "opacity-100"}`}
            >
              <span className="text-sm font-medium text-on-surface-variant whitespace-nowrap">
                {isDark ? "Dark Mode" : "Light Mode"}
              </span>
              {/* The sliding pill toggle */}
              <div
                className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-all duration-300 relative
                  ${isDark ? "bg-primary-container justify-end" : "bg-outline-variant/50 justify-start"}`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300" />
              </div>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full rounded-xl py-3 transition-colors duration-200
              bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-on-error-container
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
