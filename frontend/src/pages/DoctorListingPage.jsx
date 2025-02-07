import React, { useState } from 'react';
import { Star, MapPin, Clock, Filter, Search } from 'lucide-react';

const DoctorListingPage = () => {
  const [filters, setFilters] = useState({
    specialty: '',
    availability: '',
    rating: '',
    location: ''
  });

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Family Medicine',
    'Neurology',
    'Pediatrics',
    'Psychiatry'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name or specialty"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter location"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select 
              className="p-2 border rounded-lg"
              value={filters.specialty}
              onChange={(e) => setFilters({...filters, specialty: e.target.value})}
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
            
            <select 
              className="p-2 border rounded-lg"
              value={filters.availability}
              onChange={(e) => setFilters({...filters, availability: e.target.value})}
            >
              <option value="">Any Availability</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">This Week</option>
            </select>
            
            <select 
              className="p-2 border rounded-lg"
              value={filters.rating}
              onChange={(e) => setFilters({...filters, rating: e.target.value})}
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
            
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
              <Filter className="h-5 w-5" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <DoctorCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const DoctorCard = () => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
    <div className="flex items-start gap-4">
      <img
        src="/api/placeholder/100/100"
        alt="Doctor profile"
        className="w-24 h-24 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">Dr. Sarah Johnson</h3>
        <p className="text-blue-600">Cardiologist</p>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-4 w-4 fill-current text-yellow-400" />
          <span className="text-gray-600">4.8 (234 reviews)</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">New York, NY</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">Next available: Today</span>
        </div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t">
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Book Appointment
      </button>
    </div>
  </div>
);

export default DoctorListingPage;