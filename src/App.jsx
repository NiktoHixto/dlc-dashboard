import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DLCDashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [sortType, setSortType] = useState("none");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}dlcs_train_simulator.csv`)
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });

        const parsed = result.data
          .map((row) => {
            const precoConvertido = row.Preço
              ? parseFloat(String(row.Preço).replace(",", "."))
              : NaN;

            return {
              appId: row.AppID,
              nome: row.Nome,
              preco: precoConvertido,
              dataHora: row.Data_Hora,
            };
          })
          .filter((item) => !isNaN(item.preco) && item.nome);

        const totalPrice = parsed.reduce((acc, item) => acc + item.preco, 0);
        const avg = parsed.length > 0 ? totalPrice / parsed.length : 0;

        setData(parsed);
        setTotal(totalPrice);
        setAverage(avg);
      });
  }, []);

  let filtered = data.filter((item) =>
    item.nome?.toLowerCase().includes(search.toLowerCase())
  );

  if (minPrice !== "") {
    filtered = filtered.filter((item) => item.preco >= parseFloat(minPrice));
  }

  if (maxPrice !== "") {
    filtered = filtered.filter((item) => item.preco <= parseFloat(maxPrice));
  }

  if (sortType === "priceAsc") {
    filtered = [...filtered].sort((a, b) => a.preco - b.preco);
  } else if (sortType === "priceDesc") {
    filtered = [...filtered].sort((a, b) => b.preco - a.preco);
  } else if (sortType === "nameAsc") {
    filtered = [...filtered].sort((a, b) => a.nome.localeCompare(b.nome));
  } else if (sortType === "nameDesc") {
    filtered = [...filtered].sort((a, b) => b.nome.localeCompare(a.nome));
  }

  const filteredTotal = filtered.reduce((acc, item) => acc + item.preco, 0);
  const filteredAverage = filtered.length > 0 ? filteredTotal / filtered.length : 0;

  const clearFilters = () => {
    setSearch("");
    setSortType("none");
    setMinPrice("");
    setMaxPrice("");
  };

  const chartData = filtered.map((item) => ({
    nome: item.nome,
    preco: item.preco,
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "#f1f5f9",
        padding: "30px",
        width: "100vw",
        margin: 0,
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "30px", fontWeight: "600" }}>
        🎮 Dashboard DLCs
      </h1>

      {/* Cards Resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        {[{ title: "Total Geral", value: total },
          { title: "Média Geral", value: average },
          { title: "Total Filtros", value: filteredTotal },
          { title: "Média Filtros", value: filteredAverage }
        ].map((card, index) => (
          <div
            key={index}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              transition: "transform 0.2s ease",
            }}
          >
            <h3 style={{ fontSize: "14px", opacity: 0.7 }}>{card.title}</h3>
            <p style={{ fontSize: "22px", fontWeight: "bold", marginTop: "8px" }}>
              R$ {card.value.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px" }}>
        <input type="text" placeholder="Buscar DLC..." value={search} onChange={(e) => setSearch(e.target.value)} style={inputStyle} />

        <select value={sortType} onChange={(e) => setSortType(e.target.value)} style={inputStyle}>
          <option value="none">Sem ordenação</option>
          <option value="priceAsc">Preço ↑</option>
          <option value="priceDesc">Preço ↓</option>
          <option value="nameAsc">Nome A-Z</option>
          <option value="nameDesc">Nome Z-A</option>
        </select>

        <input type="number" placeholder="Preço mínimo" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={inputStyle} />
        <input type="number" placeholder="Preço máximo" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={inputStyle} />

        <button onClick={clearFilters} style={{ ...inputStyle, cursor: "pointer", background: "#3b82f6" }}>
          Limpar
        </button>
      </div>

      {/* Gráfico */}
      <div style={{ width: "100%", height: 350, background: "#1e293b", padding: "20px", borderRadius: "16px", marginBottom: "40px" }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="nome" hide />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff" }}
              labelStyle={{ color: "#fff", fontWeight: "bold" }}
              formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Preço"]}
              labelFormatter={(label) => `DLC: ${label}`}
            />
            <Bar dataKey="preco" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Contador */}
      <div style={{ marginBottom: "20px", fontSize: "14px", opacity: 0.8 }}>
        Mostrando <strong>{filtered.length}</strong> de <strong>{data.length}</strong> DLCs
      </div>

      {/* Lista */}
      <div style={{ display: "grid", gap: "15px" }}>
        {filtered.map((item, index) => {
          const percentOfTotal = total > 0 ? (item.preco / total) * 100 : 0;
          const diffFromAvg = item.preco - average;
          const diffPercent = average > 0 ? (diffFromAvg / average) * 100 : 0;

          return (
            <div key={index} style={{ background: "#1e293b", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.4)" }}>
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>{item.nome}</h3>
              <p>Preço: R$ {item.preco.toFixed(2)}</p>
              <p>{percentOfTotal.toFixed(2)}% do total geral</p>
              <p style={{ color: diffPercent >= 0 ? "#22c55e" : "#ef4444" }}>
                {diffPercent >= 0 ? "Acima" : "Abaixo"} da média: {Math.abs(diffPercent).toFixed(2)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#f1f5f9",
  outline: "none",
};
