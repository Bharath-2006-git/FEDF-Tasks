import { useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (task.trim() === "") return;
    setTodos([...todos, { text: task, done: false }]);
    setTask("");
  };

  const toggleTodo = (index) => {
    setTodos(
      todos.map((t, i) =>
        i === index ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="app">
      <h1>To Do List</h1>

      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Write a task..."
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((t, i) => (
          <li key={i} className={t.done ? "done" : ""}>
            <span onClick={() => toggleTodo(i)}>{t.text}</span>
            <button className="delete" onClick={() => deleteTodo(i)}>
              Done
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
