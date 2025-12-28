import React, { useState, useCallback } from 'react';
import { Upload, X, Brain, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NeuralBackground } from '@/components/neural-background';
import { useNavigate } from 'react-router-dom';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const API_BASE =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : `${window.location.protocol}//${window.location.hostname}:5000`;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setProgress(0);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    const timeoutId = setTimeout(() => {
      setError('Analysis timeout - please try again');
      setUploading(false);
    }, 10000);

    try {
      await new Promise<void>((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.timeout = 10000;

        xhr.open('POST', `${API_BASE}/api/upload`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const uploadPercent = Math.round((e.loaded / e.total) * 30);
            setProgress(uploadPercent);
          }
        };

        let processingInterval: NodeJS.Timeout;

        xhr.onloadstart = () => {
          processingInterval = setInterval(() => {
            setProgress((prev) => {
              if (prev < 85) return prev + 2;
              return prev;
            });
          }, 200);
        };

        xhr.onload = () => {
          clearInterval(processingInterval);
          clearTimeout(timeoutId);

          try {
            const response = JSON.parse(xhr.responseText);

            if (xhr.status >= 200 && xhr.status < 300) {
              sessionStorage.setItem('analysisResults', JSON.stringify(response));
              setProgress(100);
              setUploading(false);

              setTimeout(() => {
                navigate(`/results?id=${response.file_id}`);
              }, 1000);

              resolve();
            } else {
              setError(response.error || 'Analysis failed - please check your backend server');
              setUploading(false);
              reject(new Error(response.error || 'Analysis failed'));
            }
          } catch (err) {
            setError('Invalid response from server');
            setUploading(false);
            reject(err);
          }
        };

        xhr.onerror = () => {
          clearInterval(processingInterval);
          clearTimeout(timeoutId);
          setError('Connection failed - please ensure backend server is running');
          setUploading(false);
          reject(new Error('Network error'));
        };

        xhr.ontimeout = () => {
          clearInterval(processingInterval);
          setError('Request timeout');
          setUploading(false);
          reject(new Error('Timeout'));
        };

        xhr.send(formData);
      });
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Analysis error:', err);
    }
  };

  return (
    <div className="relative min-h-screen pt-20 overflow-hidden">
      <NeuralBackground />

      {/* Decorative floating icons for subtle animation */}
      <div className="absolute top-32 left-10 animate-float opacity-30">
        <Brain className="w-12 h-12 text-primary/70" />
      </div>
      <div className="absolute bottom-20 right-16 animate-pulse opacity-20">
        <Upload className="w-10 h-10 text-secondary" />
      </div>

      <div className="relative z-20 container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Split Screen Layout */}
          <div className="grid lg:grid-cols-2 gap-8 min-h-[650px]">
            {/* LEFT SIDE - Upload Section */}
            <Card className="glass-card p-8 flex flex-col justify-center shadow-xl">
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Upload MRI Scan
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    AI-powered Alzheimer’s disease detection
                  </p>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                    dragActive
                      ? 'border-primary bg-primary/10 scale-105'
                      : 'border-card-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*,.dcm,.nii,.nii.gz"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                  />

                  {!file ? (
                    <div className="space-y-4">
                      <Upload className="w-16 h-16 mx-auto text-primary animate-float" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Drop your MRI scan here</h3>
                        <p className="text-muted-foreground mb-4">or click to browse files</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <div className="text-left">
                            <p className="font-semibold text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={removeFile}
                          disabled={uploading}
                          className="hover:bg-destructive/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="flex items-start gap-3 bg-muted/10 p-4 rounded-xl border border-muted/20">
                  <Info className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ensure your MRI image is clear and properly oriented. The AI model performs best on
                    axial-view brain MRI scans.
                  </p>
                </div>

                {/* Analyze Button */}
                {file && !uploading && (
                  <Button variant="neural" size="lg" className="w-full" onClick={handleAnalyze}>
                    <Brain className="w-5 h-5 mr-2" />
                    Analyze with AI
                  </Button>
                )}

                {/* Progress */}
                {uploading && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">Processing...</span>
                      <span className="text-primary font-bold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      {progress < 30 && 'Uploading scan...'}
                      {progress >= 30 && progress < 60 && 'Preprocessing image...'}
                      {progress >= 60 && progress < 90 && 'AI analysis in progress...'}
                      {progress >= 90 && 'Finalizing results...'}
                    </p>
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <Alert className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive ml-2">{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </Card>

            {/* RIGHT SIDE - Preview Section */}
            <Card className="glass-card p-8 flex flex-col justify-center items-center shadow-lg">
              {filePreview ? (
                <div className="w-full space-y-4">
                  <h2 className="text-2xl font-bold text-center mb-6">MRI Preview</h2>
                  <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden border-2 border-primary/30 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.5)] transition-all duration-300">
                    <img
                      src={filePreview}
                      alt="MRI Preview"
                      className="w-full h-[380px] object-contain bg-black/10"
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Ready for AI analysis
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-muted/20 flex items-center justify-center">
                    <Brain className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                  <h2 className="text-2xl font-bold text-muted-foreground">No scan selected</h2>
                  <p className="text-muted-foreground">Upload an MRI scan to see preview</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
