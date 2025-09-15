import { useState, useEffect } from "react";
import TenantForm from "../components/TenantForm";
import CustomerForm from "../components/CustomerForm";
import CustomerList from "../components/CustomerList";
import { Bar } from "react-chartjs-2";
import "./Dashboard.css";
import api from "../api/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [tenant, setTenant] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [shopifyData, setShopifyData] = useState({
    store: null,
    products: [],
    orders: [],
  });

  useEffect(() => {
    const fetchShopifyData = async () => {
      try {
        const [storeRes, productsRes, ordersRes] = await Promise.all([
          api.get("/shopify/store"),
          api.get("/shopify/products"),
          api.get("/shopify/orders"),
        ]);

        setShopifyData({
          store: storeRes.data.shop,
          products: productsRes.data.products,
          orders: ordersRes.data.orders,
        });
      } catch (error) {
        console.error("Error fetching Shopify data:", error);
      }
    };

    fetchShopifyData();
  }, []);

  const handleTenantCreated = (newTenant) => {
    setTenant(newTenant);
  };

  const handleCustomerCreated = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
  };

  return (
    <div className="dashboard">
      <h1>Xeno Dashboard</h1>

      {/* Shopify Data Section */}
      <div className="shopify-data">
        <h2>Shopify Store Data</h2>
        {shopifyData.store && (
          <div className="store-info">
            <h3>Store Information</h3>
            <p>Name: {shopifyData.store.name}</p>
            <p>Email: {shopifyData.store.email}</p>
            <p>Country: {shopifyData.store.country_name}</p>
          </div>
        )}

        <div className="data-summary">
          <h3>Summary</h3>
          <Bar
            data={{
              labels: ["Products", "Orders", "Customers"],
              datasets: [
                {
                  label: "Count",
                  data: [
                    shopifyData.products.length,
                    shopifyData.orders.length,
                    customers.length,
                  ],
                  backgroundColor: [
                    "rgba(75,192,192,0.6)",
                    "rgba(153,102,255,0.6)",
                    "rgba(255,159,64,0.6)",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: "Store Overview",
                },
              },
            }}
          />
        </div>

        <div className="recent-data">
          <h3>Recent Products</h3>
          <ul>
            {shopifyData.products.slice(0, 5).map((product) => (
              <li key={product.id}>
                {product.title} - ${product.variants[0]?.price || "N/A"}
              </li>
            ))}
          </ul>

          <h3>Recent Orders</h3>
          <ul>
            {shopifyData.orders.slice(0, 5).map((order) => (
              <li key={order.id}>
                Order #{order.order_number} - {order.total_price}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tenant Section */}
      <div className="tenant-section">
        {!tenant ? (
          <TenantForm onTenantCreated={handleTenantCreated} />
        ) : (
          <div className="tenant-info">
            <h2>Tenant: {tenant.name}</h2>
            <CustomerForm
              tenantId={tenant.id}
              onCustomerCreated={handleCustomerCreated}
            />
            <CustomerList tenantId={tenant.id} />
          </div>
        )}
      </div>
    </div>
  );
}
