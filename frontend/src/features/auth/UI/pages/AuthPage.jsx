import { useAuth } from "../../hooks/useAuth";
import { InputGroup, ModalOverlay } from "../components";
import {
  User,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  Phone,
  ChevronDown,
  Building2,
  UserCog,
} from "lucide-react";
import image from "../../../../assets/danceapp.png";

const AuthPage = () => {
  const {
    userType,
    setUserType,
    mode,
    setMode,
    className,
    setClassName,
    email,
    setEmail,
    password,
    setPassword,
    phone,
    setPhone,
    show,
    setShow,
    loading,
    error,
    trainerName,
    setTrainerName,
    selectedStudioId,
    setSelectedStudioId,
    studios,
    studiosLoading,
    showForgotModal,
    setShowForgotModal,
    fpStep,
    fpInput,
    setFpInput,
    fpOtp,
    setFpOtp,
    fpNewPassword,
    setFpNewPassword,
    fpConfirmPassword,
    setFpConfirmPassword,
    fpLoading,
    fpMessage,
    fpError,
    showVerifyModal,
    setShowVerifyModal,
    verifyOtp,
    setVerifyOtp,
    verifyLoading,
    verifyError,
    verifyMessage,
    registeredEmail,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleSubmit,
    openForgotModal,
    handleForgotSubmit,
    handleVerifyEmail,
    isSuccessNotice,
  } = useAuth();
  return (
    <div className="grid place-items-center min-h-[100dvh] w-full bg-[#1F1216] relative overflow-x-hidden px-4 py-8 font-sans selection:bg-rose-500/30">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-900/20 rounded-full blur-[100px]" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/40 max-w-[420px] w-full p-6 md:p-10 border border-white/40 ring-1 ring-white/50">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-6">
          <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-[#29171c] to-[#3d1f28] flex items-center justify-center text-white p-3 shadow-lg shadow-rose-900/20 transform hover:rotate-3 transition-transform duration-300">
            <img src={image} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1
              className="text-4xl font-bold tracking-[0.25em] text-slate-900"
              style={{ fontFamily: "Inter Tight" }}
            >
              D N C R
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              {userType === "owner"
                ? mode === "login"
                  ? "Welcome back, Studio Owner"
                  : "Register your studio"
                : mode === "login"
                ? "Trainer login"
                : "Join a studio as a trainer"}
            </p>
          </div>
        </div>

        {/* Role Toggle: Owner / Trainer */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => { setUserType("owner"); setMode("login"); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
              userType === "owner"
                ? "bg-[#29171c] text-white border-transparent shadow-md"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            <Building2 size={15} />
            Studio Owner
          </button>
          <button
            onClick={() => { setUserType("trainer"); setMode("login"); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
              userType === "trainer"
                ? "bg-[#29171c] text-white border-transparent shadow-md"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            <UserCog size={15} />
            Trainer
          </button>
        </div>

        {/* Login / Register Tab Switcher */}
        <div className="bg-slate-100/80 p-1.5 rounded-2xl flex relative mb-6 border border-slate-200/50">
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              mode === "login" ? "left-1.5" : "left-[calc(50%+1.5px)]"
            }`}
          />
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors duration-200 relative z-10 ${
              mode === "login" ? "text-rose-700" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors duration-200 relative z-10 ${
              mode === "register" ? "text-rose-700" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">

            {/* Owner Fields */}
            {userType === "owner" && (
              <>
                <InputGroup
                  icon={User}
                  type="text"
                  placeholder="Studio / Class Name"
                  value={className}
                  onChange={setClassName}
                />
                {mode === "register" && (
                  <div className="animate-in slide-in-from-top-4 fade-in duration-300 space-y-4">
                    <InputGroup
                      icon={Phone}
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={setPhone}
                    />
                    <InputGroup
                      icon={Mail}
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={setEmail}
                    />
                  </div>
                )}
              </>
            )}

            {/* Trainer Fields */}
            {userType === "trainer" && (
              <>
                {mode === "register" && (
                  <div className="animate-in slide-in-from-top-4 fade-in duration-300 space-y-4">
                    <InputGroup
                      icon={User}
                      type="text"
                      placeholder="Your Full Name"
                      value={trainerName}
                      onChange={setTrainerName}
                    />
                  </div>
                )}
                <InputGroup
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={setEmail}
                />
                {/* Studio dropdown – only on register */}
                {mode === "register" && (
                  <div className="relative group animate-in slide-in-from-top-4 fade-in duration-300">
                    <Building2
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors"
                      size={18}
                    />
                    <select
                      value={selectedStudioId}
                      onChange={(e) => setSelectedStudioId(e.target.value)}
                      required
                      className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 pl-11 pr-10 py-3.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-800 font-medium appearance-none"
                    >
                      <option value="">
                        {studiosLoading ? "Loading studios…" : "Select your studio"}
                      </option>
                      {studios.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.className}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                )}
              </>
            )}

            {/* Password (always visible) */}
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors"
                size={18}
              />
              <input
                type={show ? "text" : "password"}
                className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 pl-11 pr-10 py-3.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {show ? (
                  <span className="text-[10px] font-bold uppercase">Hide</span>
                ) : (
                  <span className="text-[10px] font-bold uppercase">Show</span>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          {mode === "login" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openForgotModal}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Trainer register pending notice */}
          {userType === "trainer" && registeredEmail === "pending" && mode === "login" && (
            <div className="flex items-start gap-3 text-sm text-emerald-700 bg-emerald-50/80 border border-emerald-100 rounded-xl p-3 animate-in fade-in zoom-in-95 duration-200">
              <span className="text-lg leading-none">✅</span>
              <p className="font-medium">
                Registration submitted! Your account is pending approval from the studio owner.
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-3 text-sm text-rose-600 bg-rose-50/80 border border-rose-100 rounded-xl p-3 animate-in fade-in zoom-in-95 duration-200">
              <span className="text-lg leading-none">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#29171c] to-[#451523] text-white font-bold text-sm shadow-xl shadow-rose-900/20 hover:shadow-rose-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <span>
                  {mode === "login"
                    ? "Sign In"
                    : userType === "trainer"
                    ? "Submit Request"
                    : "Create Account"}
                </span>
                <ArrowRight size={18} className="opacity-80" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-white/30 text-xs font-medium tracking-wide mt-8 pb-4">
        © 2025 DNCR. All rights reserved.
      </div>

      {/* MODALS */}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <ModalOverlay onClose={() => setShowForgotModal(false)}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Forgot Password</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto">
              {fpStep === "request"
                ? userType === "owner"
                  ? "Enter your Class Name, Email OR Phone to receive an OTP."
                  : "Enter your registered Email to receive an OTP."
                : "Enter the code sent to your device and set a new password."}
            </p>
          </div>

          <form onSubmit={handleForgotSubmit} className="space-y-6">
            {fpStep === "request" && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <InputGroup
                  icon={User}
                  placeholder={userType === "owner" ? "Class Name / Email / Phone" : "Email"}
                  value={fpInput}
                  onChange={setFpInput}
                />
              </div>
            )}

            {fpStep === "verify" && (
              <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-center gap-2">
                  {fpOtp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-10 h-12 bg-slate-50 border border-slate-200 rounded-lg text-center text-lg font-bold text-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index, setFpOtp)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index, setFpOtp)}
                      onPaste={(e) => handleOtpPaste(e, setFpOtp)}
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  <InputGroup
                    icon={Lock}
                    type="password"
                    placeholder="New Password"
                    value={fpNewPassword}
                    onChange={setFpNewPassword}
                  />
                  <InputGroup
                    icon={Lock}
                    type="password"
                    placeholder="Confirm Password"
                    value={fpConfirmPassword}
                    onChange={setFpConfirmPassword}
                  />
                </div>
              </div>
            )}

            {fpError && (
              <p className="text-center text-xs text-rose-600 bg-rose-50 py-2 rounded-lg font-medium">
                {fpError}
              </p>
            )}
            {fpMessage && (
              <p className="text-center text-xs text-emerald-600 bg-emerald-50 py-2 rounded-lg font-medium">
                {fpMessage}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={fpLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
              >
                {fpLoading && <Loader2 size={14} className="animate-spin" />}
                {fpStep === "request" ? "Send OTP" : "Reset Password"}
              </button>
            </div>
          </form>
        </ModalOverlay>
      )}

      {/* Verify Email Modal (Owner only) */}
      {showVerifyModal && (
        <ModalOverlay onClose={() => setShowVerifyModal(false)}>
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 text-rose-600">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Verify Email</h3>
            <p className="text-xs text-slate-500 mt-2">
              Code sent to{" "}
              <span className="font-semibold text-slate-700">{registeredEmail}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyEmail} className="space-y-6">
            <div className="flex justify-center gap-2">
              {verifyOtp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-10 h-12 bg-slate-50 border border-slate-200 rounded-lg text-center text-lg font-bold text-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index, setVerifyOtp)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index, setVerifyOtp)}
                  onPaste={(e) => handleOtpPaste(e, setVerifyOtp)}
                />
              ))}
            </div>

            {verifyError && (
              <p className="text-center text-xs text-rose-600 bg-rose-50 py-2 rounded-lg font-medium">
                {verifyError}
              </p>
            )}
            {verifyMessage && (
              <p className="text-center text-xs text-emerald-600 bg-emerald-50 py-2 rounded-lg font-medium">
                {verifyMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={verifyLoading}
              className="w-full py-3 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
            >
              {verifyLoading ? <Loader2 size={16} className="animate-spin" /> : "Verify Account"}
            </button>
          </form>
        </ModalOverlay>
      )}
    </div>
  );
};
export default AuthPage;

