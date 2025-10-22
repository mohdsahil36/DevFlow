// useDataFetch.ts
"use client";

import { useState, useEffect } from "react";
import { Task } from "../types/types";

interface ApiResponse {
  success: boolean;
  count: number;
  data: Task[];
}

interface UseDataFetchReturn {
  data: Task[] | null;
}

export default function useDataFetch(route?: string): UseDataFetchReturn {
  const [data, setData] = useState<Task[] | null>(null);

  useEffect(() => {
    let shouldFetch = false;
    let fetchRoute = "";

    if (route) {
      // If route is provided, fetch from that specific route
      shouldFetch = true;
      fetchRoute = route.startsWith("/") ? route : `/${route}`;
    } else {
      // If no route provided, only fetch if we're on kanban page
      shouldFetch = window.location.pathname.includes("/kanban");
      fetchRoute = "/kanban";
    }

    if (shouldFetch) {
      async function fetchData() {
        try {
          const response = await fetch(`http://localhost:8080${fetchRoute}`);

          // Check if response is ok
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const json: ApiResponse = await response.json();

          // Check if API response indicates success
          if (!json.success) {
            throw new Error("API returned unsuccessful response");
          }

          // Extract the actual data array from the nested structure
          if (json.data && Array.isArray(json.data)) {
            setData(json.data);
          } else {
            throw new Error("Invalid data format received from API");
          }
        } catch (err) {
          throw new Error("Data can't be fetched!");
          setData(null);
        }
      }

      fetchData();
    }
  }, [route]); // Include route in dependencies

  return { data };
}
