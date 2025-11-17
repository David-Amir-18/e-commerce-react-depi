import React from "react";
import { Plane, Users, BookOpen, DollarSign, TrendingUp } from "lucide-react";
import goldParticles from "./assets/gold-particle.1920x1080.mp4";
import { useAuth } from "@/contexts/AuthContext";
const Dashboard = () => {
  const { logout, user } = useAuth();
  const stats = [
    {
      title: "Total Flights",
      value: "24",
      icon: <Plane size={24} />,
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Active Users",
      value: "1,847",
      icon: <Users size={24} />,
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Bookings",
      value: "324",
      icon: <BookOpen size={24} />,
      change: "+15%",
      changeType: "positive",
    },
    {
      title: "Revenue",
      value: "$124,580",
      icon: <DollarSign size={24} />,
      change: "+22%",
      changeType: "positive",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New booking confirmed",
      user: "John Doe",
      time: "2 min ago",
      type: "booking",
    },
    {
      id: 2,
      action: "Flight schedule updated",
      user: "System",
      time: "1 hour ago",
      type: "flight",
    },
    {
      id: 3,
      action: "New user registered",
      user: "Sarah Wilson",
      time: "3 hours ago",
      type: "user",
    },
  ];

  const getActivityIcon = (type) => {
    const icons = {
      booking: <BookOpen size={16} className="text-green-400" />,
      flight: <Plane size={16} className="text-blue-400" />,
      user: <Users size={16} className="text-purple-400" />,
    };
    return icons[type];
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/20 via-black to-black pointer-events-none"></div>
      <video
        className="fixed top-0 w-full h-full object-cover blur-[50px]"
        autoPlay
        muted
        loop
        playsInline
        // style={{display: 'none'}}
      >
        <source src={goldParticles} />
      </video>
      {/* Foreground Content */}
      <div className="relative z-10 p-4 sm:p-6 space-y-6 text-white pt-10 lg:pt-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-amber-400"> {user?.name || "Admin"}</span>
          </h1>
          <p className="text-gray-300">
            Here's what's happening with your flights today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
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
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      stat.changeType === "positive"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    <TrendingUp size={12} />
                    {stat.change} this month
                  </p>
                </div>
                <div className="text-amber-500">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Recent Activities
              </h2>
              <BookOpen className="text-amber-500" size={20} />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white group-hover:text-amber-400 truncate">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-400">by {activity.user}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">
              Performance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <span className="text-gray-300">Occupancy Rate</span>
                <span className="font-semibold text-amber-400">78%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <span className="text-gray-300">On-time Performance</span>
                <span className="font-semibold text-green-400">92%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <span className="text-gray-300">Customer Satisfaction</span>
                <span className="font-semibold text-blue-400">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
