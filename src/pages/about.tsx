import React from 'react';
import { Brain, Zap, Database, Award, Users, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NeuralBackground } from '@/components/neural-background';

export const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen pt-24">
      <NeuralBackground />
      
      <div className="relative z-20 container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <Brain className="w-16 h-16 mx-auto text-primary mb-4 animate-float" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About Smart Alzheimer Detection
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A Novel Hybrid Deep Learning Approach for Early Diagnosis of Alzheimer's Disease Using MRI Data
            </p>
          </div>

          {/* Research Overview */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Research Overview</CardTitle>
              <CardDescription>
                Combining CNN, Attention, and BiLSTM for accurate and interpretable Alzheimer’s MRI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Smart Alzheimer Detection system introduces a lightweight hybrid deep learning model designed to detect early stages of Alzheimer’s disease from MRI scans.
                The architecture combines Convolutional Neural Networks (CNN) for spatial feature extraction, an Attention module to focus on key brain regions,
                and a Bidirectional LSTM (BiLSTM) to capture sequential dependencies between feature maps.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The model was trained on a curated subset of the ADNI (Alzheimer’s Disease Neuroimaging Initiative) dataset,
                covering four classes — Non-Demented, Very Mild, Mild, and Moderate Demented — using balanced preprocessed MRI images (128×128 grayscale).
                Techniques like normalization, augmentation, and dropout were applied to improve generalization.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Experimental results demonstrate strong performance with an overall accuracy of 98%, precision of 95%, recall of 92%, and F1-score of 94%,
                outperforming baseline CNN-only models while maintaining efficiency suitable for clinical integration.
              </p>
            </CardContent>
          </Card>

          {/* Technical Architecture */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-primary" />
                  <span>Proposed CNN + Attention + BiLSTM Architecture</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">CNN Layers</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Extracts spatial features from MRI slices</li>
                    <li>• Uses Conv2D + MaxPooling for dimensional reduction</li>
                    <li>• Includes Batch Normalization for stable training</li>
                    <li>• Employs Dropout for regularization</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-secondary">Attention Module</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Highlights significant brain regions (hippocampus, cortex)</li>
                    <li>• Learns spatial importance dynamically</li>
                    <li>• Improves interpretability for clinical analysis</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-accent">BiLSTM Component</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Captures sequential dependencies across feature maps</li>
                    <li>• Models temporal changes in brain structure</li>
                    <li>• Supports bidirectional learning for robust prediction</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-6 h-6 text-secondary" />
                  <span>Training and Evaluation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Dataset Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-primary/10">
                      <div className="text-2xl font-bold text-primary">200</div>
                      <div className="text-xs text-muted-foreground">MRI Images</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/10">
                      <div className="text-2xl font-bold text-secondary">4</div>
                      <div className="text-xs text-muted-foreground">Classes</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-accent/10">
                      <div className="text-2xl font-bold text-accent">128×128</div>
                      <div className="text-xs text-muted-foreground">Image Size</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-success/10">
                      <div className="text-2xl font-bold text-success">98%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Evaluation Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Precision</span>
                      <Badge variant="outline">95%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Recall</span>
                      <Badge variant="outline">92%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">F1-Score</span>
                      <Badge variant="outline">94%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Overall Accuracy</span>
                      <Badge variant="outline">98%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clinical Insights */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-accent" />
                <span>Clinical Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Early Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    Detects cognitive decline at very mild stages — before visible clinical symptoms.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-secondary" />
                  </div>
                  <h4 className="font-semibold mb-2">Fast Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    Predicts Alzheimer’s stage in under 2 seconds using optimized TensorFlow model.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">Clinical Utility</h4>
                  <p className="text-sm text-muted-foreground">
                    Supports radiologists with explainable attention heatmaps for diagnosis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
