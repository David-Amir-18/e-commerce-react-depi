import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {BarChart3,Plane, Users, BookOpen, LogOut, Settings, Home, Menu, X} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <BarChart3 size={20} />, path: "/admin/dashboard" },
    { name: "Flights", icon: <Plane size={20} />, path: "/admin/flights" },
    { name: "Users", icon: <Users size={20} />, path: "/admin/users" },
    { name: "Bookings", icon: <BookOpen size={20} />, path: "/admin/bookings" },
   // { name: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 right-4 z-50 lg:hidden bg-amber-400 hover:bg-amber-500 text-black p-3 rounded-lg shadow-lg transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 w-64 min-h-screen bg-gradient-to-b from-[#0a0a0a]/90 to-[#1a1a1a]/80 backdrop-blur-xl border-r border-amber-400/20 flex flex-col shadow-[0_0_25px_rgba(255,193,7,0.15)] transition-transform duration-300 z-40 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Header */}
      <div className="p-6 border-b border-amber-400/20">
        <h1 className="text-2xl font-extrabold text-amber-400 ">
          ELYSIUM Admin
        </h1>
        <p className="text-gray-400 text-sm mt-1">Flight Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive
                  ? "bg-amber-400/90 text-black shadow-lg shadow-amber-500/30"
                  : "text-gray-300 hover:text-amber-400 hover:bg-amber-400/10"
              }`}
            >
              <div
                className={`transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              >
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-amber-400/20">
        <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 transition-all">
          <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center">
            <span className="text-black text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 w-full px-4 py-3 mb-2 text-gray-300 hover:text-amber-400 hover:bg-amber-400/10 rounded-xl transition-all duration-300"
        >
          <Home size={20} />
          <span className="font-medium">Back to Home</span>
        </Link>

        <button
          onClick={() => {
            closeMobileMenu();
            logout();
          }}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
