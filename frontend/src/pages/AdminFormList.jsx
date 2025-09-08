import { useEffect, useState } from "react";
import { privateApi } from "../utils/AxiosInterceptor";
import '../styles/AdminFormList.css';
import { useNavigate } from "react-router-dom";

export default function AdminFormsList() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await privateApi.get("/forms/my-forms");
      setForms(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch forms");
    }
  };

  const handleCardClick = (formId) => {
    // Navigate to a separate route for responses
    navigate(`/admin/form-responses/${formId}`);
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Recent Forms</h2>
      
      <div className="forms-grid">
        {forms.map(f => (
          <div key={f.formId} className="form-card" onClick={() => handleCardClick(f.formId)}>
            <h3>{f.title}</h3>
            <p><small>Created: {new Date(f.createdAt).toLocaleDateString()}</small></p>
          </div>
        ))}
      </div>
    </div>
  );
}
