import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

const DoctorMedicationsEditor = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newMedication, setNewMedication] = useState({ name: "", dosage: "", frequency: "" });

    // Fetch all patients
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const patientsQuery = query(collection(db, "users"), where("role", "==", "patient"));
                const querySnapshot = await getDocs(patientsQuery);
                const patientsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPatients(patientsList);
            } catch (err) {
                setError("Failed to fetch patients");
                console.error(err);
            }
        };

        fetchPatients();
    }, []);

    // Fetch medications for selected patient
    useEffect(() => {
        if (!selectedPatient) return;

        const fetchMedications = async () => {
            setLoading(true);
            try {
                const medicationsQuery = query(
                    collection(db, "medications"),
                    where("patientId", "==", selectedPatient.id),
                    where("doctorId", "==", auth.currentUser?.uid)
                );

                const querySnapshot = await getDocs(medicationsQuery);
                const medicationsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setMedications(medicationsList);
            } catch (err) {
                setError("Failed to fetch medications");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMedications();
    }, [selectedPatient]);

    // Handle adding a new medication
    const handleAddMedication = async (e) => {
        e.preventDefault();
        if (!selectedPatient || !newMedication.name || !newMedication.dosage || !newMedication.frequency) {
            setError("Please select a patient and fill all fields before adding medication.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "medications"), {
                ...newMedication,
                patientId: selectedPatient.id,
                doctorId: auth.currentUser?.uid,
                createdAt: new Date().toISOString(),
            });

            setMedications([...medications, { id: docRef.id, ...newMedication }]);
            setNewMedication({ name: "", dosage: "", frequency: "" });
            setError("");
        } catch (err) {
            setError("Failed to add medication");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Medications</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Patient Selection Dropdown */}
                <div className="mb-6">
                    <label className="block text-lg font-semibold mb-2">Select a Patient</label>
                    <select
                        className="w-full p-2 border rounded"
                        onChange={(e) => {
                            const patient = patients.find(p => p.id === e.target.value);
                            setSelectedPatient(patient);
                        }}
                    >
                        <option value="">-- Select a Patient --</option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.fullName} ({patient.email})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Medications List */}
                {selectedPatient && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4">
                            Prescribed Medications for {selectedPatient.fullName}
                        </h2>

                        {loading ? (
                            <p>Loading medications...</p>
                        ) : medications.length === 0 ? (
                            <p className="text-gray-600">No medications prescribed yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {medications.map((med) => (
                                    <li key={med.id} className="border p-4 rounded-lg">
                                        <div className="flex justify-between">
                                            <p className="font-semibold">{med.name}</p>
                                            <button
                                                className="text-blue-500 text-sm"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <p>Dosage: {med.dosage}</p>
                                        <p>Frequency: {med.frequency}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Add New Medication Form */}
                {selectedPatient && (
                    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                        <h2 className="text-lg font-semibold mb-4">Add New Medication</h2>
                        <form onSubmit={handleAddMedication} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Medication Name"
                                value={newMedication.name}
                                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Dosage (e.g., 500mg)"
                                value={newMedication.dosage}
                                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Frequency (e.g., 2 times a day)"
                                value={newMedication.frequency}
                                onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                                Add Medication
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorMedicationsEditor;
