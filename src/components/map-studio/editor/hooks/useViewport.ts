import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export function useViewport(containerRef: RefObject<HTMLDivElement | null>) {
  const [pan, setPan] = useState({ x: 100, y: 100 });
  const [scale, setScale] = useState(1);
  
  // Refs to bypass stale closures in passive event listeners
  const panRef = useRef(pan);
  const scaleRef = useRef(scale);

  useEffect(() => { panRef.current = pan; }, [pan]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);

  // Native wheel event listener for high-performance trackpad zooming
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(scaleRef.current * zoomFactor, 5));
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setScale(newScale);
        setPan({
          x: x - (x - panRef.current.x) * (newScale / scaleRef.current),
          y: y - (y - panRef.current.y) * (newScale / scaleRef.current),
        });
      } else {
        setPan((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
      }
    };
    
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [containerRef]);

  // Button-driven zoom logic
  const adjustZoomCentered = useCallback((factor: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newScale = Math.max(0.1, Math.min(scale * factor, 5));
    setPan(prevPan => ({
      x: rect.width / 2 - (rect.width / 2 - prevPan.x) * (newScale / scale),
      y: rect.height / 2 - (rect.height / 2 - prevPan.y) * (newScale / scale),
    }));
    setScale(newScale);
  }, [scale, containerRef]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPan({ x: 100, y: 100 });
  }, []);

  // Logical coordinate projection for mouse clicks
  const getLogicalCoords = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left - pan.x) / scale,
      y: (clientY - rect.top - pan.y) / scale,
    };
  }, [pan, scale, containerRef]);

  return { 
    pan, 
    setPan, 
    scale, 
    setScale, 
    adjustZoomCentered, 
    resetZoom, 
    getLogicalCoords 
  };
}