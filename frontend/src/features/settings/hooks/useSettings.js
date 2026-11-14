import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "../api/settings";
import {
  getStudioProfile,
  updateStudioProfile,
  changeStudioPassword,
  verifyProfileOtp,
} from "../../dashboard/api/studio";
import { requestPasswordOtp, resetPasswordWithOtp } from "../../auth/api/auth";

export const useSettings = () => {
  const [alertMsg, setAlertMsg] = useState("");
  const [alertErr, setAlertErr] = useState("");

  const [studioForm, setStudioForm] = useState({
    className: "",
    email: "",
    phone: "",
  });
  const [savingStudio, setSavingStudio] = useState(false);

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [savingPassword, setSavingPassword] = useState(false);

  const [settingsForm, setSettingsForm] = useState({
    defaultMonthlyFee: "",
    monthStartDay: 1,
    hideInactiveByDefault: false,
    feeReminderTemplate: "",
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const [showProfileOtpModal, setShowProfileOtpModal] = useState(false);
  const [profileOtp, setProfileOtp] = useState(new Array(6).fill(""));
  const [profileOtpLoading, setProfileOtpLoading] = useState(false);
  const [profileOtpError, setProfileOtpError] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [fpStep, setFpStep] = useState("request");

  const [fpInput, setFpInput] = useState("");
  const [fpClassName, setFpClassName] = useState("");
  const [fpEmail, setFpEmail] = useState("");
  const [fpPhone, setFpPhone] = useState("");

  const [fpOtp, setFpOtp] = useState(new Array(6).fill(""));
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMessage, setFpMessage] = useState("");
  const [fpError, setFpError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setSettingsLoading(true);
        const [settingsRes, studioRes] = await Promise.all([
          getSettings(),
          getStudioProfile(),
        ]);

        const s = settingsRes.data || {};
        setSettingsForm({
          defaultMonthlyFee:
            s.defaultMonthlyFee !== undefined ? String(s.defaultMonthlyFee) : "",
          monthStartDay: s.monthStartDay || 1,
          hideInactiveByDefault: !!s.hideInactiveByDefault,
          feeReminderTemplate:
            s.feeReminderTemplate ||
            "Dear {parentName}, this is a reminder that {studentName}'s fee of ₹{amount} for {month} is pending. - {studioName}",
        });

        const st = studioRes.data || {};
        setStudioForm({
          className: st.className || "",
          email: st.email || "",
          phone: st.phone || "",
        });
      } catch (e) {
        setAlertErr("Failed to load settings. Please refresh.");
      } finally {
        setSettingsLoading(false);
      }
    };
    load();
  }, []);

  const handleOtpChange = (element, index, setOtpState) => {
    if (isNaN(element.value)) return false;
    setOtpState((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = element.value;
      return newOtp;
    });
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index, setOtpState) => {
    if (e.key === "Backspace") {
      setOtpState((prevOtp) => {
        const newOtp = [...prevOtp];
        if (!newOtp[index] && index > 0 && e.target.previousSibling) {
          e.target.previousSibling.focus();
        }
        newOtp[index] = "";
        return newOtp;
      });
      if (!e.target.value && index > 0 && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleOtpPaste = (e, setOtpState) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, 6).split("");
    if (data.length > 0) {
      setOtpState((prev) => {
        const newOtp = [...prev];
        data.forEach((char, i) => {
          if (i < 6 && !isNaN(char)) newOtp[i] = char;
        });
        return newOtp;
      });
    }
  };

  const handleStudioChange = (e) => {
    setStudioForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStudioSave = async (e) => {
    e.preventDefault();
    setAlertErr("");
    setAlertMsg("");

    try {
      setSavingStudio(true);
      const res = await updateStudioProfile(studioForm);
      const data = res.data;

      if (data.requiresVerification) {
        setAlertMsg(data.message || "OTP sent for verification.");
        setProfileOtp(new Array(6).fill(""));
        setShowProfileOtpModal(true);
        return;
      }

      localStorage.setItem("studioName", data.className);
      setAlertMsg("Studio details updated.");
    } catch (e) {
      setAlertErr(e.response?.data?.message || "Failed to update studio details.");
    } finally {
      setSavingStudio(false);
    }
  };

  const handlePwChange = (e) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setAlertErr("");
    setAlertMsg("");

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setAlertErr("New passwords do not match.");
      return;
    }
    if (!pwForm.newPassword || pwForm.newPassword.length < 6) {
      setAlertErr("Password must be at least 6 characters.");
      return;
    }

    try {
      setSavingPassword(true);
      await changeStudioPassword(pwForm.currentPassword, pwForm.newPassword);
      setAlertMsg("Password updated successfully.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      setAlertErr(e.response?.data?.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSettingsChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettingsForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setAlertErr("");
    setAlertMsg("");

    try {
      setSettingsSaving(true);
      await updateSettings({
        ...settingsForm,
        defaultMonthlyFee: settingsForm.defaultMonthlyFee
          ? Number(settingsForm.defaultMonthlyFee)
          : 0,
      });
      setAlertMsg("Settings saved successfully.");
    } catch (e) {
      setAlertErr(e.response?.data?.message || "Failed to save settings.");
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleProfileOtpVerify = async (e) => {
    e.preventDefault();
    setProfileOtpError("");
    setAlertErr("");
    setAlertMsg("");

    const otpString = profileOtp.join("");
    if (otpString.length < 6) {
      setProfileOtpError("Please enter complete OTP");
      return;
    }

    try {
      setProfileOtpLoading(true);
      const res = await verifyProfileOtp(otpString);
      const data = res.data;

      setStudioForm((prev) => ({
        ...prev,
        email: data.email || prev.email,
        phone: data.phone || prev.phone,
        className: data.className || prev.className,
      }));

      localStorage.setItem("studioName", data.className);
      setAlertMsg("Contact details verified & updated.");
      setShowProfileOtpModal(false);
      setProfileOtp(new Array(6).fill(""));
    } catch (e) {
      setProfileOtpError(e.response?.data?.message || "Failed to verify.");
    } finally {
      setProfileOtpLoading(false);
    }
  };

  const detectInputType = (input) => {
    const value = input.trim();
    if (value.includes("@")) return "email";
    if (/^\d+$/.test(value) && value.length > 6) return "phone";
    return "className";
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setFpMessage("");
    setFpError("");
    setFpLoading(true);

    const otpString = fpOtp.join("");

    try {
      if (fpStep === "request") {
        if (!fpInput) {
          setFpError("Please enter your registered details.");
          setFpLoading(false);
          return;
        }

        const type = detectInputType(fpInput);
        const payload = { className: "", email: "", phone: "" };
        setFpClassName("");
        setFpEmail("");
        setFpPhone("");

        if (type === "email") {
          payload.email = fpInput;
          setFpEmail(fpInput);
        } else if (type === "phone") {
          payload.phone = fpInput;
          setFpPhone(fpInput);
        } else {
          payload.className = fpInput;
          setFpClassName(fpInput);
        }

        const res = await requestPasswordOtp(payload);
        setFpMessage(res.data?.message || "OTP sent.");
        setFpStep("verify");
      } else {
        if (fpNewPassword !== fpConfirmPassword) {
          setFpError("Passwords do not match.");
          setFpLoading(false);
          return;
        }
        await resetPasswordWithOtp({
          className: fpClassName,
          email: fpEmail,
          phone: fpPhone,
          otp: otpString,
          newPassword: fpNewPassword,
        });
        setFpMessage("Password reset successful.");
        setTimeout(() => setShowForgotModal(false), 1500);
      }
    } catch (err) {
      setFpError(err.response?.data?.message || "Failed.");
    } finally {
      setFpLoading(false);
    }
  };

  return {
    alertMsg,
    setAlertMsg,
    alertErr,
    setAlertErr,
    studioForm,
    savingStudio,
    pwForm,
    showPw,
    setShowPw,
    savingPassword,
    settingsForm,
    settingsLoading,
    settingsSaving,
    showProfileOtpModal,
    setShowProfileOtpModal,
    profileOtp,
    setProfileOtp,
    profileOtpLoading,
    profileOtpError,
    showForgotModal,
    setShowForgotModal,
    fpStep,
    setFpStep,
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
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleStudioChange,
    handleStudioSave,
    handlePwChange,
    handlePasswordSave,
    handleSettingsChange,
    handleSettingsSave,
    handleProfileOtpVerify,
    handleForgotSubmit,
  };
};
