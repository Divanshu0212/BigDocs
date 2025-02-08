import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { FileText, ChevronLeft, Download } from 'lucide-react';

const PatientReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { patientId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchReports = async () => {
      // Check if user is authenticated
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      // Check if user is authorized to view these reports
      if (auth.currentUser.uid !== patientId) {
        setError("You are not authorized to view these reports");
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "reports"),
          where("patientId", "==", patientId),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const reportsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));

        setReports(reportsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to fetch reports");
        setLoading(false);
      }
    };

    checkAuthAndFetchReports();
  }, [patientId, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date not available';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading reports...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Reports</h1>
              <p className="text-gray-600">View and download your medical reports</p>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600">There are no medical reports available at this time.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.reportName}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(report.timestamp)}
                    </p>
                  </div>
                </div>
                <a
                  href={report.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientReports;