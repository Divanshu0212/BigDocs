import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, getDocs, query, where, updateDoc, doc, addDoc, getDoc } from 'firebase/firestore';
import { Calendar, Clock, User, Check, X } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

const DoctorAppointmentBooking = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [availabilityModal, setAvailabilityModal] = useState(false);
    const [user, setUser] = useState(null);
    const [availability, setAvailability] = useState({
        date: '',
        startTime: '',
        endTime: '',
        breakStart: '',
        breakEnd: '',
        appointmentDuration: 30, // minutes
    });

    // Handle auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchAppointments(currentUser.uid);
            } else {
                setAppointments([]);
                setLoading(false);
            }
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    const fetchAppointments = async (userId) => {
        if (!userId) return;

        try {
            const appointmentsQuery = query(
                collection(db, "appointments"),
                where("doctorId", "==", userId)
            );
            const querySnapshot = await getDocs(appointmentsQuery);

            const appointmentsList = await Promise.all(
                querySnapshot.docs.map(async (docSnap) => {
                    const appointmentData = docSnap.data();
                    let patientName = "Unknown Patient"; // Default if name isn't found

                    if (appointmentData.patientId) {
                        const userDocRef = doc(db, "users", appointmentData.patientId);
                        const userDocSnap = await getDoc(userDocRef);
                        if (userDocSnap.exists()) {
                            patientName = userDocSnap.data().fullName || "Unknown Patient";
                        }
                    }

                    return {
                        id: docSnap.id,
                        ...appointmentData,
                        patientName,
                    };
                })
            );

            setAppointments(appointmentsList);
        } catch (err) {
            setError("Failed to fetch appointments");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAppointmentAction = async (appointmentId, status) => {
        if (!user) {
            setError('You must be logged in to perform this action');
            return;
        }

        try {
            await updateDoc(doc(db, 'appointments', appointmentId), {
                status: status,
                updatedAt: new Date().toISOString()
            });

            setSuccessMessage(`Appointment ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
            fetchAppointments(user.uid);

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            setError('Failed to update appointment status');
            console.error(err);
        }
    };

    const handleSetAvailability = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in to set availability');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'doctorAvailability'), {
                doctorId: user.uid,
                ...availability,
                createdAt: new Date().toISOString()
            });
            setSuccessMessage('Availability set successfully');
            setAvailabilityModal(false);
        } catch (err) {
            setError('Failed to set availability');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <User className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Not authenticated</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Please log in to view and manage appointments.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Rest of the component remains the same...
    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>
                    <button
                        onClick={() => setAvailabilityModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Set Availability
                    </button>
                </div>

                {/* Error and Success Messages */}
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

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="border rounded-lg p-4 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">{appointment.patientName}</h3>
                                    <span className={`px-2 py-1 rounded-full text-sm ${appointment.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : appointment.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>{appointment.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>{appointment.time}</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm">
                                    Reason: {appointment.reason}
                                </p>

                                {appointment.status === 'pending' && (
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleAppointmentAction(appointment.id, 'approved')}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            <Check className="w-4 h-4" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAppointmentAction(appointment.id, 'rejected')}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {availabilityModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Set Your Availability</h2>
                                <button
                                    onClick={() => setAvailabilityModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSetAvailability} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={availability.date}
                                        onChange={(e) => setAvailability({
                                            ...availability,
                                            date: e.target.value
                                        })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            value={availability.startTime}
                                            onChange={(e) => setAvailability({
                                                ...availability,
                                                startTime: e.target.value
                                            })}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            value={availability.endTime}
                                            onChange={(e) => setAvailability({
                                                ...availability,
                                                endTime: e.target.value
                                            })}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Break Start
                                        </label>
                                        <input
                                            type="time"
                                            value={availability.breakStart}
                                            onChange={(e) => setAvailability({
                                                ...availability,
                                                breakStart: e.target.value
                                            })}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Break End
                                        </label>
                                        <input
                                            type="time"
                                            value={availability.breakEnd}
                                            onChange={(e) => setAvailability({
                                                ...availability,
                                                breakEnd: e.target.value
                                            })}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Appointment Duration (minutes)
                                    </label>
                                    <select
                                        value={availability.appointmentDuration}
                                        onChange={(e) => setAvailability({
                                            ...availability,
                                            appointmentDuration: parseInt(e.target.value)
                                        })}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={15}>15 minutes</option>
                                        <option value={30}>30 minutes</option>
                                        <option value={45}>45 minutes</option>
                                        <option value={60}>60 minutes</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setAvailabilityModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Availability'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* No Appointments Message */}
                {!loading && appointments.length === 0 && (
                    <div className="text-center py-12">
                        <User className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            You don't have any appointments yet. Set your availability to start accepting appointments.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorAppointmentBooking;