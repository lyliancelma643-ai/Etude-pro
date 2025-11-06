export interface Course {
  id: string;
  title: string;
  professor: string;
  location: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0 = Dimanche, 1 = Lundi, etc.
  color: string;
  description?: string;
  credits?: number;
}

export interface AISuggestion {
  id: string;
  type: 'optimization' | 'conflict' | 'recommendation';
  message: string;
  courses?: string[];
  priority: 'low' | 'medium' | 'high';
}
