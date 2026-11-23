import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({
  label,
  value,
  icon,
  subtext,
  trend = "neutral",
  chart,
}) => {
  return (
    <div className="group relative overflow-hidden bg-surface-container-low border border-outline-variant/20 rounded-3xl p-5 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      
      {/* Glow */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500"></div>

      {/* Header */}
      <div className="relative flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-wide text-on-surface-variant uppercase">
            {label}
          </p>
          <h3 className="text-2xl font-bold text-on-surface tracking-tight">
            {value}
          </h3>
        </div>

        <div className="h-10 w-10 rounded-xl bg-surface-container-high border border-outline-variant/20 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>

      {/* GRAPH SECTION */}
      {chart && (
        <div className="relative mt-4 h-20">
          {chart}
        </div>
      )}

      {/* Footer */}
      {(subtext || trend) && (
        <div className="relative mt-3 flex items-center gap-2">
          {trend === "up" && <ArrowUpRight size={14} className="text-emerald-400" />}
          {trend === "down" && <ArrowDownRight size={14} className="text-error" />}
          
          <p
            className={`text-xs font-medium ${
              trend === "up"
                ? "text-emerald-400"
                : trend === "down"
                ? "text-error"
                : "text-on-surface-variant"
            }`}
          >
            {subtext}
          </p>
        </div>
      )}
    </div>
  );
};

export default StatCard;
