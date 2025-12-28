import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Move, Eye, EyeOff, Settings, ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface Brain3DViewerProps {
  originalImage: string;
  heatmapImage?: string;
  detectedRegions?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    region: string;
  }>;
  className?: string;
}

export const Brain3DViewer: React.FC<Brain3DViewerProps> = ({
  originalImage,
  heatmapImage,
  detectedRegions = [],
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [zoom, setZoom] = useState(100);
  const [heatmapOpacity, setHeatmapOpacity] = useState(60);
  const [threshold, setThreshold] = useState(50);
  const [currentSlice, setCurrentSlice] = useState(1);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showSaliency, setShowSaliency] = useState(true);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  
  const totalSlices = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mriImg = new Image();
    mriImg.crossOrigin = 'anonymous';
    mriImg.src = originalImage;
    
    const heatmapImg = heatmapImage ? new Image() : null;
    if (heatmapImg) {
      heatmapImg.crossOrigin = 'anonymous';
      heatmapImg.src = heatmapImage;
    }

    const render = () => {
      const scale = zoom / 100;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2 + panOffset.x, -height / 2 + panOffset.y);

      // Draw MRI base with maximum clarity
      ctx.imageSmoothingEnabled = false; // Disable smoothing for crisp pixels
      ctx.drawImage(mriImg, 0, 0, width, height);

      // Draw heatmap overlay if enabled with optimal quality
      if (showHeatmap && heatmapImg && heatmapImg.complete) {
        ctx.globalAlpha = heatmapOpacity / 100;
        ctx.imageSmoothingEnabled = false; // Crisp heatmap overlay
        ctx.drawImage(heatmapImg, 0, 0, width, height);
        ctx.globalAlpha = 1;
      }

      // Draw saliency points (affected regions) if enabled
      if (showSaliency && detectedRegions.length > 0) {
        detectedRegions.forEach((region) => {
          if (region.confidence >= threshold / 100) {
            // Outer glow
            ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 * (region.confidence - threshold / 100)})`;
            ctx.lineWidth = 8;
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 15;
            ctx.strokeRect(region.x, region.y, region.width, region.height);
            
            // Inner border
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 5;
            ctx.strokeRect(region.x, region.y, region.width, region.height);
            
            // Center point
            ctx.fillStyle = '#ef4444';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(region.x + region.width / 2, region.y + region.height / 2, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      ctx.restore();
    };

    if (mriImg.complete) {
      if (!heatmapImg || heatmapImg.complete) {
        render();
      } else {
        heatmapImg.onload = render;
      }
    } else {
      mriImg.onload = () => {
        if (!heatmapImg || heatmapImg.complete) {
          render();
        } else {
          heatmapImg.onload = render;
        }
      };
    }
  }, [originalImage, heatmapImage, zoom, panOffset, heatmapOpacity, threshold, showHeatmap, showSaliency, detectedRegions, currentSlice]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -10 : 10;
    setZoom((prev) => Math.max(50, Math.min(300, prev + delta)));
  };

  const handleReset = () => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
    setHeatmapOpacity(60);
    setThreshold(50);
    setCurrentSlice(1);
  };

  return (
    <div className={`${className}`}>
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          3D Brain Analysis
        </h2>
        <p className="text-muted-foreground text-sm">
          Advanced visualization with Alzheimer's detection highlights
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_400px] gap-6">
        {/* Main Canvas Area - Larger and more prominent */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-background via-background to-primary/5 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={1400}
            height={1400}
            className="w-full h-auto cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* View Controls */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-card via-card/95 to-card/90 border border-card-border backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              View Controls
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
                className="h-14"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setZoom((prev) => Math.min(300, prev + 10))}
                className="h-14"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="h-14"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14"
                onMouseDown={(e) => {
                  setIsPanning(true);
                  setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
                }}
              >
                <Move className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-sm font-bold text-primary">{zoom}%</span>
              </div>
            </div>
          </div>

          {/* Overlay Settings */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-card via-card/95 to-card/90 border border-card-border backdrop-blur-sm space-y-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Overlay Settings
            </h3>
            
            {/* Heatmap Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Heatmap Overlay</span>
              <Switch
                checked={showHeatmap}
                onCheckedChange={setShowHeatmap}
              />
            </div>

            {/* Opacity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Opacity</span>
                <span className="text-sm font-bold text-primary">{heatmapOpacity}%</span>
              </div>
              <Slider
                value={[heatmapOpacity]}
                onValueChange={(values) => setHeatmapOpacity(values[0])}
                min={0}
                max={100}
                step={5}
                className="w-full"
                disabled={!showHeatmap}
              />
            </div>

            {/* Threshold Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Threshold</span>
                <span className="text-sm font-bold text-secondary">{threshold}%</span>
              </div>
              <Slider
                value={[threshold]}
                onValueChange={(values) => setThreshold(values[0])}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Saliency Points Toggle */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">Saliency Points</span>
              <Switch
                checked={showSaliency}
                onCheckedChange={setShowSaliency}
              />
            </div>
          </div>

          {/* Slice Navigation */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-card via-card/95 to-card/90 border border-card-border backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Slice Navigation
            </h3>
            
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentSlice(1)}
                disabled={currentSlice === 1}
                className="h-10 w-10"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentSlice((prev) => Math.max(1, prev - 1))}
                disabled={currentSlice === 1}
                className="h-10 w-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentSlice((prev) => Math.min(totalSlices, prev + 1))}
                disabled={currentSlice === totalSlices}
                className="h-10 w-10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentSlice(totalSlices)}
                disabled={currentSlice === totalSlices}
                className="h-10 w-10"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Slider
                value={[currentSlice]}
                onValueChange={(values) => setCurrentSlice(values[0])}
                min={1}
                max={totalSlices}
                step={1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Slice {currentSlice}</span>
                <span className="text-muted-foreground">of {totalSlices}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Tip:</strong> Scroll to zoom • Shift+Drag to pan • Use sliders to adjust visualization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};