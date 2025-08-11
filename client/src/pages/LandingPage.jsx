import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sky-50 flex flex-col">
      {/* Navbar */}
      <header className="w-full py-4 px-8 flex justify-between items-center bg-white shadow-md">
        <h1 className="text-2xl font-bold text-green-600">ExcelLense</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-sky-100 transition"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight">
          Build Faster with <span className="text-green-600">MERN + Tailwind</span>
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Secure authentication for users and admins, file uploads with Excel parsing, and a clean, modern UI ready for development.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-white text-green-700 border border-green-600 rounded-lg shadow hover:bg-sky-100 transition"
          >
            Login
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {[
            { title: "JWT Auth", desc: "Secure login system with user & admin roles." },
            { title: "Excel Parsing", desc: "Upload Excel files and parse them into structured data." },
            { title: "Modern UI", desc: "Clean and responsive interface for great UX." },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 bg-sky-100 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-green-600">{f.title}</h3>
              <p className="mt-2 text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center bg-sky-100 text-gray-600">
        © {new Date().getFullYear()} MERN App. All rights reserved.
      </footer>
    </div>
  );
}
