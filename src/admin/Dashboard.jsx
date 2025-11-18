import React, { useState, useEffect } from "react";
import { Plane, Users, BookOpen, DollarSign, RefreshCw ,BarChart3} from "lucide-react";
import goldParticles from "./assets/gold-particle.1920x1080.mp4";
import { useAuth } from "@/contexts/AuthContext";
import { flightsAPI, bookingsAPI, usersAPI } from "@/services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFlights: 0,
    activeUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch all data in parallel
      const [flightsResponse, usersResponse, bookingsResponse] = await Promise.all([
        flightsAPI.getAll(),
        usersAPI.getAll(),
        bookingsAPI.getAll()
      ]);

      if (flightsResponse.success && usersResponse.success && bookingsResponse.success) {
        const flights = flightsResponse.data || [];
        const users = usersResponse.data || [];
        const bookings = bookingsResponse.data || [];

        // Calculate stats
        const totalFlights = flights.length;
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
          totalFlights,
          activeUsers,
          totalBookings,
          totalRevenue,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const dashboardStats = [
    {
      title: "Total Flights",
      value: stats.totalFlights.toString(),
      icon: <Plane size={24} />,
    },
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

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
      return (
        <div className="p-6 flex items-center justify-center min-h-screen bg- text-white">
          <div className="text-center">
            <BarChart3 className="animate-bounce text-amber-400 mx-auto mb-4" size={40} />
            <p className="text-gray-400">Loading Dashboard...</p>
          </div>
        </div>
      );
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
              Here's what's happening with your flights today.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
            <Plane className="text-amber-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">
              Flight Management System
            </h3>
            <p className="text-gray-300">
              Manage flights, bookings, and users from the navigation menu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;