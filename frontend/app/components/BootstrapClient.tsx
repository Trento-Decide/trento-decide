"use client";

import { useEffect } from "react";
import "bootstrap-italia";
import { loadFonts } from "bootstrap-italia";

export default function BootstrapClient() {
  useEffect(() => {
    loadFonts("/fonts");
  }, []);

  return null;
}
