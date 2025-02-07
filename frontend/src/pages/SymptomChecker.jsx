import React, { useState } from "react";

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });

    const data = await response.json();
    setResult(`Possible Condition: ${data.predicted_disease}`);
  };

  return (
    <div className="container">
      <h2>AI-Powered Symptom Checker</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe your symptoms..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <button type="submit">Check</button>
      </form>
      <p>{result}</p>
    </div>
  );
}

export default SymptomChecker;
