import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // <- dynamic URL

const TeacherMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/teacher/materials`);
      setMaterials(res.data);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
      setError("Could not load materials. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Teacher Materials</h1>

      {loading && <p>Loading materials...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>PDF</th>
              <th style={thStyle}>Batch</th>
              <th style={thStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "10px" }}>
                  No materials found
                </td>
              </tr>
            )}
            {materials.map((mat) => (
              <tr key={mat.id}>
                <td style={tdStyle}>{mat.title}</td>
                <td style={tdStyle}>
                  <a href={mat.file_url} target="_blank" rel="noopener noreferrer">
                    PDF
                  </a>
                </td>
                <td style={tdStyle}>{mat.batch_name}</td>
                <td style={tdStyle}>{new Date(mat.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

export default TeacherMaterials;
