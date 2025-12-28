import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Upload, Zap, Shield, BarChart3, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NeuralBackground } from '@/components/neural-background';

export const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <NeuralBackground />

      {/* Hero Section */}
      <section className="relative z-20 pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="relative inline-block mb-6">
              <Brain className="w-20 h-20 mx-auto text-primary animate-float" />
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Smart Alzheimer Detection
            </h1>

            <h2 className="text-lg md:text-2xl text-foreground mb-6 font-bold">
              A Hybrid Deep Learning Model Using
            </h2>
            <h3 className="text-xl md:text-3xl font-bold text-primary mb-12">
              CNN + Attention + BiLSTM for Early Diagnosis
            </h3>

            <p className="text-base text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Leveraging advanced neural architectures to analyze MRI scans with near-human precision,
              enabling early detection of Alzheimer’s disease — years before visible clinical symptoms appear.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="energy" size="lg" asChild className="hover:glow-primary">
                <Link to="/upload" className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 animate-neural-pulse" />
                  <span>Upload MRI Scan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button variant="energy" size="lg" asChild className="hover:glow-primary">
                <Link to="/about" className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Learn More</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-20 py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced AI-Powered Neuro Analysis
            </h2>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto font-medium">
              Combining Convolutional Neural Networks, Attention, and BiLSTM for accurate MRI-based Alzheimer’s detection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="glass-card hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-primary">Hybrid Deep Learning</CardTitle>
                <CardDescription>
                  CNN + Attention + BiLSTM for spatial, temporal, and contextual learning.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The CNN extracts structural brain features, the Attention module focuses on critical regions,
                  and the BiLSTM models sequential dependencies to enhance stage classification accuracy.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="glass-card hover:border-secondary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-secondary">High Performance</CardTitle>
                <CardDescription>
                  98% accuracy, 95% precision, 92% recall, 94% F1-score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The model achieves superior results on the ADNI MRI dataset,
                  outperforming traditional CNNs while maintaining lightweight computational design.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="glass-card hover:border-accent/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-accent">Explainable AI Insights</CardTitle>
                <CardDescription>
                  Visual interpretation with attention maps for transparent diagnosis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The integrated attention mechanism highlights important brain regions such as the hippocampus
                  and temporal lobes, enhancing interpretability and clinical trust.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-20 py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="glass-card max-w-4xl mx-auto p-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Begin the Diagnosis Process
            </h2>
            <p className="text-base text-muted-foreground mb-10 max-w-3xl mx-auto font-medium">
              Upload MRI images to analyze the probability of Alzheimer's across four classes —
              Non-Demented, Very Mild, Mild, and Moderate — powered by deep learning.
            </p>
            <Button variant="energy" size="lg" asChild className="hover:glow-primary">
              <Link to="/upload" className="flex items-center space-x-2">
                <Upload className="w-5 h-5 animate-neural-pulse" />
                <span>Upload and Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
