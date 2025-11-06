import { Course } from '../types/course';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Download, Calendar, FileJson } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ExportCalendarProps {
  courses: Course[];
}

export function ExportCalendar({ courses }: ExportCalendarProps) {
  const generateICalendar = () => {
    // Générer un fichier iCal
    const getNextDate = (dayOfWeek: number) => {
      const today = new Date();
      const currentDay = today.getDay();
      const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7 || 7;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysUntilTarget);
      return targetDate;
    };

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EduPlan IA//Emploi du Temps//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Emploi du Temps - EduPlan
X-WR-TIMEZONE:Europe/Paris
X-WR-CALDESC:Emploi du temps généré par EduPlan IA
`;

    courses.forEach((course) => {
      const startDate = getNextDate(course.dayOfWeek);
      const [startHour, startMin] = course.startTime.split(':').map(Number);
      const [endHour, endMin] = course.endTime.split(':').map(Number);

      startDate.setHours(startHour, startMin, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(endHour, endMin, 0, 0);

      icalContent += `BEGIN:VEVENT
UID:${course.id}@eduplan.ia
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${course.title}
DESCRIPTION:Professeur: ${course.professor}\\nCrédits: ${course.credits} ECTS\\n${course.description || ''}
LOCATION:${course.location}
RRULE:FREQ=WEEKLY;BYDAY=${['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][course.dayOfWeek]}
STATUS:CONFIRMED
END:VEVENT
`;
    });

    icalContent += 'END:VCALENDAR';

    // Télécharger le fichier
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'emploi-du-temps.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Calendrier exporté !', {
      description: 'Vous pouvez maintenant l\'importer dans Google Calendar, Outlook, etc.',
    });
  };

  const generateJSON = () => {
    // Exporter en JSON
    const jsonContent = JSON.stringify(courses, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'emploi-du-temps.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Données exportées en JSON !', {
      description: 'Fichier sauvegardé avec succès.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exporter l'emploi du temps
        </CardTitle>
        <CardDescription>
          Exportez votre calendrier vers d'autres applications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={generateICalendar}
          className="w-full justify-start"
          variant="outline"
          disabled={courses.length === 0}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Exporter en iCal (.ics)
        </Button>
        <p className="text-xs text-muted-foreground ml-6">
          Compatible avec Google Calendar, Outlook, Apple Calendar, etc.
        </p>

        <Button
          onClick={generateJSON}
          className="w-full justify-start"
          variant="outline"
          disabled={courses.length === 0}
        >
          <FileJson className="h-4 w-4 mr-2" />
          Exporter en JSON
        </Button>
        <p className="text-xs text-muted-foreground ml-6">
          Format de données pour sauvegarde ou traitement personnalisé
        </p>

        {courses.length === 0 && (
          <p className="text-sm text-muted-foreground text-center pt-2">
            Ajoutez des cours pour pouvoir exporter
          </p>
        )}
      </CardContent>
    </Card>
  );
}
