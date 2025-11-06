import { Course, AISuggestion } from '../types/course';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, Clock, GraduationCap, Sparkles } from 'lucide-react';

interface DashboardProps {
  courses: Course[];
  suggestions: AISuggestion[];
}

export function Dashboard({ courses, suggestions }: DashboardProps) {
  const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);
  const totalHours = courses.reduce((sum, course) => {
    const [startHour, startMin] = course.startTime.split(':').map(Number);
    const [endHour, endMin] = course.endTime.split(':').map(Number);
    const duration = (endHour * 60 + endMin - (startHour * 60 + startMin)) / 60;
    return sum + duration;
  }, 0);

  const daysWithCourses = new Set(courses.map(c => c.dayOfWeek)).size;

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 border-blue-300',
    medium: 'bg-orange-100 text-orange-800 border-orange-300',
    high: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              Répartis sur {daysWithCourses} jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Crédits</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalCredits} ECTS</div>
            <p className="text-xs text-muted-foreground">
              Ce semestre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Heures/Semaine</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              De cours magistraux
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Suggestions IA
          </CardTitle>
          <CardDescription>
            L'IA analyse votre emploi du temps pour vous aider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 rounded-lg border ${priorityColors[suggestion.priority]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="flex-1">{suggestion.message}</p>
                  <Badge variant="outline" className="shrink-0">
                    {suggestion.type === 'optimization' && 'Optimisation'}
                    {suggestion.type === 'conflict' && 'Conflit'}
                    {suggestion.type === 'recommendation' && 'Conseil'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mes Cours</CardTitle>
          <CardDescription>Liste de tous vos cours enregistrés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                  <div>
                    <div>{course.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {course.professor} • {course.location}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {course.credits} crédits
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
