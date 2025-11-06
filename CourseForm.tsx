import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Course } from '../types/course';
import { Plus } from 'lucide-react';

interface CourseFormProps {
  onAddCourse: (course: Omit<Course, 'id'>) => void;
}

export function CourseForm({ onAddCourse }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    professor: '',
    location: '',
    startTime: '',
    endTime: '',
    dayOfWeek: '1',
    color: '#3b82f6',
    description: '',
    credits: '3',
  });

  const colors = [
    { name: 'Bleu', value: '#3b82f6' },
    { name: 'Vert', value: '#10b981' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Rouge', value: '#ef4444' },
    { name: 'Rose', value: '#ec4899' },
    { name: 'Cyan', value: '#06b6d4' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCourse({
      title: formData.title,
      professor: formData.professor,
      location: formData.location,
      startTime: formData.startTime,
      endTime: formData.endTime,
      dayOfWeek: parseInt(formData.dayOfWeek),
      color: formData.color,
      description: formData.description,
      credits: parseInt(formData.credits),
    });
    // Reset form
    setFormData({
      title: '',
      professor: '',
      location: '',
      startTime: '',
      endTime: '',
      dayOfWeek: '1',
      color: '#3b82f6',
      description: '',
      credits: '3',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Ajouter un Cours
        </CardTitle>
        <CardDescription>
          Remplissez les informations pour ajouter un nouveau cours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nom du cours *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="ex: Mathématiques Avancées"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professor">Professeur *</Label>
              <Input
                id="professor"
                value={formData.professor}
                onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                required
                placeholder="ex: Dr. Martin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Salle *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="ex: Salle A101"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Jour de la semaine *</Label>
              <Select
                value={formData.dayOfWeek}
                onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}
              >
                <SelectTrigger id="dayOfWeek">
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
              <Label htmlFor="startTime">Heure de début *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">Crédits ECTS *</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="10"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
              >
                <SelectTrigger id="color">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du cours..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le cours
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
