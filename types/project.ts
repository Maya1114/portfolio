export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed';
  progress: number;
  startDate: string;
  deadline?: string;
  category: string;
  dailyGoal?: string;
  // Publishing workflow
  isPublished?: boolean;
  // Portfolio showcase fields (only relevant when published)
  githubUrl?: string;
  demoUrl?: string;
  showcaseDescription?: string;
  showcaseFeatures?: string[];
  showcaseImage?: string;
}