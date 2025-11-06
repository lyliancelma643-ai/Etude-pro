import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Upload, FileText, Sparkles, CheckCircle, X } from 'lucide-react';
import { Course } from '../types/course';
import { toast } from 'sonner@2.0.3';

interface FileUploadZoneProps {
  onCoursesExtracted: (courses: Omit<Course, 'id'>[]) => void;
  onRequestReview: (courses: Omit<Course, 'id'>[]) => void;
}

export function FileUploadZone({ onCoursesExtracted, onRequestReview }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    setProgress(0);

    const isImage = file.type.startsWith('image/');

    // Simulation de l'analyse IA avec OCR pour les images
    if (isImage) {
      // Étape OCR pour les images
      await new Promise(resolve => setTimeout(resolve, 400));
      setProgress(15);
    }

    const intervals = isImage ? [15, 35, 60, 85, 100] : [20, 45, 70, 90, 100];
    for (const value of intervals) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setProgress(value);
    }

    // Simulation de l'extraction de cours depuis le fichier
    const extractedCourses: Omit<Course, 'id'>[] = [
      {
        title: 'Analyse de Données',
        professor: 'Prof. Lefebvre',
        location: 'Salle C105',
        startTime: '09:00',
        endTime: '11:00',
        dayOfWeek: 2,
        color: '#3b82f6',
        description: 'Extrait du plan de cours - Statistiques et visualisation',
        credits: 4,
      },
      {
        title: 'Intelligence Artificielle',
        professor: 'Dr. Zhang',
        location: 'Lab IA B301',
        startTime: '14:00',
        endTime: '17:00',
        dayOfWeek: 3,
        color: '#8b5cf6',
        description: 'Extrait du plan de cours - Machine Learning et réseaux neuronaux',
        credits: 5,
      },
      {
        title: 'Gestion de Projet',
        professor: 'Mme. Moreau',
        location: 'Salle D202',
        startTime: '10:00',
        endTime: '12:00',
        dayOfWeek: 4,
        color: '#10b981',
        description: 'Extrait du plan de cours - Méthodes agiles et Scrum',
        credits: 3,
      },
    ];

    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsAnalyzing(false);
    setProgress(0);
    setSelectedFile(null);
    
    // Ouvrir le dialogue de révision
    onRequestReview(extractedCourses);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
        'image/png',
        'image/jpeg',
      ];

      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        toast.error('Format de fichier non supporté', {
          description: 'Utilisez PDF, Word, TXT ou images (PNG, JPG).',
        });
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      analyzeFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Importation Intelligente
        </CardTitle>
        <CardDescription>
          Déposez votre plan de cours et l'IA extraira automatiquement tous vos cours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            L'IA peut analyser des fichiers PDF, Word, TXT ou des captures d'écran de votre emploi du temps. Pour les images, la reconnaissance OCR est automatiquement activée.
          </AlertDescription>
        </Alert>

        {!selectedFile && !isAnalyzing && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
              ${isDragging 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
              }
            `}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              onChange={handleFileInput}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Glissez-déposez votre fichier ici
                </p>
                <p className="text-sm text-muted-foreground">
                  ou cliquez pour sélectionner
                </p>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-gray-100 rounded">PDF</span>
                <span className="px-2 py-1 bg-gray-100 rounded">Word</span>
                <span className="px-2 py-1 bg-gray-100 rounded">TXT</span>
                <span className="px-2 py-1 bg-gray-100 rounded">PNG/JPG</span>
              </div>
            </label>
          </div>
        )}

        {selectedFile && !isAnalyzing && (
          <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <div className="text-sm mb-1">{selectedFile.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} Ko
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleAnalyze}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Analyser avec l'IA
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-4 p-6 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
              <div className="flex-1">
                <div className="text-sm mb-2">Analyse IA en cours...</div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              {progress >= 15 && selectedFile?.type.startsWith('image/') && <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                OCR - Reconnaissance de texte
              </div>}
              {progress >= 20 && <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Lecture du document
              </div>}
              {progress >= 45 && <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Extraction des informations
              </div>}
              {progress >= 70 && <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Identification des cours
              </div>}
              {progress >= 90 && <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Organisation des horaires
              </div>}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Astuce :</strong> L'IA peut extraire :</p>
          <ul className="ml-6 space-y-1">
            <li>• Noms des cours et professeurs</li>
            <li>• Horaires et salles de classe</li>
            <li>• Nombre de crédits ECTS</li>
            <li>• Descriptions et objectifs</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
