import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Calendar, Clock, Activity, Heart, Bell, Pill, FileText, MessageSquare } from 'lucide-react';
import { auth, db } from '../firebase/firebase'; // Ensure db is imported for Firestore
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
    const [name, setName] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setName(user.displayName || "Patient");
                fetchAppointments(user.uid);
            } else {
                setName("Guest");
                setAppointments([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchAppointments = async (userId) => {
        setLoadingAppointments(true);
        try {
            const appointmentsQuery = query(
                collection(db, 'appointments'),
                where('patientId', '==', userId)
            );
            const querySnapshot = await getDocs(appointmentsQuery);
            const appointmentsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAppointments(appointmentsList);
        } catch (err) {
            console.error("Error fetching appointments:", err);
        } finally {
            setLoadingAppointments(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {name}!</h1>
                        <p className="text-gray-600">Here's your health summary</p>
                    </div>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        <Bell className="h-5 w-5" />
                        <span className="hidden md:inline">Notifications</span>
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Link to='/patientappointmentbooking'>
                        <QuickActionCard
                            icon={<Calendar className="h-6 w-6 text-blue-600" />}
                            title="Book Appointment"
                            description="Schedule your next visit"
                        />
                    </Link>
                    <QuickActionCard
                        icon={<MessageSquare className="h-6 w-6 text-blue-600" />}
                        title="Message Doctor"
                        description="Connect with your doctor"
                    />
                    <QuickActionCard
                        icon={<FileText className="h-6 w-6 text-blue-600" />}
                        title="View Records"
                        description="Access your health records"
                    />
                    <QuickActionCard
                        icon={<Pill className="h-6 w-6 text-blue-600" />}
                        title="Medications"
                        description="View your prescriptions"
                    />
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
                        {loadingAppointments ? (
                            <p className="text-gray-500">Loading appointments...</p>
                        ) : appointments.length === 0 ? (
                            <p className="text-gray-500">No upcoming appointments</p>
                        ) : (
                            <div className="space-y-4">
                                {appointments.map((appointment) => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        doctor={appointment.doctorName}
                                        specialty={appointment.specialty || "General"}
                                        date={appointment.date}
                                        time={appointment.time}
                                        type={appointment.type || "In-Person"}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Health Metrics */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Health Metrics</h2>
                        <div className="space-y-6">
                            <HealthMetric
                                icon={<Heart className="h-5 w-5 text-red-500" />}
                                title="Heart Rate"
                                value="72 bpm"
                                trend="+2 from yesterday"
                            />
                            <HealthMetric
                                icon={<Activity className="h-5 w-5 text-green-500" />}
                                title="Daily Steps"
                                value="8,453"
                                trend="2,000 to goal"
                            />
                        </div>
                    </div>

                    {/* Medication Schedule */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Today's Medications</h2>
                        <div className="space-y-4">
                            <MedicationCard
                                name="Lisinopril"
                                dosage="10mg"
                                time="8:00 AM"
                                status="taken"
                            />
                            <MedicationCard
                                name="Metformin"
                                dosage="500mg"
                                time="2:00 PM"
                                status="upcoming"
                            />
                            <MedicationCard
                                name="Atorvastatin"
                                dosage="20mg"
                                time="8:00 PM"
                                status="upcoming"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuickActionCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col items-center text-center">
            {icon}
            <h3 className="font-semibold mt-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);

const AppointmentCard = ({ doctor, specialty, date, time, type }) => (
    <div className="flex items-center gap-4 p-3 border rounded-lg">
        <div className="flex-1">
            <h4 className="font-semibold">{doctor}</h4>
            <p className="text-sm text-gray-600">{specialty}</p>
            <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{date} at {time}</span>
            </div>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
            {type}
        </span>
    </div>
);

const HealthMetric = ({ icon, title, value, trend }) => (
    <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-100 rounded-lg">
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="font-semibold">{title}</h4>
            <p className="text-xl">{value}</p>
            <p className="text-sm text-gray-600">{trend}</p>
        </div>
    </div>
);

const MedicationCard = ({ name, dosage, time, status }) => (
    <div className="flex items-center gap-4 p-3 border rounded-lg">
        <div className="p-2 bg-gray-100 rounded-lg">
            <Pill className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-gray-600">{dosage}</p>
            <p className="text-sm text-gray-600">{time}</p>
        </div>
    </div>
);

export default PatientDashboard;
