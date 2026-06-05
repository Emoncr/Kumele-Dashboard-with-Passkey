"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Filter,
  Home,
  Menu,
  MessageSquareMore,
  Presentation,
  Settings,
  ShoppingBasket,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState("2022");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const years = ["2022", "2023", "2024"];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="h-[72px] bg-white flex items-center justify-between px-4 md:px-6 border-b border-gray-200 shrink-0 z-20 relative">
        <div className="flex items-center gap-2 md:gap-4">
          <button className="md:hidden text-gray-800 p-1">
            <Menu className="w-6 h-6" />
          </button>
          {/* Logo SVG */}
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={120} height={50} />
          </div>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-pink-100 flex items-center justify-center shrink-0">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffdfbf"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className="hidden md:flex w-[72px] bg-white flex-col items-center py-6 gap-8 shrink-0 relative z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
          <button className="text-gray-800 hover:text-black transition-colors">
            <Home className="w-6 h-6 fill-gray-800" />
          </button>
          <button className="text-gray-800 hover:text-black transition-colors relative">
            <Presentation className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FFC500] rounded-full border-2 border-white"></div>
          </button>
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <ShoppingBasket className="w-6 h-6 fill-gray-400 text-gray-400" />
          </button>
          <button className="text-gray-500 hover:text-gray-800 transition-colors relative">
            <MessageSquareMore className="w-6 h-6 fill-gray-400 text-gray-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FFC500] rounded-full border-2 border-white"></div>
          </button>
          <button className="text-[#004DFF] bg-blue-50/50 p-2 rounded-xl transition-colors -mx-2 relative">
            <TrendingUp className="w-[22px] h-[22px] stroke-[2.5px]" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FFC500] rounded-full"></div>
            {/* Active indicator bar */}
            <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-8 bg-[#004DFF] rounded-r-md"></div>
          </button>
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <Settings className="w-6 h-6 fill-gray-400 text-gray-400" />
          </button>
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <Filter className="w-6 h-6 fill-gray-400 text-gray-400" />
          </button>
          <button className="text-gray-500 hover:text-gray-800 transition-colors relative">
            <ShoppingCart className="w-6 h-6 fill-gray-400 text-gray-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FFC500] rounded-full border-2 border-white"></div>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4  md:p-8 md:pt-5 overflow-y-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-white rounded-xl shadow-sm border border-gray-100 w-full h-[85vh] overflow-y-auto flex flex-col mx-auto"
          >
            {/* Card Header */}
            <div className="px-6 py-5 md:px-8 md:py-6 border-b border-gray-100">
              <h1 className="text-[18px] md:text-[22px] font-semibold text-black">
                History & Statistics
              </h1>
            </div>

            {/* Card Body */}
            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-12 lg:gap-8 xl:gap-24 2xl:gap-40 flex-1">
              {/* Left Column: Reward Rings & Pie Chart */}
              <motion.div
                variants={itemVariants}
                className="flex-1 max-w-full lg:max-w-[500px]"
              >
                <div className="flex items-center gap-1 mb-8 md:mb-10">
                  <h2 className="text-[18px] md:text-[22px] font-medium text-black">
                    Reward Rings
                  </h2>
                  <Image
                    src="/icons/badge.png"
                    alt="Award"
                    width={50}
                    height={50}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-10">
                  {/* Pie Chart SVG */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: -90 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: 0.2,
                    }}
                    className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] xl:w-[280px] xl:h-[280px] shrink-0 relative"
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full transform"
                    >
                      {/* Silver: 35% -> 54.98 offset -62.83-39.27 = -102.1 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="25"
                        fill="none"
                        stroke="#B7B9B0"
                        strokeWidth="50"
                        strokeDasharray="54.98 157.08"
                        strokeDashoffset="-102.1"
                      />
                      {/* Bronze: 25% -> 39.27 offset -62.83 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="25"
                        fill="none"
                        stroke="#CD7E31"
                        strokeWidth="50"
                        strokeDasharray="39.27 157.08"
                        strokeDashoffset="-62.83"
                      />
                      {/* Gold: 40% -> 62.83 offset 0 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="25"
                        fill="none"
                        stroke="#DDB022"
                        strokeWidth="50"
                        strokeDasharray="62.83 157.08"
                        strokeDashoffset="0"
                      />
                    </svg>
                  </motion.div>

                  {/* Legend */}
                  <div className="flex flex-col gap-4 md:gap-6 w-full sm:w-auto">
                    {[
                      { color: "bg-[#DDB022]", title: "Gold", medals: 22 },
                      { color: "bg-[#B7B9B0]", title: "Silver", medals: 1 },
                      { color: "bg-[#CD7E31]", title: "Bronze", medals: 1 },
                    ].map((legend, idx) => (
                      <motion.div
                        key={idx}
                        variants={itemVariants}
                        className="flex flex-col"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-[19px] h-[19px] md:w-[26px] md:h-[26px] rounded-full ${legend.color}`}
                          ></div>
                          <span className="text-[16px] md:text-[21px] text-[#000000] font-medium">
                            {legend.title}
                          </span>
                          <Image
                            src="/icons/info.png"
                            alt="Info"
                            width={16}
                            height={16}
                          />
                        </div>
                        <span className="text-[14px] md:text-[17px] text-[#262626] ml-7 md:ml-[30px] mt-0.5">
                          Achieved {legend.medals}{" "}
                          {legend.medals === 1 ? "medal" : "medals"}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Bar Chart */}
              <motion.div
                variants={itemVariants}
                className="flex-1 flex flex-col lg:pl-10 relative"
              >
                <div className="flex items-center justify-between mb-8 md:mb-12">
                  <h2 className="text-[16px] md:text-[18px] text-black">
                    Money Earned{" "}
                    <span className="font-bold text-black ml-1 text-[18px] md:text-[20px]">
                      $905
                    </span>
                  </h2>

                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      onBlur={() =>
                        setTimeout(() => setIsDropdownOpen(false), 150)
                      }
                      className="flex items-center gap-2 bg-[#F0F2F5] px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[13px] md:text-sm font-semibold text-black hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-[#004DFF]/20"
                    >
                      {selectedYear}
                      <ChevronDown
                        className={`w-3 h-3 md:w-4 md:h-4 text-black stroke-[3px] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute right-0 top-full mt-2 w-full min-w-[110px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden z-30"
                        >
                          <div className="py-1">
                            {years.map((year) => (
                              <button
                                key={year}
                                onClick={() => {
                                  setSelectedYear(year);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-[13px] md:text-sm transition-colors ${selectedYear === year ? "bg-[#004DFF]/10 text-[#004DFF] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="w-full flex items-end justify-between px-1 md:px-2 xl:px-4 gap-2 md:gap-4 xl:gap-8 h-[200px] md:h-[220px] xl:h-[350px] mt-4 xl:mt-8">
                  {[
                    { label: "Mar", height: "60%" },
                    { label: "Apr", height: "40%" },
                    { label: "May", height: "75%" },
                    { label: "Jun", height: "65%" },
                    { label: "Jul", height: "30%" },
                    { label: "Aug", height: "85%" },
                    { label: "Sep", height: "48%" },
                    { label: "Oct", height: "80%" },
                    { label: "Nov", height: "55%" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 md:gap-3 w-full h-full group"
                    >
                      <div className="w-full relative h-full flex items-end justify-center">
                        <motion.div
                          initial={{ height: "0%" }}
                          animate={{ height: item.height }}
                          transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            delay: 0.3 + i * 0.05,
                          }}
                          className="w-full max-w-[24px] md:max-w-[36px] xl:max-w-[56px] bg-[#0A58FF] rounded-t-md md:rounded-t-lg transition-all duration-300 group-hover:opacity-90"
                        ></motion.div>
                      </div>
                      <span className="text-[11px] md:text-[13px] text-gray-600 font-medium shrink-0">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
