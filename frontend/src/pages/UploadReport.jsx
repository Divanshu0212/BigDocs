import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const UploadReport = () => {
  const [file, setFile] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [uploading, setUploading] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPatients(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPatients = async (doctorId) => {
    const q = query(collection(db, "appointments"), where("doctorId", "==", doctorId));
    const querySnapshot = await getDocs(q);

    const patientList = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!patientList.some((p) => p.id === data.patientId)) {
        patientList.push({ id: data.patientId, name: data.patientName });
      }
    });

    setPatients(patientList);
  };

  useEffect(() => {
    if (selectedPatient) {
      fetchReports(selectedPatient);
    } else {
      setReports([]);
    }
  }, [selectedPatient]);

  const fetchReports = async (patientId) => {
    setLoadingReports(true);
    const q = query(collection(db, "reports"), where("patientId", "==", patientId));
    const querySnapshot = await getDocs(q);

    const reportsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setReports(reportsData);
    setLoadingReports(false);
  };

  const handleUpload = async () => {
    if (!file || !selectedPatient) return alert("Select a patient and a file!");

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", `patient-reports/${selectedPatient}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (data.secure_url) {
        await addDoc(collection(db, "reports"), {
          patientId: selectedPatient,
          doctorId: auth.currentUser.uid,
          reportUrl: data.secure_url,
          reportName: file.name,
          cloudinaryPublicId: data.public_id,
          timestamp: serverTimestamp(),
        });

        alert("Report uploaded successfully!");
        setFile(null);
        fetchReports(selectedPatient); // Refresh reports after upload
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading report.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (reportId, cloudinaryPublicId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {

      // Delete from Firestore
      await deleteDoc(doc(db, "reports", reportId));

      alert("Report deleted successfully!");
      fetchReports(selectedPatient); // Refresh reports after deletion
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting report.");
    }
  };

  return (
    <div className="min-h-screen p-6 pt-10 bg-gray-100">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Manage Patient Reports</h2>

        {/* Patient Dropdown */}
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="mb-4 w-full border p-2 rounded-md"
        >
          <option value="">Select a Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>

        {/* Show Reports List */}
        {selectedPatient && (
          <>
            <h3 className="text-lg font-semibold mb-2">Uploaded Reports</h3>
            {loadingReports ? (
              <p className="text-gray-500">Loading reports...</p>
            ) : reports.length === 0 ? (
              <p className="text-gray-500">No reports found for this patient.</p>
            ) : (
              <ul className="bg-gray-50 p-4 rounded-md shadow">
                {reports.map((report) => (
                  <li key={report.id} className="flex justify-between items-center border-b py-2">
                    <a href={report.reportUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                      {report.reportName}
                    </a>
                    <button
                      onClick={() => handleDelete(report.id, report.cloudinaryPublicId)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Upload Section */}
        {selectedPatient && (
          <>
            <h3 className="text-lg font-semibold mt-6">Upload New Report</h3>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-4 w-full border p-2 rounded-md"
            />

            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full disabled:bg-gray-400"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Report"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadReport;
