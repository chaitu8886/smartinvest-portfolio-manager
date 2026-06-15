import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {
  const [summary, setSummary] = useState({});
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    symbol: "",
    shares: "",
    purchase_price: "",
    current_price: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const summaryRes = await axios.get("http://127.0.0.1:8000/portfolio-summary");
    const stockRes = await axios.get("http://127.0.0.1:8000/stocks");

    setSummary(summaryRes.data);
    setStocks(stockRes.data);
  };

  const resetForm = () => {
    setForm({
      symbol: "",
      shares: "",
      purchase_price: "",
      current_price: ""
    });
    setEditingId(null);
  };

  const submitStock = async (e) => {
    e.preventDefault();

    if (!form.symbol || form.shares <= 0 || form.purchase_price <= 0 || form.current_price <= 0) {
      alert("Please enter valid stock details.");
      return;
    }

    const payload = {
      symbol: form.symbol.toUpperCase(),
      shares: Number(form.shares),
      purchase_price: Number(form.purchase_price),
      current_price: Number(form.current_price)
    };

    if (editingId) {
      await axios.put(`http://127.0.0.1:8000/stocks/${editingId}`, payload);
    } else {
      await axios.post("http://127.0.0.1:8000/stocks", payload);
    }

    resetForm();
    loadData();
  };

  const editStock = (stock) => {
    setEditingId(stock.id);
    setForm({
      symbol: stock.symbol,
      shares: stock.shares,
      purchase_price: stock.purchase_price,
      current_price: stock.current_price
    });
  };

  const deleteStock = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/stocks/${id}`);
    loadData();
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = stocks.map((stock) => ({
    name: stock.symbol,
    value: stock.shares * stock.current_price
  }));

  const colors = ["#2563eb", "#16a34a", "#f97316", "#9333ea", "#dc2626", "#0891b2"];

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>SmartInvest Portfolio Dashboard</h1>
      <p style={subtitleStyle}>Full-stack investment tracking platform powered by React, FastAPI, and SQLAlchemy.</p>

      <div style={cardContainer}>
        <div style={cardStyle}>
          <h3>Total Cost</h3>
          <h2>${summary.total_cost || 0}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Value</h3>
          <h2>${summary.total_value || 0}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Profit / Loss</h3>
          <h2 style={{ color: summary.profit_loss >= 0 ? "#16a34a" : "#dc2626" }}>
            ${summary.profit_loss || 0}
          </h2>
        </div>
      </div>

      <div style={mainGrid}>
        <form onSubmit={submitStock} style={formStyle}>
          <h2>{editingId ? "Edit Stock" : "Add New Stock"}</h2>

          <input style={inputStyle} placeholder="Symbol" value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })} />

          <input style={inputStyle} placeholder="Shares" type="number" value={form.shares}
            onChange={(e) => setForm({ ...form, shares: e.target.value })} />

          <input style={inputStyle} placeholder="Purchase Price" type="number" value={form.purchase_price}
            onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} />

          <input style={inputStyle} placeholder="Current Price" type="number" value={form.current_price}
            onChange={(e) => setForm({ ...form, current_price: e.target.value })} />

          <button style={primaryButton} type="submit">
            {editingId ? "Update Stock" : "Add Stock"}
          </button>

          {editingId && (
            <button style={secondaryButton} type="button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </form>

        <div style={chartCard}>
          <h2>Portfolio Allocation</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} label>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={tableCard}>
        <div style={tableHeader}>
          <h2>Stock Holdings</h2>
          <input
            style={searchStyle}
            placeholder="Search stock symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Symbol</th>
              <th style={cellStyle}>Shares</th>
              <th style={cellStyle}>Purchase Price</th>
              <th style={cellStyle}>Current Price</th>
              <th style={cellStyle}>Market Value</th>
              <th style={cellStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStocks.map((stock) => (
              <tr key={stock.id}>
                <td style={cellStyle}>{stock.symbol}</td>
                <td style={cellStyle}>{stock.shares}</td>
                <td style={cellStyle}>${stock.purchase_price}</td>
                <td style={cellStyle}>${stock.current_price}</td>
                <td style={cellStyle}>${stock.shares * stock.current_price}</td>
                <td style={cellStyle}>
                  <button style={editButton} onClick={() => editStock(stock)}>Edit</button>
                  <button style={deleteButton} onClick={() => deleteStock(stock.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "30px",
  fontFamily: "Arial",
  background: "#f5f7fb",
  minHeight: "100vh",
  color: "#1f2937"
};

const titleStyle = {
  textAlign: "center",
  fontSize: "42px",
  marginBottom: "5px"
};

const subtitleStyle = {
  textAlign: "center",
  color: "#6b7280",
  marginBottom: "30px"
};

const cardContainer = {
  display: "flex",
  gap: "20px",
  justifyContent: "center",
  marginBottom: "30px",
  flexWrap: "wrap"
};

const cardStyle = {
  background: "white",
  border: "1px solid #e5e7eb",
  padding: "22px",
  borderRadius: "14px",
  width: "210px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "25px",
  maxWidth: "1000px",
  margin: "auto",
  marginBottom: "30px"
};

const formStyle = {
  background: "white",
  padding: "24px",
  borderRadius: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const chartCard = {
  background: "white",
  padding: "24px",
  borderRadius: "14px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db"
};

const primaryButton = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};

const secondaryButton = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "white",
  cursor: "pointer"
};

const tableCard = {
  background: "white",
  padding: "24px",
  borderRadius: "14px",
  maxWidth: "1100px",
  margin: "auto",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const tableHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap"
};

const searchStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  width: "240px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const cellStyle = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
  textAlign: "center"
};

const editButton = {
  marginRight: "8px",
  padding: "6px 10px",
  border: "none",
  borderRadius: "6px",
  background: "#f59e0b",
  color: "white",
  cursor: "pointer"
};

const deleteButton = {
  padding: "6px 10px",
  border: "none",
  borderRadius: "6px",
  background: "#dc2626",
  color: "white",
  cursor: "pointer"
};

export default App;