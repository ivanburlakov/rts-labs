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

const pcorr = (x, y) => {
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0,
    sumY2 = 0;
  const minLength = Math.min(x.length, y.length);
  const reduce = (xi, idx) => {
    const yi = y[idx];
    sumX += xi;
    sumY += yi;
    sumXY += xi * yi;
    sumX2 += xi * xi;
    sumY2 += yi * yi;
  };
  x.forEach(reduce);
  return (
    (minLength * sumXY - sumX * sumY) /
    Math.sqrt(
      (minLength * sumX2 - Math.pow(sumX, 2)) * (minLength * sumY2 - Math.pow(sumY, 2))
    )
  );
};
let arrX = [20, 54];
let arrY = [-20, -54];
let R = pcorr(arrX, arrY);
console.log("arrX", arrX, "arrY", arrY, "R", R);

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
    0.9330672886468734,
  ];
  const phi = [
    0.22630164484429782,
    0.209250913297216,
    0.4181397442964869,
    0.7283513419958436,
    0.9143343248574061,
    0.29136587444048345,
    0.6230305731180181,
    0.7151092751757229,
    0.053674000231757946,
    0.14700253263682495,
  ];
  for (let i = 0; i < harmonics; i++) {
    const w = (frequencyBorder / harmonics) * (i + 1);
    const harmonic = [];
    for (let t = 0; t < ticks; t++) {
      harmonic.push(a[i] * Math.sin(w * t + phi[i]));
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
