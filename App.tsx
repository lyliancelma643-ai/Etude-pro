import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { CourseForm } from './components/CourseForm';
import { AIAssistant } from './components/AIAssistant';
import { FileUploadZone } from './components/FileUploadZone';
import { ReviewCoursesDialog } from './components/ReviewCoursesDialog';
import { ExportCalendar } from './components/ExportCalendar';
import { GlassTabContent } from './components/GlassTabContent';
import { Separator } from './components/ui/separator';
import { Toaster } from './components/ui/sonner';
import { Course, AISuggestion } from './types/course';
import { mockCourses, mockSuggestions } from './data/mockCourses';
import { Calendar, LayoutDashboard, Plus, Sparkles } from 'lucide-react';

export default function App() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(mockSuggestions);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [coursesToReview, setCoursesToReview] = useState<Omit<Course, 'id'>[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleAddCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
    };
    setCourses([...courses, newCourse]);
  };

  const handleRequestReview = (extractedCourses: Omit<Course, 'id'>[]) => {
    setCoursesToReview(extractedCourses);
    setReviewDialogOpen(true);
  };

  const handleConfirmReview = (reviewedCourses: Omit<Course, 'id'>[]) => {
    const newCourses: Course[] = reviewedCourses.map((courseData, index) => ({
      ...courseData,
      id: `${Date.now()}-${index}`,
    }));
    setCourses([...courses, ...newCourses]);
    setReviewDialogOpen(false);
    setCoursesToReview([]);
  };

  const handleCancelReview = () => {
    setReviewDialogOpen(false);
    setCoursesToReview([]);
  };

  const generateAISuggestions = () => {
    // Simulation de suggestions IA
    const newSuggestions: AISuggestion[] = [];

    // Détection de conflits
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
            newSuggestions.push({
              id: `conflict-${i}-${j}`,
              type: 'conflict',
              message: `Conflit détecté entre "${courses[i].title}" et "${courses[j].title}"`,
              courses: [courses[i].id, courses[j].id],
              priority: 'high',
            });
          }
        }
      }
    }

    // Suggestions d'optimisation
    const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);
    if (totalCredits < 20) {
      newSuggestions.push({
        id: 'credits-low',
        type: 'recommendation',
        message: `Vous avez ${totalCredits} crédits. Pensez à ajouter des cours pour atteindre 30 crédits recommandés.`,
        priority: 'medium',
      });
    } else if (totalCredits > 35) {
      newSuggestions.push({
        id: 'credits-high',
        type: 'recommendation',
        message: `Attention : ${totalCredits} crédits peut être une charge trop importante. Considérez alléger votre programme.`,
        priority: 'high',
      });
    } else {
      newSuggestions.push({
        id: 'credits-good',
        type: 'optimization',
        message: `Excellent ! ${totalCredits} crédits est une charge équilibrée pour ce semestre.`,
        priority: 'low',
      });
    }

    // Analyse des jours libres
    const daysWithCourses = new Set(courses.map(c => c.dayOfWeek));
    if (!daysWithCourses.has(5)) {
      newSuggestions.push({
        id: 'friday-free',
        type: 'optimization',
        message: 'Vendredi est libre - parfait pour les projets de groupe et révisions !',
        priority: 'low',
      });
    }

    // Détection de journées surchargées
    const coursesByDay = courses.reduce((acc, course) => {
      acc[course.dayOfWeek] = (acc[course.dayOfWeek] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    Object.entries(coursesByDay).forEach(([day, count]) => {
      if (count >= 4) {
        const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        newSuggestions.push({
          id: `busy-day-${day}`,
          type: 'recommendation',
          message: `${dayNames[parseInt(day)]} a ${count} cours. Prévoyez des pauses régulières.`,
          priority: 'medium',
        });
      }
    });

    setSuggestions(newSuggestions.length > 0 ? newSuggestions : mockSuggestions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <header className="border-b glass-morphism sticky top-0 z-50 shine-effect">
        <div className="premium-container py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg floating-element">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  EduPlan IA
                </h1>
                <p className="text-sm text-muted-foreground">
                  Organisez vos cours intelligemment
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="premium-container py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-4 w-full max-w-3xl glass-morphism border-0 p-2.5 gap-2 shine-effect">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 glass-tab-trigger data-[state=active]:shadow-xl transition-all duration-300 py-3"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="hidden sm:inline">Tableau de bord</span>
                <span className="sm:hidden">Accueil</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calendar" 
                className="flex items-center gap-2 glass-tab-trigger data-[state=active]:shadow-xl transition-all duration-300 py-3"
              >
                <Calendar className="h-5 w-5" />
                <span className="hidden sm:inline">Calendrier</span>
                <span className="sm:hidden">Agenda</span>
              </TabsTrigger>
              <TabsTrigger 
                value="add" 
                className="flex items-center gap-2 glass-tab-trigger data-[state=active]:shadow-xl transition-all duration-300 py-3"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">Ajouter</span>
                <span className="sm:hidden">Ajouter</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="flex items-center gap-2 glass-tab-trigger data-[state=active]:shadow-xl transition-all duration-300 py-3"
              >
                <Sparkles className="h-5 w-5" />
                <span className="hidden sm:inline">Assistant IA</span>
                <span className="sm:hidden">IA</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="glass-tab-background min-h-[700px] rounded-[2rem] p-2 shadow-2xl">
            <GlassTabContent value="dashboard" activeValue={activeTab}>
              <div className="space-y-6">
                <Dashboard courses={courses} suggestions={suggestions} />
                <div className="max-w-4xl mx-auto">
                  <ExportCalendar courses={courses} />
                </div>
              </div>
            </GlassTabContent>

            <GlassTabContent value="calendar" activeValue={activeTab}>
              <div className="max-w-6xl mx-auto">
                <CalendarView courses={courses} />
              </div>
            </GlassTabContent>

            <GlassTabContent value="add" activeValue={activeTab}>
              <div className="max-w-4xl mx-auto space-y-8">
                <FileUploadZone 
                  onCoursesExtracted={() => {}} 
                  onRequestReview={handleRequestReview}
                />
                
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="glass-morphism px-4 py-1 text-muted-foreground rounded-full">
                      Ou ajouter manuellement
                    </span>
                  </div>
                </div>
                
                <CourseForm onAddCourse={handleAddCourse} />
              </div>
            </GlassTabContent>

            <GlassTabContent value="ai" activeValue={activeTab}>
              <div className="max-w-4xl mx-auto">
                <AIAssistant 
                  courses={courses} 
                  onGenerateSuggestions={generateAISuggestions}
                />
              </div>
            </GlassTabContent>
          </div>
        </Tabs>
      </main>
      
      <ReviewCoursesDialog
        open={reviewDialogOpen}
        courses={coursesToReview}
        onConfirm={handleConfirmReview}
        onCancel={handleCancelReview}
      />
      
      <Toaster />
    </div>
  );
}
