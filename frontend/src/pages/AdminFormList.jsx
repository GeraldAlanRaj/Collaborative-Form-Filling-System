import { useEffect, useState } from "react";
import { privateApi } from "../utils/AxiosInterceptor";
import '../styles/AdminFormList.css'

export default function AdminFormsList() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState([]);

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

  const fetchResponses = async (formId) => {
    try {
      const res = await privateApi.get(`/forms/responses/${formId}`);
      setResponses(res.data);
      setSelectedForm(formId);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch responses");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">My Forms</h2>
      <div className="admin-content">
        <div className="forms-list">
          <h3>Forms List</h3>
          <ul className="form-items">
            {forms.map(f => (
              <li key={f.formId}>
                <button
                  className={`form-button ${selectedForm === f.formId ? "selected" : ""}`}
                  onClick={() => fetchResponses(f.formId)}
                >
                  {f.title} <br />
                  <small>Created: {new Date(f.createdAt).toLocaleDateString()}</small>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="responses-list">
          <h3>Form Responses</h3>
          {selectedForm && responses.length === 0 && <p>No responses yet.</p>}
          {responses.length > 0 && (
            <table className="responses-table">
              <thead>
                <tr>
                  {Object.keys(responses[0].responses || {}).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((r, i) => (
                  <tr key={i}>
                    {Object.values(r.responses || {}).map((val, j) => (
                      <td key={j}>
                        {Array.isArray(val) ? val.join(", ") : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
