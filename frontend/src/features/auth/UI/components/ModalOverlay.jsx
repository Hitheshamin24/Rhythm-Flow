import { X } from "lucide-react";

export const ModalOverlay = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1216]/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
    <div className="bg-white dark:bg-surface-container-low rounded-[20px] w-full max-w-sm shadow-2xl border border-white/40 dark:border-outline-variant/20 p-6 md:p-8 relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:text-on-surface-variant dark:hover:text-on-surface bg-slate-50 hover:bg-slate-100 dark:bg-surface-container dark:hover:bg-surface-container-high p-1.5 rounded-full transition-all"
      >
        <X size={16} />
      </button>
      {children}
    </div>
  </div>
);

export default ModalOverlay;
