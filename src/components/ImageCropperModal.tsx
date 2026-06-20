import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Crop, ZoomIn, ZoomOut, Check, X, RotateCw, RefreshCw, Maximize2, Move } from "lucide-react";

interface ImageCropperModalProps {
  isOpen: boolean;
  src: string;
  onClose: () => void;
  onCropComplete: (base64: string) => void;
  title?: string;
  aspectPreset?: "1:1" | "16:9" | "4:3" | "free";
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  src,
  onClose,
  onCropComplete,
  title = "Adjust & Crop Aspect Metrics",
  aspectPreset = "1:1"
}) => {
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [aspect, setAspect] = useState<"1:1" | "16:9" | "4:3" | "free">(aspectPreset);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Screen layout size tracking
  const [dispW, setDispW] = useState<number>(300);
  const [dispH, setDispH] = useState<number>(200);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset controls if source image changes
  useEffect(() => {
    if (src) {
      setZoom(1.0);
      setPan({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [src]);

  if (!isOpen || !src) return null;

  // Let's declare the standard cropping window bounding box sizes
  // relative to our 480x300 container
  let cropW = 240;
  let cropH = 240;

  if (aspect === "16:9") {
    cropW = 340;
    cropH = 191;
  } else if (aspect === "4:3") {
    cropW = 280;
    cropH = 210;
  } else if (aspect === "free") {
    cropW = 340;
    cropH = 240;
  }

  // Handle image load metrics
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const naturalW = img.naturalWidth || 800;
    const naturalH = img.naturalHeight || 600;

    // Center layout calculations
    const containerW = 460;
    const containerH = 290;

    const scaleX = containerW / naturalW;
    const scaleY = containerH / naturalH;
    const optimalScale = Math.min(scaleX, scaleY, 1.0) || 0.5;

    setDispW(naturalW * optimalScale);
    setDispH(naturalH * optimalScale);
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Mouse / Touch drag to pan image
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX - pan.x, y: clientY - pan.y };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPan({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Rotation triggers
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Perform canvas cropping using the geometric projections
  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    // Dynamic extraction of actual image parameters
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    // Create an off-screen canvas to render cropped dimensions
    const canvas = document.createElement("canvas");
    canvas.width = cropW * 2; // Extra physical resolution multiplier for premium crispness
    canvas.height = cropH * 2;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Fill background with black or transparent
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Center of canvas
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;

    ctx.save();
    // Move to canvas center to support translation & rotative shifts
    ctx.translate(canvasCenterX, canvasCenterY);
    
    // Rotate 
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }

    // Mathematical projections: 
    // Find the scale representation relative to original image size
    const screenToNaturalScale = naturalW / dispW;
    const appliedZoom = zoom;

    // Scaling factor map
    const finalScaleX = (2 / screenToNaturalScale) * appliedZoom;
    const finalScaleY = (2 / screenToNaturalScale) * appliedZoom;

    // Center shifts inside our mock layout
    const layoutContainerW = 480;
    const layoutContainerH = 300;

    const screenCenterX = layoutContainerW / 2;
    const screenCenterY = layoutContainerH / 2;

    const cropBoxX = (layoutContainerW - cropW) / 2;
    const cropBoxY = (layoutContainerH - cropH) / 2;

    // Offset of image center relative to crop box center in screen pixels
    const relativeImageCenterX = (screenCenterX + pan.x) - (cropBoxX + cropW / 2);
    const relativeImageCenterY = (screenCenterY + pan.y) - (cropBoxY + cropH / 2);

    // Dynamic translate coordinates mapping screen offset to canvas size
    const finalTx = relativeImageCenterX * 2;
    const finalTy = relativeImageCenterY * 2;

    ctx.translate(finalTx, finalTy);

    // Draw the image centered around the computed projection point
    ctx.drawImage(
      img,
      -naturalW / screenToNaturalScale,
      -naturalH / screenToNaturalScale,
      (naturalW * 2) / screenToNaturalScale,
      (naturalH * 2) / screenToNaturalScale
    );

    ctx.restore();

    try {
      // Export at high quality level configuration
      const base64Crop = canvas.toDataURL("image/jpeg", 0.95);
      onCropComplete(base64Crop);
      onClose();
    } catch (err) {
      console.error("Canvas crop conversion failed:", err);
      // Fallback
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md">
        {/* Modal Window backpanel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="w-full max-w-2xl bg-neutral-900 border border-neutral-850 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header toolbar */}
          <div className="px-6 py-4 border-b border-neutral-850/60 flex items-center justify-between bg-neutral-950/30">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                <Crop className="w-4 h-4" />
              </span>
              <h3 className="font-sans font-bold text-neutral-100 text-sm tracking-tight">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-450 hover:text-white hover:bg-neutral-850 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Workspace Body */}
          <div className="p-6 md:p-8 space-y-6 flex-1">
            <div className="grid md:grid-cols-12 gap-6 items-center">
              
              {/* Interactive Cropper Panel (Col-7) */}
              <div className="md:col-span-8 flex flex-col items-center select-none">
                {/* Crop container viewport bounds */}
                <div
                  ref={containerRef}
                  onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                  onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    handleDragStart(touch.clientX, touch.clientY);
                  }}
                  onTouchMove={(e) => {
                    const touch = e.touches[0];
                    handleDragMove(touch.clientX, touch.clientY);
                  }}
                  onTouchEnd={handleDragEnd}
                  style={{ width: "480px", height: "300px" }}
                  className="relative overflow-hidden bg-neutral-950 rounded-2xl border border-neutral-800 flex items-center justify-center cursor-move shadow-inner max-w-full"
                >
                  {/* Dynamic Img layer inside viewport with layout metrics applied */}
                  <img
                    ref={imageRef}
                    src={src}
                    alt="Original raw"
                    onLoad={handleImageLoad}
                    draggable={false}
                    style={{
                      width: `${dispW}px`,
                      height: `${dispH}px`,
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                      transition: isDragging ? "none" : "transform 0.15s ease-out",
                      transformOrigin: "center center"
                    }}
                    className="max-w-none shadow-md pointer-events-none select-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Dark Shadow Mask Layer overlay */}
                  <div className="absolute inset-0 bg-neutral-950/60 pointer-events-none mix-blend-multiply" />

                  {/* Centered Transparent Focus Cutout Window */}
                  <div
                    style={{
                      width: `${cropW}px`,
                      height: `${cropH}px`,
                      boxShadow: "0 0 0 999px rgba(10, 10, 10, 0.7)"
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-orange-500 rounded bg-transparent pointer-events-none transition-all duration-300 shadow-lg"
                  >
                    {/* Corner Guides */}
                    <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-orange-400" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-orange-400" />
                    <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-orange-400" />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-orange-400" />
                    
                    {/* Human guide line overlays (Rule of Thirds grid) */}
                    <span className="absolute top-1/3 left-0 right-0 h-[1px] border-b border-orange-500/10 pointer-events-none" />
                    <span className="absolute top-2/3 left-0 right-0 h-[1px] border-b border-orange-500/10 pointer-events-none" />
                    <span className="absolute left-1/3 top-0 bottom-0 w-[1px] border-r border-orange-500/10 pointer-events-none" />
                    <span className="absolute left-2/3 top-0 bottom-0 w-[1px] border-r border-orange-500/10 pointer-events-none" />
                  </div>

                  {/* Subtle drag prompt helper badge */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-neutral-900/90 backdrop-blur rounded-full text-[9px] font-mono text-neutral-400 tracking-wider flex items-center gap-1.5 pointer-events-none border border-neutral-800">
                    <Move className="w-3 h-3 text-orange-500" />
                    <span>drag image to position</span>
                  </div>
                </div>
              </div>

              {/* Side Adjustment Controls Panel (Col-4) */}
              <div className="md:col-span-4 space-y-5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 block font-bold">Crop Target Ratio</span>
                
                {/* Target Ratio Presets */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "1:1", label: "Square (1:1)" },
                    { id: "16:9", label: "Widescreen (16:9)" },
                    { id: "4:3", label: "Classic (4:3)" },
                    { id: "free", label: "Custom (Free)" }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAspect(preset.id as any)}
                      className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer font-mono text-[10.5px] font-semibold ${
                        aspect === preset.id
                          ? "bg-orange-500/10 border-orange-500/50 text-orange-400"
                          : "bg-neutral-950 border-neutral-905 hover:border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Fine Zoom Adjuster Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-420">
                    <span className="flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5 text-neutral-550" />
                      Scale Magnification
                    </span>
                    <span className="text-orange-400 font-bold">{Math.round(zoom * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(1.0, z - 0.1))}
                      className="p-1.5 bg-neutral-950 border border-neutral-905 rounded-lg hover:text-orange-455 transition-colors text-neutral-420 cursor-pointer"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="range"
                      min="1.0"
                      max="3.0"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-orange-500 h-1 bg-neutral-950 rounded-lg cursor-pointer appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(3.0, z + 0.1))}
                      className="p-1.5 bg-neutral-950 border border-neutral-905 rounded-lg hover:text-orange-455 transition-colors text-neutral-420 cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Additional Quick-Tools (Rotation & Re-zero) */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 block font-bold">Geometric Rotation</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleRotate}
                      className="flex-1 py-2 px-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-905 hover:border-neutral-800 text-neutral-300 rounded-xl font-mono text-[10.5px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                      <span>Rotate (+90°)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1.0);
                        setPan({ x: 0, y: 0 });
                        setRotation(0);
                      }}
                      className="py-2 px-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-905 text-neutral-400 hover:text-white rounded-xl font-mono text-[10.5px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Reset Position"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Action Toolbar section */}
          <div className="px-6 py-5 bg-neutral-950/50 border-t border-neutral-850/60 flex items-center justify-between gap-4">
            <span className="text-[10.5px] font-mono text-neutral-510 hidden sm:block">
              // Output rendered with premium anti-aliased viewport sampling.
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial py-2.5 px-5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-905 font-mono text-[10.5px] uppercase tracking-wider text-neutral-400 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                className="flex-1 sm:flex-initial py-2.5 px-5 bg-orange-500 hover:bg-orange-600 font-mono text-[10.5px] uppercase tracking-wider text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/10"
              >
                <Check className="w-4 h-4 text-neutral-950" />
                <span>Finalize & Apply Crop</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
