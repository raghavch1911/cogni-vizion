import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NeuralCardProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  variant?: 'default' | 'energy' | 'quantum' | 'hologram';
  className?: string;
  glowColor?: 'primary' | 'secondary' | 'accent';
}

export const NeuralCard: React.FC<NeuralCardProps> = ({
  title,
  description,
  icon,
  children,
  variant = 'default',
  className = '',
  glowColor = 'primary'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'energy':
        return 'glass-card hover:glow-primary neural-bg relative overflow-hidden group';
      case 'quantum':
        return 'glass-card transform-3d hover:rotate-y-12 transition-all duration-500 group';
      case 'hologram':
        return 'glass-card hologram relative overflow-hidden group';
      default:
        return 'glass-card hover-scale group';
    }
  };

  const getGlowClass = () => {
    switch (glowColor) {
      case 'secondary': return 'glow-secondary';
      case 'accent': return 'glow-accent';
      default: return 'glow-primary';
    }
  };

  return (
    <Card className={`${getVariantClasses()} ${className}`}>
      {/* Background effects for energy variant */}
      {variant === 'energy' && (
        <>
          <div className="morphing-bg absolute inset-0" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="neural-line absolute w-full"
              style={{
                top: `${25 + i * 25}%`,
                animationDelay: `${i * 0.7}s`
              }}
            />
          ))}
        </>
      )}
      
      {/* Quantum field for quantum variant */}
      {variant === 'quantum' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="particle animate-particle-flow"
              style={{
                left: `${i * 25}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: '6s'
              }}
            />
          ))}
        </div>
      )}

      <CardHeader className="relative z-10">
        {icon && (
          <div className={`w-12 h-12 rounded-xl bg-${glowColor}/10 flex items-center justify-center mb-4 group-hover:animate-neural-pulse group-hover:${getGlowClass()}`}>
            {icon}
          </div>
        )}
        {title && (
          <CardTitle className={`text-${glowColor} group-hover:animate-pulse-glow`}>
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription className="group-hover:text-muted-foreground/80 transition-colors">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      {children && (
        <CardContent className="relative z-10">
          {children}
        </CardContent>
      )}
      
      {/* Interactive glow effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-${glowColor}/5 via-transparent to-${glowColor}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
    </Card>
  );
};