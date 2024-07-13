"use client"
// pages/recover.js
import React, { useState } from 'react';
import { account } from "@/cms/cms.config";

const Recover = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');


  const handleRecovery = async (e) => {
    e.preventDefault();
    const baseUrl = window.location.origin;
    const resetPasswordUrl = `${baseUrl}/reset-password`;

    try {
      const res= await account.createRecovery(email, resetPasswordUrl);
      // console.log(res);
      setMessage('Recovery email sent. Please check your inbox.');
    } catch (error) {
      setMessage('Error sending recovery email.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Password Recovery</h2>
        <form onSubmit={handleRecovery}>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-primary text-white px-4 py-2 rounded-lg">Send Recovery Email</button>
        </form>
        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default Recover;
