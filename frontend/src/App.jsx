import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Users, MessageSquare, UserCircle } from 'lucide-react';
import React from 'react';

// Import all pages
import Landing from './pages/LandingPage';
import DoctorListingPage from './pages/DoctorListingPage';
import PatientDashboard from './pages/PatientDashboard';
import TelemedicineInterface from './pages/TelemedicneInterface';
import CommunityForum from './pages/CommunityForum';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PatientAppointmentBooking from './pages/PatienAppointmentBooking';
import DoctorAppointmentBooking from './pages/DoctorAppointmentBooking';
import DoctorDashboard from './pages/DoctorDashboard';
import SymptomChecker from './pages/SymptomChecker';
import DoctorMedicationEditor from './pages/DoctorMedicationsEditor';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/doctors" element={<DoctorListingPage />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/telemedicine" element={<TelemedicineInterface />} />
        <Route path="/community" element={<CommunityForum />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patientappointmentbooking" element={<PatientAppointmentBooking />} />
        <Route path="/book-appointment" element={<PatientAppointmentBooking />} />
        <Route path="/manage-appointments" element={<DoctorAppointmentBooking />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/symptom" element={<SymptomChecker/>}/>
        <Route path="/medications" element={<DoctorMedicationEditor/>}/>
        
      </Routes>
    </Router>
  );
};

export default App;