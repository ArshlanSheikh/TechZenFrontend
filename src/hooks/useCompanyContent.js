import { useEffect, useState } from "react";
import { publicContentApi } from "../Api/CmsApi";
import { company as defaultCompany } from "../data/siteData";

export default function useCompanyContent(explicitFallback) {
  const fallback = explicitFallback || defaultCompany;
  const [company, setCompany] = useState(() => fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFallback, setIsFallback] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    publicContentApi
      .company()
      .then((content) => {
        if (!active) return;
        if (content && typeof content === "object" && Object.keys(content).length > 0) {
          setCompany({
            ...fallback,
            ...content,
            whyChooseUs:
              content.whyChooseUs?.length > 0
                ? content.whyChooseUs
                : fallback.whyChooseUs || [],
            statistics:
              content.statistics?.length > 0
                ? content.statistics
                : fallback.statistics || [],
          });
          setIsFallback(false);
        } else {
          setCompany(fallback);
          setIsFallback(true);
        }
      })
      .catch((requestError) => {
        if (!active) return;
        setError(
          requestError.response?.data?.message ||
            "Company content could not be loaded."
        );
        setCompany(fallback);
        setIsFallback(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { company, loading, error, isFallback };
}
