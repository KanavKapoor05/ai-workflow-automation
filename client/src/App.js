import React, { useState } from "react";
import "./App.css";
import { FaBars } from "react-icons/fa";

function App() {
  const [prompt, setPrompt] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/workflow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setWorkflow(data.workflow || "Failed to get workflow");
      setHistory((prev) => [prompt, ...prev.filter((p) => p !== prompt)]);
    } catch (err) {
      console.error(err);
      setWorkflow("❌ Error communicating with server.");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleHistoryClick = (item) => {
    setPrompt(item);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleCopy = () => {
    if (workflow) {
      navigator.clipboard.writeText(workflow).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  return (
    <div className="main-wrapper">
      {/* Hamburger icon */}
      <div className="hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <FaBars />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <h2>Search History</h2>
        <ul>
          {history.map((item, idx) => (
            <li key={idx} onClick={() => handleHistoryClick(item)}>
              {item}
            </li>
          ))}
        </ul>
        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClearHistory}>
            Clear
          </button>
        )}
      </div>

      {/* Main Area */}
      <div className={`App ${isSidebarOpen ? "" : "centered"}`}>
        <h1 className="page-heading">Workflow Automation</h1>

        <div className="chat-output">
          {workflow && (
            <div className="output-wrapper">
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
              <pre>{workflow}</pre>
            </div>
          )}
        </div>

        <div className="chat-input">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
            />
            <button type="submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Generate"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
