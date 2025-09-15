import { useState } from "react";
import api from "../api/api";

export default function TenantForm({ onTenantCreated }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/tenants", {
        name,
      });

      console.log("Tenant creation response:", res.data);

      if (!res.data.tenant?.api_key) {
        throw new Error("No API key received from server");
      }

       localStorage.setItem("tenant_api_key", res.data.tenant.api_key);
      console.log("Stored API key:", res.data.tenant.api_key);

      onTenantCreated(res.data.tenant);
      setName("");
    } catch (error) {
      console.error(
        "Error creating tenant:",
        error.response?.data || error.message
      );
      alert("Failed to create tenant. Please check the console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tenant Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Create Tenant</button>
    </form>
  );
}
