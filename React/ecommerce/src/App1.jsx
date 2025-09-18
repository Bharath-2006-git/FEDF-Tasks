import React, { useState } from "react";
import "./App1.css";

export default function App1() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState(null);

  const add = () => setResult(Number(num1) + Number(num2));
  const subtract = () => setResult(Number(num1) - Number(num2));
  const multiply = () => setResult(Number(num1) * Number(num2));
  const divide = () => {
    if (Number(num2) === 0) {
      setResult("Error (÷0)");
    } else {
      setResult(Number(num1) / Number(num2));
    }
  };

  return (
    <div className="calculator">
      <h1>Simple Calculator</h1>

      <input
        type="number"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
        placeholder="Enter first number"
      />

      <input
        type="number"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
        placeholder="Enter second number"
      />

      <div className="buttons">
        <button onClick={add}>+</button>
        <button onClick={subtract}>-</button>
        <button onClick={multiply}>×</button>
        <button onClick={divide}>÷</button>
      </div>

      <h2>Result: {result !== null ? result : "?"}</h2>
    </div>
  );
}
