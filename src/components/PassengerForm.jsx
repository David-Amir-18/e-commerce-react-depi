import React, { useState, useEffect } from 'react';
import { User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function PassengerForm({
  passengerNumber,
  passengerType,
  data,
  onSave,
  onNext,
  isLast
}) {
  const [formData, setFormData] = useState(data || {
    title: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState({});
  const [showSaved, setShowSaved] = useState(false);
  const [lastPassengerNumber, setLastPassengerNumber] = useState(passengerNumber);

  useEffect(() => {
    if (passengerNumber !== lastPassengerNumber) {
      setFormData(data || {
        title: '',
        firstName: '',
        lastName: '',
      });
      setErrors({});
      setShowSaved(false);
      setLastPassengerNumber(passengerNumber);
    } else if (data && !formData.title && !formData.firstName && !formData.lastName) {
      setFormData(data);
    }
  }, [data, passengerNumber, lastPassengerNumber]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = 'Title is required';
    }

    if (!formData.firstName || !formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!/^[A-Za-z\s-]+$/.test(formData.firstName)) {
      newErrors.firstName = 'Only English characters allowed';
    }

    if (!formData.lastName || !formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!/^[A-Za-z\s-]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Only English characters allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndNext = () => {
    if (validateForm()) {
      onSave(passengerNumber - 1, formData);

      setShowSaved(true);

      if (!isLast) {
        setTimeout(() => {
          onNext();
        }, 800);
      } else {
        setTimeout(() => {
          setShowSaved(false);
        }, 3000);
      }
    }
  };

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-4">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/20">
        <User className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-zinc-100">
          Passenger {passengerNumber} ({passengerType})
        </h3>
      </div>

      <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 text-sm font-semibold mb-1">
              Important: Passport Matching Required
            </p>
            <p className="text-yellow-300/80 text-xs">
              Names must exactly match passport details and should be entered using English
              characters only. They can't be changed after your booking is complete.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`title-${passengerNumber}`} className="text-zinc-300 mb-2 block">
            Title <span className="text-red-400">*</span>
          </Label>
          <Select value={formData.title} onValueChange={(value) => handleChange('title', value)}>
            <SelectTrigger
              id={`title-${passengerNumber}`}
              className={`bg-white/10 border-zinc-700 text-zinc-100 focus:ring-yellow-400 ${
                errors.title ? 'border-red-400' : ''
              }`}
            >
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent className="bg-white/5 backdrop-blur-lg border-zinc-700 text-zinc-100">
              <SelectItem value="Mr">Mr</SelectItem>
              <SelectItem value="Mrs">Mrs</SelectItem>
              <SelectItem value="Ms">Ms</SelectItem>
              <SelectItem value="Miss">Miss</SelectItem>
              <SelectItem value="Dr">Dr</SelectItem>
            </SelectContent>
          </Select>
          {errors.title && (
            <p className="text-red-400 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <Label htmlFor={`firstName-${passengerNumber}`} className="text-zinc-300 mb-2 block">
            First Name <span className="text-red-400">*</span>
          </Label>
          <input
            type="text"
            id={`firstName-${passengerNumber}`}
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Enter first name"
            className={`w-full bg-white/10 border ${
              errors.firstName ? 'border-red-400' : 'border-zinc-700'
            } rounded-md px-4 py-2.5 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
          />
          {errors.firstName && (
            <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <Label htmlFor={`lastName-${passengerNumber}`} className="text-zinc-300 mb-2 block">
            Last Name <span className="text-red-400">*</span>
          </Label>
          <input
            type="text"
            id={`lastName-${passengerNumber}`}
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Enter last name"
            className={`w-full bg-white/10 border ${
              errors.lastName ? 'border-red-400' : 'border-zinc-700'
            } rounded-md px-4 py-2.5 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
          />
          {errors.lastName && (
            <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {showSaved && (
        <div className="mt-4 bg-emerald-400/20 border border-emerald-400/30 rounded-lg p-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-emerald-300 text-sm font-semibold">
            Passenger details saved successfully!
          </p>
        </div>
      )}

      <Button
        onClick={handleSaveAndNext}
        disabled={showSaved}
        className={`w-full mt-6 font-bold shadow-lg transition-all ${
          showSaved
            ? 'bg-emerald-500 hover:bg-emerald-500 text-white shadow-emerald-400/20'
            : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-zinc-950 shadow-yellow-400/20'
        }`}
      >
        {showSaved ? (
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Saved!
          </span>
        ) : (
          isLast ? 'Save Passenger Details' : 'Save and Next'
        )}
      </Button>
    </div>
  );
}

export default PassengerForm;
