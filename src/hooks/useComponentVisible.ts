"use client";

import { useState, useEffect, useRef } from "react";

export default function useComponentVisible(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef<HTMLElement>();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      ref.current instanceof Node &&
      !ref.current.contains(event.target as Node)
    ) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
