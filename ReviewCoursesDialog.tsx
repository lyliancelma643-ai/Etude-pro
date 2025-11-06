import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Course } from '../types/course';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { Badge } from './ui/badge';

interface ReviewCoursesDialogProps {
  open: boolean;
  courses: Omit<Course, 'id'>[];
  onConfirm: (courses: Omit<Course, 'id'>[]) => void;
  onCancel: () => void;
}

export function ReviewCoursesDialog({
  open,
  courses,
  onConfirm,
  onCancel,
}: ReviewCoursesDialogProps) {
  const [editedCourses, setEditedCourses] = useState<Omit<Course, 'id'>[]>(courses);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEdit = (index: number, field: keyof Omit<Course, 'id'>, value: string | number) => {
    const updated = [...editedCourses];
    updated[index] = { ...updated[index], [field]: value };
    setEditedCourses(updated);
  };

  const handleRemove = (index: number) => {
    const updated = editedCourses.filter((_, i) => i !== index);
    setEditedCourses(updated);
    setEditingIndex(null);
  };

  const handleConfirm = () => {
    onConfirm(editedCourses);
  };

  const colors = [
    { name: 'Bleu', value: '#3b82f6' },
    { name: 'Vert', value: '#10b981' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Rouge', value: '#ef4444' },
    { name: 'Rose', value: '#ec4899' },
    { name: 'Cyan', value: '#06b6d4' },
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Réviser les cours extraits</DialogTitle>
          <DialogDescription>
            Vérifiez et modifiez les informations avant de les ajouter à votre emploi du temps
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {editedCourses.map((course, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <Badge variant="outline">Cours {index + 1}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditingIndex(editingIndex === index ? null : index)
                      }
                    >
                      {editingIndex === index ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Pencil className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {editingIndex === index ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${index}`}>Nom du cours</Label>
                      <Input
                        id={`title-${index}`}
                        value={course.title}
                        onChange={(e) => handleEdit(index, 'title', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`professor-${index}`}>Professeur</Label>
                      <Input
                        id={`professor-${index}`}
                        value={course.professor}
                        onChange={(e) => handleEdit(index, 'professor', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`location-${index}`}>Salle</Label>
                      <Input
                        id={`location-${index}`}
                        value={course.location}
                        onChange={(e) => handleEdit(index, 'location', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`day-${index}`}>Jour</Label>
                      <Select
                        value={course.dayOfWeek.toString()}
                        onValueChange={(value) =>
                          handleEdit(index, 'dayOfWeek', parseInt(value))
                        }
                      >
                        <SelectTrigger id={`day-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Lundi</SelectItem>
                          <SelectItem value="2">Mardi</SelectItem>
                          <SelectItem value="3">Mercredi</SelectItem>
                          <SelectItem value="4">Jeudi</SelectItem>
                          <SelectItem value="5">Vendredi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`start-${index}`}>Début</Label>
                      <Input
                        id={`start-${index}`}
                        type="time"
                        value={course.startTime}
                        onChange={(e) => handleEdit(index, 'startTime', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`end-${index}`}>Fin</Label>
                      <Input
                        id={`end-${index}`}
                        type="time"
                        value={course.endTime}
                        onChange={(e) => handleEdit(index, 'endTime', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`credits-${index}`}>Crédits</Label>
                      <Input
                        id={`credits-${index}`}
                        type="number"
                        value={course.credits}
                        onChange={(e) =>
                          handleEdit(index, 'credits', parseInt(e.target.value))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`color-${index}`}>Couleur</Label>
                      <Select
                        value={course.color}
                        onValueChange={(value) => handleEdit(index, 'color', value)}
                      >
                        <SelectTrigger id={`color-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: color.value }}
                                />
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={course.description || ''}
                        onChange={(e) => handleEdit(index, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Cours:</span>{' '}
                      {course.title}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Professeur:</span>{' '}
                      {course.professor}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Salle:</span>{' '}
                      {course.location}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Horaire:</span>{' '}
                      {course.startTime} - {course.endTime}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Crédits:</span>{' '}
                      {course.credits} ECTS
                    </div>
                    <div>
                      <span className="text-muted-foreground">Jour:</span>{' '}
                      {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][course.dayOfWeek]}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={editedCourses.length === 0}>
            <Check className="h-4 w-4 mr-2" />
            Ajouter {editedCourses.length} cours
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
