import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "./App.css";

function W(p, k, N) {
  return (
    Math.cos(((2 * Math.PI) / N) * (p * k)) -
    Math.sin(((2 * Math.PI) / N) * (p * k))
  );
}

function Wp(p, N) {
  return Math.cos(((2 * Math.PI) / N) * p) - Math.sin(((2 * Math.PI) / N) * p);
}

function F1(x, p) {
  const N = x.length;
  let F = 0;
  for (let k = 0; k < N / 2 - 1; k++) {
    F += x[2 * k] * W(p, k, N / 2);
  }
  return F;
}

function F2(x, p) {
  const N = x.length;
  let F = 0;
  for (let k = 0; k < N / 2 - 1; k++) {
    F += x[2 * k + 1] * W(p, k, N / 2);
  }
  return F;
}

function FFT(samples) {
  const N = samples.length;
  if (N <= 1) {
    return samples;
  }
  let even = [];
  let odd = [];
  for (let i = 0; i < N / 2; i++) {
    even[i] = samples[2 * i];
    odd[i] = samples[2 * i + 1];
  }
  even = FFT(even);
  odd = FFT(odd);

  const F = [];
  for (let p = 0; p < N / 2; p++) {
    let F = 0;
  for (let k = 0; k < N / 2 - 1; k++) {
    F += x[2 * k] * W(p, k, N / 2);
  }
    F[p] = even[p];
    F[p + N / 2] = ;
  }
}

function generateChart(harmonics, frequencyBorder, ticks) {
  const results = [];
  const x = [];
  const data = [];
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
    x.push(sum);
  }
  const N = 200;
  for (let p = 0; p < N; p++) {
    if (p < N / 2) {
      data.push({
        p,
        "F(p)": `${F2(x, p) + Wp(p, N) * F1(x, p)}`,
      });
    } else {
      data.push({
        p,
        "F(p)": `${F2(x, p - N / 2) - Wp(p - N / 2, N) * F1(x, p - N / 2)}`,
      });
    }
  }
  return data;
}

function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(generateChart(10, 900, 256));
  }, []);
  return (
    <div className="App">
      {data && (
        <div className="chart">
          <ResponsiveContainer width="100%" height="95%">
            <LineChart
              data={data}
              margin={{ right: 65, top: 5, bottom: 5, left: 5 }}
            >
              <CartesianGrid stroke="#ccc" />
              <Line
                type="monotone"
                dataKey="F(p)"
                stroke="#4285F4"
                fill="#4285F4"
                strokeWidth={2}
              />
              <XAxis dataKey="p" />
              <YAxis dataKey="F(p)" />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;
