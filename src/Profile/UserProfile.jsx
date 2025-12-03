import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingsAPI } from '../services/api';
import {
  User, Mail, Phone, Calendar, Globe, Lock,
  Save, Edit2, X, Plane, MapPin, Clock, CheckCircle,
  XCircle, AlertCircle, ChevronRight, Eye, EyeOff
} from 'lucide-react';

function UserProfile() {
  const { user, updateUser, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
    'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
    'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
    'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde',
    'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
    'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark',
    'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt',
    'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji',
    'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece',
    'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
    'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
    'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
    'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
    'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
    'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
    'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
    'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
    'North Korea', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
    'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
    'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
    'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
    'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden',
    'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo',
    'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
    'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen', 'Zambia', 'Zimbabwe'
  ];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    country: user?.country || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: true,
    new: true,
    confirm: true,
  });

  const isGoogleUser = user?.googleId;

  useEffect(() => {
    console.log('User object updated:', user);
    console.log('Is Google user:', isGoogleUser);
  }, [user, isGoogleUser]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        country: user.country || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const response = await bookingsAPI.getMyBookings();
      if (response.success) {
        setBookings(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setMessage({ type: 'error', text: 'Failed to load bookings' });
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Validation functions
  const validateEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true;
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 9 && digitsOnly.length <= 15;
  };

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSaveProfile = async () => {
    // Validate email
    if (!validateEmail(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    // Validate phone if provided
    if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
      setMessage({ type: 'error', text: 'Phone number must be between 9 and 15 digits' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Updating user with data:', formData);
      const result = await updateUser(formData);
      console.log('Update result:', result);

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      country: user?.country || '',
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
    setMessage({ type: '', text: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-amber-500 pt-24 px-4 md:px-8 pb-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 mb-6 mt-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-3xl flex items-center justify-center shadow-lg shadow-amber-400/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {user?.name || 'User'}
              </h1>
              <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              {isGoogleUser && (
                <p className="text-amber-400 text-sm mt-2">
                  Signed in with Google
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 sticky top-28">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'account'
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-slate-800/50 text-white hover:bg-slate-800 border border-white/10'
                  }`}
                >
                  <User className="w-5 h-5" />
                  Account Settings
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'bookings'
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-slate-800/50 text-white hover:bg-slate-800 border border-white/10'
                  }`}
                >
                  <Plane className="w-5 h-5" />
                  Booking History
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Message Display */}
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg border ${
                  message.type === 'success'
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border-red-500/50 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                {/* Profile Information Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <User className="w-6 h-6 text-amber-400" />
                      Profile Information
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-500 transition-all font-semibold"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                          placeholder="Enter your name"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-slate-800/50 rounded-lg text-white border border-white/10">
                          {user?.name || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      {isEditing && !isGoogleUser ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-slate-800/50 rounded-lg text-white border border-white/10">
                          {user?.email || 'Not set'}
                        </p>
                      )}
                      {isGoogleUser && isEditing && (
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed for Google accounts</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-slate-800/50 rounded-lg text-white border border-white/10">
                          {user?.phoneNumber || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-slate-800/50 rounded-lg text-white border border-white/10">
                          {user?.dateOfBirth
                            ? new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Country */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country
                      </label>
                      {isEditing ? (
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                        >
                          <option value="" className="bg-slate-800">Select a country</option>
                          {countries.map((country, index) => (
                            <option key={index} value={country} className="bg-slate-800">
                              {country}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="px-4 py-3 bg-slate-800/50 rounded-lg text-white border border-white/10">
                          {user?.country || 'Not set'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-500 transition-all font-semibold disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-semibold"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Password Change Card - Only for non-Google users */}
                {!isGoogleUser && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Lock className="w-6 h-6 text-amber-400" />
                        Change Password
                      </h2>
                      {!isChangingPassword && (
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-semibold"
                        >
                          <Edit2 className="w-4 h-4" />
                          Change Password
                        </button>
                      )}
                    </div>

                    {isChangingPassword ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.current ? "text" : "password"}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className={`w-full px-4 py-3 pr-12 bg-[#ffffff10] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all ${
                                passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                                  ? 'border-red-500'
                                  : 'border-[#ffffff30]'
                              }`}
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                            <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                          )}
                        </div>
                        <div className="flex gap-4 pt-2">
                          <button
                            onClick={handleChangePassword}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-500 transition-all font-semibold disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            {loading ? 'Changing...' : 'Change Password'}
                          </button>
                          <button
                            onClick={handleCancelPasswordChange}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-semibold"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-300">
                        You can change your password to keep your account secure.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Booking History Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Plane className="w-6 h-6 text-amber-400" />
                  Your Booking History
                </h2>

                {bookingsLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
                    <p className="text-gray-300 mt-4">Loading bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Plane className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No bookings found</p>
                    <p className="text-gray-500 text-sm mt-2">
                      When you book a flight, it will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      // Get flight info from either flightId (database flights) or flightDetails (SerpAPI flights)
                      const flightInfo = booking.flightId || booking.flightDetails || {};
                      const airline = flightInfo.airline || 'Flight';
                      const flightNumber = flightInfo.flightNumber || 'N/A';
                      const origin = flightInfo.origin || flightInfo.from || flightInfo.fromCode || 'N/A';
                      const destination = flightInfo.destination || flightInfo.to || flightInfo.toCode || 'N/A';

                      // Get departure date - handle both database format and SerpAPI format
                      let departureDate = 'N/A';
                      if (flightInfo.departureTime) {
                        departureDate = new Date(flightInfo.departureTime).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });
                      } else if (flightInfo.departDate) {
                        departureDate = flightInfo.departDate;
                      }

                      // Get departure time
                      const departTime = flightInfo.departTime || '';

                      // Get total price from pricing breakdown or calculate from flight price
                      const totalPrice = booking.pricing?.totalCost ||
                        (flightInfo.price ? flightInfo.price * (booking.seats || 1) : null);

                      return (
                        <div
                          key={booking._id}
                          className="bg-slate-800/50 rounded-xl p-6 border border-white/10 hover:border-amber-400/30 transition-all"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-2">
                                {airline} - {flightNumber}
                              </h3>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-amber-400" />
                                  {origin} → {destination}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4 text-amber-400" />
                                  {departureDate} {departTime && `at ${departTime}`}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {getStatusIcon(booking.status)}
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                            <div>
                              <p className="text-gray-400 text-sm mb-1">Booking Reference</p>
                              <p className="text-white font-mono font-semibold">
                                {booking.bookingReference || booking._id?.slice(-8).toUpperCase()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm mb-1">Passengers</p>
                              <p className="text-white font-semibold">{booking.seats || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm mb-1">Booked On</p>
                              <p className="text-white font-semibold">
                                {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          {totalPrice && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total Price</span>
                                <span className="text-2xl font-bold text-amber-400">
                                  ${totalPrice.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
