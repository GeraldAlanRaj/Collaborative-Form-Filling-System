import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { privateApi } from "../utils/AxiosInterceptor";
import '../styles/AdminFormResponses.css';

export default function AdminFormResponses() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const res = await privateApi.get(`/forms/responses/${formId}`);
      setResponses(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch responses");
    }
  };

  return (
    <div className="responses-container">
      <h2>Form Responses</h2>

      {responses.length === 0 ? (
        <p>No responses yet.<br></br> <br></br>Share the form to gather response!<br></br><br></br>Form Id : {formId}</p>
      ) : (
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
  );
}
