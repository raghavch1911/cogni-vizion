import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Upload, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-card-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo + Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Brain className="w-8 h-8 text-primary group-hover:animate-neural-pulse" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Smart Alzheimer Detection
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Hybrid CNN + Attention + BiLSTM Model
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/" className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </Button>

            <Button
              variant={isActive('/upload') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/upload" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </Link>
            </Button>

            <Button
              variant={isActive('/about') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/about" className="flex items-center space-x-2">
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
