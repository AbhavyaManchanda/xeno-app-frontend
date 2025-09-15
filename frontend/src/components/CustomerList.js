import { useEffect, useState } from "react";
import api from "../api/api";

export default function CustomerList({ tenantId }) {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    const apiKey = localStorage.getItem("tenant_api_key");
    console.log("Fetching customers with API key:", apiKey);

    try {
      const res = await api.get("/customers", {
        headers: {
          "X-API-Key": apiKey,
        },
      });
      console.log("Customer data received:", res.data);
      setCustomers(res.data);
      setError(null);
    } catch (err) {
      console.error(
        "Error fetching customers:",
        err.response?.data || err.message
      );
      setError(
        `Failed to load customers: ${err.response?.data?.error || err.message}`
      );
      setCustomers([]);
    }
  };

  useEffect(() => {
    if (tenantId) fetchCustomers();
  }, [tenantId]);

  const deleteCustomer = async (id) => {
    try {
      await api.delete(`/customers/${id}`, {
        headers: {
          "X-API-Key": localStorage.getItem("tenant_api_key"),
        },
      });
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Failed to delete customer. Please try again.");
    }
  };

  return (
    <div className="customer-list">
      <h3>Customers</h3>
      {error ? (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "10px" }}
        >
          {error}
        </div>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {customers.map((c) => (
            <li
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                margin: "4px 0",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              <div>
                <strong>{c.name}</strong>
                {c.email && (
                  <div style={{ fontSize: "0.9em", color: "#666" }}>
                    {c.email}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteCustomer(c.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2em",
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
