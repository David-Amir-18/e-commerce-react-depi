import React, { useState, useEffect } from "react";
import { flightsAPI } from "../services/api";
import goldParticles from "./assets/gold-particle.1920x1080.mp4";
import { Plus, Search, Edit, Trash2, Eye, Plane, Calendar, Clock, X, AlertCircle, CheckCircle, Info } from "lucide-react";
import Pagination from "./components/Pagination";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [alert, setAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    flightNumber: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    totalSeats: "",
    availableSeats: "" 
  });

  const showAlert = (type, title, message, onConfirm = null, showCancel = false) => {
    setAlert({ type, title, message, onConfirm, showCancel });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const handleAlertConfirm = () => {
    if (alert?.onConfirm) {
      alert.onConfirm();
    }
    closeAlert();
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-400" size={48} />;
      case 'error': return <AlertCircle className="text-red-400" size={48} />;
      case 'warning': return <AlertCircle className="text-amber-400" size={48} />;
      case 'info': return <Info className="text-blue-400" size={48} />;
      default: return <Info className="text-gray-400" size={48} />;
    }
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Fetch flights from API
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await flightsAPI.getAll();
        if (response.success) {
          setFlights(response.data);
        } else {
          showAlert('error', 'Fetch Error', response.message || 'Failed to fetch flights.');
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
        const errorMsg = error.message || 'Unable to connect to server. Please check your connection.';
        showAlert('error', 'Network Error', errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const handleSubmit = async () => {
    // Validation
    if (!formData.flightNumber || !formData.origin || !formData.destination || 
        !formData.departureTime || !formData.arrivalTime || !formData.price || 
        !formData.totalSeats || !formData.availableSeats) { 
      showAlert('warning', 'Missing Fields!', 'Please fill in all required fields');
      return;
    }

    // Validate dates
    const depDate = new Date(formData.departureTime);
    const arrDate = new Date(formData.arrivalTime);
    if (depDate >= arrDate) {
      showAlert('warning', 'Invalid Dates!', 'Arrival time must be after departure time');
      return;
    }

    // Validate price and seats
    if (Number(formData.price) <= 0) {
      showAlert('warning', 'Invalid Price!', 'Price must be greater than 0');
      return;
    }

    if (Number(formData.totalSeats) <= 0) {
      showAlert('warning', 'Invalid Seats!', 'Total seats must be greater than 0');
      return;
    }

    if (Number(formData.availableSeats) < 0) {
      showAlert('warning', 'Invalid Available Seats!', 'Available seats cannot be negative');
      return;
    }

    if (Number(formData.availableSeats) > Number(formData.totalSeats)) {
      showAlert('warning', 'Invalid Seats!', 'Available seats cannot exceed total seats');
      return;
    }

    try {
     
      const flightData = {
        flightNumber: formData.flightNumber.trim(),
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        departureTime: new Date(formData.departureTime).toISOString(),
        arrivalTime: new Date(formData.arrivalTime).toISOString(),
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats),
        availableSeats: Number(formData.availableSeats), 
      };

      let response;
      if (editingFlight) {
        // Update flight
        response = await flightsAPI.update(editingFlight._id, flightData);

        if (response.success) {
          setFlights(flights.map((flight) =>
            flight._id === editingFlight._id ? response.data : flight
          ));
          showAlert('success', 'Flight Updated!', 'Flight has been updated successfully.');
        } else {
          showAlert('error', 'Update Failed', response.message || 'Failed to update flight.');
        }
      } else {
        // Create new flight
        response = await flightsAPI.create(flightData);

        if (response.success) {
          setFlights([...flights, response.data]);
          showAlert('success', 'Flight Added!', 'New flight has been added successfully.');
        } else {
          showAlert('error', 'Creation Failed', response.message || 'Failed to add flight.');
        }
      }

      setShowModal(false);
      setEditingFlight(null);
      resetForm();
    } catch (error) {
      console.error("Error saving flight:", error);
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred. Please try again.';
      showAlert('error', 'Error!', errorMsg);
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setFormData({
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: formatDateForInput(flight.departureTime),
      arrivalTime: formatDateForInput(flight.arrivalTime),
      price: flight.price.toString(),
      totalSeats: flight.totalSeats.toString(),
      availableSeats: flight.availableSeats.toString(), 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const flightToDelete = flights.find((f) => f._id === id);
    
    showAlert(
      'warning',
      'Delete Flight?',
      `Are you sure you want to delete flight ${flightToDelete?.flightNumber}? This action cannot be undone.`,
      async () => {
        try {
          const response = await flightsAPI.delete(id);
          if (response.success) {
            setFlights(flights.filter((f) => f._id !== id));
            showAlert('success', 'Deleted!', 'Flight removed successfully.');
          } else {
            showAlert('error', 'Deletion Failed', response.message || 'Failed to delete flight.');
          }
        } catch (error) {
          console.error('Error deleting flight:', error);
          const errorMsg = error.response?.data?.message || error.message || 'Failed to delete flight.';
          showAlert('error', 'Error!', errorMsg);
        }
      },
      true
    );
  };

  const clearAllData = () => {
  showAlert(
    'warning',
    'Clear All Flights?',
    `This will permanently delete all ${flights.length} flights. This action cannot be undone.`,
    async () => {
      if (flights.length === 0) {
        showAlert('info', 'No Data', 'There are no flights to delete.');
        return;
      }
      
      try {
        setLoading(true);
        let successCount = 0;
        let errorCount = 0;
        
        //delete
        const deletePromises = flights.map(async (flight) => {
          try {
            await flightsAPI.delete(flight._id);
            successCount++;
          } catch (error) {
            console.error(`Failed to delete flight ${flight.flightNumber}:`, error);
            errorCount++;
            throw error; 
          }
        });

       
        const results = await Promise.allSettled(deletePromises);
        
        
        try {
          const response = await flightsAPI.getAll();
          if (response.success) {
            setFlights(response.data);
          }
        } catch (fetchError) {
          console.error('Error fetching updated flights:', fetchError);
          
          setFlights([]);
        }
        
        
        if (errorCount === 0) {
          showAlert('success', 'All Cleared!', `Successfully deleted all ${successCount} flights.`);
        } else {
          showAlert(
            'warning', 
            'Partially Completed', 
            `Deleted ${successCount} flights. ${errorCount} failed to delete. Some flights may still exist.`
          );
        }
      } catch (error) {
        console.error('Error during bulk deletion:', error);
        showAlert('error', 'Clear Failed', 'Failed to clear all flights. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    true
  );
};

  const showFlightDetails = (flight) => {
    showAlert('info', `Flight ${flight.flightNumber}`,
      `Route: ${flight.origin} → ${flight.destination}\n\nDeparture: ${formatDateTime(flight.departureTime)}\nArrival: ${formatDateTime(flight.arrivalTime)}\n\nPrice: $${flight.price}\nAvailable Seats: ${flight.availableSeats}/${flight.totalSeats}\n\nFlight ID: ${flight._id}`
    );
  };

  const resetForm = () => {
    setFormData({
      flightNumber: "",
      origin: "",
      destination: "",
      departureTime: "",
      arrivalTime: "",
      price: "",
      totalSeats: "",
      availableSeats: "", 
    });
  };

  const filteredFlights = flights.filter(
    (f) =>
      f.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedFlights = filteredFlights.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <Plane className="animate-bounce text-amber-400 mx-auto mb-4" size={40} />
          <p className="text-gray-400">Loading flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/20 via-black to-black pointer-events-none"></div>
      <video className="fixed top-0 w-full h-full object-cover blur-[50px]" autoPlay muted loop playsInline>
        <source src={goldParticles} />
      </video>
      
      <div className="relative z-10 p-4 sm:p-6 space-y-6 text-white pt-10 lg:pt-6">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2">Flight Management</h1>
            <p className="text-sm sm:text-base text-gray-300">Manage and monitor all flight operations</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={clearAllData} className="border border-red-400 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all text-sm sm:text-base">
              Clear All Data
            </button>
            <button onClick={() => { setShowModal(true); resetForm(); setEditingFlight(null); }} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base">
              <Plus size={20} /> Add New Flight
            </button>
          </div>
        </div>

        {/* Search - Responsive */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search flights by number, origin, or destination..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden lg:block bg-white/10 backdrop-blur-md rounded-2xl overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/20 text-amber-300">
              <tr>
                <th className="p-3 sm:p-4 text-sm sm:text-base">Flight</th>
                <th className="p-3 sm:p-4 text-sm sm:text-base">Route</th>
                <th className="p-3 sm:p-4 text-sm sm:text-base">Schedule</th>
                <th className="p-3 sm:p-4 text-sm sm:text-base">Price</th>
                <th className="p-3 sm:p-4 text-sm sm:text-base">Seats</th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFlights.length > 0 ? (
                paginatedFlights.map((flight) => (
                  <tr key={flight._id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="bg-amber-500 text-black w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Plane size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm sm:text-base truncate">{flight.flightNumber}</p>
                          <p className="text-xs sm:text-sm text-gray-400 truncate">ID: {flight._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <span className="bg-white/10 px-2 py-1 rounded-md text-amber-300 text-xs sm:text-sm whitespace-nowrap">{flight.origin}</span>
                        <span className="text-amber-400 text-xs sm:text-sm">→</span>
                        <span className="bg-white/10 px-2 py-1 rounded-md text-amber-300 text-xs sm:text-sm whitespace-nowrap">{flight.destination}</span>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-300">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="whitespace-nowrap">{formatDateTime(flight.departureTime)}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 mt-1 text-gray-500">
                        <Clock size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="whitespace-nowrap">{formatDateTime(flight.arrivalTime)}</span>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 font-semibold text-amber-400 text-sm sm:text-base whitespace-nowrap">${flight.price}</td>
                    <td className="p-3 sm:p-4">
                      <div className="text-xs sm:text-sm text-gray-300">
                        {flight.availableSeats || 0}/{flight.totalSeats || 0}
                        <div className="w-16 sm:w-24 bg-white/10 rounded-full h-1.5 sm:h-2 mt-1">
                          <div className="bg-amber-500 h-1.5 sm:h-2 rounded-full"
                            style={{ width: `${flight.totalSeats > 0 ? (flight.availableSeats / flight.totalSeats) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex justify-center gap-1 sm:gap-2">
                        <button onClick={() => handleEdit(flight)} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg text-blue-400" title="Edit">
                          <Edit size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button onClick={() => handleDelete(flight._id)} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg text-red-400" title="Delete">
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button onClick={() => showFlightDetails(flight)} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg text-green-400" title="View">
                          <Eye size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400 text-sm sm:text-base">
                    {searchTerm ? 'No flights match your search.' : 'No flights found. Add your first flight to get started!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Hidden on desktop */}
        <div className="lg:hidden space-y-4">
          {paginatedFlights.length > 0 ? (
            paginatedFlights.map((flight) => (
              <div key={flight._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                {/* Flight Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-500 text-black w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Plane size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-base">{flight.flightNumber}</p>
                      <p className="text-xs text-gray-400">ID: {flight._id}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(flight)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(flight._id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400" title="Delete">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => showFlightDetails(flight)} className="p-2 hover:bg-white/10 rounded-lg text-green-400" title="View">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                {/* Route */}
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1">Route</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-white/10 px-3 py-1.5 rounded-md text-amber-300 text-sm">{flight.origin}</span>
                    <span className="text-amber-400">→</span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-md text-amber-300 text-sm">{flight.destination}</span>
                  </div>
                </div>

                {/* Schedule */}
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1">Schedule</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar size={14} />
                      <span>Departure: {formatDateTime(flight.departureTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Clock size={14} />
                      <span>Arrival: {formatDateTime(flight.arrivalTime)}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Seats */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Price</p>
                    <p className="font-semibold text-amber-400 text-lg">${flight.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Seats Available</p>
                    <p className="text-sm text-gray-300 mb-1">{flight.availableSeats || 0}/{flight.totalSeats || 0}</p>
                    <div className="w-24 bg-white/10 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${flight.totalSeats > 0 ? (flight.availableSeats / flight.totalSeats) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
              <p className="text-gray-400">
                {searchTerm ? 'No flights match your search.' : 'No flights found. Add your first flight to get started!'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredFlights.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredFlights.length}
          />
        )}

        {/* Modal - Responsive */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-4 sm:p-6 max-w-2xl w-full shadow-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-amber-400">
                  {editingFlight ? "Edit Flight" : "Add New Flight"}
                </h2>
                <button onClick={() => { setShowModal(false); setEditingFlight(null); resetForm(); }}
                  className="text-gray-400 hover:text-amber-400 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    ["Flight Number", "flightNumber", "text", "EG123"],
                    ["Origin", "origin", "text", "Cairo"],
                    ["Destination", "destination", "text", "Paris"],
                    ["Price ($)", "price", "number", "350"],
                    ["Departure Time", "departureTime", "datetime-local", ""],
                    ["Arrival Time", "arrivalTime", "datetime-local", ""],
                    ["Total Seats", "totalSeats", "number", "200"],
                    ["Available Seats", "availableSeats", "number", "200"], 
                  ].map(([label, key, type, placeholder]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-amber-300 mb-2">{label} *</label>
                      <input type={type} value={formData[key]} placeholder={placeholder}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button onClick={handleSubmit} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 sm:py-3 rounded-lg flex-1 transition-all text-sm sm:text-base">
                    {editingFlight ? "Update Flight" : "Add Flight"}
                  </button>
                  <button onClick={() => { setShowModal(false); setEditingFlight(null); resetForm(); }}
                    className="border border-white/20 hover:bg-white/10 text-white rounded-lg px-4 py-2 sm:py-3 flex-1 transition-all text-sm sm:text-base">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Modal - Responsive */}
        {alert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{getAlertIcon(alert.type)}</div>
                <h2 className="text-xl sm:text-2xl font-semibold text-amber-400 mb-3">{alert.title}</h2>
                <p className="text-sm sm:text-base text-gray-300 mb-6 whitespace-pre-line">{alert.message}</p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  {alert.showCancel ? (
                    <>
                      <button onClick={handleAlertConfirm} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 sm:py-3 rounded-lg flex-1 transition-all text-sm sm:text-base">
                        Confirm
                      </button>
                      <button onClick={closeAlert} className="border border-white/20 hover:bg-white/10 text-white font-semibold px-4 py-2 sm:py-3 rounded-lg flex-1 transition-all text-sm sm:text-base">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={handleAlertConfirm} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 sm:py-3 rounded-lg w-full transition-all text-sm sm:text-base">
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flights;