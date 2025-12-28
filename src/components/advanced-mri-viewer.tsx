import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ZoomIn, ZoomOut, RotateCw, Download, Eye, EyeOff, 
  Settings, Brain, Activity, Target, Layers, Move, 
  SkipBack, SkipForward, Play, Pause 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SaliencyPoint {
  coordinates: [number, number];
  saliency_score: number;
  region: string;
  activation_strength: string;
  confidence: number;
}

interface AdvancedMRIViewerProps {
  originalSrc: string;
  heatmapSrc?: string;
  saliencyData?: Record<string, SaliencyPoint>;
  predictionData?: any;
  className?: string;
  alt?: string;
}

export const AdvancedMRIViewer: React.FC<AdvancedMRIViewerProps> = ({
  originalSrc,
  heatmapSrc,
  saliencyData = {},
  predictionData = {},
  className = "",
  alt = "MRI Brain Scan"
}) => {
  // View state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Overlay controls
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState([0.6]);
  const [threshold, setThreshold] = useState([0.5]);
  const [currentSlice, setCurrentSlice] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Interactive state
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showSaliencyPoints, setShowSaliencyPoints] = useState(true);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play slice navigation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlice(prev => (prev + 1) % 20); // Simulate 20 slices
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.3));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !imageRef.current) return;

    canvas.width = imageRef.current.naturalWidth;
    canvas.height = imageRef.current.naturalHeight;
    ctx.drawImage(imageRef.current, 0, 0);
    
    const link = document.createElement('a');
    link.download = `mri-analysis-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    // Check for heatmap hover points
    if (imageRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * imageRef.current.naturalWidth;
      const y = ((e.clientY - rect.top) / rect.height) * imageRef.current.naturalHeight;
      
      // Find nearby saliency points
      let nearestPoint = null;
      let minDistance = Infinity;
      
      Object.entries(saliencyData).forEach(([key, point]) => {
        const distance = Math.sqrt(
          Math.pow(x - point.coordinates[0], 2) + 
          Math.pow(y - point.coordinates[1], 2)
        );
        if (distance < 30 && distance < minDistance) {
          minDistance = distance;
          nearestPoint = key;
        }
      });
      
      setHoveredPoint(nearestPoint);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getSaliencyColor = (score: number) => {
    if (score > 0.8) return 'bg-red-500';
    if (score > 0.6) return 'bg-orange-500';
    if (score > 0.4) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const ViewerContent = () => (
    <div className="relative w-full h-full overflow-hidden rounded-lg bg-black">
      <div 
        ref={containerRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Main MRI Image */}
        <img
          ref={imageRef}
          src={originalSrc}
          alt={alt}
          className="w-full h-full object-contain transition-transform duration-200"
          style={{
            transform: `
              translate(${position.x}px, ${position.y}px) 
              scale(${zoom}) 
              rotate(${rotation}deg)
            `,
            filter: 'contrast(1.1) brightness(1.05)'
          }}
          draggable={false}
        />
        
        {/* Heatmap Overlay */}
        {showHeatmap && heatmapSrc && (
          <img
            src={heatmapSrc}
            alt="AI Detection Heatmap"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{
              opacity: heatmapOpacity[0],
              transform: `
                translate(${position.x}px, ${position.y}px) 
                scale(${zoom}) 
                rotate(${rotation}deg)
              `,
              mixBlendMode: 'screen',
              filter: `brightness(${1 + threshold[0]}) saturate(1.5)`
            }}
          />
        )}

        {/* Saliency Points */}
        {showSaliencyPoints && Object.entries(saliencyData).map(([key, point]) => {
          const [x, y] = point.coordinates;
          const shouldShow = point.saliency_score >= threshold[0];
          
          if (!shouldShow) return null;
          
          return (
            <div
              key={key}
              className={cn(
                "absolute w-3 h-3 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
                getSaliencyColor(point.saliency_score),
                hoveredPoint === key ? "scale-150 z-50" : "scale-100"
              )}
              style={{
                left: `${(x / (imageRef.current?.naturalWidth || 1)) * 100}%`,
                top: `${(y / (imageRef.current?.naturalHeight || 1)) * 100}%`,
                transform: `
                  translate(-50%, -50%) 
                  translate(${position.x}px, ${position.y}px) 
                  scale(${zoom * (hoveredPoint === key ? 1.5 : 1)}) 
                  rotate(${rotation}deg)
                `
              }}
            />
          );
        })}

        {/* Slice Navigation Indicator */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white">
          <div className="flex items-center space-x-2 text-sm">
            <Layers className="w-4 h-4" />
            <span>Slice {currentSlice + 1}/20</span>
          </div>
        </div>

        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white text-sm">
          {(zoom * 100).toFixed(0)}%
        </div>

        {/* Interactive Tooltip */}
        {hoveredPoint && saliencyData[hoveredPoint] && (
          <div
            className="absolute z-50 bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg border border-primary/30 shadow-2xl max-w-xs"
            style={{
              left: mousePos.x + 15,
              top: mousePos.y - 10,
              pointerEvents: 'none'
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-primary">{saliencyData[hoveredPoint].region}</h4>
                <Badge variant="outline" className="text-xs">
                  {saliencyData[hoveredPoint].activation_strength}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Coordinates:</span>
                  <span className="text-blue-300">
                    ({saliencyData[hoveredPoint].coordinates[0]}, {saliencyData[hoveredPoint].coordinates[1]})
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Saliency Score:</span>
                  <span className={getStrengthColor(saliencyData[hoveredPoint].activation_strength)}>
                    {(saliencyData[hoveredPoint].saliency_score * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="text-green-300">
                    {(saliencyData[hoveredPoint].confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <Separator className="my-2" />
              
              <p className="text-xs text-gray-300">
                This region shows {saliencyData[hoveredPoint].activation_strength.toLowerCase()} activation 
                patterns consistent with Alzheimer's pathology.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const ControlPanel = () => (
    <Card className="glass-card h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Settings className="w-5 h-5 text-primary" />
          <span>Analysis Controls</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* View Controls */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            View Controls
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 5}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom In</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.3}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom Out</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleRotate}>
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rotate 90°</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <Move className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Separator />

        {/* Overlay Controls */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Overlay Settings
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Heatmap Overlay</span>
              <Button
                variant={showHeatmap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                {showHeatmap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>

            {showHeatmap && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Opacity</span>
                    <span className="text-primary">{Math.round(heatmapOpacity[0] * 100)}%</span>
                  </div>
                  <Slider
                    value={heatmapOpacity}
                    onValueChange={setHeatmapOpacity}
                    max={1}
                    min={0}
                    step={0.05}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Threshold</span>
                    <span className="text-primary">{Math.round(threshold[0] * 100)}%</span>
                  </div>
                  <Slider
                    value={threshold}
                    onValueChange={setThreshold}
                    max={1}
                    min={0}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm">Saliency Points</span>
              <Button
                variant={showSaliencyPoints ? "default" : "outline"}
                size="sm"
                onClick={() => setShowSaliencyPoints(!showSaliencyPoints)}
              >
                <Target className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Slice Navigation */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Slice Navigation
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSlice(Math.max(0, currentSlice - 1))}
                disabled={currentSlice === 0}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                variant={isPlaying ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSlice(Math.min(19, currentSlice + 1))}
                disabled={currentSlice === 19}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Progress value={(currentSlice / 19) * 100} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slice {currentSlice + 1}</span>
                <span>of 20</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Export */}
        <div className="space-y-2">
          <Button onClick={handleDownload} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex">
        {/* Main Viewer */}
        <div className="flex-1 relative">
          <ViewerContent />
          
          {/* Fullscreen Controls */}
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <Button variant="secondary" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsFullscreen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Side Panel */}
        <div className="w-80 border-l border-border bg-background/95 backdrop-blur-sm">
          <ControlPanel />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid lg:grid-cols-3 gap-6", className)}>
      {/* Main Viewer */}
      <div className="lg:col-span-2 space-y-4">
        <div 
          className="aspect-square bg-black rounded-lg overflow-hidden border border-border cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        >
          <ViewerContent />
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-card/50 p-3 rounded-lg">
          <span>Click to enter fullscreen mode</span>
          <div className="flex items-center space-x-4">
            <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
            <span>Rotation: {rotation}°</span>
          </div>
        </div>
      </div>
      
      {/* Control Panel */}
      <div>
        <ControlPanel />
      </div>
    </div>
  );
};