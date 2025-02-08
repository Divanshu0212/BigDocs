import React, { useState } from "react";
import { Activity, AlertCircle } from "lucide-react";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("https://Anupam1111-model-deploy.hf.space/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });
      const data = await response.json();
      setResult(data.predicted_disease);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Symptom Checker
          </h2>
          <p className="text-gray-600 text-lg">
            Describe your symptoms in detail for an AI-powered analysis
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <textarea
              placeholder="Example: cold,cough,viral fever"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full h-40 p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !symptoms.trim()}
            className={`w-full py-4 px-6 text-lg font-semibold text-white rounded-xl 
              ${isLoading || !symptoms.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 transition-colors'}`}
          >
            {isLoading ? "Analyzing..." : "Check Symptoms"}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Possible Condition:</h3>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg text-gray-800 font-medium">{result}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Note: This is an AI-powered analysis and should not be considered as a medical diagnosis. 
                  Please consult with a healthcare professional for proper medical advice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;