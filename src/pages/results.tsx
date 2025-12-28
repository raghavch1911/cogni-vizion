import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Brain as BrainIcon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NeuralBackground } from '@/components/neural-background';

interface RecommendationItem {
  title: string;
  description: string;
}

interface RecommendationSection {
  category: string;
  items: RecommendationItem[];
}

const Results = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : `${window.location.protocol}//${window.location.hostname}:5000`;

  // Expanded pools with 12 recommendations each
  const physicalMentalPool: RecommendationItem[] = [
    { title: 'Brain Exercises', description: 'Daily puzzles, Sudoku, and memory games to enhance cognition.' },
    { title: 'Meditation', description: 'Practice mindfulness meditation to reduce stress and support brain health.' },
    { title: 'Yoga', description: 'Engage in gentle yoga sessions to improve balance, focus, and mental clarity.' },
    { title: 'Social Interaction', description: 'Participate in group activities or conversations to keep your mind active.' },
    { title: 'Learning New Skills', description: 'Take up new hobbies or skills to stimulate brain plasticity.' },
    { title: 'Reading', description: 'Read books, articles, or educational content daily to challenge cognitive functions.' },
    { title: 'Art & Creativity', description: 'Draw, paint, or create crafts to stimulate visual and motor areas.' },
    { title: 'Music Therapy', description: 'Listen to music or play an instrument to enhance mood and cognition.' },
    { title: 'Walking Outdoors', description: 'Daily walks in nature help memory and overall well-being.' },
    { title: 'Memory Journaling', description: 'Keep a journal to improve memory recall and organization.' },
    { title: 'Mindful Breathing', description: 'Practice deep breathing exercises to maintain focus and reduce stress.' },
    { title: 'Cognitive Games', description: 'Play apps or games designed to stimulate memory and reasoning.' },
  ];

  const treatmentPool: RecommendationItem[] = [
    { title: 'Balanced Diet', description: 'Maintain a diet rich in antioxidants, omega-3 fatty acids, and vitamins.' },
    { title: 'Regular Exercise', description: 'Engage in light cardio 3-4 times a week to improve blood flow to the brain.' },
    { title: 'Sleep Hygiene', description: 'Ensure 7-8 hours of quality sleep each night to support memory consolidation.' },
    { title: 'Hydration', description: 'Drink enough water daily to maintain optimal brain function.' },
    { title: 'Stress Management', description: 'Practice relaxation techniques like deep breathing or journaling.' },
    { title: 'Cognitive Therapy', description: 'Consider professional cognitive training programs for early intervention.' },
    { title: 'Vitamin Supplements', description: 'Consider vitamin D, B12, or omega-3 supplements after consulting a doctor.' },
    { title: 'Social Engagement', description: 'Maintain strong social connections to reduce cognitive decline risk.' },
    { title: 'Routine Health Checkups', description: 'Regularly monitor blood pressure, cholesterol, and sugar levels.' },
    { title: 'Mindful Breathing', description: 'Short daily breathing exercises to lower stress and boost focus.' },
    { title: 'Music & Art Therapy', description: 'Use creative therapies to reduce anxiety and improve cognition.' },
    { title: 'Cognitive Challenges', description: 'Engage in learning or problem-solving activities daily.' },
  ];

  // Function to randomly pick `count` items from a pool
  const getRandomRecommendations = (pool: RecommendationItem[], count: number): RecommendationItem[] => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const resultId = searchParams.get('id');
    if (!resultId) {
      setError('No result ID provided');
      return;
    }

    setResults(null);

    const storedResults = sessionStorage.getItem('analysisResults');
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        const metrics = parsed.metrics || parsed.evaluation || {};
        const toNum = (v: any) => (v === null || v === undefined || isNaN(Number(v)) ? null : Number(v));

        // Dynamically generate 6-8 recommendations per category
        const dynamicRecommendations: RecommendationSection[] = [
          { category: 'Physical & Mental Activities', items: getRandomRecommendations(physicalMentalPool, 6) },
          { category: 'Treatment Suggestions', items: getRandomRecommendations(treatmentPool, 6) },
        ];

        const formatted = {
          predicted_class: parsed.prediction || parsed.predicted_class,
          description: parsed.prediction_description || '',
          original_image: parsed.original_image
            ? parsed.original_image.startsWith('http')
              ? parsed.original_image
              : `${API_BASE}${parsed.original_image}`
            : null,
          gradcam_image: parsed.highlighted_image
            ? parsed.highlighted_image.startsWith('http')
              ? parsed.highlighted_image
              : `${API_BASE}${parsed.highlighted_image}`
            : null,
          accuracy: toNum(parsed.accuracy || metrics.accuracy),
          precision: toNum(parsed.precision || metrics.precision),
          recall: toNum(parsed.recall || metrics.sensitivity || parsed.tpr || metrics.recall),
          f1_score: toNum(parsed.f1_score || parsed.f1 || metrics.f1_score),
          clinical_recommendations: dynamicRecommendations,
        };

        setResults(formatted);
      } catch (err) {
        console.error('Error parsing stored results:', err);
        setError('Error loading analysis results');
      }
    } else {
      setError('No analysis data found');
    }
  }, [searchParams]);

  return (
    <div className="relative min-h-screen pt-20">
      <NeuralBackground />
      <div className="relative z-20 container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {error && (
            <Card className="glass-card border-destructive/30">
              <CardContent className="pt-8">
                <div className="text-center space-y-4">
                  <p className="text-destructive font-medium">{error}</p>
                  <Button asChild variant="outline">
                    <Link to="/upload">
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back to Upload
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {results && (
            <>
              {/* Header */}
              <div className="text-center space-y-4">
                <Badge className="text-xl px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/40">
                  {results.predicted_class || 'Analysis'}
                </Badge>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Analysis Results
                </h1>
                {results.description && (
                  <p className="text-muted-foreground text-lg">{results.description}</p>
                )}
              </div>

              {/* MRI Section */}
              <Card className="glass-card p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-center">Original MRI</h2>
                    <div className="relative rounded-xl overflow-hidden border-2 border-card-border shadow-2xl bg-black/20">
                      {results.original_image ? (
                        <img
                          src={results.original_image}
                          alt="Original MRI"
                          className="w-full h-auto object-contain"
                          style={{ minHeight: '400px' }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                          Original image not available
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-center">Analyzed MRI</h2>
                    <div className="relative rounded-xl overflow-hidden border-2 border-destructive/50 shadow-2xl bg-black/20">
                      {results.gradcam_image ? (
                        <>
                          <img
                            src={results.gradcam_image}
                            alt="Analyzed MRI with Heatmap"
                            className="w-full h-auto object-contain"
                            style={{ minHeight: '400px' }}
                          />
                          <div className="absolute top-4 right-4 bg-destructive/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-white">
                            Affected Areas
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                          Analyzed image not available
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-8 flex flex-wrap justify-center gap-6">
                  {[
                    { label: 'Accuracy', value: results.accuracy, color: 'text-primary', bg: 'from-primary/10 to-primary/20', border: 'border-primary/30' },
                    { label: 'Precision', value: results.precision, color: 'text-secondary', bg: 'from-secondary/10 to-secondary/20', border: 'border-secondary/30' },
                    { label: 'Recall', value: results.recall, color: 'text-accent', bg: 'from-accent/10 to-accent/20', border: 'border-accent/30' },
                    { label: 'F1-Score', value: results.f1_score, color: 'text-primary', bg: 'from-primary/10 to-primary/20', border: 'border-primary/30' },
                  ].map((metric, i) => (
                    <div key={i} className={`text-center px-6 py-3 rounded-lg bg-gradient-to-br ${metric.bg} border ${metric.border}`}>
                      <div className={`text-2xl font-bold ${metric.color}`}>
                        {typeof metric.value === 'number'
                          ? `${(metric.value <= 1 ? metric.value * 100 : metric.value).toFixed(1)}%`
                          : 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Clinical Recommendations */}
              {results.clinical_recommendations?.map((section, idx) => (
                <div key={idx} className="space-y-6 mt-8">
                  <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {section.category}
                    </h2>
                    <p className="text-muted-foreground">
                      {section.category === 'Treatment Suggestions'
                        ? 'Lifestyle activities to support cognitive health'
                        : 'Activities to maintain cognitive function'}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {section.items.map((item, i) => (
                      <Card key={i} className="glass-card border-primary/30">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3 text-primary">
                            {section.category === 'Physical & Mental Activities' ? (
                              <BrainIcon className="w-6 h-6" />
                            ) : (
                              <Heart className="w-6 h-6" />
                            )}
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              {/* Re-upload */}
              <div className="flex justify-center pt-8">
                <Button variant="neural" size="lg" asChild className="hover:scale-105 transition-transform duration-300">
                  <Link to="/upload">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Re-upload Another MRI
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
export { Results as ResultsPage };
