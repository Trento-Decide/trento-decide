"use client";

import { useEffect } from "react";
import { loadFonts } from "bootstrap-italia";

export default function BootstrapClient() {
  useEffect(() => {
    // @ts-expect-error: bootstrap-italia non usa tipi
    import("bootstrap-italia/dist/js/bootstrap-italia.bundle.min.js");
    loadFonts("/fonts");
  }, []);

  return null;
}
