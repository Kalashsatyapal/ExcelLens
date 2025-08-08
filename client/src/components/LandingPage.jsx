import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col justify-center items-center p-6">
      <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg">Welcome to MERN Auth App</h1>
      <p className="text-white mb-12 text-lg max-w-xl text-center">
        Secure app with User & Admin authentication using JWT, built with MERN & TailwindCSS.
      </p>
      <div className="space-x-6">
        <Link to="/login" className="px-6 py-3 rounded-md bg-white text-indigo-600 font-semibold hover:bg-indigo-100 transition">
          Login
        </Link>
        <Link to="/register" className="px-6 py-3 rounded-md bg-indigo-700 text-white font-semibold hover:bg-indigo-800 transition">
          Register
        </Link>
      </div>
    </div>
  );
}
