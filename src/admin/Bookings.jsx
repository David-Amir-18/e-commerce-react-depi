import React, { useState, useEffect } from 'react';
import { Search, Eye, Calendar, User, Plane, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { bookingsAPI } from '../services/api';
import goldParticles from "./assets/gold-particle.1920x1080.mp4";
import Pagination from "./components/Pagination";
import AlertModal from './components/AlertModal';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getAll();
      if (response.success) {
        setBookings(response.data);
      } else {
        showAlert('error', 'Fetch Error', response.message || 'Failed to fetch bookings.');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const errorMsg = error.message || 'Unable to connect to server. Please check your connection.';
      showAlert('error', 'Network Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await bookingsAPI.updateStatus(bookingId, newStatus);
      if (response.success) {
        setBookings(bookings.map(booking =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        ));
        showAlert('success', 'Status Updated!', `Booking status changed to ${newStatus}.`);
      } else {
        showAlert('error', 'Update Failed', response.message || 'Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      const errorMsg = error.message || 'Failed to update booking status.';
      showAlert('error', 'Error!', errorMsg);
    }
  };

  const deleteBooking = async (bookingId) => {
    const bookingToDelete = bookings.find(b => b._id === bookingId);
    
    showAlert(
      'warning',
      'Delete Booking?',
      `Are you sure you want to delete booking for ${bookingToDelete?.user?.name || 'this user'}? This action cannot be undone.`,
      async () => {
        try {
          const response = await bookingsAPI.delete(bookingId);
          if (response.success) {
            setBookings(bookings.filter(booking => booking._id !== bookingId));
            showAlert('success', 'Booking Deleted!', 'Booking has been deleted successfully.');
          } else {
            showAlert('error', 'Deletion Failed', response.message || 'Failed to delete booking.');
          }
        } catch (error) {
          console.error('Error deleting booking:', error);
          const errorMsg = error.message || 'Failed to delete booking.';
          showAlert('error', 'Error!', errorMsg);
        }
      },
      true
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    const userName = booking.user?.name?.toLowerCase() || '';
    const userEmail = booking.user?.email?.toLowerCase() || '';
    const flightNumber = booking.flight?.flightNumber?.toLowerCase() || '';
    const origin = booking.flight?.origin?.toLowerCase() || '';
    const destination = booking.flight?.destination?.toLowerCase() || '';
    const bookingId = booking._id?.toLowerCase() || '';
    const status = booking.status?.toLowerCase() || '';
    
    return userName.includes(searchLower) ||
           userEmail.includes(searchLower) ||
           flightNumber.includes(searchLower) ||
           origin.includes(searchLower) ||
           destination.includes(searchLower) ||
           bookingId.includes(searchLower) ||
           status.includes(searchLower);
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-500/20 text-green-300 border border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border border-red-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
  };

  const showBookingDetails = (booking) => {
    const details = [
      `Booking Reference: ${booking.bookingReference || booking._id}`,
      `Status: ${booking.status}`,
      '',
      `User: ${booking.user?.name || 'N/A'}`,
      `Email: ${booking.user?.email || 'N/A'}`,
      `Phone: ${booking.user?.phoneNumber || 'N/A'}`,
      '',
      `Flight: ${booking.flight?.flightNumber || 'N/A'}`,
      `Route: ${booking.flight?.origin || booking.flight?.from || 'N/A'} → ${booking.flight?.destination || booking.flight?.to || 'N/A'}`,
      `Departure: ${booking.flight?.departureTime ? formatDate(booking.flight.departureTime) : (booking.flight?.departDate || 'N/A')}`,
      `Arrival: ${booking.flight?.arrivalTime ? formatDate(booking.flight.arrivalTime) : 'N/A'}`,
      '',
      `Seats Booked: ${booking.seats}`,
      `Flight Price: $${booking.flight?.price || 'N/A'}`,
      `Total: $${booking.pricing?.totalCost || (booking.seats * (booking.flight?.price || 0)).toFixed(2)}`,
      '',
      `Booking Date: ${formatDate(booking.createdAt)}`
    ].join('\n');

    showAlert('info', 'Booking Details', details);
  };

  // const clearAllBookings = () => {
  //   showAlert(
  //     'info',
  //     'Clear All Bookings',
  //     'This feature requires individual booking deletion. Would you like to delete all bookings one by one?',
  //     async () => {
  //       if (bookings.length === 0) {
  //         showAlert('info', 'No Data', 'There are no bookings to delete.');
  //         return;
  //       }
        
  //       showAlert(
  //         'warning',
  //         'Confirm Clear All',
  //         `This will delete all ${bookings.length} bookings. Are you absolutely sure?`,
  //         async () => {
  //           let successCount = 0;
  //           let errorCount = 0;
            
  //           for (const booking of bookings) {
  //             try {
  //               await bookingsAPI.delete(booking._id);
  //               successCount++;
  //             } catch (error) {
  //               console.error(`Failed to delete booking ${booking._id}:`, error);
  //               errorCount++;
  //             }
  //           }
            
  //           // Refresh the bookings list
  //           await fetchBookings();
            
  //           if (errorCount === 0) {
  //             showAlert('success', 'All Cleared!', `Successfully deleted all ${successCount} bookings.`);
  //           } else {
  //             showAlert('warning', 'Partially Completed', `Deleted ${successCount} bookings. ${errorCount} failed.`);
  //           }
  //         },
  //         true
  //       );
  //     },
  //     true
  //   );
  // };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg- text-white">
        <div className="text-center">
          <Calendar className="animate-bounce text-amber-400 mx-auto mb-4" size={40} />
          <p className="text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-">
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/20 via-black to-black pointer-events-none"></div>
      <video className="fixed top-0 w-full h-full object-cover blur-[50px]" autoPlay muted loop playsInline>
        <source src={goldParticles} />
      </video>
      
      <div className="relative z-10 p-4 sm:p-6 space-y-6 text-white pt-10 lg:pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2">Booking Management</h1>
            <p className="text-sm sm:text-base text-gray-300">View and manage all flight bookings</p>
          </div>
          {/* <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={clearAllBookings} className="border border-red-400 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all text-sm sm:text-base">
              Clear All
            </button>
          </div> */}
        </div>

        {/* Search Bar */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search bookings by user, flight, route, status, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Results Count */}
        <div>
          <p className="text-gray-400 text-sm sm:text-base">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {paginatedBookings.map((booking) => {
            const totalPrice = (booking.seats * (booking.flight?.price || 0)).toFixed(2);
            
            return (
              <div key={booking._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-amber-500/30">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-mono font-semibold text-white text-xs sm:text-sm truncate">{booking.bookingReference || `#${booking._id.slice(-8)}`}</h3>
                    <p className="text-xs sm:text-sm text-gray-400">{formatDate(booking.createdAt)}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(booking.status)} whitespace-nowrap flex-shrink-0 ml-2`}>
                    {booking.status}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 p-2 sm:p-3 bg-white/5 rounded-lg">
                  <User size={14} className="text-gray-400 flex-shrink-0 sm:w-4 sm:h-4" />
                  <div className="min-w-0">
                    <p className="font-medium text-white text-xs sm:text-sm truncate">{booking.user?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-400 truncate">{booking.user?.email || ''}</p>
                  </div>
                </div>

                {/* Flight Info */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Plane size={14} className="text-amber-500 flex-shrink-0 sm:w-4 sm:h-4" />
                    <span className="font-medium text-white text-xs sm:text-sm">{booking.flight?.flightNumber || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span className="font-medium bg-white/10 text-amber-300 px-2 py-1 rounded text-xs whitespace-nowrap">
                      {booking.flight?.origin || 'N/A'}
                    </span>
                    <span className="text-amber-400 text-xs">→</span>
                    <span className="font-medium bg-white/10 text-amber-300 px-2 py-1 rounded text-xs whitespace-nowrap">
                      {booking.flight?.destination || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-400">{booking.seats} passenger(s)</span>
                    <span className="font-semibold text-amber-400">${totalPrice}</span>
                  </div>

                  {booking.flight?.departureTime && (
                    <div className="text-xs text-gray-400">
                      Departs: {formatDate(booking.flight.departureTime)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-white/20 flex gap-2">
                  <button className="flex-1 border border-white/20 hover:bg-white/10 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm transition-all text-white"
                    onClick={() => showBookingDetails(booking)}>
                    <Eye size={14} className="inline mr-1 sm:w-4 sm:h-4" /> Details
                  </button>
                  
                  <select className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                    value={booking.status}
                    onChange={(e) => updateBookingStatus(booking._id, e.target.value)}>
                    <option value="pending" className="bg-gray-800">Pending</option>
                    <option value="confirmed" className="bg-gray-800">Confirmed</option>
                    <option value="cancelled" className="bg-gray-800">Cancelled</option>
                  </select>

                  <button className="flex-1 border border-red-400 text-red-400 hover:bg-red-500/10 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm transition-all"
                    onClick={() => deleteBooking(booking._id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 sm:p-12 text-center">
            <Calendar className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">No bookings found</h3>
            <p className="text-sm sm:text-base text-gray-400">
              {searchTerm ? 'Try adjusting your search criteria.' : 'No bookings have been made yet.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredBookings.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredBookings.length}
          />
        )}

        {/* Alert Modal */}
         <AlertModal
          isOpen={!!alert}
          type={alert?.type}
          title={alert?.title}
          message={alert?.message}
          showCancel={alert?.showCancel}
          onConfirm={handleAlertConfirm}
          onCancel={closeAlert}
        />
      </div>
    </div>
  );
};

export default Bookings;