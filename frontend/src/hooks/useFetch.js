import { useState } from "react";
import axios from "axios";

export default function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = async (method, url, body = null, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios({
        method,
        url,
        data: body,
        params,
      });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error };
}
