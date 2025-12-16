import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <h1 className="text-4xl font-bold text-accent">
        Card Ghar is Live 🚀
      </h1>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
