import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Globe } from 'lucide-react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function ContactDetailsForm({ data, onSave }) {
  const [formData, setFormData] = useState(data || {
    contactPerson: '',
    country: '',
    phoneNumber: '',
    email: '',
  });

  const [errors, setErrors] = useState({});

  // Update form when data changes
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
    // Auto-save on change
    onSave({
      ...formData,
      [field]: value,
    });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[0-9+\-\s()]{10,20}$/.test(phone);
  };

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Italy', 'Spain', 'Egypt', 'UAE', 'Saudi Arabia',
    'India', 'China', 'Japan', 'Brazil', 'Mexico', 'Netherlands',
    'Switzerland', 'Turkey', 'South Africa', 'Other'
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
        <Mail className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-zinc-100">
          Contact Details
        </h3>
      </div>

      {/* Info Message */}
      <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-4 mb-6">
        <p className="text-blue-300 text-sm">
          We'll use these details to send your booking confirmation and flight updates.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Contact Person */}
        <div>
          <Label htmlFor="contactPerson" className="text-zinc-300 mb-2 block">
            Contact Person Name <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => handleChange('contactPerson', e.target.value)}
              placeholder="Enter contact person name"
              className={`w-full bg-zinc-800 border ${
                errors.contactPerson ? 'border-red-400' : 'border-zinc-700'
              } rounded-md pl-10 pr-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
            />
          </div>
          {errors.contactPerson && (
            <p className="text-red-400 text-xs mt-1">{errors.contactPerson}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <Label htmlFor="country" className="text-zinc-300 mb-2 block">
            Country <span className="text-red-400">*</span>
          </Label>
          <Select value={formData.country} onValueChange={(value) => handleChange('country', value)}>
            <SelectTrigger
              id="country"
              className={`bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-yellow-400 ${
                errors.country ? 'border-red-400' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-zinc-500" />
                <SelectValue placeholder="Select country" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100 max-h-60">
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-red-400 text-xs mt-1">{errors.country}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phoneNumber" className="text-zinc-300 mb-2 block">
            Phone Number <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={`w-full bg-zinc-800 border ${
                errors.phoneNumber ? 'border-red-400' : 'border-zinc-700'
              } rounded-md pl-10 pr-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-400 text-xs mt-1">{errors.phoneNumber}</p>
          )}
          <p className="text-zinc-500 text-xs mt-1">Include country code (e.g., +1, +20, +971)</p>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-zinc-300 mb-2 block">
            Email Address <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@example.com"
              className={`w-full bg-zinc-800 border ${
                errors.email ? 'border-red-400' : 'border-zinc-700'
              } rounded-md pl-10 pr-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactDetailsForm;
