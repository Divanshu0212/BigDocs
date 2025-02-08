
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase.js";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const DoctorMedicationsEditor = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newMedication, setNewMedication] = useState({ name: "", dosage: "", frequency: "" });
    const [editingMedication, setEditingMedication] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchPatients(user.uid);
            } else {
                setError("User not authenticated.");
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchPatients = async (doctorId) => {
        try {
            const appointmentsQuery = query(
                collection(db, "appointments"),
                where("doctorId", "==", doctorId)
            );

            const appointmentsSnapshot = await getDocs(appointmentsQuery);
            const patientIds = [...new Set(appointmentsSnapshot.docs.map(doc => doc.data().patientId))];

            if (patientIds.length === 0) {
                setPatients([]);
                return;
            }

            const usersQuery = query(
                collection(db, "users"),
                where("__name__", "in", patientIds)
            );

            const usersSnapshot = await getDocs(usersQuery);
            const patientsList = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setPatients(patientsList);
        } catch (err) {
            setError("Failed to fetch patients");
            console.error(err);
        }
    };

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

                const medicationsSnapshot = await getDocs(medicationsQuery);
                const medicationsList = medicationsSnapshot.docs.map(doc => ({
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

    const handleUpdateMedication = async (e) => {
        e.preventDefault();
        if (!editingMedication) return;

        try {
            const medDocRef = doc(db, "medications", editingMedication.id);
            await updateDoc(medDocRef, {
                name: editingMedication.name,
                dosage: editingMedication.dosage,
                frequency: editingMedication.frequency
            });

            setMedications(medications.map(med => med.id === editingMedication.id ? editingMedication : med));
            setEditingMedication(null);
            setError("");
        } catch (err) {
            setError("Failed to update medication");
            console.error(err);
        }
    };

    const handleDeleteMedication = async (medId) => {
        try {
            await deleteDoc(doc(db, "medications", medId));
            setMedications(medications.filter(med => med.id !== medId));
        } catch (err) {
            setError("Failed to delete medication");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Medications</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

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

                {selectedPatient && (
                    <>
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
                                        <li key={med.id} className="border p-4 rounded-lg flex justify-between">
                                            <div>
                                                <p className="font-semibold">{med.name}</p>
                                                <p>Dosage: {med.dosage}</p>
                                                <p>Frequency: {med.frequency}</p>
                                            </div>
                                            <div>
                                                <button onClick={() => setEditingMedication(med)} className="text-blue-500">Edit</button>
                                                <button onClick={() => handleDeleteMedication(med.id)} className="text-red-500 ml-2">Delete</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                            <h2 className="text-lg font-semibold mb-4">{editingMedication ? "Edit Medication" : "Add New Medication"}</h2>
                            <form onSubmit={editingMedication ? handleUpdateMedication : handleAddMedication} className="space-y-4">
                                <input type="text" placeholder="Medication Name" value={editingMedication ? editingMedication.name : newMedication.name} onChange={(e) => editingMedication ? setEditingMedication({ ...editingMedication, name: e.target.value }) : setNewMedication({ ...newMedication, name: e.target.value })} className="w-full p-2 border rounded" required />
                                <input type="text" placeholder="Dosage (e.g., 500mg)" value={editingMedication ? editingMedication.dosage : newMedication.dosage} onChange={(e) => editingMedication ? setEditingMedication({ ...editingMedication, dosage: e.target.value }) : setNewMedication({ ...newMedication, dosage: e.target.value })} className="w-full p-2 border rounded" required />
                                <input type="text" placeholder="Frequency (e.g., 2 times a day)" value={editingMedication ? editingMedication.frequency : newMedication.frequency} onChange={(e) => editingMedication ? setEditingMedication({ ...editingMedication, frequency: e.target.value }) : setNewMedication({ ...newMedication, frequency: e.target.value })} className="w-full p-2 border rounded" required />
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingMedication ? "Update" : "Add"}</button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DoctorMedicationsEditor;