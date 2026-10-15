import { useEffect, useState } from "react";
import { publicContentApi } from "../Api/CmsApi";
import {
  services as fallbackServices,
  projects as fallbackProjects,
  Tranings as fallbackTrainings,
  trainingCategories as fallbackCategories,
  faqs as fallbackFaqs,
  teamMembers as fallbackTeam,
} from "../data/siteData";

const normalizeFaqs = (rawFaqs) => {
  if (!Array.isArray(rawFaqs)) return [];
  return rawFaqs.map((faq, index) => {
    if (Array.isArray(faq)) {
      return {
        _id: `fallback-faq-${index}`,
        question: faq[0] || "",
        answer: faq[1] || "",
      };
    }
    return faq;
  });
};

export const getFallbackForResource = (resource) => {
  switch (resource) {
    case "services":
      return fallbackServices || [];
    case "projects":
      return fallbackProjects || [];
    case "trainings":
    case "training":
      return fallbackTrainings || [];
    case "training-categories":
    case "trainingCategories":
      return fallbackCategories || [];
    case "faqs":
    case "faq":
      return normalizeFaqs(fallbackFaqs);
    case "team":
    case "teamMembers":
      return fallbackTeam || [];
    default:
      return [];
  }
};

export default function usePublicContent(resource, explicitFallback) {
  const fallback =
    explicitFallback !== undefined
      ? explicitFallback
      : getFallbackForResource(resource);

  const [items, setItems] = useState(() => fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFallback, setIsFallback] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    publicContentApi
      .list(resource)
      .then((result) => {
        if (!active) return;
        if (Array.isArray(result) && result.length > 0) {
          setItems(result);
          setIsFallback(false);
        } else {
          // If backend returns empty array or invalid data, continue using fallback
          setItems(fallback);
          setIsFallback(true);
        }
      })
      .catch((requestError) => {
        if (!active) return;
        setError(
          requestError.response?.data?.message || "Content could not be loaded."
        );
        // On error, continue displaying the fallback data
        setItems(fallback);
        setIsFallback(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [resource]);

  return { items, loading, error, isFallback };
}