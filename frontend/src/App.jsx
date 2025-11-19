import React from "react";
import { motion } from "framer-motion";
import ChecklistForm from "./components/ChecklistForm";
import ChecklistList from "./components/ChecklistList";
import "./index.css";

export default function App() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-64 hidden md:flex flex-col bg-white/20 backdrop-blur-xl 
          shadow-xl border-r border-white/30 p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-10 drop-shadow-lg">
          ✈️ Dashboard
        </h1>

        <nav className="space-y-4">
          <a className="block text-lg font-medium hover:text-yellow-300 transition-all cursor-pointer">
            ➤ Create Checklist
          </a>
          <a className="block text-lg font-medium hover:text-yellow-300 transition-all cursor-pointer">
            ➤ All Checklists
          </a>
        </nav>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10">

        {/* PAGE TITLE */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-4xl font-extrabold text-white drop-shadow-xl">
            Pre-Flight
          </h2>
          <p className="text-white/80 mt-1 text-lg">
            Manage flight forms & checklist items
          </p>
        </motion.div>

        {/* TWO SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* FORM CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-xl shadow-xl p-6 
              rounded-3xl border border-white/20 hover:scale-[1.02] transition-all"
          >
            <ChecklistForm />
          </motion.div>

          {/* LIST CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-xl shadow-xl p-6 
              rounded-3xl border border-white/20 hover:scale-[1.02] transition-all"
          >
            <ChecklistList />
          </motion.div>

        </div>
      </main>
    </div>
  );
}
