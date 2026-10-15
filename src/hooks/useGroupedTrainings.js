import { useEffect, useState, useMemo } from "react";
import { trainingApi } from "../Api/CmsApi";
import { Tranings as fallbackTrainings, trainingCategories as fallbackCategories } from "../data/siteData";

export const buildFallbackGrouped = () => {
  const categories = (fallbackCategories || []).filter((c) => c.isActive !== false);
  const activeTrainings = (fallbackTrainings || []).filter((t) => t.isActive !== false);

  const grouped = categories.map((cat) => ({
    ...cat,
    trainings: activeTrainings.filter(
      (t) =>
        t.category === cat.name ||
        t.categoryName === cat.name ||
        t.category === cat._id ||
        t.category?.name === cat.name ||
        (t.category && typeof t.category === "object" && (
          t.category._id === cat._id ||
          t.category.slug === cat.slug
        ))
    ),
  }));

  const matchedIds = new Set(
    grouped.flatMap((g) => g.trainings.map((t) => t._id || t.id || t.slug))
  );
  const unmatched = activeTrainings.filter(
    (t) => !matchedIds.has(t._id || t.id || t.slug)
  );

  if (unmatched.length > 0) {
    grouped.push({
      _id: "general",
      name: "Specialized Programs",
      slug: "specialized-programs",
      description: "Additional technical skill training programs",
      displayOrder: 99,
      isActive: true,
      trainings: unmatched,
    });
  }

  return grouped;
};

export default function useGroupedTrainings() {
  const initialFallback = useMemo(() => buildFallbackGrouped(), []);
  const [categories, setCategories] = useState(initialFallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFallback, setIsFallback] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    trainingApi
      .getGrouped()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const valid = data
            .filter((c) => c.isActive !== false)
            .map((c) => ({
              ...c,
              trainings: (c.trainings || []).filter((t) => t.isActive !== false),
            }));
          setCategories(valid);
          setIsFallback(false);
        } else {
          setCategories(initialFallback);
          setIsFallback(true);
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err.response?.data?.message || "Failed to load grouped trainings.");
        setCategories(initialFallback);
        setIsFallback(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialFallback]);

  return { categories, loading, error, isFallback };
}
