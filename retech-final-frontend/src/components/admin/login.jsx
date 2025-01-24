import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Navbar from "../user/navbar/navbar";
import { Link, useNavigate } from "react-router-dom";


const AdminLogin = () => {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleSendOtp = async () => {
    if (!emailOrPhone) {
      setError("Please enter your email.");
      return;
    }

    try {
      const response = await fetch(
        "https://api.merabestie.com/otp/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailOrPhone,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setError("");
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      const response = await fetch(
        "https://api.merabestie.com/otp/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailOrPhone,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.message === "OTP verification successful") {
        setOtpVerified(true);
        setError("");
      } else if (data.message === "OTP has expired") {
        setShowResendButton(true);
        setError(data.message);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch(
        "https://api.merabestie.com/otp/resend-otp",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailOrPhone,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setShowResendButton(false);
        setError("");
      } else {
        setError(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleLogin = async () => {
    if (!sellerId || !emailOrPhone || !password || !otpVerified) {
      setError("Please fill all fields and verify OTP.");
      return;
    }

    try {
      const response = await fetch(`https://api.merabestie.com/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellerId,
          emailOrPhone,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message === "Login successful") {
        navigate(`/admin/${data.sellerId}`);
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Mera Bestie</title>
      </Helmet>
      <Navbar />
      <div className="h-[calc(100vh-140px)] bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-4 mt-20">
        <motion.div
          className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 120,
          }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Admin Login
              </h2>
              <p className="text-pink-600 mt-2">Log in to Admin Dashboard</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-pink-400" />
                </div>
                <input
                  type="text"
                  placeholder="Seller ID"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-pink-400" />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition duration-300 transform active:scale-95"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-pink-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    required
                    maxLength="6"
                    className="w-full pl-10 pr-4 py-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) {
                        setOtp(value);
                        if (value.length === 6) {
                          handleVerifyOtp(value);
                        }
                      }
                    }}
                  />
                </div>
              )}

              {showResendButton && (
                <button
                  type="button"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition duration-300 transform active:scale-95"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-pink-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-400 hover:text-pink-600 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <motion.button
                type="button"
                className={`w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition duration-300 transform active:scale-95 ${
                  !otpVerified ? "opacity-50 cursor-not-allowed" : ""
                }`}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
                disabled={!otpVerified}
              >
                Login
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
