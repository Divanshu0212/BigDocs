import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Video,
  Bell,
  FileText,
  Check,
  X,
  Pill,
} from "lucide-react";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchAppointments(currentUser.uid);
      } else {
        setUser(null);
        setPendingAppointments([]);
        setTodayAppointments([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAppointments = async (doctorId) => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    try {
      const q = query(collection(db, "appointments"), where("doctorId", "==", doctorId));
      const querySnapshot = await getDocs(q);

      const pending = [];
      const todayList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "pending") {
          pending.push({ id: doc.id, ...data });
        } else if (data.date === today) {
          todayList.push({ id: doc.id, ...data });
        }
      });

      setPendingAppointments(pending);
      setTodayAppointments(todayList);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }

    setLoading(false);
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), { status: "confirmed" });
      setPendingAppointments((prev) => prev.filter((app) => app.id !== appointmentId));
      alert("Appointment Accepted!");
    } catch (error) {
      console.error("Error accepting appointment:", error);
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), { status: "rejected" });
      setPendingAppointments((prev) => prev.filter((app) => app.id !== appointmentId));
      alert("Appointment Rejected!");
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-6">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, Dr. {user?.displayName}
            </h1>
            <p className="text-gray-600">Your patient dashboard</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Bell className="h-5 w-5" />
            <span className="hidden md:inline">Notifications</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/manage-appointments">
            <QuickActionCard icon={<Calendar />} title="Schedule" description="Manage appointments" />
          </Link>
          <Link to="/patient-list">
            <QuickActionCard icon={<Users />} title="Patients" description="View patient list" />
          </Link>
          <Link to="/upload-reports">
            <QuickActionCard icon={<FileText />} title="Reports" description="View medical reports" />
          </Link>
          <Link to="/medications">
            <QuickActionCard icon={<Pill/>} title="Edit Medications" description="Manage prescriptions" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardCard title="Pending Appointments">
            {loading ? (
              <p>Loading...</p>
            ) : pendingAppointments.length === 0 ? (
              <p>No pending appointments</p>
            ) : (
              pendingAppointments.map((appointment) => (
                <PendingAppointment
                  key={appointment.id}
                  id={appointment.id}
                  patient={appointment.patientName}
                  age={appointment.patientAge}
                  reason={appointment.reason}
                  preferredDate={appointment.date}
                  preferredTime={appointment.time}
                  onAccept={handleAcceptAppointment}
                  onReject={handleRejectAppointment}
                />
              ))
            )}
          </DashboardCard>

          <DashboardCard title="Today's Schedule">
            {loading ? (
              <p>Loading...</p>
            ) : todayAppointments.length === 0 ? (
              <p>No appointments today</p>
            ) : (
              todayAppointments.map((appointment) => (
                <TodayAppointment
                  key={appointment.id}
                  patient={appointment.patientName}
                  time={appointment.time}
                  type={appointment.type}
                  status={appointment.status}
                />
              ))
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

const TodayAppointment = ({ patient, time, type, status }) => (
  <div className="border rounded-lg p-4 flex justify-between items-start">
    <div>
      <h4 className="font-semibold">{patient}</h4>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="h-4 w-4" />
        <span>{time}</span>
      </div>
      <p className="text-sm text-gray-600">Type: {type}</p>
      <p className={`text-sm font-semibold ${status === "confirmed" ? "text-green-600" : "text-red-600"}`}>
        {status}
      </p>
    </div>
  </div>
);


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

export default DoctorDashboard;
