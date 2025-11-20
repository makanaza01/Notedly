
export enum Category {
  ACADEMICS = 'Academics',
  SPORTS = 'Sports',
  ARTS = 'Arts',
  CAMPUS_LIFE = 'Campus Life',
  EVENTS = 'Events',
  DEBATE = 'Debate',
  OPINION = 'Opinion'
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  date: string;
  category: Category;
  imageUrl: string;
  videoUrl?: string;
  likes: number;
  comments: Comment[];
}

export type ViewState = 'HOME' | 'NEWS' | 'POST' | 'AUTHOR';