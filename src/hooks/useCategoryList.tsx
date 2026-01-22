// src/hooks/useCategoryList.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { CategoryUI, fetchCategories } from "@/library/category";

interface UseCategoryListProps {
  initialLimit: number;
  initialPage?: number; // 👈 Add this optional prop
  isInfinite: boolean;
}

export const useCategoryList = ({ 
  initialLimit, 
  initialPage = 1, 
  isInfinite 
}: UseCategoryListProps) => {
  const [categories, setCategories] = useState<CategoryUI[]>([]);
  const [loading, setLoading] = useState(true);
  
 
  const [page, setPage] = useState(initialPage); 
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
       
        const data = await fetchCategories(initialPage, initialLimit); 
        setCategories(data);
        if (data.length < initialLimit) setHasMore(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [initialLimit, initialPage]); 

 
  const loadMore = useCallback(async () => {
    if (!isInfinite || loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const newData = await fetchCategories(nextPage, initialLimit);
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setCategories((prev) => [...prev, ...newData]);
        setPage(nextPage);
        if (newData.length < initialLimit) setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [isInfinite, loadingMore, hasMore, page, initialLimit]);

  return { categories, loading, loadingMore, hasMore, loadMore };
};