import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TenantForm from "./components/TenantForm";
import CustomerForm from "./components/CustomerForm";

function App() {
  return (
    <Router>
      <Routes>
         
        <Route path="/" element={<Dashboard />} />

         
        <Route path="/tenants" element={<TenantForm />} />
        <Route path="/customers" element={<CustomerForm />} />
      </Routes>
    </Router>
  );
}

export default App;
