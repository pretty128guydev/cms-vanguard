"use client";
// pages/reset-password.js
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { account } from "@/cms/cms.config";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const expire = searchParams.get("expire");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isExpired, setIsExpired] = useState(false);

//   useEffect(() => {
//     const checkExpiration = () => {
//       if (!expire) {
//         console.log("Expire parameter is missing");
//         return;
//       }

//       // Current date in UTC
//       const currentDate = new Date(new Date().toISOString());
//       // Expiration date in UTC
//       const expirationDate = new Date(expire);

//       if (isNaN(expirationDate.getTime())) {
//         console.log(`Invalid expiration date format: ${expire}`);
//         return;
//       }

//       console.log(`Current Date (UTC): ${currentDate.toISOString()}`);
//       console.log(`Expiration Date (UTC): ${expirationDate.toISOString()}`);

//       if (currentDate.getTime() > expirationDate.getTime()) {
//         setIsExpired(true);
//       } else {
//         setIsExpired(false);
//       }
//     };

//     checkExpiration();
//   }, [expire]);

  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 265;
    const commonPasswords = ["12345678", "password", "123456789"];

    if (password.length < minLength || password.length > maxLength) {
      return `Password must be between ${minLength} and ${maxLength} characters long.`;
    }

    if (commonPasswords.includes(password)) {
      return "Password should not be one of the commonly used passwords.";
    }

    return "";
  };

  const handleReset = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await account.updateRecovery(userId, secret, password, confirmPassword);
      // console.log(res);
      setMessage("Password reset successfully.");
    } catch (error) {
      setMessage("Error resetting password.");
      console.error(error);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>
        {isExpired ? (
          <p className="text-center text-red-600">The reset link has expired. Please request a new one.</p>
        ) : (
          <form onSubmit={handleReset}>
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">
              Reset Password
            </button>
          </form>
        )}
        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
