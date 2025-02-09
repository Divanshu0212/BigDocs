import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { Calendar, Clock, User, MapPin, Phone, Mail, Search } from 'lucide-react';

const PatientAppointmentBooking = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState({
    date: '',
    time: '',
    reason: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchQuery, doctors]);

  const filterDoctors = () => {
    if (!searchQuery.trim()) {
      setFilteredDoctors(doctors);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = doctors.filter(doctor => 
      doctor.fullName?.toLowerCase().includes(query) ||
      doctor.address?.toLowerCase().includes(query)
    );
    setFilteredDoctors(filtered);
  };

  const fetchDoctors = async () => {
    try {
      const doctorsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'doctor')
      );
      const querySnapshot = await getDocs(doctorsQuery);
      const doctorsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDoctors(doctorsList);
      setFilteredDoctors(doctorsList);
    } catch (err) {
      setError('Failed to fetch doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const appointmentData = {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.fullName,
        doctorEmail: selectedDoctor.email,
        doctorAddress: selectedDoctor.address,
        patientId: auth.currentUser.uid,
        patientName: auth.currentUser.displayName,
        patientEmail: auth.currentUser.email,
        date: appointmentDetails.date,
        time: appointmentDetails.time,
        reason: appointmentDetails.reason,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      setSuccessMessage('Appointment request sent successfully!');
      setAppointmentDetails({ date: '', time: '', reason: '' });
      setSelectedDoctor(null);
    } catch (err) {
      setError('Failed to book appointment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Book an Appointment</h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {successMessage}
          </div>
        )}

        {!selectedDoctor && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search doctors by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {!selectedDoctor ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.fullName}</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{doctor.address || 'Address not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{doctor.email}</span>
                  </div>
                </div>
              </div>
            ))}
            {filteredDoctors.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No doctors found matching your search criteria
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Book Appointment with {selectedDoctor.fullName}</h2>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Back to doctors
                </button>
              </div>

              <form onSubmit={handleBookAppointment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDetails.date}
                    onChange={(e) => setAppointmentDetails({
                      ...appointmentDetails,
                      date: e.target.value
                    })}
                    min={new Date().toISOString().split('T')[0]}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    required
                    value={appointmentDetails.time}
                    onChange={(e) => setAppointmentDetails({
                      ...appointmentDetails,
                      time: e.target.value
                    })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit
                  </label>
                  <textarea
                    required
                    value={appointmentDetails.reason}
                    onChange={(e) => setAppointmentDetails({
                      ...appointmentDetails,
                      reason: e.target.value
                    })}
                    rows={4}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Request Appointment'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointmentBooking;