import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { Link } from 'react-router-dom'; // Import Link for navigation

const MessageDoctor = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchApprovedAppointments(currentUser.uid);
            } else {
                setUser(null);
                setAppointments([]); // Clear data if logged out
                setLoading(false);
            }
        });

        return () => unsubscribe(); // Cleanup listener
    }, []);

    const fetchApprovedAppointments = async (userId) => {
        setLoading(true);
        try {
            const q = query(
                collection(db, 'appointments'),
                where('patientId', '==', userId),
                where('status', '==', 'approved')
            );
            const querySnapshot = await getDocs(q);
            const appointmentsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log("Fetched Appointments:", appointmentsList); // Debugging

            setAppointments(appointmentsList);
        } catch (err) {
            console.error("Error fetching approved appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold">Message Your Doctor</h1>

            {loading ? (
                <p>Loading...</p>
            ) : appointments.length === 0 ? (
                <p>No approved appointments yet.</p>
            ) : (
                <div className="mt-4 space-y-4">
                    {appointments.map(appt => (
                        <div key={appt.id} className="p-4 border rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold">{appt.doctorName}</h2>
                            <p className="text-gray-600">{appt.specialty}</p>
                            <p className="text-gray-500">
                                {appt.date} at {appt.time}
                            </p>
                            {appt.roomId && (
                                <Link
                                    to={`/telemedicine/${appt.roomId}`}
                                    className="mt-2 inline-block text-blue-600 hover:underline"
                                >
                                    Join Telemedicine Meeting
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageDoctor;
