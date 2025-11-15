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
  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/20">
        <Mail className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-zinc-300">
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
              className={`w-full bg-white/10 border ${
                errors.contactPerson ? 'border-red-400' : 'border-white/20'
              } rounded-md pl-10 pr-4 py-2.5 text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
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
              className={`bg-white/10 border-white/20 text-zinc-300 focus:ring-yellow-400 ${
                errors.country ? 'border-red-400' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-zinc-00" />
                <SelectValue placeholder="Select country" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white/10 backdrop-blur-lg border-white/20 text-zinc-300 max-h-60">
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
              className={`w-full bg-white/10 border ${
                errors.phoneNumber ? 'border-red-400' : 'border-white/20'
              } rounded-md pl-10 pr-4 py-2.5 text-zinc-300 placeholder-zinc-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
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
              className={`w-full bg-white/10 border ${
                errors.email ? 'border-red-400' : 'border-white/20'
              } rounded-md pl-10 pr-4 py-2.5 text-zinc-300 placeholder-zinc-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
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
