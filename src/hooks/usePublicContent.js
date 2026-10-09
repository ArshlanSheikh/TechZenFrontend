import { useEffect, useState } from "react";
import { publicContentApi } from "../Api/CmsApi";

export default function usePublicContent(resource) {
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    publicContentApi.list(resource)
      .then((result) => { if (active) setItems(result); })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Content could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [resource]);

  return { items, loading, error };
}