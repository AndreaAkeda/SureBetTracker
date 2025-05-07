import { useState, useEffect } from "react";

export function useMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return;

    // Initial check
    setIsMobile(window.innerWidth < breakpoint);

    // Handler function
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}
