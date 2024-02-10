import { useEffect, useState } from "react";

export type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};

export default function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Function to handle window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call handler initially to set initial window size
    handleResize();

    // Remove event listener on component cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
