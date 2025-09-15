import { useState } from "react";
import api from "../api/api";

export default function CustomerForm({ tenantId, onCustomerCreated }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/customers",
        { name },
        {
          headers: {
            "X-API-Key": localStorage.getItem("tenant_api_key"),
          },
        }
      );
      onCustomerCreated(res.data);
      setName("");
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to create customer. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Customer</button>
    </form>
  );
}
