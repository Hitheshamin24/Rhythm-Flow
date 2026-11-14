import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  login,
  registerStudio,
  requestPasswordOtp,
  resetPasswordWithOtp,
  verifyEmailOtp,
  staffLogin,
  staffRegister,
  getStudiosList,
  staffRequestPasswordOtp,
  staffResetPasswordWithOtp,
} from "../api/auth";

export const useAuth = () => {
  const [userType, setUserType] = useState("owner");
  const [mode, setMode] = useState("login");

  const [className, setClassName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [trainerName, setTrainerName] = useState("");
  const [selectedStudioId, setSelectedStudioId] = useState("");
  const [studios, setStudios] = useState([]);
  const [studiosLoading, setStudiosLoading] = useState(false);

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

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(new Array(6).fill(""));
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");

  const [registeredClassName, setRegisteredClassName] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (userType === "trainer" && mode === "register") {
      setStudiosLoading(true);
      getStudiosList()
        .then((res) => setStudios(res.data || []))
        .catch(() => setStudios([]))
        .finally(() => setStudiosLoading(false));
    }
  }, [userType, mode]);

  useEffect(() => {
    setError("");
    setEmail("");
    setPassword("");
    setClassName("");
    setPhone("");
    setTrainerName("");
    setSelectedStudioId("");
  }, [userType, mode]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (userType === "owner") {
        if (mode === "login") {
          const response = await login(className, password);
          const data = response.data;

          if (data.requiresVerification) {
            setRegisteredClassName(className);
            setRegisteredEmail(data.studio?.email || "");
            setError("");
            setShowVerifyModal(true);
            return;
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("studioName", data.studio.className);
          localStorage.setItem("role", "owner");
          navigate("/dashboard");
        } else {
          await registerStudio(className, email, password, phone);
          setRegisteredClassName(className);
          setRegisteredEmail(email);
          setError("");
          setShowVerifyModal(true);
        }
      } else {
        if (mode === "login") {
          const response = await staffLogin(email, password);
          const data = response.data;

          localStorage.setItem("token", data.token);
          localStorage.setItem("studioName", data.staff.name);
          localStorage.setItem("role", "trainer");
          navigate("/dashboard");
        } else {
          if (!selectedStudioId) {
            setError("Please select the studio you belong to.");
            return;
          }
          await staffRegister(trainerName, email, password, selectedStudioId);
          setMode("login");
          setError("");
          setRegisteredEmail("pending");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
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

        let res;
        if (userType === "owner") {
          res = await requestPasswordOtp(payload);
        } else {
          res = await staffRequestPasswordOtp({ email: fpInput });
        }
        setFpMessage(res.data?.message || "OTP sent to registered details.");
        setFpStep("verify");
      } else {
        if (fpNewPassword !== fpConfirmPassword) {
          setFpError("Passwords do not match.");
          setFpLoading(false);
          return;
        }

        let res;
        if (userType === "owner") {
          res = await resetPasswordWithOtp({
            className: fpClassName,
            email: fpEmail,
            phone: fpPhone,
            otp: otpString,
            newPassword: fpNewPassword,
          });
        } else {
          res = await staffResetPasswordWithOtp({
            email: fpInput,
            otp: otpString,
            newPassword: fpNewPassword,
          });
        }

        setFpMessage(res.data?.message || "Password reset successful.");
        setTimeout(() => setShowForgotModal(false), 1500);
      }
    } catch (err) {
      setFpError(err.response?.data?.message || "Failed to process request.");
    } finally {
      setFpLoading(false);
    }
  };

  const openForgotModal = () => {
    const prefill = email || phone || className || "";
    setFpInput(prefill);
    setFpOtp(new Array(6).fill(""));
    setFpNewPassword("");
    setFpConfirmPassword("");
    setFpMessage("");
    setFpError("");
    setFpStep("request");
    setShowForgotModal(true);
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setVerifyError("");
    setVerifyMessage("");
    setVerifyLoading(true);

    const otpString = verifyOtp.join("");

    try {
      const res = await verifyEmailOtp({
        className: registeredClassName,
        email: registeredEmail,
        otp: otpString,
      });

      const data = res.data;
      setVerifyMessage(data.message || "Email verified!");

      if (data.token && data.studio) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("studioName", data.studio.className);
        localStorage.setItem("role", "owner");
        setTimeout(() => {
          setShowVerifyModal(false);
          navigate("/dashboard");
        }, 800);
      }
    } catch (err) {
      setVerifyError(err.response?.data?.message || "Verification failed.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const isSuccessNotice =
    userType === "trainer" && registeredEmail === "pending" && !error;

  return {
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
  };
};
