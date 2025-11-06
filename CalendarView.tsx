import { Course } from '../types/course';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CalendarViewProps {
  courses: Course[];
}

export function CalendarView({ courses }: CalendarViewProps) {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8h à 20h

  const getCourseForTimeSlot = (day: number, hour: number) => {
    return courses.find((course) => {
      const [startHour] = course.startTime.split(':').map(Number);
      const [endHour] = course.endTime.split(':').map(Number);
      return course.dayOfWeek === day + 1 && hour >= startHour && hour < endHour;
    });
  };

  const getCourseHeight = (course: Course) => {
    const [startHour, startMin] = course.startTime.split(':').map(Number);
    const [endHour, endMin] = course.endTime.split(':').map(Number);
    const duration = endHour - startHour + (endMin - startMin) / 60;
    return duration;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emploi du Temps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header with days */}
            <div className="grid grid-cols-6 gap-2 mb-2">
              <div className="p-2" />
              {days.map((day) => (
                <div key={day} className="p-2 text-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="relative">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-6 gap-2 border-t border-gray-200">
                  <div className="p-2 text-sm text-muted-foreground">
                    {hour}:00
                  </div>
                  {days.map((_, dayIndex) => {
                    const course = getCourseForTimeSlot(dayIndex, hour);
                    const [startHour] = course?.startTime.split(':').map(Number) || [0];
                    const isFirstHour = startHour === hour;

                    if (course && isFirstHour) {
                      const height = getCourseHeight(course);
                      return (
                        <div
                          key={dayIndex}
                          className="p-2 rounded-lg text-white relative"
                          style={{
                            backgroundColor: course.color,
                            gridRow: `span ${height}`,
                            minHeight: `${height * 60}px`,
                          }}
                        >
                          <div className="text-sm">{course.title}</div>
                          <div className="text-xs opacity-90 mt-1">
                            {course.startTime} - {course.endTime}
                          </div>
                          <div className="text-xs opacity-75">{course.location}</div>
                        </div>
                      );
                    } else if (!course || !isFirstHour) {
                      return (
                        <div
                          key={dayIndex}
                          className="p-2 min-h-[60px] hover:bg-accent/50 transition-colors cursor-pointer rounded"
                        />
                      );
                    }
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
