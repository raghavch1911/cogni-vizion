import React from 'react';
import { Brain } from 'lucide-react';

interface QuantumLoaderProps {
  progress?: number;
  text?: string;
  className?: string;
}

export const QuantumLoader: React.FC<QuantumLoaderProps> = ({ 
  progress = 0, 
  text = 'Processing...', 
  className = '' 
}) => {
  return (
    <div className={`relative flex flex-col items-center space-y-6 ${className}`}>
      {/* Quantum Loading Ring */}
      <div className="relative w-32 h-32">
        {/* Outer ring with quantum particles */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-neural-pulse"
              style={{
                top: '50%',
                left: '50%',
                transform: `
                  translate(-50%, -50%) 
                  rotate(${i * 45}deg) 
                  translateY(-62px)
                `,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
        
        {/* Middle ring with morphing shape */}
        <div className="absolute inset-4 rounded-full border border-secondary/30 animate-morphing-glow" />
        
        {/* Inner core with brain icon */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 flex items-center justify-center backdrop-blur-sm">
          <Brain className="w-8 h-8 text-primary animate-neural-pulse" />
        </div>
        
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r="60"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeDasharray={`${progress * 3.77} 377`}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: 'drop-shadow(0 0 8px hsla(var(--primary), 0.6))'
            }}
          />
        </svg>
        
        {/* Holographic scan lines */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-data-stream" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/3 to-transparent animate-data-stream" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Progress percentage */}
      <div className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        {Math.round(progress)}%
      </div>

      {/* Status text */}
      <div className="text-lg text-muted-foreground font-medium text-center hologram">
        {text}
      </div>

      {/* Quantum field visualization */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full animate-particle-flow opacity-60"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + Math.sin(i) * 40}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '4s'
            }}
          />
        ))}
      </div>
    </div>
  );
};