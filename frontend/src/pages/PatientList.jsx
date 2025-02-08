import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      if (!auth.currentUser) return;
      const doctorId = auth.currentUser.uid;

      try {
        const appointmentsQuery = query(
          collection(db, "appointments"),
          where("doctorId", "==", doctorId)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const patientIds = new Set();

        appointmentsSnapshot.forEach((doc) => {
          patientIds.add(doc.data().patientId);
        });

        if (patientIds.size === 0) {
          setPatients([]);
          setLoading(false);
          return;
        }

        const patientsQuery = query(
          collection(db, "users"),
          where("role", "==", "patient")
        );
        const patientsSnapshot = await getDocs(patientsQuery);
        const patientsList = [];

        patientsSnapshot.forEach((doc) => {
          if (patientIds.has(doc.id)) {
            patientsList.push({ id: doc.id, ...doc.data() });
          }
        });

        setPatients(patientsList);
      } catch (error) {
        console.error("Error fetching patients: ", error);
      }
      setLoading(false);
    };

    fetchPatients();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-6">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Patients</h1>
        <input
          type="text"
          placeholder="Search patients..."
          className="w-full p-2 mb-4 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Loading...</p>
        ) : patients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-400">
                  <th className="p-2 border-l-1 border-t-1">Name</th>
                  <th className="p-2 border-r-1 border-t-1">Email</th>
                </tr>
              </thead>
              <tbody>
                {patients
                  .filter((patient) =>
                    patient.fullName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((patient) => (
                    <tr key={patient.id} className="border bg-blue-200">
                      <td className="p-2">{patient.fullName}</td>
                      <td className="p-2">{patient.email}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
