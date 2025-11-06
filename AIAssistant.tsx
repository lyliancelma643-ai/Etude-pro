import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Course, AISuggestion } from '../types/course';
import { Sparkles, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface AIAssistantProps {
  courses: Course[];
  onGenerateSuggestions: () => void;
}

export function AIAssistant({ courses, onGenerateSuggestions }: AIAssistantProps) {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      onGenerateSuggestions();
      setAnalyzing(false);
    }, 1500);
  };

  // Analyse rapide
  const hasConflicts = () => {
    for (let i = 0; i < courses.length; i++) {
      for (let j = i + 1; j < courses.length; j++) {
        if (courses[i].dayOfWeek === courses[j].dayOfWeek) {
          const [start1Hour] = courses[i].startTime.split(':').map(Number);
          const [end1Hour] = courses[i].endTime.split(':').map(Number);
          const [start2Hour] = courses[j].startTime.split(':').map(Number);
          const [end2Hour] = courses[j].endTime.split(':').map(Number);

          if (
            (start1Hour >= start2Hour && start1Hour < end2Hour) ||
            (start2Hour >= start1Hour && start2Hour < end1Hour)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);
  const avgHoursPerDay = courses.length > 0 
    ? courses.reduce((sum, course) => {
        const [startHour, startMin] = course.startTime.split(':').map(Number);
        const [endHour, endMin] = course.endTime.split(':').map(Number);
        return sum + (endHour - startHour + (endMin - startMin) / 60);
      }, 0) / new Set(courses.map(c => c.dayOfWeek)).size
    : 0;

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Assistant IA
        </CardTitle>
        <CardDescription>
          Optimisez votre emploi du temps avec l'intelligence artificielle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              {hasConflicts() ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm">Conflits</span>
            </div>
            <div>
              {hasConflicts() ? 'Détectés' : 'Aucun'}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Charge</span>
            </div>
            <div>
              {totalCredits} ECTS
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Moy/jour</span>
            </div>
            <div>
              {avgHoursPerDay.toFixed(1)}h
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            L'IA peut vous aider à :
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Détecter les conflits d'horaires</li>
            <li>• Optimiser la répartition des cours</li>
            <li>• Identifier les temps libres pour réviser</li>
            <li>• Équilibrer votre charge de travail</li>
          </ul>
        </div>

        <Button 
          onClick={handleAnalyze} 
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={analyzing || courses.length === 0}
        >
          {analyzing ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyser mon emploi du temps
            </>
          )}
        </Button>

        {courses.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Ajoutez des cours pour commencer l'analyse IA
          </p>
        )}
      </CardContent>
    </Card>
  );
}
