import { useEffect, useState } from "react";
import api from "@/lib/api";

export const useDashboardData = (role, storeId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint =
          role === "admin"
            ? "/statistics/admin"
            : `/statistics/store?storeId=${storeId}`;

        const res = await api.get(endpoint);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role, storeId]);

  return { data, loading, error };
};
