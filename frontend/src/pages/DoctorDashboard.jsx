import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Activity, 
  Users, 
  Video, 
  Bell, 
  FileText, 
  MessageSquare,
  Check,
  X,
  Camera
} from 'lucide-react';
import { auth } from '../firebase/firebase';

const DoctorDashboard = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleAcceptAppointment = (appointmentId) => {
    console.log('Appointment accepted:', appointmentId);
  };

  const handleRejectAppointment = (appointmentId) => {
    console.log('Appointment rejected:', appointmentId);
  };

  const startVideoCall = (patientId) => {
    console.log('Starting video call with patient:', patientId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-6">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {auth.currentUser?.displayName}</h1>
            <p className="text-gray-600">Your patient dashboard</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Bell className="h-5 w-5" />
            <span className="hidden md:inline">Notifications</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickActionCard icon={<Calendar />} title="Schedule" description="Manage appointments" />
          <QuickActionCard icon={<Users />} title="Patients" description="View patient list" />
          <QuickActionCard icon={<Video />} title="Video Calls" description="Start consultations" />
          <QuickActionCard icon={<FileText />} title="Reports" description="View medical reports" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardCard title="Pending Appointments">
            <PendingAppointment id="1" patient="Sarah Smith" age="34" reason="Follow-up consultation" preferredDate="2025-02-08" preferredTime="10:00 AM" onAccept={handleAcceptAppointment} onReject={handleRejectAppointment} />
            <PendingAppointment id="2" patient="John Doe" age="45" reason="Annual checkup" preferredDate="2025-02-09" preferredTime="2:30 PM" onAccept={handleAcceptAppointment} onReject={handleRejectAppointment} />
          </DashboardCard>

          <DashboardCard title="Today's Schedule">
            <TodayAppointment patient="Michael Brown" time="9:00 AM" type="Video Call" status="Completed" />
            <TodayAppointment patient="Emily Johnson" time="11:30 AM" type="In-Person" status="In Progress" />
            <TodayAppointment patient="David Wilson" time="2:00 PM" type="Video Call" status="Upcoming" onStartCall={() => startVideoCall("david-id")} />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, children }) => (
  <div className="bg-white shadow-sm rounded-lg p-6 border">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const QuickActionCard = ({ icon, title, description }) => (
  <div className="bg-white shadow-sm p-4 rounded-lg text-center hover:shadow-md cursor-pointer">
    <div className="flex flex-col items-center">
      <div className="text-blue-600">{icon}</div>
      <h3 className="font-semibold mt-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const PendingAppointment = ({ id, patient, age, reason, preferredDate, preferredTime, onAccept, onReject }) => (
  <div className="border rounded-lg p-4">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="font-semibold">{patient}</h4>
        <p className="text-sm text-gray-600">Age: {age}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onAccept(id)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md">
          <Check className="h-4 w-4" />
        </button>
        <button onClick={() => onReject(id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
    <p className="text-sm text-gray-600">{reason}</p>
    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
      <Calendar className="h-4 w-4" />
      <span>{preferredDate}</span>
      <Clock className="h-4 w-4 ml-2" />
      <span>{preferredTime}</span>
    </div>
  </div>
);

const TodayAppointment = ({ patient, time, type, status, onStartCall }) => (
  <div className="border rounded-lg p-4 flex justify-between items-start">
    <div>
      <h4 className="font-semibold">{patient}</h4>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="h-4 w-4" />
        <span>{time}</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded-full text-sm ${
        status === 'Completed' ? 'bg-green-100 text-green-600' :
        status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
        'bg-yellow-100 text-yellow-600'}`}>{status}</span>
      {type === 'Video Call' && status === 'Upcoming' && (
        <button onClick={onStartCall} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md">
          <Camera className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);

export default DoctorDashboard;