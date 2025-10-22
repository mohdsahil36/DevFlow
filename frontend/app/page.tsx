"use client";

import { useState, useEffect } from "react";

export default function KanbanBoard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:8080");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          console.warn("Unexpected data format:", result);
          setData([]);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h1>Tasks ({data.length})</h1>
      {data.map((item: any, index: number) => (
        <div key={item._id || index} style={{ border: '1px solid #ccc', margin: '10px', padding: '15px', borderRadius: '5px' }}>
          <h2>{item.title || 'No Title'}</h2>
          <p><strong>Description:</strong> {item.description || 'No Description'}</p>
          <p><strong>Due Date:</strong> {item.due_date || 'No Due Date'}</p>
          <p><strong>Priority:</strong> {item.priority || 'No Priority'}</p>
          <p><strong>ID:</strong> {item._id || 'No ID'}</p>
        </div>
      ))}
    </div>
  );
}
