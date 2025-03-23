import React, { useState } from "react";

const HashTool = () => {
  const [text, setText] = useState("");
  const [algorithm, setAlgorithm] = useState("MD5");
  const [hashedText, setHashedText] = useState("");

  const handleHash = async () => {
    try {
        console.log("${algorithm}")
        const response = await fetch(`http://localhost:8080/api/hash/${algorithm}?text=${text}`);
        const data = await response.text();
        setHashedText(data);
    } catch (error) {
        console.error("Error hashing text:", error);
        setHashedText("Error processing request!");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Hash Text Tool</h2>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text" className="border p-2 rounded w-full mb-2" required/>
      <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="border p-2 rounded w-full mb-2">
        <option value="MD5">MD5</option>
        <option value="SHA-256">SHA-256</option>
        <option value="SHA-512">SHA-512</option>
      </select>
      <button onClick={handleHash} className="bg-blue-500 text-white p-2 rounded w-full">Hash Text</button>
      {hashedText && <p className="mt-2 p-2 bg-gray-100">{hashedText}</p>}
    </div>
  );
};

export default HashTool;