import React, { useState, useEffect } from "react";
import { Users, BookOpen, DollarSign, BarChart3 } from "lucide-react";
import goldParticles from "./assets/gold-particle.1920x1080.mp4";
import { useAuth } from "@/contexts/AuthContext";
import { bookingsAPI, usersAPI } from "@/services/api";
import Loading from "./components/Loading";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [usersResponse, bookingsResponse] = await Promise.all([
        usersAPI.getAll(),
        bookingsAPI.getAll()
      ]);

      if (usersResponse.success && bookingsResponse.success) {
        const users = usersResponse.data || [];
        const bookings = bookingsResponse.data || [];

        // Calculate stats
        const activeUsers = users.filter(u => u.isActive).length;
        const totalBookings = bookings.length;
        
        // Calculate total revenue from confirmed bookings
        const totalRevenue = bookings
          .filter(booking => booking.status === 'confirmed')
          .reduce((sum, booking) => {
            const flightPrice = booking.flight?.price || 0;
            return sum + (booking.seats * flightPrice);
          }, 0);

        setStats({
          activeUsers,
          totalBookings,
          totalRevenue,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const dashboardStats = [
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: <Users size={24} />,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: <BookOpen size={24} />,
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={24} />,
    },
  ];

  if (loading) {
  return <Loading icon={BarChart3} message="Loading Dashboard..." />;
}

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/20 via-black to-black pointer-events-none"></div>
      <video
        className="fixed top-0 w-full h-full object-cover blur-[50px]"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={goldParticles} />
      </video>
      
      {/* Foreground Content */}
      <div className="relative z-10 p-4 sm:p-6 space-y-6 text-white pt-10 lg:pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, <span className="text-amber-400">{user?.name || "Admin"}</span>
            </h1>
            <p className="text-gray-300">
              Here's what's happening with your bookings today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-amber-500/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {stat.value}
                  </h3>
                </div>
                <div className="text-amber-500">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Content Space */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
          <div className="max-w-md mx-auto">
            <BookOpen className="text-amber-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">
              Booking Management System
            </h3>
            <p className="text-gray-300">
              Manage bookings and users from the navigation menu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;