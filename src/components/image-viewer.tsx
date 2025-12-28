import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageViewerProps {
  src: string;
  alt: string;
  className?: string;
  showHeatmapOverlay?: boolean;
  heatmapSrc?: string;
  onHoverReveal?: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt,
  className = "",
  showHeatmapOverlay = false,
  heatmapSrc,
  onHoverReveal = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showOverlay, setShowOverlay] = useState(!onHoverReveal);
  const [isHovered, setIsHovered] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `mri-scan-${Date.now()}.png`;
    link.click();
  };

  const openFullscreen = () => setIsFullscreen(true);
  const closeFullscreen = () => {
    setIsFullscreen(false);
    handleReset();
  };

  const ImageContent = () => (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={openFullscreen}
    >
      <div 
        className="relative overflow-hidden rounded-lg border border-card-border transition-all duration-500 hover:border-primary/50"
        style={{
          transform: `scale(${isHovered && !isFullscreen ? 1.02 : 1})`,
        }}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto transition-all duration-500 ${className}`}
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            filter: isHovered ? 'brightness(1.1) contrast(1.05)' : 'none'
          }}
        />
        
        {/* Heatmap Overlay - Red Highlighting for Affected Areas */}
        {showHeatmapOverlay && heatmapSrc && (
          <img
            src={heatmapSrc}
            alt="AI Detection Overlay - Affected Areas in Red"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{
              opacity: onHoverReveal ? (isHovered ? 0.8 : 0.3) : (showOverlay ? 0.7 : 0),
              transform: `rotate(${rotation}deg) scale(${zoom})`,
              filter: 'hue-rotate(0deg) saturate(1.5) brightness(1.2)',
              mixBlendMode: 'screen'
            }}
          />
        )}
        
        {/* Hover Overlay Controls */}
        {isHovered && !isFullscreen && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
        
        {/* Scanning Effect */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center">
        <div className="relative max-w-7xl max-h-screen p-4">
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
            <Button variant="secondary" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleRotate}>
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
            {showHeatmapOverlay && (
              <Button 
                variant={showOverlay ? "default" : "secondary"} 
                size="sm" 
                onClick={() => setShowOverlay(!showOverlay)}
              >
                Overlay
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={closeFullscreen}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Image */}
          <div className="flex items-center justify-center h-full overflow-hidden">
            <div className="relative">
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom})`,
                  transition: 'transform 0.3s ease'
                }}
              />
              
              {showHeatmapOverlay && heatmapSrc && showOverlay && (
                <img
                  src={heatmapSrc}
                  alt="AI Detection Overlay - Affected Areas in Red"
                  className="absolute inset-0 w-full h-full object-contain opacity-70"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                    transition: 'transform 0.3s ease',
                    filter: 'hue-rotate(0deg) saturate(1.5) brightness(1.2)',
                    mixBlendMode: 'screen'
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Info */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
            <p className="text-sm font-medium">{alt}</p>
            <p className="text-xs text-white/70">Zoom: {Math.round(zoom * 100)}% | Rotation: {rotation}°</p>
          </div>
        </div>
      </div>
    );
  }

  return <ImageContent />;
};