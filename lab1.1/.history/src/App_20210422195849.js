import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "./App.css";

function generateChart(harmonics, frequencyBorder, ticks) {
  const results = [];
  const x = [];
  let mx = 0;
  let dx = 0;
  const a = [
    0.4339828585740546,
    0.7913122899825349,
    0.9046675274492586,
    0.03561605703191084,
    0.6945208754805292,
    0.31068813398293105,
    0.8019743203386724,
    0.28475103254141687,
    0.12064273435943562,
    0.9330672886468734
]
  console.log([
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
  ]);
  for (let i = 1; i <= harmonics; i++) {
    const w = (frequencyBorder / harmonics) * i;
    const a = Math.random();
    const phi = Math.random();
    const harmonic = [];
    for (let t = 0; t < ticks; t++) {
      harmonic.push(a * Math.sin(w * t + phi));
    }
    results.push(harmonic);
  }
  for (let t = 0; t < ticks; t++) {
    let sum = 0;
    for (const array of results) {
      sum += array[t];
    }
    x.push({
      signal: `${sum}`,
      t: `${t}`,
    });
    mx += sum;
  }
  mx = mx / ticks;
  for (let t = 0; t < ticks; t++) {
    dx += Math.pow(x[t].signal - mx, 2);
  }
  dx = dx / (ticks - 1);
  return {
    x,
    mx,
    dx,
  };
}

function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(generateChart(10, 900, 256));
  }, []);
  return (
    <div className="App">
      {data && (
        <>
          <div className="chart">
            <ResponsiveContainer width="100%" height="95%">
              <LineChart
                data={data.x}
                margin={{ right: 65, top: 5, bottom: 5, left: 5 }}
              >
                <CartesianGrid stroke="#ccc" />
                <Line
                  type="monotone"
                  dataKey="signal"
                  stroke="#4285F4"
                  strokeWidth={2}
                />
                <XAxis dataKey="t" />
                <YAxis
                  dataKey="signal"
                  ticks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]}
                />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="results">
            <div className="center">
              <h3 className="mx">MX = {data.mx}</h3>
            </div>
            <div className="center">
              <h3 className="dx">DX = {data.dx}</h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
