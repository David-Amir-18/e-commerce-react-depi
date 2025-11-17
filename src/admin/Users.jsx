import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { Search, Trash2, Mail, Phone, User, UserPlus, Edit, Eye, X, AlertCircle, CheckCircle, Info, Calendar, FileText } from 'lucide-react';
import goldParticles from "./assets/gold-particle.1920x1080.mp4";
import Pagination from "./components/Pagination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'user',
    password: '',
    dateOfBirth: '',
    passportNumber: '',
    isActive: true
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

  // swithing alert icons
  const getAlertIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="text-green-400" size={48} />;
      case 'error': return <AlertCircle className="text-red-400" size={48} />;
      case 'warning': return <AlertCircle className="text-amber-400" size={48} />;
      case 'info': return <Info className="text-blue-400" size={48} />;
      default: return <Info className="text-gray-400" size={48} />;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      if (response.success) {
        setUsers(response.data);
      } else {
        showAlert('error', 'Fetch Error', response.message || 'Failed to fetch users.');
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMsg = error.message || 'Unable to connect to server.';
      showAlert('error', 'Network Error', errorMsg);
    } finally {
      setLoading(false); //end loading
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim() || !formData.email?.trim()) {
      showAlert('warning', 'Missing Fields', 'Please fill in name and email');
      return;
    }

    if (!editingUser && !formData.password?.trim()) {
      showAlert('warning', 'Missing Password', 'Password is required for new users');
      return;
    }
    try {
      let response;
      // Update user
      if (editingUser) {
        const updateData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          role: formData.role,
          dateOfBirth: formData.dateOfBirth || undefined,
          passportNumber: formData.passportNumber.trim() || undefined,
          isActive: formData.isActive
        };
        
        // Only include password if provided
        if (formData.password?.trim()) {
          updateData.password = formData.password;
        }

        response = await usersAPI.update(editingUser._id, updateData);

        if (response.success) {
          setUsers(users.map(user =>
            user._id === editingUser._id ? response.data : user
          ));
          showAlert('success', 'User Updated', 'User has been updated successfully.');
        } else {
          showAlert('error', 'Update Failed', response.message || 'Failed to update user.');
        }
      } else {
        // Create new user
        const userData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          role: formData.role,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth || undefined,
          passportNumber: formData.passportNumber.trim() || undefined,
          isActive: formData.isActive
        };

        response = await usersAPI.create(userData);

        if (response.success) {
          setUsers([...users, response.data]);
          showAlert('success', 'User Added', 'New user has been added successfully.');
        } else {
          showAlert('error', 'Creation Failed', response.message || 'Failed to add user.');
        }
      }

      setShowModal(false);
      setEditingUser(null);
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred. Please try again.';
      showAlert('error', 'Error', errorMsg);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      role: user.role,
      password: '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      passportNumber: user.passportNumber || '',
      isActive: user.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const userToDelete = users.find(user => user._id === id);

    showAlert(
      'warning',
      'Delete User?',
      `Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`,
      async () => {
        try {
          const response = await usersAPI.delete(id);
          if (response.success) {
            setUsers(users.filter(user => user._id !== id));
            showAlert('success', 'User Deleted', 'User has been deleted successfully.');
          } else {
            showAlert('error', 'Deletion Failed', response.message || 'Failed to delete user.');
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          const errorMsg = error.message || 'Failed to delete user.';
          showAlert('error', 'Error', errorMsg);
        }
      },
      true
    );
  };

  const toggleUserStatus = async (user) => {
    showAlert(
      'warning',
      `${user.isActive ? 'Deactivate' : 'Activate'} User?`,
      `Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} ${user.name}?`,
      async () => {
        try {
          const response = await usersAPI.update(user._id, { isActive: !user.isActive });

          if (response.success) {
            setUsers(users.map(u =>
              u._id === user._id ? response.data : u
            ));
            showAlert('success', 'User Updated', `User has been ${user.isActive ? 'deactivated' : 'activated'} successfully.`);
          } else {
            showAlert('error', 'Update Failed', response.message || 'Failed to update user.');
          }
        } catch (error) {
          console.error('Error updating user:', error);
          const errorMsg = error.message || 'Failed to update user.';
          showAlert('error', 'Error', errorMsg);
        }
      },
      true
    );
  };

  // const clearAllData = () => {
  //   showAlert(
  //     'warning',
  //     'Clear All User Data',
  //     `This will delete all ${users.length} users. Are you absolutely sure?`,
  //     async () => {
  //       if (users.length === 0) {
  //         showAlert('info', 'No Data', 'There are no users to delete.');
  //         return;
  //       }
  //       let successCount = 0;
  //       let errorCount = 0; 
  //       for (const user of users) {
  //         try {
  //           await usersAPI.delete(user._id);
  //           successCount++;
  //         } catch (error) {
  //           console.error(`Failed to delete user ${user.name}:`, error);
  //           errorCount++;
  //         }
  //       }
        
  //       await fetchUsers();
        
  //       if (errorCount === 0) {
  //         showAlert('success', 'All Cleared', `Successfully deleted all ${successCount} users.`);
  //       } else {
  //         showAlert('warning', 'Partially Completed', `Deleted ${successCount} users. ${errorCount} failed.`);
  //       }
  //     },
  //     true
  //   );
  // };

  const showUserDetails = (user) => {
    const formatDate = (dateString) => {
      if (!dateString) return 'Not set';
      return new Date(dateString).toLocaleDateString();
    };

    const details = `
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phoneNumber || 'Not set'}
Role: ${user.role}
Status: ${user.isActive ? 'Active' : 'Inactive'}
Date of Birth: ${formatDate(user.dateOfBirth)}
Passport Number: ${user.passportNumber || 'Not set'}
Created: ${formatDate(user.createdAt)}
${user.googleId ? `Google ID: ${user.googleId}` : ''}

User ID: ${user._id}
`.trim();

    showAlert('info', `User Details - ${user.name}`, details);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      role: 'user',
      password: '',
      dateOfBirth: '',
      passportNumber: '',
      isActive: true
    });
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber?.includes(searchTerm) ||
    user.passportNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getRoleColor = (role) => {
    return role === 'admin' 
      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
      : 'bg-red-500/20 text-red-300 border border-red-500/30';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <User className="animate-bounce text-amber-400 mx-auto mb-4" size={40} />
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/20 via-black to-black pointer-events-none"></div>
      {/* Vedio background */}
      <video className="fixed top-0 w-full h-full object-cover blur-[50px]" autoPlay muted loop playsInline>
        <source src={goldParticles} />
      </video>
      
      <div className="relative z-10 p-4 sm:p-6 space-y-6 text-white pt-10 lg:pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2">User Management</h1>
            <p className="text-sm sm:text-base text-gray-300">Manage registered users and their accounts</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {/* <button onClick={clearAllData} className="border border-red-400 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all text-sm sm:text-base">
              Clear All Data
            </button> */}
            <button onClick={() => { setShowModal(true); resetForm(); setEditingUser(null); }} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base">
              <UserPlus size={20} /> Add User
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search users by name, email, phone, or passport..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Results Count */}
        <div>
          <p className="text-gray-400 text-sm sm:text-base">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {paginatedUsers.map((user) => (
            <div key={user._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300 group border border-white/10 hover:border-amber-500/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <User className="text-black" size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">{user.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => showUserDetails(user)} className="p-1.5 sm:p-2 text-green-400 hover:bg-white/10 rounded-lg transition-colors" title="View Details">
                    <Eye size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <button onClick={() => handleEdit(user)} className="p-1.5 sm:p-2 text-blue-400 hover:bg-white/10 rounded-lg transition-colors" title="Edit User">
                    <Edit size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <button onClick={() => toggleUserStatus(user)} className="p-1.5 sm:p-2 text-amber-400 hover:bg-white/10 rounded-lg transition-colors" title={user.isActive ? 'Deactivate' : 'Activate'}>
                    {user.isActive ? 'X' : '✅'}
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="p-1.5 sm:p-2 text-red-400 hover:bg-white/10 rounded-lg transition-colors" title="Delete User">
                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Mail size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-300 truncate">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Phone size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-300">{user.phoneNumber}</span>
                  </div>
                )}
                {user.passportNumber && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <FileText size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-300 truncate">Passport: {user.passportNumber}</span>
                  </div>
                )}
                {user.dateOfBirth && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      DOB: {new Date(user.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {user.googleId && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-blue-400">Google OAuth</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-400">Member since</span>
                  <span className="font-semibold text-amber-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 sm:p-12 text-center border border-white/10">
            <User className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">No users found</h3>
            <p className="text-sm sm:text-base text-gray-400">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Add your first user to get started!'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsers.length}
          />
        )}

        {/* Add/Edit User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-amber-400">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button onClick={() => { setShowModal(false); setEditingUser(null); resetForm(); }} className="text-gray-400 hover:text-amber-400 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
                    placeholder="user@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phoneNumber} 
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">
                    Password {editingUser ? '(leave blank to keep current)' : '*'}
                  </label>
                  <input 
                    type="password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
                    placeholder={editingUser ? "Enter new password (optional)" : "Enter password"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.dateOfBirth} 
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Passport Number</label>
                  <input 
                    type="text" 
                    value={formData.passportNumber} 
                    onChange={(e) => setFormData({...formData, passportNumber: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
                    placeholder="Enter passport number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">Role</label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
                  >
                    <option value="user" className="bg-gray-800">User</option>
                    <option value="admin" className="bg-gray-800">Admin</option>
                  </select>
                </div>

                {editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-2">Status</label>
                    <select 
                      value={formData.isActive} 
                      onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none text-sm sm:text-base"
                    >
                      <option value="true" className="bg-gray-800">Active</option>
                      <option value="false" className="bg-gray-800">Inactive</option>
                    </select>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button onClick={handleSave} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 sm:py-3 rounded-lg flex-1 transition-all text-sm sm:text-base">
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                  <button onClick={() => { setShowModal(false); setEditingUser(null); resetForm(); }}
                    className="border border-white/20 hover:bg-white/10 text-white rounded-lg px-4 py-2 sm:py-3 flex-1 transition-all text-sm sm:text-base">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Modal */}
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

export default Users;