export const InputGroup = ({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
}) => (
  <div className="relative group">
    <Icon
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-on-surface-variant/60 group-focus-within:text-rose-600 dark:group-focus-within:text-primary transition-colors"
      size={18}
    />
    <input
      type={type}
      className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white dark:bg-surface-container dark:hover:bg-surface-container-high dark:focus:bg-surface-container-high rounded-xl border border-slate-200 dark:border-outline-variant/40 pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:focus:border-primary/60 transition-all placeholder:text-slate-400 dark:placeholder:text-on-surface-variant/50 text-slate-800 dark:text-on-surface font-medium"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

export default InputGroup;
